package ch.fhnw.woweb.TeamDocumentServer.service

import org.reactivestreams.Publisher
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.util.function.Supplier

@Service
class DocumentService {

    var documentFlux: Supplier<Publisher<String>> = this::producePseudoStream

    fun getDocumentStream() : Flux<String>{
        return Flux.defer(documentFlux)
    }

    fun producePseudoStream(elements: List<String>): Flux<String> {
        return Flux.fromIterable(elements);
    }

}