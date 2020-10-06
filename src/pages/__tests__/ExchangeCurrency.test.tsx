import React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

import '@testing-library/jest-dom/extend-expect';

import * as exchangeCurrencyResponses from '../../mocks/exchange-currency-responses.json';
import { ExchangeCurrencyPage } from '../ExchangeCurrency';

test('renders the right initial content', async () => {
  const { queryByText } = render(<ExchangeCurrencyPage />);

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
