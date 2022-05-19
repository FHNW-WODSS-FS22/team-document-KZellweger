// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import {resetDb} from "../utils/requestUtil";

// Alternatively you can use CommonJS syntax:
// require('./commands')
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
