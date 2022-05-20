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

    fun createUpdateCommands(p: Paragraph, n: Int): MutableList<DocumentCommand> {
        val updateCmds = mutableListOf<DocumentCommand>()
        var paragraphContent = ""
        for (i in 1..n) {
            paragraphContent += i
            updateCmds.add(
                createUpdateCommand(
                    Paragraph(
                        id = p.id,
                        ordinal = p.ordinal,
                        content = paragraphContent,
                        author = p.author,
                        lockedBy = p.author
                    )
                )
            )
        }
        return updateCmds
    }

    fun createUpdateOrdinalsCommand(p: Paragraph): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(listOf(p)),
            sender = p.author.id,
            type = CommandType.UPDATE_PARAGRAPH_ORDINALS
        )
    }

    fun createUpdateOrdinalsCommand(p: List<Paragraph>, sender: UUID): DocumentCommand {
        return DocumentCommand(
            payload = Gson().toJson(p),
            sender = sender,
            type = CommandType.UPDATE_PARAGRAPH_ORDINALS
        )
    }

    fun createUpdateOrdinalsCommands(p: Paragraph, n: Int): List<DocumentCommand> {
        val cmds = mutableListOf<DocumentCommand>()
        for (i in 1..n) {
            cmds.add(createUpdateOrdinalsCommand(listOf(p), p.author.id))
        }
        return cmds;
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

    fun createAddClientCommand(ids: List<UUID> = listOf(UUID.randomUUID())): DocumentCommand{
        return DocumentCommand(
            payload = Gson().toJson(ids),
            sender = UUID.randomUUID(),
            type = CommandType.ADD_CLIENTS
        )
    }
    fun createRemoveClientCommand(id: UUID = UUID.randomUUID()): DocumentCommand{
        return DocumentCommand(
            payload = id.toString(),
            sender = id,
            type = CommandType.REMOVE_CLIENT
        )
    }

}
