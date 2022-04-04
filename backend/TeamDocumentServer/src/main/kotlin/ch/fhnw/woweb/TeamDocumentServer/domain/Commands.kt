package ch.fhnw.woweb.TeamDocumentServer.domain

import java.util.UUID

interface Command {
    val sender: UUID
    val type: CommandType
}

enum class CommandType {
    GENERIC, // For testing
    INITIAL,
    ADD_PARAGRAPH,
    UPDATE_PARAGRAPH,
    UPDATE_PARAGRAPH_ORDINALS,
    UPDATE_AUTHOR
}

sealed class DocumentCommand : Command {

    // This is only for testing
    data class GenericCommand(
        val payload: String,
        override val sender: UUID,
        override val type: CommandType = CommandType.GENERIC,
    ) : DocumentCommand()

    data class InitializeDocument(
        val payload: String, // TODO: Use Document as Payload
        override val sender: UUID,
        override val type: CommandType = CommandType.INITIAL,
    ) : DocumentCommand()

    data class AddParagraph(
        // TODO: Payload
        override val sender: UUID,
        override val type: CommandType = CommandType.ADD_PARAGRAPH,
    ) : DocumentCommand()

    data class UpdateParagraphContent(
        // TODO: Payload
        override val sender: UUID,
        override val type: CommandType = CommandType.UPDATE_PARAGRAPH,
    ) : DocumentCommand()

    data class UpdateParagraphOrdinals(
        // TODO: Payload
        override val sender: UUID,
        override val type: CommandType = CommandType.UPDATE_PARAGRAPH_ORDINALS,
    ) : DocumentCommand()

    data class UpdateAuthor(
        // TODO: Payload
        override val sender: UUID,
        override val type: CommandType = CommandType.UPDATE_AUTHOR,
    ) : DocumentCommand()
}


