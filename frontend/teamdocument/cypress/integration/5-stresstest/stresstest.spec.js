import {resetDb} from "../../utils/requestUtil";
import User from "../../utils/user";
import {delay} from "rxjs";

describe('Stress suite', () => {
    let users = [];
    let username = "Special Name"

    // Pseudo asynchronous calls
    const executeNActionsPerUser = (n, handle) => {
        for(let i = 0; i < users.length; i++) {
            for(let j = 0; j < n; j++) {
                let user = new User();
                user.randomUserBehaviour();
            }
            handle();
        }
    }

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

        cy.get('.username-primary').clear();
        cy.get('.username-primary').type(username, {delay: 250});

        // Create 5 user
        for(let i = 0; i < 5; i++) {
            users.push(new User());
        }
    })

    afterEach(() => {
        resetDb();
        cy.wait(1000);
        cy.get('.logout').click();
    })

    const add = () => {
        cy.get('.add').click();
    }

    const remove = () => {
        cy.get('.remove').click({multiple: true});
    }

    const addAndRemove = () => {
        add();
        remove();
    }

    const doNothing = () => {}

    it('Can add paragraphs under stress', () => {
        let n = 5;
        add();
        executeNActionsPerUser(n, add);
        cy.wait(500);
        cy.get('.author-name').filter(`:contains("${username}")`).should('have.length', n + 1);
    })

    it('Can remove paragraphs under stress', () => {
        let n = 5;
        executeNActionsPerUser(n, addAndRemove);
        cy.wait(500);
        cy.get('.paragraphs').children('div').should('have.length', 0);
    })

    it('Can edit paragraphs under stress', () => {
        add();
        let n = 5;
        executeNActionsPerUser(n, doNothing);
        cy.get('textarea').first().type("This is an example text", {delay: 250});
        executeNActionsPerUser(n, doNothing);
        cy.get('textarea:contains("This is an example text")').should("have.length", 1);
    })
})