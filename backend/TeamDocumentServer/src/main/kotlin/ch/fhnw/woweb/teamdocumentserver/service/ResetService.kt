package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import org.springframework.stereotype.Service

@Service
class ResetService(
    private val processor: DocumentProcessor,
    private val repository: DocumentCommandRepository
) {
    //@Profile("e2e")
    fun resetDb() {
        processor.resetDocument()
        repository.deleteAll()
    }
}
