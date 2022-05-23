import { resetDb } from '../../utils/requestUtil';

describe('Paragraph Suite', () => {
  beforeEach(() => {
    resetDb();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    cy.visit('localhost:3000/login');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
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
    cy.wait(2500);
    cy.get('.logout').click();
  });

  it('Adds a paragraph', () => {
    cy.get('.paragraphs').children('div').should('have.length', 0);
    cy.get('.add').click();
    cy.get('.paragraphs').children('div').should('have.length', 1);
  });

  it('Adds i paragraphs', () => {
    const upper = 5;
    cy.get('.paragraphs').children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
    }
    cy.get('.paragraphs').children('div').should('have.length', upper);
  });

  it('Adds and removes a paragraph', () => {
    cy.get('.paragraphs').children('div').should('have.length', 0);
    cy.get('.add').click();
    cy.get('.paragraphs').children('div').should('have.length', 1);
    cy.get('.remove').click();
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Adds and removes i paragraph', () => {
    const upper = 5;
    cy.get('.paragraphs').children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
      cy.get('.paragraphs').children('div').should('have.length', 1);
      cy.get('.remove').click();
      cy.get('.paragraphs').children('div').should('have.length', 0);
    }
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Adds i paragraphs and removes i paragraph', () => {
    const upper = 5;
    cy.get('.paragraphs').children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
    }
    // eslint-disable-next-line no-plusplus
    for (let i = upper; i > 0; i--) {
      cy.get(`[tabindex="${i}"] > .paragraphHeader > :nth-child(3) > .remove`).click();
    }
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Swaps 2 paragraphs', () => {
    const upper = 3;
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < upper + 1; i++) {
      cy.get('.add').click();
      cy.get(`[tabindex="${i}"] > .paragraphHeader`).click();
      cy.get(`[tabindex="${i}"] textarea`).click();
      cy.get(`[tabindex="${i}"] textarea`).type(i.toString());
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }
    // Swap 3 with 1
    cy.get('[tabindex="3"] > .paragraphHeader').click();
    cy.get('[tabindex="3"] > .paragraphHeader input').clear();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.get('[tabindex="3"] > .paragraphHeader input').type('1', { delay: 250 }).trigger('change');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    // Write 1 to the new 1
    cy.get('[tabindex="1"] > .paragraphHeader').click();
    cy.get('[tabindex="1"] textarea').click();
    cy.get('[tabindex="1"] textarea').type('1');
    /* ==== Generated with Cypress Studio ==== */
  });

  it('Restores a deleted paragraph', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.add').click();
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    cy.get('textarea').click();
    cy.get('textarea').type('This gets restored', { delay: 250 });
    // Simulate long waiting
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500);
    cy.get('.remove').click();
    cy.get('.add').click({ shiftKey: true });
    /* ==== End Cypress Studio ==== */
    cy.get('textarea').should('contain.text', 'This gets restored');
  });
});
