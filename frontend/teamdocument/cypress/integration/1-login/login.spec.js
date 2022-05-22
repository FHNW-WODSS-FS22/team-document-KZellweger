// login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Login Suite', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
    })

    it('Logs into the application', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.username').clear();
        cy.get('.username').type('user');
        cy.get('.password').clear();
        cy.get('.password').type('1234');
        cy.get('.login').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/')
        })
    })

    it('Logs into the application and logout', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.username').clear();
        cy.get('.username').type('user');
        cy.get('.password').clear();
        cy.get('.password').type('1234');
        cy.get('.login').click();
        cy.get('.logout').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/login')
        })
    })

    it('Tries to login with wrong credentials', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.username').clear();
        cy.get('.username').type('user');
        cy.get('.password').clear();
        cy.get('.password').type('1234');
        cy.get('.login').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/login')
        })
    })
})