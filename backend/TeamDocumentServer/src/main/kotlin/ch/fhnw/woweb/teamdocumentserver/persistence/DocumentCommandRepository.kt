package ch.fhnw.woweb.teamdocumentserver.persistence

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono
import java.util.*

interface DocumentCommandRepository : ReactiveCrudRepository<DocumentCommand, UUID> {

    fun findFirstByTypeOrderByCreatedAtDesc(type: CommandType): Mono<DocumentCommand>

    fun findFirstByTypeAndCorrelationIdOrderByCreatedAtDesc(type: CommandType, correlationId: UUID): Mono<DocumentCommand>

}
