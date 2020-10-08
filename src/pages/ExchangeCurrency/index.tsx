import React, { useCallback, useMemo, useReducer, useRef } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import {
  Alert,
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
} from '@chakra-ui/core';
import { TrendingUp } from 'react-feather';

import { API_URL } from '../../config/constants';
import {
  Currency,
  currencies,
  currenciesConfig,
} from '../../config/currencies';
import { InvertIcon } from '../../components/InvertIcon';
import { roundNumber } from '../../utils/numbers';
import { exchangeReducer, initialState } from './state';
import type { ExchangeResult } from '../../types/exchange-result';

import { StyledCenterContainer } from './styles';

import './carousel.css';
import Slider from 'react-slick';
import { useHistory, useLocation } from 'react-router-dom';
import { Badge, IconBadge } from '../../components/Badge';
import { CurrencyInput } from './CurrencyInput';
import { BalanceResponse, fetchUserBalance } from '../../api/balance';
import { Loading } from '../../components/Loading';
import { ExchangeSuccess } from './Success';

// Fetch the exchange rates
const fetchExchangeRates = async (_key: string, baseCurrency: Currency) => {
  const res = await fetch(`${API_URL}?base=${baseCurrency}`);
  return await res.json();
};

const exchangeAmounts = async ({
  baseAmount,
  baseBalance,
  targetAmount,
  targetBalance,
}: {
  baseAmount: number;
  baseBalance: number;
  targetAmount: number;
  targetBalance: number;
}) => {
  const newBaseBalance = baseBalance - baseAmount;
  const newTargetBalance = targetBalance + targetAmount;
  return { baseBalance: newBaseBalance, targetBalance: newTargetBalance };
};

const ExchangeCurrencyPage = () => {
  const history = useHistory();
  const { search } = useLocation();
  // we want to update the cache for this example
  const cache = useQueryCache();
  // construct the base state based on the search query
  const defaultState = useMemo(() => {
    const params = new URLSearchParams(search);
    const base = params.get('base') as Currency | null;
    if (!base || currencies.indexOf(base) === -1) {
      return initialState;
    }
    return {
      ...initialState,
      base: {
        ...initialState.base,
        name: base,
        index: currencies.indexOf(base),
        config: currenciesConfig[base],
      },
    };
  }, [search]);
  const [{ base, target, rates }, dispatch] = useReducer(
    exchangeReducer,
    defaultState
  );
  // the refs for the sliders
  const baseRef = useRef<Slider | null>(null);
  const targetRef = useRef<Slider | null>(null);
  // Fetch the user balance to display it and to update the base
  // currency if needed
  const {
    data: balances,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useQuery(['user-balance'], fetchUserBalance, {
    onSuccess: (data) => {
      if (data.defaultCurrency !== initialState.base.name) {
        baseRef?.current?.slickGoTo(
          currencies.indexOf(data.defaultCurrency),
          true
        );
      }
    },
    // for the purpose of this demo, so that balances do update
    cacheTime: Infinity,
    staleTime: Infinity,
  });
  // fetches the rates and updates them every 10 seconds
  const { isError, isLoading, refetch } = useQuery<ExchangeResult>(
    ['exchange', base.name],
    fetchExchangeRates,
    {
      refetchInterval: 10 * 1000,
      onSuccess: (data) =>
        dispatch({ type: 'SetExchangeRates', value: data.rates }),
    }
  );

  // controls wether the button should be disabled
  const disabled = useMemo(
    () =>
      base.value === '' ||
      target.index === base.index ||
      base.value > (balances?.balances[base.name] ?? 0),
    [base.value, base.index, target.index, balances, base.name]
  );

  // we want to refetch the rates if the slider changes
  React.useEffect(
    function updateAmountsOnSlideChange() {
      refetch();
    },
    [base.index, target.index, base.value, refetch]
  );

  const [
    exchange,
    { isLoading: isLoadingExchange, isError: isErrorExchange, isSuccess },
  ] = useMutation(exchangeAmounts);

  const paginateCurrency = (args: {
    type: 'SetTargetIndex' | 'SetBaseIndex';
    value: number;
  }) => {
    dispatch(args);
  };

  // inverts the base and target currencies
  const invertValues = useCallback(() => {
    const temp = base.index;
    baseRef?.current?.slickGoTo(target.index, true);
    targetRef?.current?.slickGoTo(temp, true);
  }, [base.index, target.index]);

  const handleAmountChange = (
    type: 'SetBaseAmount' | 'SetTargetAmount',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      e.target.value === '' ? e.target.value : Number(e.target.value);
    dispatch({ type, value });
  };

  const save = () => {
    if (balances && base.value !== '' && target.value !== '') {
      exchange(
        {
          baseAmount: base.value,
          baseBalance: balances.balances[base.name],
          targetAmount: target.value,
          targetBalance: balances.balances[target.name],
        },
        {
          onSuccess: (data) => {
            console.log(data);
            const previousBalance = cache.getQueryData([
              'user-balance',
            ]) as BalanceResponse;
            cache.setQueryData(['user-balance'], {
              ...previousBalance,
              balances: {
                ...previousBalance.balances,
                [base.name]: data.baseBalance,
                [target.name]: data.targetBalance,
              },
            });
          },
        }
      );
    }
  };

  if (isError || isErrorBalance || isErrorExchange) {
    return (
      <Alert status="error">
        There was an unexpected error, please try again later
      </Alert>
    );
  }

  if (isLoadingExchange) {
    return <Loading />;
  }

  if (isSuccess) {
    return (
      <ExchangeSuccess
        baseAmount={`${base.config.symbol}${base.value}`}
        targetAmount={`${target.config.symbol}${target.value}`}
        onDone={() => history.push('/')}
      />
    );
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
        <Flex as="nav" alignItems="center" p={2}>
          <CloseButton onClick={() => history.push('/')} />
          <Heading fontSize={['lg', '2xl']} px={4} flex="1">
            Exchange
          </Heading>
          <Flex>
            <Button
              variantColor="blue"
              variant="ghost"
              isDisabled={disabled}
              onClick={save}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </header>
      <Flex flex="1" flexDirection="column" position="relative">
        <CurrencyInput
          id="base-currency"
          ref={baseRef}
          value={base.value}
          initialSlide={base.index}
          type="base"
          balance={balances?.balances[base.name]}
          isLoading={isLoadingBalance}
          {...{ paginateCurrency, handleAmountChange }}
        />

        <CurrencyInput
          backgroundColor="gray.100"
          id="target-currency"
          ref={targetRef}
          value={target.value}
          initialSlide={target.index}
          balance={balances?.balances[target.name]}
          isLoading={isLoadingBalance}
          type="target"
          {...{ paginateCurrency, handleAmountChange }}
        />
        <StyledCenterContainer px={[2, 4, 0]}>
          <IconBadge
            isRound
            aria-label="Invert values"
            icon={() => <InvertIcon size="18" />}
            onClick={invertValues}
          />
          <Flex flex="1" justifyContent="center">
            {base.index !== target.index && (
              <Badge
                isLoading={isLoading}
                leftIcon={() => <TrendingUp size="16" />}
                onClick={invertValues}
              >
                {!isLoading && rates && (
                  <Box pl={2}>
                    {base.config.symbol}1 = {target.config.symbol}
                    {roundNumber(rates[target.name])}
                  </Box>
                )}
              </Badge>
            )}
          </Flex>
          <Box w={8} />
        </StyledCenterContainer>
      </Flex>
    </Flex>
  );
};

export default ExchangeCurrencyPage;
