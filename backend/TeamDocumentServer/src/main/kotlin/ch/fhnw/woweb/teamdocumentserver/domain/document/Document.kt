package ch.fhnw.woweb.teamdocumentserver.domain.document

import java.util.Collections.synchronizedList

class Document(
    val paragraphs: MutableList<Paragraph> = synchronizedList(mutableListOf<Paragraph>())
)




