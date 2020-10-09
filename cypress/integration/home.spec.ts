import { currenciesConfig } from './../../src/config/currencies';

// const formatRegex = /\B(?=(\d{3})+(?!\d))/g;

context('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should be able to change the current currency', () => {
    const initialCurrency = 'EUR';
    cy.get('[data-test-id="currencies-menu-button"]')
      .should('contain', `${currenciesConfig[initialCurrency].symbol}200`)
      .click();
    cy.get('[data-test-id="transaction"]').should('have.length', 6);
    // Cypress click does not work, so jQuery is a workaround
    cy.get('[data-test-id="currencies-menu-list"')
      .contains(currenciesConfig.GBP.name)
      .then((option) => {
        option.click();
      });
    cy.get('[data-test-id="currencies-menu-button"]').should(
      'contain',
      `${currenciesConfig.GBP.symbol}50`
    );
    cy.get('[data-test-id="transaction"]').should('have.length', 3);
  });

  it('should navigate to exchange and have the right base currency', () => {
    const initialCurrency = 'EUR';
    cy.get('[data-test-id="currencies-menu-button"]')
      .should('contain', `${currenciesConfig[initialCurrency].symbol}200`)
      .click();
    // Cypress click does not work, so jQuery is a workaround
    cy.get('[data-test-id="currencies-menu-list"')
      .contains(currenciesConfig.GBP.name)
      .then((option) => {
        option.click();
      });
    cy.get('[data-test-id="action-button"]').contains('Exchange').click();
    cy.get('[data-test-id="exchange-currency-input-heading-base"]').should(
      'contain',
      'GBP'
    );
    cy.get(
      '[data-test-id="exchange-currency-input-balance-base"]:visible'
    ).should('contain', `Balance: ${currenciesConfig.GBP.symbol}50`);
  });
});
