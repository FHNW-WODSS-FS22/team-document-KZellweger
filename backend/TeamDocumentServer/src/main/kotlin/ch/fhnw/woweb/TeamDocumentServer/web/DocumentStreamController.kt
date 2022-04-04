package ch.fhnw.woweb.TeamDocumentServer.web

import ch.fhnw.woweb.TeamDocumentServer.domain.DocumentCommand
import ch.fhnw.woweb.TeamDocumentServer.service.DocumentService
import org.springframework.http.MediaType
import org.springframework.http.codec.ServerSentEvent
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

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
