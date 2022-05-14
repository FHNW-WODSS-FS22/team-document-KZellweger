package ch.fhnw.woweb.teamdocumentserver.util

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import java.util.*

object CommandGenerator {

    fun createInitialCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(listOf(p)),
            sender = UUID.randomUUID(),
            type = CommandType.INITIAL
        )
    }

    fun createAddCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = UUID.randomUUID(),
            type = CommandType.ADD_PARAGRAPH
        )
    }

    fun createRemoveCommand(id: UUID): DocumentCommand {
        return DocumentCommand(
            payload = id.toString(),
            sender = UUID.randomUUID(),
            type = CommandType.REMOVE_PARAGRAPH
        )
    }

    fun createUpdateCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = UUID.randomUUID(),
            type = CommandType.UPDATE_PARAGRAPH
        )
    }

    fun createUpdateOrdinalsCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(listOf(p)),
            sender = UUID.randomUUID(),
            type = CommandType.UPDATE_PARAGRAPH_ORDINALS
        )
    }

    fun createUpdateAuthorCommand(a: Author): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(a),
            sender = UUID.randomUUID(),
            type = CommandType.UPDATE_AUTHOR
        )
    }
}
