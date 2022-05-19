describe('User Suite', () => {

    it('Displays a user', () => {
        cy.get('.username-primary').should('have.length.at.least', 1);
        cy.get('.username-secondary').should('have.length.at.least', 1);
    })

    it('Changes a user name', () => {
        cy.get('.username-primary').clear();
        cy.get('.username-primary').type('My cool new name', {delay: 250});
        cy.get('.username-primary').should('have.value', 'My cool new name');
    })

    it('Changes a user name on a paragraph', () => {
        let name = "";
        cy.get('.username-primary').invoke('val').then(content => name = content);
        cy.get('.username-primary').clear();

        // Add a paragraph
        cy.get('.add').click();
        cy.wait(250);
        // Check name before update
        cy.get('[tabindex="1"] > .paragraphHeader > :nth-child(1) > .author-name').should('have.value', name);

        // Check name after update
        cy.get('.username-primary').type('New Username', {delay: 250});
        cy.wait(1500);
        cy.get('.author-name').should('have.value', 'New Username');
    })

    it('Changes a user name on all paragraph', () => {
        let name = "";
        cy.get('.username-primary').invoke('val').then(content => name = content);
        cy.get('.username-primary').clear();

        for(let i = 1; i < 4; i++) {
            // Add a paragraph
            cy.get('.add').click();
        }

        cy.wait(250);
        cy.get('.username-primary').type('New Username', {delay: 250});
        cy.wait(1500);

       for(let i = 1; i < 4; i++) {
            // Check name after update
            cy.get(`[tabindex="${i}"] .author-name`).should('have.value', 'New Username');
        }

    })

})