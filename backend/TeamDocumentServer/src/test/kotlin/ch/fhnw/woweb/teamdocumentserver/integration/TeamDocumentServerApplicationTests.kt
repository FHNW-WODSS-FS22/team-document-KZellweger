package ch.fhnw.woweb.teamdocumentserver.integration

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import ch.fhnw.woweb.teamdocumentserver.service.DocumentProcessor
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createAddCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createLockCommand
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import ch.fhnw.woweb.teamdocumentserver.web.CommandController
import ch.fhnw.woweb.teamdocumentserver.web.DocumentUpdateStreamController
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureDataMongo
class TeamDocumentServerApplicationTests {

	@Autowired
	var updateController: DocumentUpdateStreamController? = null

	@Autowired
	var commandController: CommandController? = null

	@Autowired
	var repository: DocumentCommandRepository? = null

	@BeforeEach
	fun beforeEach() {
		// Make sure repository is always empty at start of test
		repository?.deleteAll()?.block()
	}

	@Test
	fun contextLoads() {}

	@Test
	fun testProcessCommands_persistenceAndNewSubscription() {
		// Given
		val cmds = listOf(createAddCommand(createParagraphPayload()))

		// When
		commandController?.processCommands(cmds)

		// Then
		val initialCommandSubscription = updateController?.getUpdatedDocumentSubscription()?.blockFirst()
		val take = repository?.findAll()?.collectList()

		Assertions.assertThat(take).isEqualTo(cmds)
		Assertions.assertThat(initialCommandSubscription).isEqualTo(cmds)
	}

	@Test
	fun singleUser_workflow() {
		// Add
		val p1 = createParagraphPayload(ordinal = 1)
		val p2 = createParagraphPayload(ordinal = 2)
		val p3 = createParagraphPayload(ordinal = 3)
		val addCmds = listOf(createAddCommand(p1), createAddCommand(p2), createAddCommand(p3))
		commandController?.processCommands(addCmds)

		// Lock
		val lockedP1 = Paragraph(p1.id, p1.ordinal, p1.content, p1.author, p1.author.id.toString())
		val lockCmds = listOf(createLockCommand(lockedP1))
		commandController?.processCommands(lockCmds)

		// N Updates
		val updateCmds =  mutableListOf<DocumentCommand>()
		var paragraphContent = ""
		for (i in 1..16) {
				paragraphContent += i
				updateCmds.add(
					CommandGenerator.createUpdateCommand(Paragraph(
					id = p1.id,
					ordinal = p1.ordinal,
					content = paragraphContent,
					author = p1.author,
					lockedBy = p1.author.id.toString()))
				)
		}
		commandController?.processCommands(updateCmds)

		// Unlock
		val unlockedP1 = Paragraph(p1.id, p1.ordinal, p1.content, p1.author, null)
		val unlockCmds = listOf(createLockCommand(unlockedP1))
		commandController?.processCommands(unlockCmds)

		val allCmds = mutableListOf<DocumentCommand>()
		allCmds.addAll(addCmds)
		allCmds.addAll(lockCmds)
		allCmds.addAll(updateCmds)
		allCmds.addAll(unlockCmds)

		val persistedCommands = repository?.findAll()?.collectList()?.block()
		Assertions.assertThat(persistedCommands).containsAll(allCmds)

		val proc = DocumentProcessor()
		allCmds.forEach { proc.process(it) }
		val expectedDocument = proc.getFullDocument().blockFirst()
		val subscriptionDocument = updateController?.getUpdatedDocumentSubscription()?.blockFirst()

		Assertions.assertThat(subscriptionDocument)
			.usingRecursiveComparison()
			.ignoringFields("id")
			.ignoringFields("sender") // TODO: Remove when sender is loaded from config
			.isEqualTo(expectedDocument)
	}

	@Test
	fun multiUser_workflow() {
		// TODO: Create separate threads editing, and make sure all commands are processed
	}

	@Test
	fun loadTest() {
		/* TODO: Create a test like DocumentProcesserLoadTest that starts at the controller.
				Multiple Users at the same time
				Measure performance and compare it to DocumentProcessorLoadTest
				If it is considerably worse there is optimization potential in the reactor plumbing
	   */
	}

}





