import {resetDb} from "../../utils/requestUtil";

describe('Paragraph Suite', () => {
    beforeEach(() => {
        cy.visit('localhost:3000');
        /* ==== Generated with Cypress Studio ==== */
        // Login to the application
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('1234');
        cy.get('.btn').click();
        // Needs to wait, else actions in test might be executed before INIT
        cy.wait(1000);
        /* ==== End Cypress Studio ==== */
    })

    afterEach(() => {
        resetDb();
        cy.wait(3000);
        cy.reload();
        cy.get('.logout').click();
    })

    it('Adds a paragraph', () => {
        cy.get('.paragraphs').children('div').should('have.length', 0);
        cy.get('.add').click();
        cy.get('.paragraphs').children('div').should('have.length', 1);
    })

    it('Adds i paragraphs', () => {
        let upper = 5;
        cy.get('.paragraphs').children('div').should('have.length', 0);
        for(let i = 0; i < upper ; i++) {
            cy.get('.add').click();
        }
        cy.get('.paragraphs').children('div').should('have.length', upper);
    })

    it('Adds and removes a paragraph', () => {
        cy.get('.paragraphs').children('div').should('have.length', 0);
        cy.get('.add').click();
        cy.get('.paragraphs').children('div').should('have.length', 1);
        cy.get('.remove').click();
        cy.get('.paragraphs').children('div').should('have.length', 0);
    })

    it('Adds and removes i paragraph', () => {
        const upper = 5;
        cy.get('.paragraphs').children('div').should('have.length', 0);
        for(let i = 0; i < upper; i++) {
            cy.get('.add').click();
            cy.get('.paragraphs').children('div').should('have.length', 1);
            cy.get('.remove').click();
            cy.get('.paragraphs').children('div').should('have.length', 0);
        }
        cy.get('.paragraphs').children('div').should('have.length', 0);
    })

    it('Adds i paragraphs and removes i paragraph', () => {
        const upper = 5;
        cy.get('.paragraphs').children('div').should('have.length', 0);
        for(let i = 0; i < upper; i++) {
            cy.get('.add').click();
        }
        for(let i = upper - 1; i > 0; i--) {
            cy.get('.remove').click({ multiple: true });
        }
        cy.get('.paragraphs').children('div').should('have.length', 0);
    })
})