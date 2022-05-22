package ch.fhnw.woweb.teamdocumentserver.web

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.service.DocumentService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/message")
class CommandController(
    private val service: DocumentService
) {

    private val logger: Logger = LoggerFactory.getLogger(CommandController::class.java)

    @PostMapping
    fun processCommands(@RequestBody commands: List<DocumentCommand>): ResponseEntity<Void> {
        return try {
            service.process(commands)
            ResponseEntity(HttpStatus.OK)
        } catch (e: Exception) {
            logger.error("Processing Command failed with exception.", e)
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PostMapping("/restore")
    fun restoreLastDeleted(): ResponseEntity<Void> {
        return try {
            service.restoreLastDeleted()
            ResponseEntity(HttpStatus.OK)
        } catch (e: Exception) {
            logger.error("Processing Command failed with exception.", e)
            ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
