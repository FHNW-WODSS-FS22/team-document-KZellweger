package ch.fhnw.woweb.teamdocumentserver.service

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
import java.util.*
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

@Service
@Transactional
class DocumentProcessor {


    private val SERVER_SENDER_ID = UUID.randomUUID()

    private val document: Document = Document()
    private val lock = ReentrantLock()

    fun getFullDocument(): Flux<DocumentCommand> {
        return just(
            DocumentCommand(
                UUID.randomUUID(),
                Gson().toJson(document.paragraphs),
                SERVER_SENDER_ID,
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
    }

    // Needs lock because of potential ordinals issues and update ordinals command
    private fun addParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        if (document.paragraphs.any { it.ordinal == p.ordinal }) {
            p.ordinal = document.paragraphs.maxOf { it.ordinal } + 1
        }
        document.paragraphs.add(p)
        val updateOrdinalsCmd = DocumentCommand(
            id = UUID.randomUUID(),
            payload = Gson().toJson(document.paragraphs),
            sender = SERVER_SENDER_ID, // TODO: User Server sender Id,
            type = UPDATE_PARAGRAPH_ORDINALS
        )
        return just(cmd, updateOrdinalsCmd)
    }

    // Needs lock because of Ordinal fixes (Closing gaps and update command)
    private fun removeParagraph(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val id = Gson().fromJson(cmd.payload, UUID::class.java)
        document.paragraphs.removeIf { it.id == id && it.lockedBy == cmd.sender.toString() }
        document.paragraphs.sortBy { it.ordinal }
        document.paragraphs.forEachIndexed { i: Int, p: Paragraph -> p.ordinal = i + 1 }
        val updateOrdinalsCmd = DocumentCommand(
            id = UUID.randomUUID(),
            payload = Gson().toJson(document.paragraphs),
            sender = SERVER_SENDER_ID, // TODO: User Server sender Id,
            type = UPDATE_PARAGRAPH_ORDINALS
        )
        return just(cmd, updateOrdinalsCmd)
    }

    // Does not need lock, because all updates for author will come from same thread
    // Editing the document with the same user on multiple devices results in last one wins principle
    private fun updateAuthor(cmd: DocumentCommand): Flux<DocumentCommand> {
        val a = Gson().fromJson(cmd.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == a.id }
            .map { paragraph -> paragraph.author.name = a.name }
        return just(cmd)
    }

    // Does not need lock ass list access is synchronized by using synchronized list
    private fun updateParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == p.id && it.lockedBy == cmd.sender.toString() }
            ?.content = p.content
        return just(cmd)
    }

    // Needs lock because concurrent updates are possible
    // The paragraph that triggered the update will be locked by the user
    // But the sibling paragraph it will be swapped with might not be.
    private fun updateParagraphOrdinals(cmd: DocumentCommand): Flux<DocumentCommand> = lock.withLock {
        val paragraphs = Gson().fromJson(cmd.payload, Array<Paragraph>::class.java)
        paragraphs.forEach { updateParagraphOrdinals(cmd, it) }
        return just(cmd)
    }

    private fun updateParagraphOrdinals(cmd: DocumentCommand, paragraph: Paragraph) {
        document.paragraphs
            .find { it.id == paragraph.id && it.lockedBy == cmd.sender.toString() }
            ?.ordinal = paragraph.ordinal
    }

    // Does not need explicit lock because list access is synchronized
    private fun updateLock(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == p.id }
            ?.lockedBy = p.lockedBy
        return just(cmd)
    }
}
