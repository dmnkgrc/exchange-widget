import { format } from 'date-fns';
import { Currency } from './../config/currencies';

export interface TransactionResponse {
  id: number;
  description: string;
  date: string;
  amount: number;
  currency: Currency;
  exchangeCurrency: Currency;
  exchangeAmount: number;
}

export type GroupedTransactions = {
  [key: string]: {
    transactions: TransactionResponse[];
    total: number;
  };
};

const mockTransactions: {
  [Key in Currency]: TransactionResponse[];
} = {
  EUR: [
    {
      id: 10,
      description: 'Exchanged from MXN',
      date: 'Thu Oct 05 2020 15:50:22',
      amount: 100,
      currency: 'EUR',
      exchangeCurrency: 'MXN',
      exchangeAmount: -2500,
    },
    {
      id: 9,
      description: 'Exchanged to MXN',
      date: 'Wed Oct 04 2020 08:40:22',
      amount: -50,
      currency: 'EUR',
      exchangeCurrency: 'MXN',
      exchangeAmount: 1250,
    },
    {
      id: 8,
      description: 'Exchanged to USD',
      date: 'Wed Oct 04 2020 07:40:22',
      amount: -100,
      currency: 'EUR',
      exchangeCurrency: 'USD',
      exchangeAmount: 120,
    },
    {
      id: 7,
      description: 'Exchanged from MXN',
      date: 'Thu Oct 05 2020 15:50:22',
      amount: 100,
      currency: 'EUR',
      exchangeCurrency: 'MXN',
      exchangeAmount: -2500,
    },
    {
      id: 6,
      description: 'Exchanged to MXN',
      date: 'Wed Oct 04 2020 08:40:22',
      amount: -50,
      currency: 'EUR',
      exchangeCurrency: 'MXN',
      exchangeAmount: 1250,
    },
    {
      id: 5,
      description: 'Exchanged to USD',
      date: 'Wed Oct 04 2020 07:40:22',
      amount: -100,
      currency: 'EUR',
      exchangeCurrency: 'USD',
      exchangeAmount: 120,
    },
  ],
  USD: [
    {
      id: 10,
      description: 'Exchanged from MXN',
      date: 'Thu Oct 05 2020 15:50:22',
      amount: 100,
      currency: 'USD',
      exchangeCurrency: 'MXN',
      exchangeAmount: -2500,
    },
    {
      id: 9,
      description: 'Exchanged to MXN',
      date: 'Wed Oct 04 2020 08:40:22',
      amount: -50,
      currency: 'USD',
      exchangeCurrency: 'MXN',
      exchangeAmount: 1250,
    },
    {
      id: 8,
      description: 'Exchanged to EUR',
      date: 'Wed Oct 04 2020 07:40:22',
      amount: -100,
      currency: 'USD',
      exchangeCurrency: 'EUR',
      exchangeAmount: 120,
    },
  ],
  GBP: [
    {
      id: 10,
      description: 'Exchanged from MXN',
      date: 'Thu Oct 05 2020 15:50:22',
      amount: 100,
      currency: 'GBP',
      exchangeCurrency: 'MXN',
      exchangeAmount: -2500,
    },
    {
      id: 9,
      description: 'Exchanged to MXN',
      date: 'Wed Oct 04 2020 08:40:22',
      amount: -50,
      currency: 'GBP',
      exchangeCurrency: 'MXN',
      exchangeAmount: 1250,
    },
    {
      id: 8,
      description: 'Exchanged to USD',
      date: 'Wed Oct 04 2020 07:40:22',
      amount: -120,
      currency: 'GBP',
      exchangeCurrency: 'USD',
      exchangeAmount: 100,
    },
  ],
  MXN: [
    {
      id: 10,
      description: 'Exchanged from USD',
      date: 'Thu Oct 05 2020 15:50:22',
      amount: 2200,
      currency: 'MXN',
      exchangeCurrency: 'USD',
      exchangeAmount: -100,
    },
    {
      id: 9,
      description: 'Exchanged to MXN',
      date: 'Wed Oct 04 2020 08:40:22',
      amount: -5000,
      currency: 'MXN',
      exchangeCurrency: 'EUR',
      exchangeAmount: 200,
    },
    {
      id: 8,
      description: 'Exchanged to USD',
      date: 'Wed Oct 04 2020 07:40:22',
      amount: -100,
      currency: 'MXN',
      exchangeCurrency: 'USD',
      exchangeAmount: 5,
    },
  ],
};

// fetch from the mock user transactions
export const fetchUserTransactions = async (
  _: string,
  currency: Currency
): Promise<GroupedTransactions> => {
  const groups: GroupedTransactions = {};
  const transactions = mockTransactions[currency];
  transactions.forEach((transaction) => {
    const formatedDate = format(new Date(transaction.date), 'MMMM dd, yyyy');
    if (!groups[formatedDate]) {
      groups[formatedDate] = {
        transactions: [],
        total: 0,
      };
    }
    groups[formatedDate].transactions.push(transaction);
    groups[formatedDate].total += transaction.amount;
  });
  return groups;
};
