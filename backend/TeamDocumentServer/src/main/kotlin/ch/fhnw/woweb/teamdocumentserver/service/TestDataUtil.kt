package ch.fhnw.woweb.teamdocumentserver.service

import ch.fhnw.woweb.teamdocumentserver.domain.document.Document
import java.util.*

object TestDataUtil {
    private val placeholderId = UUID.randomUUID()

    fun createPlaceholderDocument(): Document {
        return Document(mutableListOf())
    }

}
