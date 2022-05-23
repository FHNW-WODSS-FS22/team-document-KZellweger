describe('User Suite', () => {
  it('Displays a user', () => {
    cy.get('.username-primary', { timeout: 5000 }).should('have.length.at.least', 1);
    cy.get('.username-secondary').should('have.length.at.least', 1);
  });

  it('Changes a user name', () => {
    cy.get('.username-primary', { timeout: 5000 }).clear();
    cy.get('.username-primary').type('My cool new name', { delay: 250 });
    cy.get('.username-primary').should('have.value', 'My cool new name');
  });

  it('Changes a user name on a paragraph', () => {
    let name = '';
    // eslint-disable-next-line no-return-assign
    cy.get('.username-primary', { timeout: 5000 }).invoke('val').then((content) => name = content);
    cy.get('.username-primary').clear();
    // Add a paragraph
    cy.get('.add').click();
    // Check name before update
    cy.get('[tabindex="1"] > .paragraphHeader > :nth-child(1) > .author-name', { timeout: 5000 }).should('have.value', name);
    // Check name after update
    cy.get('.username-primary').type('New Username', { delay: 250 });
    cy.get('.author-name', { timeout: 5000 }).should('contain.text', 'New Username');
  });

  it('Changes a user name on all paragraph', () => {
    // eslint-disable-next-line no-unused-vars
    let name = '';
    // eslint-disable-next-line no-return-assign
    cy.get('.username-primary', { timeout: 5000 }).invoke('val').then((content) => name = content);
    cy.get('.username-primary').clear();
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 4; i++) {
      // Add a paragraph
      cy.get('.add').click();
    }
    cy.get('.username-primary', { timeout: 5000 }).type('New Username', { delay: 250 });
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 4; i++) {
      // Check name after update
      cy.get(`[tabindex="${i}"] .author-name`, { timeout: 5000 }).should('contain.text', 'New Username');
    }
  });
});
