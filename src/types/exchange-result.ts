import { Currency } from '../config/currencies';

export interface ExchangeResult {
  rates: {
    [K in Currency]: number;
  };
  base: Currency;
  date: string;
}
