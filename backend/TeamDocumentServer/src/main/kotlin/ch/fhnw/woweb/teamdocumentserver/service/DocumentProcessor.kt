package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.config.TeamDocumentServerProperties
import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Flux.just
import reactor.core.publisher.Mono
import java.util.*
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

@Service
@Transactional
class DocumentProcessor(
    val properties: TeamDocumentServerProperties
) {

    private val document: Document = Document()
    private val lock = ReentrantLock()

    fun getFullDocument(): Flux<DocumentCommand> {
        return just(
            DocumentCommand(
                UUID.randomUUID(),
                Gson().toJson(document.paragraphs),
                properties.serverId,
                INITIAL
            )
        )
    }

    fun process(cmd: DocumentCommand): Flux<DocumentCommand> = when (cmd.type) {
        INITIAL -> just(cmd)
        ADD_PARAGRAPH -> addParagraph(cmd)
        REMOVE_PARAGRAPH -> removeParagraph(cmd)
        UPDATE_PARAGRAPH -> updateParagraph(cmd)
        UPDATE_PARAGRAPH_ORDINALS -> updateParagraphOrdinals(cmd)
        UPDATE_AUTHOR -> updateAuthor(cmd)
        UPDATE_LOCK -> updateLock(cmd)
        REMOVE_CLIENT -> removeClient(cmd)
        ADD_CLIENTS -> Flux.empty()
    }

    private fun removeClient(cmd: DocumentCommand): Flux<DocumentCommand> {
        val update : MutableList<DocumentCommand> = mutableListOf()
        document.paragraphs
            .filter { it.lockedBy?.id == Gson().fromJson(cmd.payload, UUID::class.java) }
            .map { paragraph ->
                paragraph.lockedBy = null
                update.add(
                    DocumentCommand(
                        payload = Gson().toJson(paragraph),
                        sender = properties.serverId,
                        type = UPDATE_LOCK
                    ))
            }
        update.add(0,cmd)
        return Flux.fromIterable(update)
    }

    private fun addParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphPayload = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs.add(paragraphPayload)
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    private fun removeParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphIdPayload = Gson().fromJson(cmd.payload, UUID::class.java)
        document.paragraphs.removeIf { it.id == paragraphIdPayload }
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    private fun updateAuthor(cmd: DocumentCommand): Flux<DocumentCommand> {
        val authorPayload = Gson().fromJson(cmd.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == authorPayload.id }
            .map { paragraph ->
                paragraph.author.name = authorPayload.name
                paragraph.lockedBy?.name= authorPayload.name
            }
        return just(cmd)
    }

    private fun updateParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val paragraphPayload = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.content = paragraphPayload.content
        return Flux.merge(just(cmd))
    }

    private fun updateParagraphOrdinals(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphsPayload = Gson().fromJson(cmd.payload, Array<Paragraph>::class.java)
        paragraphsPayload.forEach { updateParagraphOrdinals(it) }
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    private fun updateParagraphOrdinals(paragraphPayload: Paragraph) {
        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.ordinal = paragraphPayload.ordinal
    }

    private fun updateLock(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphPayload = Gson().fromJson(cmd.payload, Paragraph::class.java)
        val existingParagraph = document.paragraphs.find { it.id == paragraphPayload.id }

        if (existingParagraph?.lockedBy != null && paragraphPayload.lockedBy == null && cmd.sender != existingParagraph?.lockedBy?.id) {
            return just(DocumentCommand(
                payload = Gson().toJson(existingParagraph?.lockedBy),
                sender = properties.serverId,
                type = UPDATE_LOCK
            ))
        }

        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.lockedBy = paragraphPayload.lockedBy
        return just(cmd)
    }
    
    private fun resolveOrdinalsConflicts(): Flux<DocumentCommand> {
        document.paragraphs.sortBy { it.ordinal }
        document.paragraphs.forEachIndexed { i: Int, p: Paragraph -> p.ordinal = i + 1 }
        return just(DocumentCommand(
            id = UUID.randomUUID(),
            payload = Gson().toJson(document.paragraphs),
            sender = properties.serverId,
            type = UPDATE_PARAGRAPH_ORDINALS
        ))
    }

    fun toAddCommand(commandToUndo: DocumentCommand): Mono<DocumentCommand> {
        val paragraphToRestore = Gson().fromJson(commandToUndo.payload, Paragraph::class.java)
        val sanitizedParagraph = Paragraph(
            ordinal = paragraphToRestore.ordinal,
            content = paragraphToRestore.content,
            author = paragraphToRestore.author
        )
        return Mono.just(DocumentCommand(payload = Gson().toJson(sanitizedParagraph), sender = UUID.randomUUID(), type = ADD_PARAGRAPH))
    }
}
