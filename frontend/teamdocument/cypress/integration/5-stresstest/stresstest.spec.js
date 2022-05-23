import User from '../../utils/user';

describe('Stress suite', () => {
  const username = 'Special Name';

  // Pseudo asynchronous calls
  const executeNActionsPerUser = (n, handle) => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < n; i++) {
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < n; j++) {
        const user = new User();
        user.randomUserBehaviour();
      }
      handle();
    }
  };

  beforeEach(() => {
    cy.get('.username-primary', { timeout: 5000 }).clear();
    cy.get('.username-primary').type(username, { delay: 250 });
  });

  const add = () => {
    cy.get('.add').click();
    cy.get('.UPDATE_PARAGRAPH_ORDINALS', { timeout: 10000 });
  };

  const remove = () => {
    cy.get('.remove').click({ multiple: true });
  };

  const addAndRemove = () => {
    add();
    remove();
  };

  const doNothing = () => {};

  it('Can add paragraphs under stress', () => {
    const n = 5;
    add();
    executeNActionsPerUser(n, add);
    cy.get('.author-name').filter(`:contains("${username}")`).should('have.length', n + 1);
  });

  it('Can remove paragraphs under stress', () => {
    const n = 5;
    executeNActionsPerUser(n, addAndRemove);
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Can edit paragraphs under stress', () => {
    add();
    const n = 5;
    executeNActionsPerUser(n, doNothing);
    cy.get('textarea').first().type('This is an example text', { delay: 250 });
    executeNActionsPerUser(n, doNothing);
    cy.get('textarea:contains("This is an example text")').should('have.length', 1);
  });
});
