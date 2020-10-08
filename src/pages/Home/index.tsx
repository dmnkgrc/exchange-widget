import React, { useEffect, useMemo, useState } from 'react';
import { Flex, IconButton, Alert, Box, Text, Spinner } from '@chakra-ui/core';
import { TrendingUp, Search, Plus, Info, RefreshCw } from 'react-feather';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { Loading } from '../../components/Loading';
import { Transactions } from './Transactions';
import { fetchUserTransactions } from '../../api/transactions';
import { fetchUserBalance } from '../../api/balance';
import { CurrenciesMenu } from './CurrenciesMenu';
import { ActionButton } from './ActionButton';

import { currenciesConfig, Currency } from '../../config/currencies';

const HomePage = () => {
  const history = useHistory();
  // Currency from the menu, that will be used to get all the data
  const [currentCurrency, setCurrentCurrency] = useState<
    Currency | undefined
  >();
  // Gets the configuration based on the current currency
  const currencyConfig = useMemo(() => {
    if (!currentCurrency) {
      return undefined;
    }
    return currenciesConfig[currentCurrency];
  }, [currentCurrency]);
  // Fetch the user balances and the default currency
  const { data, isLoading, isError } = useQuery(
    ['user-balance'],
    fetchUserBalance,
    {
      // for the purpose of this demo, so that balances do update
      cacheTime: Infinity,
      staleTime: Infinity,
    }
  );
  useEffect(
    function updateCurrentCurrency() {
      if (data) {
        setCurrentCurrency(data.defaultCurrency);
      }
    },
    [data]
  );
  // Fetch the user transactions for that currency
  const {
    data: groupedTransactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = useQuery(
    ['currency-transactions', currentCurrency],
    fetchUserTransactions,
    {
      enabled: currentCurrency !== undefined,
    }
  );
  if (isLoading) {
    return <Loading />;
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
        <Flex as="nav" alignItems="center" p={2} justifyContent="space-between">
          <IconButton aria-label="Trend" variant="ghost" icon={TrendingUp} />
          <IconButton aria-label="Search" variant="ghost" icon={Search} />
        </Flex>
      </header>
      {isError && (
        <Alert status="error">
          There was an unexpected error, please try again later
        </Alert>
      )}
      {isLoading && (
        <Box position="relative" flex="1">
          <Loading height="100%" />
        </Box>
      )}
      {data && currentCurrency && (
        <Flex as="main" flexDirection="column" height="100%">
          <Flex flexDirection="column" alignItems="center" py={4}>
            <CurrenciesMenu
              {...{ currentCurrency, balances: data.balances }}
              onItemClick={(value) => setCurrentCurrency(value)}
            />
            <Text color="gray.400" fontSize="xl">
              {currencyConfig?.name}
            </Text>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <ActionButton text="Add money">
              <Plus />
            </ActionButton>
            <ActionButton
              text="Exchange"
              onClick={() => history.push(`/exchange?base=${currentCurrency}`)}
            >
              <RefreshCw />
            </ActionButton>
            <ActionButton text="Details">
              <Info />
            </ActionButton>
          </Flex>
          {isErrorTransactions && (
            <Alert status="error">
              There was an unexpected error fetching your transactions, please
              try again later
            </Alert>
          )}
          {isLoadingTransactions && <Spinner size="lg" />}
          {groupedTransactions && (
            <Transactions
              {...{ groupedTransactions, currency: currentCurrency }}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default HomePage;
