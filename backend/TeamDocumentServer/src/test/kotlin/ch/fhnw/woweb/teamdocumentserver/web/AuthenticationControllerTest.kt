package ch.fhnw.woweb.teamdocumentserver.web

import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import java.security.Principal

internal class AuthenticationControllerTest {

    @Test
    fun loginWithUserNameAndPassword() {
        // Given
        val controller = AuthenticationController()
        val principal = Mockito.mock(Principal::class.java)

        // When
        val result = controller.loginWithUserNameAndPassword(principal)

        // Then
        Assertions.assertThat(result).isSameAs(principal)
    }
}
