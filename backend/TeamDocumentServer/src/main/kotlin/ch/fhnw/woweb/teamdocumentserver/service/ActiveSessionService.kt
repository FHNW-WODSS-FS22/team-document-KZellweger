package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

@Service
class ActiveSessionService(
    val activeUsers: MutableList<UUID> = mutableListOf()
) {

    fun register(id: UUID): DocumentCommand {
        activeUsers.add(id)
        // TODO: Add to map
    }

    fun unregister(id: UUID): DocumentCommand {
        // TODO: Remove from map
    }


    fun getActiveUsers(): Mono<DocumentCommand> {
        // TODO: generate commands from map
        return Flux.just()
    }

}
