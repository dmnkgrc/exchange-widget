import React from 'react';
import { render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

import { server } from './mocks/server';

import App from './App';

test('renders the right initial content', async () => {
  const { queryByText } = render(<App />);
  waitFor(() => {
    const eurTitle = queryByText(/EUR/i);
    expect(eurTitle).toBeInTheDocument();
    const gbpTitle = queryByText(/GBP/i);
    expect(gbpTitle).toBeInTheDocument();
  });
});
