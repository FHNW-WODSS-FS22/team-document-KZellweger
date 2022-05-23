describe('Paragraph Suite', () => {
  it('Adds a paragraph', () => {
    cy.get('.paragraphs', { timeout: 10000 }).children('div').should('have.length', 0);
    cy.get('.add').click();
    cy.get('[tabindex="1"]', { timeout: 10000 });
    cy.get('.paragraphs').children('div').should('have.length', 1);
  });

  it('Adds i paragraphs', () => {
    const upper = 5;
    cy.get('.paragraphs', { timeout: 10000 }).children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
      cy.get(`[tabindex="${i + 1}"]`, { timeout: 10000 });
    }
    cy.get('.paragraphs').children('div').should('have.length', upper);
  });

  it('Adds and removes a paragraph', () => {
    cy.get('.paragraphs', { timeout: 10000 }).children('div').should('have.length', 0);
    cy.get('.add').click();
    cy.get('[tabindex="1"]', { timeout: 10000 });
    cy.get('.paragraphs').children('div').should('have.length', 1);
    cy.get('.remove').click();
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Adds and removes i paragraph', () => {
    const upper = 5;
    cy.get('.paragraphs', { timeout: 10000 }).children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
      cy.get('[tabindex="1"]', { timeout: 10000 });
      cy.get('.paragraphs').children('div').should('have.length', 1);
      cy.get('.remove').click();
      cy.get('.paragraphs').children('div').should('have.length', 0);
    }
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Adds i paragraphs and removes i paragraph', () => {
    const upper = 5;
    cy.get('.paragraphs', { timeout: 10000 }).children('div').should('have.length', 0);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < upper; i++) {
      cy.get('.add').click();
      cy.get(`[tabindex="${i + 1}"]`, { timeout: 10000 });
    }
    // eslint-disable-next-line no-plusplus
    for (let i = upper; i > 0; i--) {
      cy.get(`[tabindex="${i}"] > .paragraphHeader > :nth-child(3) > .remove`).click();
    }
    cy.get('.paragraphs').children('div').should('have.length', 0);
  });

  it('Swaps 2 paragraphs', () => {
    const upper = 3;
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < upper + 1; i++) {
      cy.get('.add', { timeout: 10000 }).click();
      cy.get(`[tabindex="${i}"] > .paragraphHeader`, { timeout: 10000 }).click();
      cy.get(`[tabindex="${i}"] textarea`).click();
      cy.get(`[tabindex="${i}"] textarea`).type(i.toString());
    }
    // Swap 3 with 1
    cy.get('[tabindex="3"] > .paragraphHeader').click();
    cy.get('[tabindex="3"] > .paragraphHeader input').clear();
    cy.get('[tabindex="3"] > .paragraphHeader input').type('1', { delay: 250 }).trigger('change');
    cy.get('[tabindex="1"] > .paragraphHeader').click();
    cy.get('[tabindex="1"] textarea').click();
    cy.get('[tabindex="1"] textarea').type('1');
  });

  it('Restores a deleted paragraph', () => {
    cy.get('.add', { timeout: 10000 }).click();
    cy.get('textarea', { timeout: 10000 }).click();
    cy.get('.UPDATE_LOCK', { timeout: 10000 });
    cy.get('.UPDATE_PARAGRAPH_ORDINALS', { timeout: 10000 });
    cy.get('textarea', { timeout: 10000 }).type('This gets restored', { delay: 250 });
    cy.get('.remove', { timeout: 10000 }).click();
    cy.get('.add').click({ shiftKey: true });
    cy.get('textarea', { timeout: 10000 }).should('contain.text', 'This gets restored');
  });
});
