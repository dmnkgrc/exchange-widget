export const currenciesConfig = {
  EUR: {
    name: 'Euro',
    symbol: '€',
  },
  USD: {
    name: 'US Dollar',
    symbol: '$',
  },
  GBP: {
    name: 'Pound sterling',
    symbol: '£',
  },
  MXN: {
    name: 'Mexican Peso',
    symbol: '$',
  },
};

export type Currency = keyof typeof currenciesConfig;
export interface CurrencyConfig {
  name: string;
  symbol: string;
}

export const currencies = Object.keys(currenciesConfig) as Currency[];
