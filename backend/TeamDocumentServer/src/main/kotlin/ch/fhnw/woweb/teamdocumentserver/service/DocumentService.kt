package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import com.google.gson.Gson
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import reactor.util.concurrent.Queues.SMALL_BUFFER_SIZE
import java.util.*
import javax.annotation.PostConstruct

@Service
class DocumentService(
    private val processor: DocumentProcessor,
    private val repository: DocumentCommandRepository
) {

    val sink = Sinks.many().multicast().onBackpressureBuffer<DocumentCommand>(SMALL_BUFFER_SIZE, false)

    fun subscribe(): Flux<DocumentCommand> {
        return Flux
            .merge(getFullDocument(), getUpdateStream())
            .onErrorStop()
    }

    private fun getFullDocument(): Flux<DocumentCommand> {
        return processor.getFullDocument()
    }

    private fun getUpdateStream(): Flux<DocumentCommand> {
        return sink.asFlux().log()
    }


    fun process(messages: List<DocumentCommand>) {
        messages.forEach { process(it) }
    }

    private fun process(cmd: DocumentCommand) {
        processor.process(cmd)
            .flatMap { repository.save(it) }
            .map { sink.tryEmitNext(it) }
            .log()
            .subscribe()
    }

    fun restoreLastDeleted() {
        repository.findFirstByTypeOrderByCreatedAtDesc(REMOVE_PARAGRAPH)
            .map { Gson().fromJson(it?.payload, UUID::class.java) }
            .flatMap { repository.findFirstByTypeInAndCorrelationIdOrderByCreatedAtDesc(listOf(UPDATE_PARAGRAPH, ADD_PARAGRAPH), it) }
            .flatMap { processor.toAddCommand(it) }
            .map { process(it) }
            .subscribe()
    }

    @PostConstruct
    fun loadInitialState() {
        // This operation is blocking on purpose
        // It allows creating the document state before it can be accessed by clients
        repository
            .findAll()
            .doOnNext { processor.process(it) }
            .blockLast()
    }

}
