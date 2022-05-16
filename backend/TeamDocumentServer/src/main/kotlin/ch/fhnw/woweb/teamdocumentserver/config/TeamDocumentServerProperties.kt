package ch.fhnw.woweb.teamdocumentserver.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import java.util.*

@ConstructorBinding
@ConfigurationProperties(prefix = "teamdocument")
class TeamDocumentServerProperties(
    val serverId: UUID,
    val userName: String,
    val userPassword: String,
    val allowedOrigins: List<String>
)
