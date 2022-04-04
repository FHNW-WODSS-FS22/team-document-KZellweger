package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.Command
import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand.InitializeDocument
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import java.util.*

@Service
class DocumentService(
    val processor: DocumentProcessor,
) {

    private val sink = Sinks.many().multicast().onBackpressureBuffer<Command>()

    fun subscribe(): Flux<Command> {
        return Flux.merge(getInitialState(), getUpdateStream())
    }

    private fun getInitialState(): Flux<Command> {
        return Flux.just(InitializeDocument("I am the initial state.", UUID.randomUUID(), CommandType.INITIAL))
    }

    private fun getUpdateStream(): Flux<Command> {
        return sink.asFlux().log()
    }

    fun postMessages(messages: List<String>) {
        messages
            .map { processor.process(it) }
            .forEach { publish(it) }
    }

    private fun publish(cmd: Command) {
        val result = sink.tryEmitNext(cmd)
        if (result.isFailure) {
            println("emit result is failure")
        }
    }

}
