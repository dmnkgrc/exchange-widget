export const exchangeCurrenciesConfig = {
  EUR: {
    name: 'EUR',
    url: '',
    symbol: '€',
  },
  USD: {
    name: 'USD',
    url: '',
    symbol: '$',
  },
  GBP: {
    name: 'EUR',
    url: '',
    symbol: '£',
  },
  MXN: {
    name: 'EUR',
    url: '',
    symbol: '$',
  },
};

export type Currency = keyof typeof exchangeCurrenciesConfig;
