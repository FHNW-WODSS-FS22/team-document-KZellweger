package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.document.Author
import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import ch.fhnw.woweb.teamdocumentserver.domain.document.Paragraph
import java.util.*

object TestDataUtil {
    private val placeholderId = UUID.randomUUID()

    fun createPlaceholderDocument(): Document {
        val p = Paragraph(
            id = placeholderId,
            ordinal = 0,
            content = "Hurray",
            author = Author(id = placeholderId, name = "Babababa")
        )
        return Document(mutableListOf(p));
    }

}
