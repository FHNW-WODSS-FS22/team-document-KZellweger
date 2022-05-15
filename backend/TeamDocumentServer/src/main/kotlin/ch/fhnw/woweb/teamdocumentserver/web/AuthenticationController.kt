package ch.fhnw.woweb.teamdocumentserver.web

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import java.security.Principal

@RestController
@RequestMapping("/api/v1/authentication")
class AuthenticationController {

    @GetMapping
    @ResponseBody
    fun loginWithUserNameAndPassword(user : Principal) : Principal {
        return user
    }

}