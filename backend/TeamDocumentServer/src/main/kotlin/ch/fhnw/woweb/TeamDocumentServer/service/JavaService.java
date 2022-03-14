package ch.fhnw.woweb.TeamDocumentServer.service;

import reactor.core.publisher.Flux;

import org.reactivestreams.Publisher;
import reactor.core.publisher.FluxSink;

import java.util.List;
import java.util.function.Supplier;

public class JavaService {

    Flux<String> bridge = Flux.create(sink -> {
        new DocumentEventListener<String> (){
            @Override
            public void onDataChunk(List<String> chunk) {
                for(String s : chunk){
                    sink.next(s);
                }
            }

            @Override
            public void processComplete() {
                sink.complete();
            }
        };
    });

    public Flux<String> getFlux(){
        return bridge;
    }

    public void produceStream(List<String> elements){
        Flux.fromIterable(elements);
    }
}
