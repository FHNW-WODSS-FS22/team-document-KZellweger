package ch.fhnw.woweb.TeamDocumentServer.service

import ch.fhnw.woweb.TeamDocumentServer.domain.CommandType
import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand
import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand.GenericCommand
import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand.InitializeDocument
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import java.util.*

@Service
class DocumentService(
    val processor: DocumentProcessor,
) {

    private val sink = Sinks.many().multicast().onBackpressureBuffer<DocumentCommand>()

    fun subscribe(): Flux<DocumentCommand> {
        return Flux.merge(getInitialState(), getUpdateStream())
    }

    private fun getInitialState(): Flux<DocumentCommand> {
        return Flux.just(InitializeDocument("I am the initial state.", UUID.randomUUID(), CommandType.INITIAL))
    }

    private fun getUpdateStream(): Flux<DocumentCommand> {
        return sink.asFlux().log()
    }

    fun postMessages(messages: List<String>) {
        messages
            .map { processor.process(it) }
            .forEach { publish(it) }
    }

    private fun publish(cmd: DocumentCommand) {
        val result = sink.tryEmitNext(cmd)
        if (result.isFailure) {
            println("emit result is failure")
        }
    }

}
