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

    fun resetDocument() {
        document.paragraphs.removeAll(document.paragraphs)
    }

    // Needs lock because of potential ordinals issues and update ordinals command
    private fun addParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs.add(p)
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    // Needs lock because of Ordinal fixes (Closing gaps and update command)
    private fun removeParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val id = Gson().fromJson(cmd.payload, UUID::class.java)
        document.paragraphs.removeIf { it.id == id }
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    private fun updateAuthor(cmd: DocumentCommand): Flux<DocumentCommand> {
        val a = Gson().fromJson(cmd.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == a.id }
            .map { paragraph ->
                paragraph.author.name = a.name
                paragraph.lockedBy?.name= a.name
            }
        return just(cmd)
    }

    private fun updateParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == p.id }
            ?.content = p.content
        return Flux.merge(just(cmd))
    }

    private fun updateParagraphOrdinals(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphs = Gson().fromJson(cmd.payload, Array<Paragraph>::class.java)
        paragraphs.forEach { updateParagraphOrdinals(it) }
        return Flux.merge(just(cmd), resolveOrdinalsConflicts())
    }

    private fun updateParagraphOrdinals(paragraphFromCmd: Paragraph) {
        document.paragraphs
            .find { it.id == paragraphFromCmd.id }
            ?.ordinal = paragraphFromCmd.ordinal
    }

    private fun updateLock(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val p1 = Gson().fromJson(cmd.payload, Paragraph::class.java)
        val p2 = document.paragraphs.find { it.id == p1.id }

        if (p2?.lockedBy != null && p1.lockedBy == null && cmd.sender != p2?.lockedBy?.id) {
            return just(DocumentCommand(
                payload = Gson().toJson(p2?.lockedBy),
                sender = properties.serverId,
                type = UPDATE_LOCK
            ))
        }

        document.paragraphs
            .find { it.id == p1.id }
            ?.lockedBy = p1.lockedBy
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

    private fun hasOrdinalsConflict(): Boolean {
        val ordinals = document.paragraphs.map { it.ordinal }
        return ordinals.isNotEmpty()
                && ordinals.maxOf { it }  > ordinals.size
                || ordinals.distinct().count() != document.paragraphs.size
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
