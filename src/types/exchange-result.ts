import { Currency } from '../config/exchange-currencies';

export interface ExchangeResult {
  rates: {
    [K in Currency]: number;
  };
  base: Currency;
  date: string;
}
