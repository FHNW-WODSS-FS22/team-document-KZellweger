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
    private val properties: TeamDocumentServerProperties
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

    fun process(documentCommand: DocumentCommand): Flux<DocumentCommand> = when (documentCommand.type) {
        INITIAL -> just(documentCommand)
        ADD_PARAGRAPH -> addParagraph(documentCommand)
        REMOVE_PARAGRAPH -> removeParagraph(documentCommand)
        UPDATE_PARAGRAPH -> updateParagraph(documentCommand)
        UPDATE_PARAGRAPH_ORDINALS -> updateParagraphOrdinals(documentCommand)
        UPDATE_AUTHOR -> updateAuthor(documentCommand)
        UPDATE_LOCK -> updateLock(documentCommand)
        REMOVE_CLIENT -> removeClient(documentCommand)
        ADD_CLIENTS -> Flux.empty()
    }

    private fun removeClient(removeClientCommand: DocumentCommand): Flux<DocumentCommand> {
        val removeLockCommands : MutableList<DocumentCommand> = mutableListOf()
        document.paragraphs
            .filter { it.lockedBy?.id == Gson().fromJson(removeClientCommand.payload, UUID::class.java) }
            .map { paragraph ->
                paragraph.lockedBy = null
                removeLockCommands.add(
                    DocumentCommand(
                        payload = Gson().toJson(paragraph),
                        sender = properties.serverId,
                        type = UPDATE_LOCK
                    ))
            }
        removeLockCommands.add(0,removeClientCommand)
        return Flux.fromIterable(removeLockCommands)
    }

    private fun addParagraph(addParagraphCommand: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphPayload = Gson().fromJson(addParagraphCommand.payload, Paragraph::class.java)
        document.paragraphs.add(paragraphPayload)
        return Flux.merge(just(addParagraphCommand), resolveOrdinalsConflicts())
    }

    fun resetDocument() {
        document.paragraphs.removeAll(document.paragraphs)
    }

    private fun removeParagraph(removeParagraphCommand: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphIdPayload = Gson().fromJson(removeParagraphCommand.payload, UUID::class.java)
        document.paragraphs.removeIf { it.id == paragraphIdPayload }
        return Flux.merge(just(removeParagraphCommand), resolveOrdinalsConflicts())
    }

    private fun updateAuthor(updateAuthorCommand: DocumentCommand): Flux<DocumentCommand> {
        val authorPayload = Gson().fromJson(updateAuthorCommand.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == authorPayload.id }
            .map { paragraph ->
                paragraph.author.name = authorPayload.name
                paragraph.lockedBy?.name= authorPayload.name
            }
        return just(updateAuthorCommand)
    }

    private fun updateParagraph(updateParagraphCommand: DocumentCommand): Flux<DocumentCommand> {
        val paragraphPayload = Gson().fromJson(updateParagraphCommand.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.content = paragraphPayload.content
        return Flux.merge(just(updateParagraphCommand))
    }

    private fun updateParagraphOrdinals(updateOrdinalsCommand: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphsPayload = Gson().fromJson(updateOrdinalsCommand.payload, Array<Paragraph>::class.java)
        paragraphsPayload.forEach { updateParagraphOrdinals(it) }
        return Flux.merge(just(updateOrdinalsCommand), resolveOrdinalsConflicts())
    }

    private fun updateParagraphOrdinals(paragraphPayload: Paragraph) {
        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.ordinal = paragraphPayload.ordinal
    }

    private fun updateLock(updateLockCommand: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphPayload = Gson().fromJson(updateLockCommand.payload, Paragraph::class.java)
        val existingParagraph = document.paragraphs.find { it.id == paragraphPayload.id }

        if (existingParagraph?.lockedBy != null && paragraphPayload.lockedBy == null && updateLockCommand.sender != existingParagraph?.lockedBy?.id) {
            return just(DocumentCommand(
                payload = Gson().toJson(existingParagraph?.lockedBy),
                sender = properties.serverId,
                type = UPDATE_LOCK
            ))
        }

        document.paragraphs
            .find { it.id == paragraphPayload.id }
            ?.lockedBy = paragraphPayload.lockedBy
        return just(updateLockCommand)
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

    fun undo(commandToUndo: DocumentCommand): Mono<DocumentCommand> {
        // So far only undoing a RemoveCommand is supported
        val paragraphToRestore = Gson().fromJson(commandToUndo.payload, Paragraph::class.java)
        val sanitizedParagraph = Paragraph(
            ordinal = paragraphToRestore.ordinal,
            content = paragraphToRestore.content,
            author = paragraphToRestore.author
        )
        return Mono.just(DocumentCommand(payload = Gson().toJson(sanitizedParagraph), sender = UUID.randomUUID(), type = ADD_PARAGRAPH))
    }
}
