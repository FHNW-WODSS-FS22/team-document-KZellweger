import randomUUID from '../../src/utils/uuid';

const backendUrl = 'localhost:8080/api/v1/message';

const headers = () => ({
  Authorization: `Basic ${btoa('user:1234')}`,
  'Content-Type': 'application/json',
});

const addParagraphByAPI = (author) => {
  const payload = {
    id: randomUUID(),
    author,
    ordinal: 1,
    content: '',
  };

  cy.requestUrl(backendUrl, [{
    type: 'ADD_PARAGRAPH',
    correlationId: payload.id,
    payload: JSON.stringify(payload),
    sender: author.id,
  }], 'POST', 200);

  return payload;
};

const lockParagraphByAPI = (author, paragraph) => {
  cy.requestUrl(backendUrl, [{
    type: 'UPDATE_LOCK',
    payload: JSON.stringify(paragraph),
    sender: author.id,
  }], 'POST', 200);

  return paragraph;
};

const updateParagraphContentByAPI = (author, paragraph, newContent) => {
  let pContent = paragraph.content;
  pContent += newContent;
  const payload = { ...paragraph, content: pContent };

  cy.requestUrl(backendUrl, [{
    type: 'UPDATE_PARAGRAPH',
    payload: JSON.stringify(payload),
    sender: author.id,
    correlationId: paragraph.id,
  }], 'POST', 200);

  return payload;
};

const removeParagraphByAPI = (author, paragraphId) => {
  cy.requestUrl(backendUrl, [{
    type: 'REMOVE_PARAGRAPH',
    payload: JSON.stringify(paragraphId),
    sender: author.id,
  }], 'POST', 200);
};

export {
  headers,
  addParagraphByAPI,
  lockParagraphByAPI,
  updateParagraphContentByAPI,
  removeParagraphByAPI,
};
