import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Button, Flex, Heading, Spinner } from '@chakra-ui/core';

const currenciesConfig = {
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

const API_URL = 'https://api.exchangeratesapi.io/latest';

type Currency = keyof typeof currenciesConfig;

interface ExchangeResult {
  rates: {
    [K in Currency]: number;
  };
  base: Currency;
  date: string;
}

const fetchExchangeRates = async (_key: string, baseCurrency: Currency) => {
  const res = await fetch(`${API_URL}?base=${baseCurrency}`);
  return await res.json();
};

function App() {
  const [baseCurrency, setBaseCurrency] = useState<Currency>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<Currency>('GBP');

  const { data, isError, isLoading } = useQuery<ExchangeResult>(
    ['exchange', baseCurrency],
    fetchExchangeRates
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>Something went wront, please try again later</h1>;
  }
  return (
    <Box>
      <header>
        <Flex as="nav">
          <Button variant="ghost">Cancel</Button>
          <Button variant="ghost">Exchange</Button>
        </Flex>
      </header>
      <Box>
        <Heading>{baseCurrency}</Heading>
      </Box>
      <Box>
        <Heading>{targetCurrency}</Heading>
      </Box>
    </Box>
  );
}

export default App;
