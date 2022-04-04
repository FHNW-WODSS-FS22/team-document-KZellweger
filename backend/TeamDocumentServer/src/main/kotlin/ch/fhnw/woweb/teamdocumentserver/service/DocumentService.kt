package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import reactor.util.concurrent.Queues.SMALL_BUFFER_SIZE
import java.util.*


@Service
class DocumentService(
    val processor: DocumentProcessor,
) {

    val sink = Sinks.many().multicast().onBackpressureBuffer<DocumentCommand>(SMALL_BUFFER_SIZE, false)

    fun subscribe(): Flux<DocumentCommand> {
        return Flux.merge(getInitialState(), getUpdateStream()).onErrorStop()
    }

    private fun getInitialState(): Flux<DocumentCommand> {
        return Flux.just(
            DocumentCommand(
                "I am the initial state.",
                UUID.randomUUID()
            )
        )
    }

    private fun getUpdateStream(): Flux<DocumentCommand> {
        return sink.asFlux().log()
    }

    fun process(messages: List<DocumentCommand>) {
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
