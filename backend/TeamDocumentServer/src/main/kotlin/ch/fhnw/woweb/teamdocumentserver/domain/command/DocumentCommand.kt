package ch.fhnw.woweb.teamdocumentserver.domain.command

import java.util.*

sealed class DocumentCommand(
    val type: CommandType = CommandType.GENERIC
) {

    abstract val sender: UUID;

    // This is only for testing
    data class GenericCommand(
        val payload: String,
        override val sender: UUID,
    ) : DocumentCommand()

    data class InitializeDocument(
        val payload: String, // TODO: Use Document as Payload
        override val sender: UUID,
    ) : DocumentCommand(CommandType.INITIAL)

    data class AddParagraph(
        // TODO: Payload
        override val sender: UUID,
    ) : DocumentCommand(CommandType.ADD_PARAGRAPH)

    data class UpdateParagraphContent(
        // TODO: Payload
        override val sender: UUID,
    ) : DocumentCommand(CommandType.UPDATE_PARAGRAPH)

    data class UpdateParagraphOrdinals(
        // TODO: Payload
        override val sender: UUID,
    ) : DocumentCommand(CommandType.UPDATE_PARAGRAPH_ORDINALS)

    data class UpdateAuthor(
        // TODO: Payload
        override val sender: UUID,
    ) : DocumentCommand(CommandType.UPDATE_AUTHOR)
}


