export const exchangeCurrenciesConfig = {
  EUR: {
    name: 'EUR',
    symbol: '€',
  },
  USD: {
    name: 'USD',
    symbol: '$',
  },
  GBP: {
    name: 'EUR',
    symbol: '£',
  },
  MXN: {
    name: 'EUR',
    symbol: '$',
  },
};

export type Currency = keyof typeof exchangeCurrenciesConfig;
export interface CurrencyConfig {
  name: string;
  symbol: string;
}

export const currencies = Object.keys(exchangeCurrenciesConfig) as Currency[];
