import randomUUID from '../../src/utils/uuid';

const backendUrl = 'localhost:8080/api/v1/message';

const headers = () => ({
  Authorization: `Basic ${btoa('user:1234')}`,
  'Content-Type': 'application/json',
});

// eslint-disable-next-line default-param-last
const requestUrl = (url = backendUrl, body = {}, method = 'GET', expectedResponseCode) => {
  cy.request({
    method,
    body,
    url,
    headers: headers(),
  })
    .should((response) => {
      expect(response.status).eq(expectedResponseCode);
    });
};

const resetDb = () => {
  const url = `${backendUrl}/reset`;
  requestUrl(url, {}, 'DELETE', 204);
};

const addParagraphByAPI = (author) => {
  const payload = {
    id: randomUUID(),
    author,
    ordinal: 1,
    content: '',
  };

  requestUrl(backendUrl, [{
    type: 'ADD_PARAGRAPH',
    correlationId: payload.id,
    payload: JSON.stringify(payload),
    sender: author.id,
  }], 'POST', 200);

  return payload;
};

const lockParagraphByAPI = (author, paragraph) => {
  requestUrl(backendUrl, [{
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

  requestUrl(backendUrl, [{
    type: 'UPDATE_PARAGRAPH',
    payload: JSON.stringify(payload),
    sender: author.id,
    correlationId: paragraph.id,
  }], 'POST', 200);

  return payload;
};

const removeParagraphByAPI = (author, paragraphId) => {
  requestUrl(backendUrl, [{
    type: 'REMOVE_PARAGRAPH',
    payload: JSON.stringify(paragraphId),
    sender: author.id,
  }], 'POST', 200);
};

export {
  resetDb,
  requestUrl,
  addParagraphByAPI,
  lockParagraphByAPI,
  updateParagraphContentByAPI,
  removeParagraphByAPI,
};
