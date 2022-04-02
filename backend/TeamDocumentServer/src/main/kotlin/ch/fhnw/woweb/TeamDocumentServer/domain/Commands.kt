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

    data class AddParagraph(
        // TODO: Payload
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateParagraphContent(
        // TODO: Payload
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateParagraphOrdinals(
        // TODO: Payload
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateAuthor(
        // TODO: Payload
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()
}


