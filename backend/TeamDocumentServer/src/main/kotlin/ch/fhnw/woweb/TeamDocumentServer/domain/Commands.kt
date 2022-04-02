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
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateParagraphContent(
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateParagraphOrdinals(
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()

    data class UpdateAuthor(
        override val sender: UUID,
        override val type: String
    ) : DocumentCommand()
}


