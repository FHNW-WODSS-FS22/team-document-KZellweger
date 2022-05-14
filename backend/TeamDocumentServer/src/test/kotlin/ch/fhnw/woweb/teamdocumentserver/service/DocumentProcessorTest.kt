package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createAddCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createRemoveCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createUpdateAuthorCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createUpdateCommand
import ch.fhnw.woweb.teamdocumentserver.util.CommandGenerator.createUpdateOrdinalsCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyAddParagraphCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyInitialDocumentCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyRemoveParagraphCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyUpdateAuthorCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyUpdateOrdinalsCommand
import ch.fhnw.woweb.teamdocumentserver.util.DocumentCommandAssertions.verifyUpdateParagraphCommand
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createAuthorPayload
import ch.fhnw.woweb.teamdocumentserver.util.PayloadGenerator.createParagraphPayload
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import reactor.test.StepVerifier
import java.util.*

class DocumentProcessorTest {

    @Test
    @DisplayName("Empty document is generated with Processor creation")
    fun testInitialLoad() {
        // Given
        val processor = DocumentProcessor()

        // When
        val result = processor.getFullDocument()

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("First Paragraph is added")
    fun testAddParagraph() {
        // Given
        val processor = DocumentProcessor()
        val p = createParagraphPayload()
        val addCmd = createAddCommand(p)

        // When
        val result = processor.process(addCmd)

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyAddParagraphCommand(it, p) }
            .expectNextMatches { verifyUpdateOrdinalsCommand(it, p) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it, listOf(p)) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Only Existing Paragraph is removed")
    fun testRemoveParagraph() {
        // Given
        val processor = DocumentProcessor()
        val p = createParagraphPayload()
        val addCmd = createAddCommand(p)
        val removeCmd = createRemoveCommand(p.id)

        // When
        processor.process(addCmd)
        val result = processor.process(removeCmd)

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyRemoveParagraphCommand(it, p.id) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Remove for unknown is ignored but re-published")
    fun testRemoveParagraph_notFound() {
        // Given
        val processor = DocumentProcessor()
        val p = createParagraphPayload()
        val removeCmd = createRemoveCommand(p.id)

        // When
        val result = assertDoesNotThrow { processor.process(removeCmd) }

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyRemoveParagraphCommand(it, p.id) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update Only Existing Paragraph")
    fun testUpdateParagraph() {
        // Given
        val processor = DocumentProcessor()
        val pInitial = createParagraphPayload()
        val addCmd = createAddCommand(pInitial)
        val pUpdated = createParagraphPayload(id = pInitial.id, content = "This is different.")
        val updateCommand = createUpdateCommand(pUpdated)

        // When
        processor.process(addCmd)
        val result = processor.process(updateCommand)

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateParagraphCommand(it, pUpdated) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it, listOf(pUpdated)) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update for unknown is ignored but re-published")
    fun testUpdateParagraph_notFound() {
        // Given
        val processor = DocumentProcessor()
        val p = createParagraphPayload()
        val pUpdated = createParagraphPayload(id = p.id, content = "This is different.")
        val updateCommand = createUpdateCommand(pUpdated)

        // When
        val result = assertDoesNotThrow { processor.process(updateCommand) }

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateParagraphCommand(it, pUpdated) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update Author")
    fun testUpdateAuthor() {
        // Given
        val processor = DocumentProcessor()
        val pInitial = createParagraphPayload()
        val addCmd = createAddCommand(pInitial)

        val updatedAuthor = createAuthorPayload(pInitial.author.id, "Franziskus")
        val updateAuthorCmd = createUpdateAuthorCommand(updatedAuthor)

        // When
        processor.process(addCmd)
        val result = processor.process(updateAuthorCmd)

        // Then
        val pExpected = Paragraph(pInitial.id, pInitial.ordinal, pInitial.content, updatedAuthor)

        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateAuthorCommand(it, updatedAuthor) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it, listOf(pExpected)) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update Author for unknown is ignrored but re-published")
    fun testUpdateAuthor_notFound() {
        // Given
        val processor = DocumentProcessor()
        val updatedAuthor = createAuthorPayload(UUID.randomUUID(), "Franziskus")
        val updateAuthorCmd = createUpdateAuthorCommand(updatedAuthor)

        // When
        val result = assertDoesNotThrow { processor.process(updateAuthorCmd) }

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateAuthorCommand(it, updatedAuthor) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update Ordinals")
    fun testUpdateOrdinals() {
        // Given
        val processor = DocumentProcessor()
        val p1 = createParagraphPayload()
        val addCmd1 = createAddCommand(p1)
        val p2 = createParagraphPayload(1, "This is different.")
        val addCmd2 = createAddCommand(p2)

        val p1Updated = createParagraphPayload(id = p1.id, ordinal = 1)
        val ordinalsCmd = createUpdateOrdinalsCommand(p1Updated)

        // When
        processor.process(addCmd1)
        processor.process(addCmd2)
        val result = processor.process(ordinalsCmd)

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateOrdinalsCommand(it, p1Updated) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it, listOf(p2, p1Updated)) }
            .expectComplete()
            .verify()
    }

    @Test
    @DisplayName("Update ordinals for unknown is ignored but re-published")
    fun testUpdateOrdinals_notFound() {
        // Given
        val processor = DocumentProcessor()
        val p1 = createParagraphPayload()
        val pUpdated = createParagraphPayload(id = p1.id, ordinal = 1)
        val ordinalsCmd = createUpdateOrdinalsCommand(pUpdated)

        // When
        val result = assertDoesNotThrow { processor.process(ordinalsCmd) }

        // Then
        StepVerifier.create(result)
            .expectNextMatches { verifyUpdateOrdinalsCommand(it, pUpdated) }
            .expectComplete()
            .verify()

        StepVerifier.create(processor.getFullDocument())
            .expectNextMatches { verifyInitialDocumentCommand(it) }
            .expectComplete()
            .verify()
    }

    fun testUpdateFails_throws() {}


}
