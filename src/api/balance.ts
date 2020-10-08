import { Currency } from './../config/currencies';

export interface BalanceResponse {
  defaultCurrency: Currency;
  balances: {
    [Key in Currency]: number;
  };
}

export const fetchUserBalance = async (): Promise<BalanceResponse> => {
  return {
    defaultCurrency: 'EUR',
    balances: {
      EUR: 200,
      USD: 0,
      GBP: 50,
      MXN: 10500,
    },
  };
};
