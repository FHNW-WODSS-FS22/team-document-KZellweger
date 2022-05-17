package ch.fhnw.woweb.teamdocumentserver

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
class TeamDocumentServerApplication

fun main(args: Array<String>) {
	runApplication<TeamDocumentServerApplication>(*args)
}
