package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator
import ch.fhnw.woweb.teamdocumentserver.util.TeamDocumentServerTestProperties
import com.google.gson.Gson
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.*
import java.util.concurrent.atomic.AtomicReference
import kotlin.math.roundToLong

internal class DocumentProcessorLoadTest {

    private val NUMBER_OF_COMMANDS = 512
    private val MAX_MS_PER_COMMAND = 4L
    private val MAX_MS_TOTAL = NUMBER_OF_COMMANDS * MAX_MS_PER_COMMAND

    private val processor: DocumentProcessor = DocumentProcessor(TeamDocumentServerTestProperties.create())
    private val author = PayloadGenerator.createAuthorPayload()

    @Test
    fun testAddCommandLoad() {
        // Given
        // Processor is initialized
        val start = System.currentTimeMillis()

        // When
        runBlocking {
            for (i in 1..NUMBER_OF_COMMANDS) {
                launch {
                    delay((Math.random() * 1000).roundToLong())
                    processor.process(CommandGenerator.createAddCommand(Paragraph(
                        id = UUID.randomUUID(),
                        ordinal = 1,
                        content = i.toString(),
                        author = author,
                        lockedBy = null
                    )))
                }
            }
        }

        // Then
        // Expected time is kept
        val totalTime = System.currentTimeMillis() - start
        assertThat(totalTime).isLessThan(MAX_MS_TOTAL)

        // Conflicts are resolved
        val result = processor.getFullDocument().blockFirst()
        val paragraphs: Array<Paragraph> = Gson().fromJson(result?.payload, Array<Paragraph>::class.java)

        val expectedOrdinals: List<Int> = (1..NUMBER_OF_COMMANDS).toList()
        assertThat(paragraphs.map { it.ordinal } ).containsAll(expectedOrdinals).hasSize(NUMBER_OF_COMMANDS)
    }

    @Test
    fun testUpdateContentCommandLoad() {
        // Given
        // Processor is initialized
        val start = System.currentTimeMillis()

        val paragraphContent: AtomicReference<String> = AtomicReference("");
        val sender = author.id
        val paragraphId = UUID.randomUUID()

        processor.process(CommandGenerator.createAddCommand(Paragraph(
            id = paragraphId,
            ordinal = 1,
            content = paragraphContent.get(),
            author = author,
            lockedBy = author
        )))

        // When
        runBlocking {
            for (i in 1..NUMBER_OF_COMMANDS) {
                launch {
                    delay((Math.random() * 1000).roundToLong())
                    paragraphContent.set(paragraphContent.get() + i)
                    processor.process(CommandGenerator.createUpdateCommand(Paragraph(
                        id = paragraphId,
                        ordinal = i,
                        content = paragraphContent.get(),
                        author = author,
                        lockedBy = author
                    )))
                }
            }
        }

        // Then
        // Expected time is kept
        val totalTime = System.currentTimeMillis() - start
        assertThat(totalTime).isLessThan(MAX_MS_TOTAL)

        // Conflicts are resolved
        val result = processor.getFullDocument().blockFirst()
        val paragraphs: Array<Paragraph> = Gson().fromJson(result?.payload, Array<Paragraph>::class.java)

        assertThat(paragraphs).hasSize(1)
        assertThat(paragraphs[0].content).isEqualTo(paragraphContent.get())
    }
}
