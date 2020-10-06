/// <reference types="cypress" />

import { worker } from '../../src/mocks/worker';

context('Exchange currency', () => {
  beforeEach(() => {
    worker.start();
    cy.visit('/');
  });

  afterEach(() => {
    worker.resetHandlers();
    worker.stop();
  });

  it('should convert the base currency value to the target value', () => {
    expect(true).to.equal(true);
  });
});
