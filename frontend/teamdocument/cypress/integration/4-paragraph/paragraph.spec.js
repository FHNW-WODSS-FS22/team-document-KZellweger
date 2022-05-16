import {resetDb} from "../../utils/requestUtil";
import {wait} from "@testing-library/user-event/dist/utils";

describe('Paragraph Suite', () => {
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
            cy.get(`[tabindex="${i}"] > .paragraphContent > textarea`).click();
            cy.get(`[tabindex="${i}"] > .paragraphContent > textarea`).type(i.toString());
            cy.wait(100);
        }
        // Swap 3 with 1
        cy.get('[tabindex="3"] > .paragraphHeader').click();
        cy.get('[tabindex="3"] > .paragraphHeader > :nth-child(3) > input').clear();
        cy.get('[tabindex="3"] > .paragraphHeader > :nth-child(3) > input').type('1').type('{enter}');
        cy.wait(100);
        // Write 1 to the new 1
        cy.get('[tabindex="1"] > .paragraphContent > textarea').click();
        cy.get('[tabindex="1"] > .paragraphContent > textarea').type('1');
    })

    it('Swaps i paragraphs', () => {
        const upper = 50;
        for(let i = 1; i < upper + 1; i++) {
        }
    })
})