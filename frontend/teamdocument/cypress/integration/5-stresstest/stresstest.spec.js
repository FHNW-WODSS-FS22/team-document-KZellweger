import { resetDb } from '../../utils/requestUtil';
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
    resetDb();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    cy.visit('localhost:3000/login');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    /* ==== Generated with Cypress Studio ==== */
    // Login to the application
    cy.get('.username', { timeout: 5000 }).should('be.visible').clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    // Needs to wait, else actions in test might be executed before INIT
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500);
    /* ==== End Cypress Studio ==== */

    cy.get('.username-primary').clear();
    cy.get('.username-primary').type(username, { delay: 250 });
  });

  afterEach(() => {
    resetDb();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    cy.get('.logout').click();
  });

  const add = () => {
    cy.get('.add').click();
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
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('.author-name').filter(`:contains("${username}")`).should('have.length', n + 1);
  });

  it('Can remove paragraphs under stress', () => {
    const n = 5;
    executeNActionsPerUser(n, addAndRemove);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
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
