package ch.fhnw.woweb.teamdocumentserver.util

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson

object CommandGenerator {

    fun createInitialCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(listOf(p)),
            sender = p.author.id,
            type = CommandType.INITIAL
        )
    }

    fun createAddCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = p.author.id,
            type = CommandType.ADD_PARAGRAPH
        )
    }

    fun createRemoveCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = p.id.toString(),
            sender = p.author.id,
            type = CommandType.REMOVE_PARAGRAPH
        )
    }

    fun createUpdateCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = p.author.id,
            type = CommandType.UPDATE_PARAGRAPH
        )
    }

    fun createUpdateOrdinalsCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(listOf(p)),
            sender = p.author.id,
            type = CommandType.UPDATE_PARAGRAPH_ORDINALS
        )
    }

    fun createUpdateAuthorCommand(a: Author): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(a),
            sender = a.id,
            type = CommandType.UPDATE_AUTHOR
        )
    }

    fun createLockCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = p.author.id,
            type = CommandType.UPDATE_LOCK
        )
    }
}
