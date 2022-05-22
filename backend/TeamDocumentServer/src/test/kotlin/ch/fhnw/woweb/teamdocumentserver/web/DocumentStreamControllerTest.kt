package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import reactor.core.publisher.Flux
import java.util.*

internal class DocumentStreamControllerTest {

    private val documentService = Mockito.mock(DocumentService::class.java)
    private val controller = DocumentUpdateStreamController(documentService)

    @Test
    fun testSubscriptionInitialized() {
        // Given
        val subscription = Flux.empty<DocumentCommand>()
        val clientId = UUID.randomUUID()
        Mockito.`when`(documentService.subscribe(clientId)).thenReturn(subscription)

        // When
        val result = controller.getUpdatedDocumentSubscription(clientId)

        // Then
        Assertions.assertThat(result).isSameAs(subscription)
    }

    @Test
    fun testSubscriptionFails_exceptionIsRethrown() {
        // Given
        val e = java.lang.IllegalArgumentException()
        val clientId = UUID.randomUUID()
        Mockito.doThrow(e).`when`(documentService).subscribe(clientId)

        // When
        // Then
        Assertions.assertThatThrownBy { controller.getUpdatedDocumentSubscription(clientId) }.isEqualTo(e)
    }

}
