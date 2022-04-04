package ch.fhnw.woweb.TeamDocumentServer.service

import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand.GenericCommand
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import java.util.*

@Service
class DocumentService {

    private val sink = Sinks.many().multicast().onBackpressureBuffer<String>()

    fun postMessages(messages: List<String>) {
        for (m in messages) {
            val result = sink.tryEmitNext(m)
            if (result.isFailure) {
                println("emit result is failure")
            }
        }
    }

    fun subscribe(): Flux<GenericCommand> {
        return Flux.merge(getInitialState(), getStream())
    }

    private fun getInitialState(): Flux<GenericCommand> {
        return Flux.just(GenericCommand("I am the initial state.", UUID.randomUUID(), "INITIAL"))
    }

    private fun getStream(): Flux<GenericCommand> {
        return sink.asFlux()
            .map { GenericCommand("Processed: $it", UUID.randomUUID(), "UPDATE") }
            .log()
    }
}
