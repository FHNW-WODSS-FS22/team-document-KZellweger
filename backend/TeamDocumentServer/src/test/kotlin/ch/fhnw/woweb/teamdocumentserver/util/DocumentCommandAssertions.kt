package ch.fhnw.woweb.teamdocumentserver.util

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import org.assertj.core.api.Assertions.assertThat
import java.util.*

object DocumentCommandAssertions {

    private val gson = Gson()

    fun verifyInitialDocumentCommand(cmd: DocumentCommand?, expectedContent: List<Paragraph> = emptyList()): Boolean {
        assertThat(cmd?.type).isEqualTo(CommandType.INITIAL)
        val paragraphs: Array<Paragraph> = gson.fromJson(cmd?.payload, Array<Paragraph>::class.java)
        assertThat(paragraphs)
            .usingRecursiveFieldByFieldElementComparator()
            .containsAll(expectedContent)
        return true
    }

    fun verifyAddParagraphCommand(cmd: DocumentCommand, expectedPayload: Paragraph): Boolean {
        assertThat(cmd.type).isEqualTo(CommandType.ADD_PARAGRAPH)
        val paragraph = gson.fromJson(cmd.payload, Paragraph::class.java)
        assertThat(paragraph)
            .usingRecursiveComparison()
            .isEqualTo(expectedPayload)
        return true
    }

    fun verifyRemoveParagraphCommand(cmd: DocumentCommand, expectedPayload: UUID): Boolean {
        assertThat(cmd.type).isEqualTo(CommandType.REMOVE_PARAGRAPH)
        assertThat(cmd.payload).isEqualTo(expectedPayload.toString())
        return true
    }

    fun verifyUpdateParagraphCommand(cmd: DocumentCommand, expectedPayload: Paragraph): Boolean {
        assertThat(cmd.type).isEqualTo(CommandType.UPDATE_PARAGRAPH)
        val paragraph = gson.fromJson(cmd.payload, Paragraph::class.java)
        assertThat(paragraph)
            .usingRecursiveComparison()
            .isEqualTo(expectedPayload)
        return true
    }

    fun verifyUpdateOrdinalsCommand(cmd: DocumentCommand, expectedPayload: Paragraph): Boolean {
        assertThat(cmd.type).isEqualTo(CommandType.UPDATE_PARAGRAPH_ORDINALS)
        val paragraph = gson.fromJson(cmd.payload, Paragraph::class.java)
        assertThat(paragraph)
            .usingRecursiveComparison()
            .isEqualTo(expectedPayload)
        return true
    }

    fun verifyUpdateAuthorCommand(cmd: DocumentCommand, expectedPayload: Author): Boolean {
        assertThat(cmd.type).isEqualTo(CommandType.UPDATE_AUTHOR)
        val paragraph = gson.fromJson(cmd.payload, Author::class.java)
        assertThat(paragraph)
            .usingRecursiveComparison()
            .isEqualTo(expectedPayload)
        return true
    }

}