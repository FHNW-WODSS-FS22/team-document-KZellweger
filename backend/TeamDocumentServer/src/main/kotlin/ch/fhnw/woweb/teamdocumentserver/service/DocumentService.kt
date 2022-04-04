package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import com.google.gson.Gson
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import reactor.util.concurrent.Queues.SMALL_BUFFER_SIZE
import java.util.*


@Service
class DocumentService(
    val processor: DocumentProcessor,
) {

    val placeholderId = UUID.randomUUID()
    val sink = Sinks.many().multicast().onBackpressureBuffer<DocumentCommand>(SMALL_BUFFER_SIZE, false)

    fun subscribe(): Flux<DocumentCommand> {
        return Flux.merge(getInitialState(), getUpdateStream()).onErrorStop()
    }

    private fun getInitialState(): Flux<DocumentCommand> {

        val p = Paragraph(
            id = placeholderId,
            ordinal = 0,
            content = "Hurray",
            author = Author(id = placeholderId, name = "Babababa")
        )

        return Flux.just(
            DocumentCommand(
                Gson().toJson(p),
                UUID.randomUUID(),
                CommandType.INITIAL
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
