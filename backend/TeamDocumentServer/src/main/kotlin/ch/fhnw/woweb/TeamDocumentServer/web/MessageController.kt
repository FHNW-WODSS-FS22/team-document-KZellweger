package ch.fhnw.woweb.TeamDocumentServer.web

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/message")
class MessageController {

    @PostMapping()
    fun message(@RequestBody message: String): ResponseEntity<Void> {
        println(message)
        return ResponseEntity(HttpStatus.OK)
    }
}