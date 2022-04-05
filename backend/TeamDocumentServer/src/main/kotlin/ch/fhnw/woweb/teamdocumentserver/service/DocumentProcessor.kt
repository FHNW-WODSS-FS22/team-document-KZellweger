package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.service.TestDataUtil.createPlaceholderDocument
import com.google.gson.Gson
import org.springframework.stereotype.Service
import java.util.*

@Service
class DocumentProcessor(
    // TODO: Add repository
    val document: Document = createPlaceholderDocument()
) {

    fun getFullDocument(): Document {
        return document
    }

    // TODO: Receive command instead of string
    fun process(cmd: DocumentCommand): DocumentCommand = when(cmd.type) {
            INITIAL -> cmd
            ADD_PARAGRAPH -> addParagraph(cmd)
            UPDATE_PARAGRAPH -> updateParagraph(cmd)
            UPDATE_PARAGRAPH_ORDINALS -> TODO()
            UPDATE_AUTHOR -> TODO()
            GENERIC -> TODO()
        }

    fun addParagraph(cmd: DocumentCommand): DocumentCommand {
        // TODO: Consider author
        val initialParagraph = Gson().fromJson(cmd.payload, Paragraph::class.java)
        val maxOrdinal = if(document.paragraphs.isEmpty())  0 else document.paragraphs.maxOf { paragraph: Paragraph -> paragraph.ordinal }
        println("Max Ordinal $maxOrdinal")
        val p = Paragraph(
            id = UUID.randomUUID(),
            ordinal = maxOrdinal + 1,
            content = "",
            author = initialParagraph.author
        )
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

}
