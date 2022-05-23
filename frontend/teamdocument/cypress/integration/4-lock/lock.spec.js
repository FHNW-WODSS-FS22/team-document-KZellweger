import User from '../../utils/user';

describe('User Suite', () => {
  it('Locks a paragraph', () => {
    cy.get('.username-primary').clear();
    cy.get('.username-primary').type('Test', { delay: 250 });

    cy.get('.add').click();

    // Assert locked state
    cy.get('.locked-by').should('contain.text', '');
    cy.get('[tabindex="1"]').should('have.class', 'locked');

    // Assert locked for this user
    cy.get('[tabindex="1"]').click();
    cy.get('.locked-by').should('contain.text', 'Test');
    cy.get('[tabindex="1"]').should('have.class', 'editing');
  });

  it('Releases a lock', () => {
    cy.get('.add').click();
    cy.get('[tabindex="1"]').should('have.class', 'locked');
    cy.get('[tabindex="1"]').click();
    cy.get('[tabindex="1"]').should('have.class', 'editing');
    cy.get('.messages').click();
    cy.get('[tabindex="1"]').should('have.class', 'locked');
  });

  it('Moves the lock', () => {
    cy.get('.add').click();
    cy.get('.add').click();
    cy.get('[tabindex="1"]').click();
    cy.get('[tabindex="1"]').should('have.class', 'editing');
    cy.get('[tabindex="2"]').should('have.class', 'locked');
    // Swap
    cy.get('[tabindex="2"]').click();
    cy.get('[tabindex="1"]').should('have.class', 'locked');
    cy.get('[tabindex="2"]').should('have.class', 'editing');
  });

  it('Can not edit a locked paragraph', () => {
    const user = new User();
    user.rename('Test');
    user.addParagraph();
    user.updateLock(user.selectRandomParagraph(), true);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.get('[tabindex="1"]').should('have.class', 'locked');
    cy.get('[tabindex="1"] .locked-by').should('contain.text', 'Test');
    cy.get('[tabindex="1"] textarea').should('have.attr', 'readonly');
    cy.get('[tabindex="1"] input').should('have.attr', 'readonly');

    // Behaviour should not change after click
    cy.get('[tabindex="1"]').click();
    cy.get('[tabindex="1"]').should('have.class', 'locked');
    cy.get('[tabindex="1"] .locked-by').should('contain.text', 'Test');
    cy.get('[tabindex="1"] textarea').should('have.attr', 'readonly');
    cy.get('[tabindex="1"] input').should('have.attr', 'readonly');
  });

  it('Can edit after unlocked paragraph', () => {
    cy.get('.username-primary').clear();
    cy.get('.username-primary').type('Me', { delay: 250 });

    const user = new User();
    user.rename('Other');
    user.addParagraph();
    user.updateLock(user.selectRandomParagraph(), true);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.get('[tabindex="1"]').should('have.class', 'locked');
    cy.get('[tabindex="1"] .locked-by').should('contain.text', 'Other');
    cy.get('[tabindex="1"] textarea').should('have.attr', 'readonly');
    cy.get('[tabindex="1"] input').should('have.attr', 'readonly');

    user.updateLock(user.selectRandomParagraph(), false);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    // Behaviour should change after click
    cy.get('[tabindex="1"] textarea').click();
    cy.get('[tabindex="1"]').should('have.class', 'editing');
    cy.get('[tabindex="1"] .locked-by').should('contain.text', 'Me');
    cy.get('[tabindex="1"] textarea').should('not.have.attr', 'readonly');
    cy.get('[tabindex="1"] input').should('not.have.attr', 'readonly');
    cy.get('[tabindex="1"] textarea').type('I can edit!', { delay: 250 });
    cy.get('[tabindex="1"] textarea').should('have.value', 'I can edit!');
  });

  it('Can not delete locked paragraph', () => {
    const user = new User();
    user.addParagraph();
    user.updateLock(user.selectRandomParagraph(), true);
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    // Try remove
    cy.get('.remove').click();
    cy.get('.paragraphs').children('div').should('have.length', 1);
  });
});
