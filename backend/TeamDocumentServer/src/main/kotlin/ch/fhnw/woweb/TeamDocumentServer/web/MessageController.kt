package ch.fhnw.woweb.TeamDocumentServer.web

import ch.fhnw.woweb.TeamDocumentServer.service.DocumentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/message")
class MessageController(
    val service: DocumentService
) {
    @CrossOrigin(origins = ["*", "http://localhost:3000"])
    @PostMapping()
    fun message(@RequestBody message: List<String>): ResponseEntity<Void> {
        println(message)
        service.postMessages(message)
        return ResponseEntity(HttpStatus.OK)
    }
}