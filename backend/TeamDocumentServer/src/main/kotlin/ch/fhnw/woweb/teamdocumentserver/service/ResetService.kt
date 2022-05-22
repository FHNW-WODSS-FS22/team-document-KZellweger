package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ResetService(
    private val processor: DocumentProcessor,
    private val repository: DocumentCommandRepository
) {
    @Transactional
    fun reset() {
        processor.resetDocument()
        repository.deleteAll()
    }
}
