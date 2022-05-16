package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

internal class CommandControllerTest {

    private val documentService = Mockito.mock(DocumentService::class.java)
    private val controller = CommandController(documentService)

    @Test
    fun testProcessMessages_empty() {
        // Given
        val cmds = listOf<DocumentCommand>()

        // When
        val result = controller.processCommands(cmds)

        // Then
        Mockito.verify(documentService).process(cmds)
        Assertions.assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        Assertions.assertThat(result.body).isNull()
    }

    @Test
    fun testProcessMessages_cmds() {
        // Given
        val p = createParagraphPayload()
        val cmds = listOf(
            CommandGenerator.createAddCommand(p),
            CommandGenerator.createUpdateCommand(p),
            CommandGenerator.createUpdateCommand(p),
            CommandGenerator.createUpdateCommand(p)
        )

        // When
        val result = controller.processCommands(cmds)

        // Then
        Mockito.verify(documentService).process(cmds)
        Assertions.assertThat(result.statusCode).isEqualTo(HttpStatus.OK)
        Assertions.assertThat(result.body).isNull()
    }

    @Test
    fun testProcessMessages_exceptionReturnsInternalServerError() {
        // Given
        val cmds = listOf<DocumentCommand>()
        val e = java.lang.IllegalArgumentException()
        Mockito.doThrow(e).`when`(documentService).process(cmds)

        // When
        val result = controller.processCommands(cmds)

        // Then
        val expectedResponse = ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        Assertions.assertThat(result).isEqualTo(expectedResponse)
    }

}
