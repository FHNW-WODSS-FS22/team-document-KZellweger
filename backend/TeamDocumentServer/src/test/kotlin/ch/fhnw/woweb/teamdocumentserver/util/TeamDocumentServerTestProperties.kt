package ch.fhnw.woweb.teamdocumentserver.util

import ch.fhnw.woweb.teamdocumentserver.config.TeamDocumentServerProperties
import java.util.*

object TeamDocumentServerTestProperties {
    fun create(): TeamDocumentServerProperties {
        return TeamDocumentServerProperties(
            UUID.randomUUID(),
            "",
            "",
            listOf())
    }
}
