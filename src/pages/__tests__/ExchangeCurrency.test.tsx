import * as React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Switch, theme, ThemeProvider } from '@chakra-ui/core';

import '@testing-library/jest-dom/extend-expect';

import * as exchangeCurrencyResponses from '../../mocks/exchange-currency-responses.json';
import ExchangeCurrencyPage from '../ExchangeCurrency';
import { exchangeReducer, initialState } from '../ExchangeCurrency/state';
import {
  currencies,
  currenciesConfig,
  Currency,
} from '../../config/currencies';
import { roundNumber } from '../../utils/numbers';
import { BrowserRouter } from 'react-router-dom';

describe('ExchangeCurrencyPage', () => {
  test('renders the right initial content', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Switch>
          <ThemeProvider theme={theme}>
            <ExchangeCurrencyPage />
          </ThemeProvider>
        </Switch>
      </BrowserRouter>
    );

    const { rates } = exchangeCurrencyResponses.EUR;
    waitFor(() => {
      const eurTitle = queryByText(/EUR/i);
      expect(eurTitle).toBeInTheDocument();
      const gbpTitle = queryByText(/GBP/i);
      expect(gbpTitle).toBeInTheDocument();
      const targetValue = queryByText(new RegExp(rates.GBP.toString()));
      expect(targetValue).toBeInTheDocument();
    });
  });
});

describe('ExchangeCurrencyPage reducer', () => {
  describe('Set Currency', () => {
    test('it sets a new base currency', () => {
      const value = 'GBP';
      const newState = exchangeReducer(initialState, {
        type: 'SetBaseCurrency',
        value,
      });
      expect(newState.base.name).toEqual(value);
      expect(newState.base.index).toEqual(currencies.indexOf(value));
      expect(newState.base.config).toEqual(currenciesConfig[value]);
    });

    test('it sets a new target currency', () => {
      const value = 'MXN';
      const newState = exchangeReducer(initialState, {
        type: 'SetTargetCurrency',
        value,
      });
      expect(newState.target.name).toEqual(value);
      expect(newState.target.index).toEqual(currencies.indexOf(value));
      expect(newState.target.config).toEqual(currenciesConfig[value]);
    });
  });

  describe('Set Currency Index', () => {
    test('it sets a new base currency index', () => {
      const expectedValue = 'GBP';
      const value = currencies.indexOf(expectedValue);
      const newState = exchangeReducer(initialState, {
        type: 'SetBaseIndex',
        value,
      });
      expect(newState.base.name).toEqual(expectedValue);
      expect(newState.base.index).toEqual(value);
      expect(newState.base.config).toEqual(currenciesConfig[expectedValue]);
    });

    test('it sets a new target currency index', () => {
      const expectedValue = 'MXN';
      const value = currencies.indexOf(expectedValue);
      const newState = exchangeReducer(initialState, {
        type: 'SetTargetIndex',
        value,
      });
      expect(newState.target.name).toEqual(expectedValue);
      expect(newState.target.index).toEqual(value);
      expect(newState.target.config).toEqual(currenciesConfig[expectedValue]);
    });

    test('changing any index should recalculate the target amount', () => {
      const state = {
        ...initialState,
        base: {
          ...initialState.base,
          value: 100,
        },
        target: {
          ...initialState.target,
          name: 'USD' as Currency,
          index: 1,
          config: currenciesConfig.USD,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const newCurrency = 'MXN';
      const value = currencies.indexOf(newCurrency);
      const stateWithRates = exchangeReducer(state, {
        type: 'SetExchangeRates',
        value: exchangeCurrencyResponses[newCurrency].rates,
      });
      let newState = exchangeReducer(stateWithRates, {
        type: 'SetBaseIndex',
        value,
      });
      expect(newState.target.value).toEqual(
        roundNumber(
          exchangeCurrencyResponses[newCurrency].rates[newState.target.name] *
            (newState.base.value as number),
          2
        )
      );
      newState = exchangeReducer(state, {
        type: 'SetTargetIndex',
        value,
      });
      expect(newState.target.value).toEqual(
        roundNumber(
          (newState.base.value as number) *
            exchangeCurrencyResponses.EUR.rates[newCurrency],
          2
        )
      );
    });
  });

  describe('Set Amount', () => {
    test('if the base amount is empty also the target amount should be', () => {
      const state = {
        ...initialState,
        target: {
          ...initialState.target,
          value: 50,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const value = '';
      const newState = exchangeReducer(state, {
        type: 'SetBaseAmount',
        value,
      });
      expect(newState.base.value).toEqual(value);
      expect(newState.target.value).toEqual(value);
    });

    test('if the amount has too many decimal spaces, the state does not update', () => {
      const value = 3.141;
      let newState = exchangeReducer(initialState, {
        type: 'SetBaseAmount',
        value,
      });
      expect(newState).toEqual(initialState);
      newState = exchangeReducer(initialState, {
        type: 'SetTargetAmount',
        value,
      });
      expect(newState).toEqual(initialState);
    });

    test('setting the base amount also updates the target amount', () => {
      const state = {
        ...initialState,
        target: {
          ...initialState.target,
          value: 50,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const value = 2.13;
      const newState = exchangeReducer(state, {
        type: 'SetBaseAmount',
        value,
      });
      expect(newState.base.value).toEqual(value);
      expect(newState.target.value).toEqual(
        roundNumber(
          value * exchangeCurrencyResponses.EUR.rates[state.target.name],
          2
        )
      );
    });

    test('setting the target amount also updates the base amount', () => {
      const state = {
        ...initialState,
        base: {
          ...initialState.base,
          value: 100,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const value = 30.79;
      const newState = exchangeReducer(state, {
        type: 'SetTargetAmount',
        value,
      });
      expect(newState.target.value).toEqual(value);
      expect(newState.base.value).toEqual(
        roundNumber(
          value / exchangeCurrencyResponses.EUR.rates[state.target.name],
          2
        )
      );
    });

    test('negative amounts should not change the state', () => {
      const state = {
        ...initialState,
        base: {
          ...initialState.base,
          value: 100,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const value = -30.79;
      let newState = exchangeReducer(state, {
        type: 'SetTargetAmount',
        value,
      });
      expect(newState).toEqual(state);
      newState = exchangeReducer(state, {
        type: 'SetBaseAmount',
        value,
      });
      expect(newState).toEqual(state);
    });
  });
  describe('Set Rates', () => {
    test('changing the rates should update the target amount', () => {
      const state = {
        ...initialState,
        base: {
          ...initialState.base,
          value: 100,
        },
        rates: exchangeCurrencyResponses.EUR.rates,
      };
      const rates = state.rates;
      const expectedRate = rates[state.target.name] * 2;
      const newState = exchangeReducer(state, {
        type: 'SetExchangeRates',
        value: {
          ...rates,
          [state.target.name]: expectedRate,
        },
      });
      expect(newState.target.value).toEqual(
        roundNumber((newState.base.value as number) * expectedRate, 2)
      );
    });
  });
});
