package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/message")
class MessageController(
    val service: DocumentService
) {

    @PostMapping
    fun message(@RequestBody commands: List<DocumentCommand>): ResponseEntity<Void> {
        println(commands)
        service.process(commands)
        return ResponseEntity(HttpStatus.OK)
    }

    //@Profile("e2e")
    @DeleteMapping
    fun resetDb(): ResponseEntity<Void> {
        service.resetDb()
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

}
