// login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Login Suite', () => {
  beforeEach(() => {
    cy.visit('localhost:3000/');
  });

  it('Logs into the application', () => {
    cy.get('.username', { timeout: 5000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/');
    });
  });

  it('Logs into the application and logout', () => {
    cy.get('.username', { timeout: 5000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.get('.logout', { timeout: 5000 }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/login');
    });
  });

  it('Tries to login with wrong credentials', () => {
    cy.get('.username', { timeout: 5000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/login');
    });
  });
});
