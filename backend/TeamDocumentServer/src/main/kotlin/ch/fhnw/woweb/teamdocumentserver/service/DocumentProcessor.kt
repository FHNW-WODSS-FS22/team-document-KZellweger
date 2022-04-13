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

    val document: Document = Document()

    fun process(cmd: DocumentCommand): Flux<DocumentCommand> = when (cmd.type) {
        INITIAL -> just(cmd)
        ADD_PARAGRAPH -> addParagraph(cmd)
        REMOVE_PARAGRAPH -> removeParagraph(cmd)
        UPDATE_PARAGRAPH -> updateParagraph(cmd)
        UPDATE_PARAGRAPH_ORDINALS -> updateParagraphOrdinals(cmd)
        UPDATE_AUTHOR -> updateAuthor(cmd)
    }

    fun addParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: Validate Ordinal and resolve Conflict if necessary
        document.paragraphs.add(p)
        return just(cmd)
    }

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

    fun removeParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val id = Gson().fromJson(cmd.payload, UUID::class.java)
        document.paragraphs
            .removeIf { it.id == id }
        return just(cmd);
    }

    fun updateAuthor(cmd: DocumentCommand): Flux<DocumentCommand> {
        val a = Gson().fromJson(cmd.payload, Author::class.java)
        document.paragraphs
            .filter { it.author.id == a.id }
            .map { paragraph -> paragraph.author.name = a.name }

        return just(cmd)
    }

    fun updateParagraph(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document.paragraphs
            .find { it.id == p.id }
            ?.content = p.content
        return just(cmd)
    }

    fun updateParagraphOrdinals(cmd: DocumentCommand): Flux<DocumentCommand> {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: sanity check: when staying with swapping no conflict resolve is necessary right?
        document.paragraphs
            .find { it.id == p.id }
            ?.ordinal = p.ordinal
        return just(cmd)
    }
}
