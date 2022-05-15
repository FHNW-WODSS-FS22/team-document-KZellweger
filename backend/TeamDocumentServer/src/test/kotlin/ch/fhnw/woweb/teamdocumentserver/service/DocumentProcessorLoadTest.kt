package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.command.DocumentCommand
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator
import com.google.gson.Gson
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import java.util.*
import kotlin.math.roundToLong

internal class DocumentProcessorLoadTest {

    private val processor: DocumentProcessor = DocumentProcessor()
    private val author = PayloadGenerator.createAuthorPayload()

    @Test
    fun testAddCommandLoad() {
        runBlocking {
            for (i in 1..512) {
                launch {
                    processWithRandomDelay(CommandGenerator.createAddCommand(Paragraph(
                        id = UUID.randomUUID(),
                        ordinal = 1,
                        content = i.toString(),
                        author = author,
                        lockedBy = null
                    )))
                }
            }
        }
        val result = processor.getFullDocument().blockFirst()
        val paragraphs = Gson().fromJson(result?.payload, Array<Paragraph>::class.java)
        for (i in 1 .. 512) {
            Assertions.assertThat(paragraphs.filter { it.ordinal == i }.count()).isEqualTo(1)
        }
    }

    suspend fun processWithRandomDelay(cmd: DocumentCommand) = run {
        delay((Math.random() * 1000).roundToLong())
        processor.process(cmd)
    }
}
