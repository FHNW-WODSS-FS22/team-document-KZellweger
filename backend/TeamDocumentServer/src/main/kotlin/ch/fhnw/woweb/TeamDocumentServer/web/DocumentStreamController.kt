package ch.fhnw.woweb.TeamDocumentServer.web

import ch.fhnw.woweb.TeamDocumentServer.service.DocumentService
import org.springframework.http.MediaType
import org.springframework.http.codec.ServerSentEvent
import org.springframework.web.bind.annotation.CrossOrigin
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

    @CrossOrigin(origins = ["http://localhost:3000", "*"])
    @GetMapping(produces = [MediaType.APPLICATION_NDJSON_VALUE])
    fun getUpdatedDocument(): Flux<ServerSentEvent<String>>? {
        return service.getStream();
    }

}