package ch.fhnw.woweb.TeamDocumentServer.service

import org.reactivestreams.Publisher
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.FluxSink
import java.util.function.Consumer
import java.util.function.Supplier

@Service
class DocumentService {
    var consumer: Consumer<List<String?>>? = null
    fun produceStream(): Flux<String?> {
        return Flux.create { sink: FluxSink<String?> ->
            consumer = Consumer { items: List<String?> ->
                items.forEach(
                    Consumer { t: String? -> sink.next(t!!) })
            }
        }
    }

}