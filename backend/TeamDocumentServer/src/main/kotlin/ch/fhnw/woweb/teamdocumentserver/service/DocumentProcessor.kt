package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import org.springframework.stereotype.Service

@Service
class DocumentProcessor {

    val document: Document = Document()

    fun getFullDocument(): Document {
        return document
    }

    fun process(cmd: DocumentCommand): DocumentCommand = when(cmd.type) {
            INITIAL -> cmd
            ADD_PARAGRAPH -> addParagraph(cmd)
            UPDATE_PARAGRAPH -> updateParagraph(cmd)
            UPDATE_PARAGRAPH_ORDINALS -> updateParagraphOrdinals(cmd)
            UPDATE_AUTHOR -> updateAuthor(cmd)
        }

     fun updateAuthor(cmd: DocumentCommand): DocumentCommand {
        val a = Gson().fromJson(cmd.payload, Author::class.java)
         document.paragraphs
             .filter { it.author.id == a.id }
             .map { paragraph -> paragraph.author.name = a.name }

         return cmd
    }

    fun addParagraph(cmd: DocumentCommand): DocumentCommand {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: Validate Ordinal and resolve Conflict if necessary
        document.paragraphs.add(p)
        return cmd;
    }

    fun updateParagraph(cmd: DocumentCommand): DocumentCommand {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        document
            .paragraphs
            .find { it.id == p.id }
            ?.content = p.content
        return cmd;
    }

    fun updateParagraphOrdinals(cmd: DocumentCommand): DocumentCommand {
        val p = Gson().fromJson(cmd.payload, Paragraph::class.java)
        // TODO: sanity check: when staying with swapping no conflict resolve is necessary right?
        document
            .paragraphs
            .find { it.id == p.id }
            ?.ordinal = p.ordinal
        return cmd;
    }
}
