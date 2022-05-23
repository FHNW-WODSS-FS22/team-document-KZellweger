// login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Login Suite', () => {
  it('Logs into the application', () => {
    // Undo login from global forEach
    cy.get('.logout', { timeout: 10000 }).click();
    // Login test
    cy.get('.username', { timeout: 10000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/');
    });
  });

  it('Logs into the application and logout', () => {
    // Undo login from global forEach
    cy.get('.logout', { timeout: 10000 }).click();
    // Login test
    cy.get('.username', { timeout: 10000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.get('.logout', { timeout: 10000 }).click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/login');
    });
    // Login again, so test can log out
    cy.get('.username', { timeout: 10000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
  });

  it('Tries to login with wrong credentials', () => {
    // Undo login from global forEach
    cy.get('.logout', { timeout: 10000 }).click();
    // Actual test
    cy.get('.username', { timeout: 10000 }).clear();
    cy.get('.username').type('user');
    cy.get('.password').clear();
    cy.get('.password').type('1234');
    cy.get('.login').click();
    cy.location().should((loc) => {
      expect(loc.pathname).equal('/login');
    });
  });
});
