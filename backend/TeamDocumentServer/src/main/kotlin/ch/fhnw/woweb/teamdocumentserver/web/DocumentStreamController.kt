package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
@RequestMapping("api/v1/document")
class DocumentStreamController(
    val service: DocumentService
)
{
    @GetMapping(produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun getUpdatedDocument(): Flux<DocumentCommand> {
        return service.subscribe()
    }
}
