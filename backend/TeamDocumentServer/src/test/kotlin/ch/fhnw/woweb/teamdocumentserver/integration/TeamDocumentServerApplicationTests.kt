package ch.fhnw.woweb.teamdocumentserver.integration

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.persistence.DocumentCommandRepository
import ch.fhnw.woweb.teamdocumentserver.service.DocumentProcessor
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createAddCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createLockCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createUpdateCommands
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import ch.fhnw.woweb.teamdocumentserver.util.TeamDocumentServerTestProperties
import ch.fhnw.woweb.teamdocumentserver.web.CommandController
import ch.fhnw.woweb.teamdocumentserver.web.DocumentUpdateStreamController
import com.google.gson.Gson
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.annotation.DirtiesContext
import java.lang.Thread.sleep
import java.util.concurrent.CountDownLatch
import kotlin.concurrent.thread
import kotlin.math.roundToLong

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
    fun contextLoads() {
    }

    @Test
    @DirtiesContext
    fun testProcessCommands_persistenceAndNewSubscription() {
        // Given
        val cmds = listOf(createAddCommand(createParagraphPayload()))
        val subscription = updateController?.getUpdatedDocumentSubscription()?.take(3)

        // When
        thread {
            commandController?.processCommands(cmds)
        }

        // Then
        sleep(500) // Give enough time for the repository to persist the data
        val persistedCommands = repository?.findAll()?.collectList()?.block()
        Assertions.assertThat(persistedCommands).containsAll(cmds)
        Assertions.assertThat(subscription?.collectList()?.block()).containsAll(cmds)
    }

    @Test
    @DirtiesContext
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
        val updateCmds = createUpdateCommands(p1, 512)
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

        val proc = DocumentProcessor(TeamDocumentServerTestProperties.create())
        allCmds.forEach { proc.process(it) }
        val expectedDocument = proc.getFullDocument().blockFirst()
        val subscriptionDocument = updateController?.getUpdatedDocumentSubscription()?.blockFirst()

        Assertions.assertThat(subscriptionDocument)
            .usingRecursiveComparison()
            .ignoringFields("id")
            .ignoringFields("sender")
            .ignoringFields("createdAt")
            .isEqualTo(expectedDocument)
    }

    @Test
    fun multiUser_workflow() {
        // Given
        val nUpdates = 512
        val nUsers = 3;
        val lock = CountDownLatch(nUsers)
        val start = System.currentTimeMillis()

        // When
        for (i in 1..nUsers) {
            thread(start = true) {
                val p = createParagraphPayload(ordinal = i)
                val addCommands = listOf(createAddCommand(p))
                val updateCommands = createUpdateCommands(p, nUpdates)
                sleep((Math.random() * 1000).roundToLong())
                commandController?.processCommands(addCommands)
                sleep((Math.random() * 1000).roundToLong())
                commandController?.processCommands(updateCommands)
                lock.countDown()
            }
        }

        // Then
        lock.await()
        val time = System.currentTimeMillis() - start
        val initialDocumentCommand = updateController?.getUpdatedDocumentSubscription()?.blockFirst()
        // 50 ms per Command: nUser * addCmd, nUser * lockCmd, nUpdates * updateCmd
        // This purposefully includes threading overhead as the overhead applies when requests are processed.
        Assertions.assertThat(time).isLessThan(nUpdates * nUsers * nUsers * 40L)

        val expectedContent = (1..nUpdates).joinToString("")
        val p = Gson().fromJson(initialDocumentCommand?.payload, Array<Paragraph>::class.java)

        Assertions.assertThat(p)
            .hasSize(nUsers)
            .allMatch { it.content == expectedContent }
            .allMatch { it.lockedBy != null }

        Assertions.assertThat(p.map { it.ordinal })
            .hasSize(nUsers)
            .containsAll((1..nUsers))
    }

}





