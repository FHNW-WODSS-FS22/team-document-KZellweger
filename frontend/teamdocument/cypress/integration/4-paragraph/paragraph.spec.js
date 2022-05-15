describe('Login Suite', () => {
    it('Login to the application', () => {
        cy.visit('localhost:3000');
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('1234');
        cy.get('.btn').click();
        /* ==== End Cypress Studio ==== */
        cy.get('.paragraphs').children('div').should('have.length', 0);
        /* ==== Generated with Cypress Studio ==== */
        cy.get(':nth-child(2) > button').click();
        /* ==== End Cypress Studio ==== */
        cy.get('.paragraphs').children('div').should('have.length', 1);
    })
})