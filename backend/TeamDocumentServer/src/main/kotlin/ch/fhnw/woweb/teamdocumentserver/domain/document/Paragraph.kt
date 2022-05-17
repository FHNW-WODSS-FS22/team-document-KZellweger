package ch.fhnw.woweb.teamdocumentserver.domain.document

import java.util.*

class Paragraph(
    val id: UUID = UUID.randomUUID(),
    var ordinal: Int,
    var content: String,
    var author: Author,
    var lockedBy: Author? = null
)
