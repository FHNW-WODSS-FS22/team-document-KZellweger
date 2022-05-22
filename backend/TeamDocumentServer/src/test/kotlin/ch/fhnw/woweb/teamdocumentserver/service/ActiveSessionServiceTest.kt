package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyAddClientCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyRemoveClientCommand
import ch.fhnw.woweb.teamdocumentserver.util.TeamDocumentServerTestProperties
import com.google.gson.Gson
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import java.util.*

internal class ActiveSessionServiceTest {

    private val activeUsersContent = Mockito.spy(mutableListOf<UUID>())
    private var activeSessionService = ActiveSessionService(activeUsersContent, TeamDocumentServerTestProperties.create())

    @BeforeEach
    fun beforeEach() {
        activeUsersContent.clear()
    }

    @Test
    fun testRegister() {
        // Given
        val id = UUID.randomUUID()

        // When
        val result = activeSessionService.register(id)

        // Then
        verifyAddClientCommand(result, listOf(id))
        verifyActiveUsers(activeUsersContent, listOf(id))
    }

    @Test
    fun testRegister_alreadyRegistered() {
        // Given
        val id = UUID.randomUUID()
        activeSessionService.register(id)

        // When
        val result = activeSessionService.register(id)

        // Then
        verifyAddClientCommand(result, listOf(id))
        verifyActiveUsers(activeUsersContent, listOf(id, id))
    }

    @Test
    fun testRegister_exception() {
        // Given
        val id = UUID.randomUUID()
        val e = RuntimeException()
        Mockito.doThrow(e).`when`(activeUsersContent).add(id)

        // When
        // Then
        assertThatThrownBy { activeSessionService.register(id) }.isSameAs(e)
        verifyActiveUsers(activeUsersContent, listOf())
    }

    @Test
    fun testUnregister() {
        // Given
        val id = UUID.randomUUID()
        activeSessionService.register(id)

        // When
        val result = activeSessionService.unregister(id)

        // Then
        verifyRemoveClientCommand(result, id)
        verifyActiveUsers(activeUsersContent, listOf())
    }

    @Test
    fun testUnregister_unknown() {
        // Given
        val id = UUID.randomUUID()

        // When
        val result = activeSessionService.unregister(id)

        // Then
        verifyRemoveClientCommand(result, id)
        verifyActiveUsers(activeUsersContent, listOf())
    }

    @Test
    fun testUnregister_exception() {
        // Given
        val id = UUID.randomUUID()
        val e = RuntimeException()
        activeSessionService.register(id)
        Mockito.doThrow(e).`when`(activeUsersContent).remove(id)

        // When
        // Then
        assertThatThrownBy { activeSessionService.unregister(id) }.isSameAs(e)
        verifyActiveUsers(activeUsersContent, listOf(id))
    }

    @Test
    fun testGetActiveUsersCommand_empty() {
        // Given

        // When
        val result = activeSessionService.getActiveUsersCommand()

        // Then
        val payload = Gson().fromJson(result.block()?.payload, Array<UUID>::class.java)
        verifyActiveUsers(payload)
    }

    @Test
    fun testGetActiveUsersCommand_containsKnown() {
        // Given
        val id = UUID.randomUUID()
        activeSessionService.register(id)

        // When
        val activeUsersCommand = activeSessionService.getActiveUsersCommand()

        // Then
        val result = Gson().fromJson(activeUsersCommand.block()?.payload, Array<UUID>::class.java)
        verifyActiveUsers(result, listOf(id))
    }

    @Test
    fun testGetActiveUsersCommand_resultIsDistinct() {
        // Given
        val id = UUID.randomUUID()
        activeSessionService.register(id)
        activeSessionService.register(id)

        // When
        val activeUsersCommand = activeSessionService.getActiveUsersCommand()

        // Then
        val result = Gson().fromJson(activeUsersCommand.block()?.payload, Array<UUID>::class.java)
        verifyActiveUsers(result, listOf(id))
    }

    private fun verifyActiveUsers(actual: List<UUID>?, expected: List<UUID> = listOf()) {
        assertThat(actual)
            .isNotNull
            .hasSize(expected.size)
            .containsAll(expected)
    }

    private fun verifyActiveUsers(actual: Array<UUID>?, expected: List<UUID> = listOf()) {
        assertThat(actual)
            .isNotNull
            .hasSize(expected.size)
            .containsAll(expected)
    }

}
