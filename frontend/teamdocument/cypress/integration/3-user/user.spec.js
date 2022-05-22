import { resetDb } from '../../utils/requestUtil';

describe('User Suite', () => {
  beforeEach(() => {
    resetDb();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.visit('localhost:3000');
    /* ==== Generated with Cypress Studio ==== */
    // Login to the application
    cy.get('.username').clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    // Needs to wait, else actions in test might be executed before INIT
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500);
    /* ==== End Cypress Studio ==== */
  });

  afterEach(() => {
    resetDb();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('.logout').click();
  });

  it('Displays a user', () => {
    cy.get('.username-primary').should('have.length.at.least', 1);
    cy.get('.username-secondary').should('have.length.at.least', 1);
  });

  it('Changes a user name', () => {
    cy.get('.username-primary').clear();
    cy.get('.username-primary').type('My cool new name', { delay: 250 });
    cy.get('.username-primary').should('have.value', 'My cool new name');
  });

  it('Changes a user name on a paragraph', () => {
    let name = '';
    // eslint-disable-next-line no-return-assign
    cy.get('.username-primary').invoke('val').then((content) => name = content);
    cy.get('.username-primary').clear();

    // Add a paragraph
    cy.get('.add').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250);
    // Check name before update
    cy.get('[tabindex="1"] > .paragraphHeader > :nth-child(1) > .author-name').should('have.value', name);

    // Check name after update
    cy.get('.username-primary').type('New Username', { delay: 250 });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500);
    cy.get('.author-name').should('contain.text', 'New Username');
  });

  it('Changes a user name on all paragraph', () => {
    // eslint-disable-next-line no-unused-vars
    let name = '';
    // eslint-disable-next-line no-return-assign
    cy.get('.username-primary').invoke('val').then((content) => name = content);
    cy.get('.username-primary').clear();

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 4; i++) {
      // Add a paragraph
      cy.get('.add').click();
    }

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250);
    cy.get('.username-primary').type('New Username', { delay: 250 });
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500);

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 4; i++) {
      // Check name after update
      cy.get(`[tabindex="${i}"] .author-name`).should('contain.text', 'New Username');
    }
  });
});
