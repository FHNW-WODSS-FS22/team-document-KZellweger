package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import org.springframework.stereotype.Service
import java.util.*

@Service
class DocumentProcessor(
    // TODO: Add repository
    val document: Document = Document()
) {

    // TODO: Receive command instead of string
    fun process(cmd: DocumentCommand): DocumentCommand {

//        when(cmd.type) {
//            GENERIC -> TODO()
//            INITIAL -> TODO()
//            ADD_PARAGRAPH -> TODO()
//            UPDATE_PARAGRAPH -> TODO()
//            UPDATE_PARAGRAPH_ORDINALS -> TODO()
//            UPDATE_AUTHOR -> TODO()
//        }

        return DocumentCommand(
            payload = "Processed: $cmd",
            sender = UUID.randomUUID()
        )
    }

}
