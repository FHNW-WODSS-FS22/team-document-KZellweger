import randomUUID from '../../src/utils/uuid';

const backendUrl = 'localhost:8080/api/v1/message';

const headers = () => ({
  Authorization: `Basic ${btoa('user:1234')}`,
  'Content-Type': 'application/json',
});

// eslint-disable-next-line default-param-last
const requestUrl = (url = backendUrl, body = {}, method = 'GET', expectedResponseCode) => cy.request({
  method,
  body,
  url,
  headers: headers(),
})
  .should((response) => {
    expect(response.status).eq(expectedResponseCode);
  });

const resetDb = async () => {
  const url = `${backendUrl}/reset`;
  return requestUrl(url, {}, 'DELETE', 204);
};

const addParagraphByAPI = async (author) => {
  const payload = {
    id: randomUUID(),
    author,
    ordinal: 1,
    content: '',
  };

  await requestUrl(backendUrl, [{
    type: 'ADD_PARAGRAPH',
    correlationId: payload.id,
    payload: JSON.stringify(payload),
    sender: author.id,
  }], 'POST', 200);

  return payload;
};

const lockParagraphByAPI = async (author, paragraph) => {
  await requestUrl(backendUrl, [{
    type: 'UPDATE_LOCK',
    payload: JSON.stringify(paragraph),
    sender: author.id,
  }], 'POST', 200);

  return paragraph;
};

const updateParagraphContentByAPI = async (author, paragraph, newContent) => {
  let pContent = paragraph.content;
  pContent += newContent;
  const payload = { ...paragraph, content: pContent };

  await requestUrl(backendUrl, [{
    type: 'UPDATE_PARAGRAPH',
    payload: JSON.stringify(payload),
    sender: author.id,
    correlationId: paragraph.id,
  }], 'POST', 200);

  return payload;
};

const removeParagraphByAPI = async (author, paragraphId) => {
  await requestUrl(backendUrl, [{
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
