package ch.fhnw.woweb.TeamDocumentServer.service

import ch.fhnw.woweb.TeamDocumentServer.domain.Command
import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand
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

    // TODO implement
    fun process(command: Command) = when(command) {
        is DocumentCommand.InitializeDocument -> process(command)
        else -> {}
    }

    private fun process(command: DocumentCommand.InitializeDocument) {
        print(command.payload)
    }


}
