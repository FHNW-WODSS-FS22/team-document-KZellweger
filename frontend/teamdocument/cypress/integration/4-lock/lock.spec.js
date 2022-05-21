import {resetDb} from "../../utils/requestUtil";
import User from "../../utils/user";

describe('User Suite', () => {
    beforeEach(() => {
        resetDb();
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
        cy.wait(1500);
        /* ==== End Cypress Studio ==== */
    })

    it('Locks a paragraph', () => {
        for(let j = 0; j < 1; j++) {
            let user = new User();

            for(let i = 0; i < 1; i++) {
                user.addParagraph();
                cy.wait(500);
                user.updateParagraphContent(user.selectRandomParagraph());
                cy.wait(500);
            }
        }
    })
})