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

    afterEach(() => {
        resetDb();
        cy.wait(1000);
        cy.get('.logout').click();
    })

    it('Locks a paragraph', () => {
        cy.get('.add').click();
        cy.get('[tabindex="1"]').should("have.class", "locked");
        cy.get('[tabindex="1"]').click();
        cy.get('[tabindex="1"]').should("have.class", "editing");
    })

    it('Releases a lock', () => {
        cy.get('.add').click();
        cy.get('[tabindex="1"]').should("have.class", "locked");
        cy.get('[tabindex="1"]').click();
        cy.get('[tabindex="1"]').should("have.class", "editing");
        cy.get('.messages').click();
        cy.get('[tabindex="1"]').should("have.class", "locked");
    })

    it('Moves the lock', () => {
        cy.get('.add').click();
        cy.get('.add').click();
        cy.get('[tabindex="1"]').click();
        cy.get('[tabindex="1"]').should("have.class", "editing");
        cy.get('[tabindex="2"]').should("have.class", "locked");
        // Swap
        cy.get('[tabindex="2"]').click();
        cy.get('[tabindex="1"]').should("have.class", "locked");
        cy.get('[tabindex="2"]').should("have.class", "editing");
    })
})