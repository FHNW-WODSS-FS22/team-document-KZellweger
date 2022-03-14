package ch.fhnw.woweb.TeamDocumentServer.web

import ch.fhnw.woweb.TeamDocumentServer.service.DocumentService
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

    @GetMapping(produces = [MediaType.APPLICATION_NDJSON_VALUE])
    fun getUpdatedDocument(): Flux<String> {
        return service.getDocumentStream();
    }

}