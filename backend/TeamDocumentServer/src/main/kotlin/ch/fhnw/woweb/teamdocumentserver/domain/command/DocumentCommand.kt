package ch.fhnw.woweb.teamdocumentserver.domain.command

import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import java.util.*

data class DocumentCommand(
    val payload: String,
    val sender: UUID,
    val type: CommandType
)
