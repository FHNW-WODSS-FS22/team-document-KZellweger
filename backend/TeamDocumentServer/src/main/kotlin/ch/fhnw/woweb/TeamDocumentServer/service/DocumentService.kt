package ch.fhnw.woweb.TeamDocumentServer.service

import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks

@Service
class DocumentService {
    val sink = Sinks.many().multicast().onBackpressureBuffer<String>()

    fun postMessages(messages: List<String>) {
        for (m in messages) {
            val result = sink.tryEmitNext(m)
            if (result.isFailure) {
                println("emit result is failure")
            }
        }
    }

    fun getStream(): Flux<String> {
        return sink.asFlux()
            .map { "Processed: $it" }
            .log()
    }
}
