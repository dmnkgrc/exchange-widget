import { currenciesConfig } from './../../src/config/currencies';

const formatRegex = /\B(?=(\d{3})+(?!\d))/g;

context('Exchange currency', () => {
  beforeEach(() => {
    cy.visit('/exchange');
  });

  it('should convert the base currency value to the target value', () => {
    cy.get('[data-test-id="exchange-save-btn"]').should('be.disabled');
    const baseAmount = 50;
    cy.get('[data-test-id="exchange-currency-input-base-EUR"]')
      .first()
      .type(baseAmount.toString());
    cy.get('[data-test-id="exchange-currency-input-target-MXN"]')
      .first()
      .invoke('val')
      .then((targetValue) => {
        cy.get('[data-test-id="exchange-save-btn"]')
          .should('not.be.disabled')
          .click();
        cy.get('[data-test-id="exchange-currency-done-btn"]').should('exist');
        const eurConfig = currenciesConfig.EUR;
        const mxnConfig = currenciesConfig.MXN;
        cy.findByText(
          `You exchanged ${eurConfig.symbol}${baseAmount} to ${
            mxnConfig.symbol
          }${targetValue?.toString().replace(formatRegex, ',')}`
        ).should('exist');
      });
  });

  it('should convert the desired target currency value', () => {
    cy.visit('/exchange?base=GBP');
    cy.get('[data-test-id="exchange-save-btn"]').should('be.disabled');
    const targetAmount = 1000;
    cy.get('[data-test-id="exchange-currency-input-target-MXN"]:visible')
      .first()
      .type(targetAmount.toString());
    cy.get('[data-test-id="exchange-currency-input-base-GBP"]')
      .first()
      .invoke('val')
      .then((baseValue) => {
        cy.get('[data-test-id="exchange-save-btn"]')
          .should('not.be.disabled')
          .click();
        cy.get('[data-test-id="exchange-currency-done-btn"]').should('exist');
        const gbpConfig = currenciesConfig.GBP;
        const mxnConfig = currenciesConfig.MXN;
        cy.findByText(
          `You exchanged ${gbpConfig.symbol}${baseValue
            ?.toString()
            .replace(formatRegex, ',')} to ${
            mxnConfig.symbol
          }${targetAmount.toString().replace(formatRegex, ',')}`
        ).should('exist');
      });
  });
});
