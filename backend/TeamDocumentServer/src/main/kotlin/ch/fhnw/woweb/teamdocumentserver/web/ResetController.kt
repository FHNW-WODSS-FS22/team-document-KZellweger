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
    //@Profile("e2e")
    @DeleteMapping
    fun resetDb(): ResponseEntity<Void> {
        service.resetDb()
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}