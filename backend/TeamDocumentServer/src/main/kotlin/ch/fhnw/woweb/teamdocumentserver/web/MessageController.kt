package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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

}
