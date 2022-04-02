package ch.fhnw.woweb.TeamDocumentServer.domain

import java.util.UUID

class Document(
    val paragraphs: List<Paragraph>
)

class Paragraph(
    val id: UUID,
    var ordinal: Int,
    var content: String,
    var author: Author
)

class Author(
    val id: UUID,
    var name: String
)
