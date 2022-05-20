import {resetDb} from "../../utils/requestUtil";
import {wait} from "@testing-library/user-event/dist/utils";

describe('Paragraph Suite', () => {
    beforeEach(() => {
        resetDb();
        cy.wait(1000);
        cy.visit('localhost:3000');
        /* ==== Generated with Cypress Studio ==== */
        // Login to the application
        cy.get(':nth-child(1) > .form-control').clear();
        cy.get(':nth-child(1) > .form-control').type('user');
        cy.get(':nth-child(2) > .form-control').clear();
        cy.get(':nth-child(2) > .form-control').type('1234');
        cy.get('.btn').click();
        // Needs to wait, else actions in test might be executed before INIT
        cy.wait(1500);
        /* ==== End Cypress Studio ==== */
    })

    afterEach(() => {
        resetDb();
        cy.wait(1000);
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
        for(let i = upper; i > 0; i--) {
            cy.get(`[tabindex="${i}"] > .paragraphHeader > :nth-child(3) > .remove`).click();
        }
        cy.get('.paragraphs').children('div').should('have.length', 0);
    })

    it('Swaps 2 paragraphs', () => {
        const upper = 3;
        for(let i = 1; i < upper + 1; i++) {
            cy.get('.add').click();
            cy.get(`[tabindex="${i}"] > .paragraphHeader`).click();
            cy.get(`[tabindex="${i}"] textarea`).click();
            cy.get(`[tabindex="${i}"] textarea`).type(i.toString());
            cy.wait(100);
        }
        // Swap 3 with 1
        // TODO find out why it doesn't swap
        cy.get('[tabindex="3"] > .paragraphHeader').click();
        cy.get('[tabindex="3"] > .paragraphHeader input').clear();
        cy.wait(500);
        cy.get('[tabindex="3"] > .paragraphHeader input').type('1', {delay: 500}).trigger('change');
        cy.wait(500);
        // Write 1 to the new 1
        cy.get('[tabindex="1"] > .paragraphHeader').click();
        cy.get('[tabindex="1"] textarea').click();
        cy.get('[tabindex="1"] textarea').type('1');
        /* ==== Generated with Cypress Studio ==== */
    })

    it('Restores a deleted paragraph', () => {
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.add').click();
        cy.get('textarea').click();
        cy.get('textarea').type('This gets restored', {delay: 250});
        // Simulate long waiting
        cy.wait(1000);
        cy.get('.remove').click();
        cy.get('.add').click({shiftKey: true});
        /* ==== End Cypress Studio ==== */
        cy.get('textarea').should('contain.text', 'This gets restored');
    })
})