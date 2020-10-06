import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/core';

import { Loading } from './components/Loading';
import { TrendingUp, X } from 'react-feather';
import styled from '@emotion/styled';

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

const StyledCenterContainer = styled(Flex)(
  () => `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
`
);

function App() {
  const [baseCurrency, setBaseCurrency] = useState<Currency>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<Currency>('GBP');

  const { data, isError, isLoading } = useQuery<ExchangeResult>(
    ['exchange', baseCurrency],
    fetchExchangeRates,
    {
      refetchInterval: 10 * 1000,
    }
  );

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <h1>Something went wront, please try again later</h1>;
  }
  return (
    <Flex
      width="100%"
      height="100%"
      maxWidth="4xl"
      mx="auto"
      flexDirection="column"
    >
      <header>
        <Flex as="nav" alignItems="center">
          <IconButton aria-label="Cancel" variant="ghost" icon={X} />
          <Heading fontSize={['lg', '2xl']} px={4}>
            Exchange
          </Heading>
        </Flex>
      </header>
      <Flex flex="1" flexDirection="column" position="relative">
        <Box flex="1" p={[4, 8]}>
          <Heading>{baseCurrency}</Heading>
        </Box>
        <StyledCenterContainer>
          <Flex
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.200"
            py={2}
            px={4}
            color="blue.400"
            borderRadius="full"
            alignItems="center"
          >
            <TrendingUp size="16" />
            <Text fontWeight="700" fontSize={['xs', 'sm']} ml={2}>
              {currenciesConfig[baseCurrency].symbol}1 ={' '}
              {currenciesConfig[targetCurrency].symbol}{' '}
              {data?.rates[targetCurrency]}
            </Text>
          </Flex>
        </StyledCenterContainer>
        <Box flex="1" backgroundColor="gray.100" p={[4, 8]}>
          <Heading>{targetCurrency}</Heading>
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
