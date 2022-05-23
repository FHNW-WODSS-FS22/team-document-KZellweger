package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.service.ResetService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/message")
class ResetController(
    private val service: ResetService
) {
    @DeleteMapping("/reset")
    fun reset(): ResponseEntity<Void> {
        return try {
            service.reset()
            ResponseEntity(HttpStatus.NO_CONTENT)
        } catch (e: Exception) {
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}