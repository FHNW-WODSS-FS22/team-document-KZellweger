package ch.fhnw.woweb.teamdocumentserver.domain.command

import java.util.*

data class DocumentCommand(
    val payload: String,
    val sender: UUID,
    val type: CommandType
)
