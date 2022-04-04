package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.Command
import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import org.springframework.stereotype.Service
import java.util.*

@Service
class DocumentProcessor(
    // TODO: Add repository
    val document: Document = Document()
) {

    // TODO: Receive command instead of string
    fun process(cmd: String): Command {
        return DocumentCommand.GenericCommand("Processed: $cmd", UUID.randomUUID(), CommandType.GENERIC)
    }

}
