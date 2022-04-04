package ch.fhnw.woweb.TeamDocumentServer.service

import ch.fhnw.woweb.TeamDocumentServer.domain.CommandType
import ch.fhnw.woweb.TeamDocumentServer.domain.Document
import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand
import org.springframework.stereotype.Service
import java.util.*

@Service
class DocumentProcessor(
    val document: Document = Document()
) {

    fun process(cmd: String): DocumentCommand {
        return DocumentCommand.GenericCommand("Processed: $cmd", UUID.randomUUID(), CommandType.GENERIC)
    }

}
