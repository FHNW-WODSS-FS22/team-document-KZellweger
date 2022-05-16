package ch.fhnw.woweb.teamdocumentserver.util

import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import java.util.*

object PayloadGenerator {

    private val authorId = UUID.randomUUID()

    fun createParagraphPayload(ordinal: Int = 0, content: String = "CONTENTO", lockedBy: String? = authorId.toString(), id: UUID = UUID.randomUUID()): Paragraph {
        return Paragraph(
            id = id,
            ordinal = ordinal,
            content = content,
            author = createAuthorPayload(authorId),
            lockedBy = lockedBy
        )
    }

    fun createAuthorPayload(id: UUID = UUID.randomUUID(), name: String = "Paul"): Author {
        return Author(
            id = id,
            name = name
        )
    }

}
