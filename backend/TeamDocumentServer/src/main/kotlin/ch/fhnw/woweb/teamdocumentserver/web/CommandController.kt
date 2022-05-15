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
class CommandController(
    val service: DocumentService
) {

    @PostMapping
    fun processCommands(@RequestBody commands: List<DocumentCommand>): ResponseEntity<Void> {
        service.process(commands)
        return ResponseEntity(HttpStatus.OK)
    }

}
