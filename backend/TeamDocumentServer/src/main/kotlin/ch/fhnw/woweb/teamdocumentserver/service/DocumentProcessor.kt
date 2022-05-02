package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Flux.just
import java.util.*

@Service
class DocumentProcessor {

    private val document: Document = Document()

    fun getFullDocument(): Flux<DocumentCommand> {
        return just(
            DocumentCommand(
                UUID.randomUUID(),
                Gson().toJson(document.paragraphs),
                UUID.randomUUID(),
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
    }

    private fun addParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: Validate Ordinal and resolve Conflict if necessary
        document.paragraphs.add(p)
        return just(cmd)
    }

    private fun removeParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val id = Gson().fromJson(cmd.payload, UUID::class.java)
        document.paragraphs.removeIf { it.id == id }
        return just(cmd);
    }

    private fun updateAuthor(cmd: DocumentCommand): Flux<DocumentCommand> {
        val a = Gson().fromJson(cmd.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == a.id }
            .map { paragraph -> paragraph.author.name = a.name }
        return just(cmd)
    }

    private fun updateParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == p.id }
            ?.content = p.content
        return just(cmd)
    }

    private fun updateParagraphOrdinals(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: Fix ordinal update:
        // All effected paragraphs have to be updated within a single command.
        // Otherwise a command could leave the document in an invald state, which is not permitted.
        document.paragraphs
            .find { it.id == p.id }
            ?.ordinal = p.ordinal
        return just(cmd)
    }
}
