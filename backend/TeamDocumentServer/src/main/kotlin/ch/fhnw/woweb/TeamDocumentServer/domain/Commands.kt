package ch.fhnw.woweb.TeamDocumentServer.domain

import java.util.UUID

interface Command {
    val sender: UUID
    val type: String
}

sealed class DocumentCommand : Command {
    data class InitializeDocument(
        val payload: Document,
        override val sender: UUID,
        override val type: String,
    ) : DocumentCommand()
}


class Service {

    fun process(command: Command) = when(command) {
        is DocumentCommand.InitializeDocument -> process(command)
        else -> {}
    }

    private fun process(command: DocumentCommand.InitializeDocument) {
        print(command.payload)
    }

}

// Initial Load

// Add Paragraph
class AddParagraph

// Update Paragraph
class UpdateParagraphContent
class UpdateParagraphOrdinals

// Change AuthorName
class UpdateAuthor
