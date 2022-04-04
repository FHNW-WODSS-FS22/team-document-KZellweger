package ch.fhnw.woweb.TeamDocumentServer.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks

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

    fun subscribe(): Flux<String> {
        return Flux.merge(getInitialState(), getStream())
    }

    private fun getInitialState(): Flux<String> {
        return Flux.just("I am the initial state.")
    }

    private fun getStream(): Flux<String> {
        return sink.asFlux()
            .map { "Processed: $it" }
            .log()
    }
}
