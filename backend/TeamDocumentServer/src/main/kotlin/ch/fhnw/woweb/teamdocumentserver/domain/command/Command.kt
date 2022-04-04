package ch.fhnw.woweb.teamdocumentserver.domain.command

import java.util.*

interface Command {
    val sender: UUID
    val type: CommandType
}
