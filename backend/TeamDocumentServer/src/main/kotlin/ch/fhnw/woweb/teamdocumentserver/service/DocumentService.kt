package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.CommandType.*
import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import com.google.gson.Gson
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Sinks
import java.util.*
import javax.annotation.PostConstruct

@Service
class DocumentService(
    private val activeSessionService: ActiveSessionService,
    private val processor: DocumentProcessor,
    private val repository: DocumentCommandRepository
) {

    private val sink: Sinks.Many<DocumentCommand> = Sinks.many().multicast().onBackpressureBuffer<DocumentCommand>(4200000, false)

    fun subscribe(id: UUID): Flux<DocumentCommand> {
        val cmd = activeSessionService.register(id)
        sink.tryEmitNext(cmd)

        return Flux
            .merge(getFullDocument(), activeSessionService.getActiveUsersCommand(), getUpdateStream())
            .onErrorStop()
            .doOnCancel {
               process(activeSessionService.unregister(id))
            }
    }

    //@Profile("e2e")
    fun resetDb() {
        processor.resetDocument()
        repository.deleteAll()
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
            .flatMap { processor.undo(it) }
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
