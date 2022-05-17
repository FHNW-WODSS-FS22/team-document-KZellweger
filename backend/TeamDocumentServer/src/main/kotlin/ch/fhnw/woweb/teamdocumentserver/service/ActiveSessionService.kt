package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import com.google.gson.Gson
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.util.*

@Service
class ActiveSessionService(
    val activeUsers: MutableList<UUID> = mutableListOf()
) {

    fun register(id: UUID): DocumentCommand {
        activeUsers.add(id)
        val serializedIds = Gson().toJson(listOf(id))
        return DocumentCommand(
            payload = serializedIds,
            sender = id,
            type = CommandType.ADD_CLIENTS
        )
    }

    fun unregister(id: UUID): DocumentCommand {
        activeUsers.remove(id)
        return DocumentCommand(
            payload = Gson().toJson(id),
            sender = id,
            type = CommandType.REMOVE_CLIENT
        )
    }


    fun getActiveUsersCommand(): Mono<DocumentCommand> {
        val serializedIds = Gson().toJson(activeUsers.distinct())
        return Mono.just(
            DocumentCommand(
                payload = serializedIds,
                sender = UUID.randomUUID(),
                type = CommandType.ADD_CLIENTS
            )
        )
    }

}
