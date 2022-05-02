package ch.fhnw.woweb.teamdocumentserver.web

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/authentication")
class AuthenticationController {

    @GetMapping
    fun loginWithUserNameAndPassword() : ResponseEntity<Void> {
        return ResponseEntity(HttpStatus.OK);
    }

}