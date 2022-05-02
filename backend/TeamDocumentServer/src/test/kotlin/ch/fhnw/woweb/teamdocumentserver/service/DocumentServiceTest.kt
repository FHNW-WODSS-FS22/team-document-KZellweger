package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createInitialCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoExtension
import reactor.core.publisher.Flux

@ExtendWith(MockitoExtension::class)
internal class DocumentServiceTest {

    private val processor = Mockito.mock(DocumentProcessor::class.java)
    private val repository = Mockito.mock(DocumentCommandRepository::class.java)
    private val service = DocumentService(processor, repository)

    @Test
    fun subscribe_initialIsPublished() {
        // Given
        val p = createParagraphPayload()
        val initialCmd = createInitialCommand(p)
        Mockito.`when`(processor.getFullDocument()).thenReturn(Flux.just(initialCmd))

        // When
        val subscription = service.subscribe()

        // Then
        DocumentCommandAssertions.verifyInitialDocumentCommand(subscription.blockFirst())
    }

    @Test
    fun process() {
    }

    @Test
    fun loadInitialState() {
    }
}
