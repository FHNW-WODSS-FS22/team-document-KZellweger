package ch.fhnw.woweb.TeamDocumentServer.service;

import java.util.List;

public interface DocumentEventListener <T>{
    void onDataChunk(List<T> chunk);
    void processComplete();

}
