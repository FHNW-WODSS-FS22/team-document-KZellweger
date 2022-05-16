package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createInitialCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import reactor.core.publisher.Flux.just
import reactor.core.publisher.Mono
import reactor.test.StepVerifier

@Disabled
internal class DocumentServiceTest {

    private val processor = Mockito.mock(DocumentProcessor::class.java)
    private val repository = Mockito.mock(DocumentCommandRepository::class.java)
    private val service = DocumentService(processor, repository)


    @Test
    fun subscribe() {
        // Given
        val p = createParagraphPayload()
        val initialCmd = createInitialCommand(p)
        Mockito.`when`(processor.getFullDocument()).thenReturn(just(initialCmd))

        // When
        val subscription = service.subscribe()

        // Then
        DocumentCommandAssertions.verifyFullDocumentCommand(subscription.blockFirst())
        Mockito.verify(processor).getFullDocument()
        Mockito.verifyNoInteractions(repository)
    }

    @Test
    fun process() {
        // Given
        val p = createParagraphPayload()
        val initialCmd = createInitialCommand(p)
        val p2 = createParagraphPayload()
        val addCmd = CommandGenerator.createAddCommand(p2)

        Mockito.`when`(processor.getFullDocument()).thenReturn(just(initialCmd))
        Mockito.`when`(processor.process(addCmd)).thenReturn(just(addCmd))
        Mockito.`when`(repository.save(addCmd)).thenReturn(Mono.just(addCmd))

        // When
        service.process(listOf(addCmd))

        // Then
        StepVerifier.create(service.subscribe().take(2))
            .consumeNextWith { DocumentCommandAssertions.verifyFullDocumentCommand(it, listOf(p)) }
            .consumeNextWith { DocumentCommandAssertions.verifyAddParagraphCommand(it, p2) }
            .verifyComplete()
    }

    @Test
    fun testProcessFails() {
        // Given
        val p = createParagraphPayload()
        val initialCmd = createInitialCommand(p)
        val p2 = createParagraphPayload()
        val addCmd = CommandGenerator.createAddCommand(p2)
        val e = RuntimeException()

        Mockito.`when`(processor.getFullDocument()).thenReturn(just(initialCmd))
        Mockito.`when`(processor.process(addCmd)).thenThrow(e)

        // When
        Assertions.assertThatThrownBy { service.process(listOf(addCmd)) }.isEqualTo(e)

        // Then
        Mockito.verifyNoMoreInteractions(repository)
        StepVerifier.create(service.subscribe().take(1))
            .consumeNextWith { DocumentCommandAssertions.verifyFullDocumentCommand(it, listOf(p)) }
            .verifyComplete()
    }


    @Test
    fun loadInitialState() {
        // Given
        val p = createParagraphPayload()
        val initialCmd = createInitialCommand(p)
        val p2 = createParagraphPayload()
        val addCmd = CommandGenerator.createAddCommand(p2)
        Mockito.`when`(repository.findAll()).thenReturn(just(initialCmd, addCmd))
        Mockito.`when`(processor.process(initialCmd)).thenReturn(just(initialCmd))
        Mockito.`when`(processor.process(addCmd)).thenReturn(just(addCmd))

        // When
        service.loadInitialState()

        // Then
        Mockito.verify(processor).process(initialCmd)
        Mockito.verify(processor).process(addCmd)
        Mockito.verifyNoMoreInteractions(processor)
    }
}
