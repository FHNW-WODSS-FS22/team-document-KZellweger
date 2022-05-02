package ch.fhnw.woweb.teamdocumentserver.persistence

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import java.util.*

interface DocumentCommandRepository : ReactiveCrudRepository<DocumentCommand, UUID>
