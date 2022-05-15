package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.http.HttpStatus

internal class MessageControllerTest {

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
    fun testProcessMessages_expectionIsRethrown() {
        // Given
        val cmds = listOf<DocumentCommand>()
        val e = java.lang.IllegalArgumentException()
        Mockito.doThrow(e).`when`(documentService).process(cmds)

        // When
        // Then
        Assertions.assertThatThrownBy { controller.processCommands(cmds) }.isEqualTo(e)
    }

}
