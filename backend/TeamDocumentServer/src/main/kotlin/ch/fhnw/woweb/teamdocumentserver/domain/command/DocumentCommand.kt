package ch.fhnw.woweb.teamdocumentserver.domain.command

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document
data class DocumentCommand(
    @Id
    val id: UUID? = UUID.randomUUID(),
    val payload: String,
    val sender: UUID,
    val type: CommandType,
    val correlationId: UUID? = null,
    val createdAt: Long = System.currentTimeMillis()
)
