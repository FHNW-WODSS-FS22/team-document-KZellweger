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

    it('Login to the application', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('1234');
        cy.get('.btn').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/')
        })
    })

    it('Login to the application and logout', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('1234');
        cy.get('.btn').click();
        cy.get('.logout').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/login')
        })
    })

    it('Login with wrong credentials', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('wrongPw');
        cy.get('.btn').click();
        /* ==== End Cypress Studio ==== */
        cy.location().should(loc => {
            expect(loc.pathname).to.equal('/login')
        })
    })
})