import React, {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/core';
import { TrendingUp, X } from 'react-feather';
import Slide from 'react-slick';

import { API_URL } from '../../config/constants';
import { Currency, currencies } from '../../config/exchange-currencies';
import { Badge } from '../../components/Badge';
import { InvertIcon } from '../../components/InvertIcon';
import { roundNumber } from '../../utils/numbers';
import { amountsReducer, initialState } from './state';
import type { ExchangeResult } from '../../types/exchange-result';

import { StyledCenterContainer } from './styles';

import './carousel.css';
import Slider from 'react-slick';

const fetchExchangeRates = async (_key: string, baseCurrency: Currency) => {
  const res = await fetch(`${API_URL}?base=${baseCurrency}`);
  return await res.json();
};

export const ExchangeCurrencyPage = () => {
  const [{ base, target, rates }, dispatch] = useReducer(
    amountsReducer,
    initialState
  );
  const baseRef = useRef<Slider | null>(null);
  const targetRef = useRef<Slider | null>(null);

  const disabled = useMemo(
    () => base.value === '' || target.index === base.index,
    [base.value, base.index, target.index]
  );

  const { isError, isLoading } = useQuery<ExchangeResult>(
    ['exchange', base.name],
    fetchExchangeRates,
    {
      refetchInterval: 10 * 1000,
      onSuccess: (data) =>
        dispatch({ type: 'SetExchangeRates', value: data.rates }),
    }
  );

  React.useEffect(
    function calculateTargetAmount() {
      dispatch({ type: 'SetBaseAmount', value: base.value });
    },
    [base.index, target.index, base.value]
  );

  const paginateTargetCurrency = (_: number, value: number) => {
    dispatch({ type: 'SetTargetIndex', value });
  };

  const paginateBaseCurrency = (_: number, value: number) => {
    dispatch({ type: 'SetBaseIndex', value });
  };

  const invertValues = useCallback(() => {
    const temp = base.index;
    baseRef?.current?.slickGoTo(target.index, true);
    targetRef?.current?.slickGoTo(temp, true);
  }, [base.index, target.index]);

  const handleBaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === '' ? e.target.value : Number(e.target.value);
    dispatch({ type: 'SetBaseAmount', value });
  };

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value === '' ? e.target.value : Number(e.target.value);
    dispatch({ type: 'SetTargetAmount', value });
  };

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
        <Flex as="nav" alignItems="center" p={2}>
          <IconButton aria-label="Cancel" variant="ghost" icon={X} />
          <Heading fontSize={['lg', '2xl']} px={4}>
            Exchange
          </Heading>
          <Flex flex="1" justifyContent="flex-end">
            <Button variantColor="blue" variant="ghost" isDisabled={disabled}>
              Exchange
            </Button>
          </Flex>
        </Flex>
      </header>
      <Flex flex="1" flexDirection="column" position="relative">
        <Box flex="1" p={[4, 8]} pb={12} id="base-currency">
          <Slide
            dots
            infinite
            beforeChange={paginateBaseCurrency}
            arrows={false}
            ref={baseRef}
          >
            {currencies.map((currency) => (
              <Flex
                width="100%"
                alignItems="center"
                height="100%"
                key={currency}
                justifyContent="space-between"
              >
                <Heading fontSize={['4xl', '6xl']}>{currency}</Heading>
                <Box w={['50%', '30%']}>
                  <Input
                    variant="unstyled"
                    placeholder="0"
                    step=".01"
                    type="number"
                    textAlign="center"
                    fontSize={['4xl', '6xl']}
                    value={base.value}
                    onChange={handleBaseAmountChange}
                  />
                </Box>
              </Flex>
            ))}
          </Slide>
        </Box>

        <Box
          flex="1"
          backgroundColor="gray.100"
          p={[4, 8]}
          id="target-currency"
        >
          <Slide
            dots
            infinite
            beforeChange={paginateTargetCurrency}
            initialSlide={target.index}
            ref={targetRef}
            arrows={false}
          >
            {currencies.map((currency) => (
              <Flex
                width="100%"
                alignItems="center"
                height="100%"
                key={currency}
                justifyContent="space-between"
              >
                <Heading fontSize={['4xl', '6xl']}>{currency}</Heading>
                <Box w={['50%', '30%']}>
                  <Input
                    variant="unstyled"
                    placeholder="0"
                    type="number"
                    step=".01"
                    textAlign="center"
                    fontSize={['4xl', '6xl']}
                    value={target.value}
                    onChange={handleTargetAmountChange}
                  />
                </Box>
              </Flex>
            ))}
          </Slide>
        </Box>
        <StyledCenterContainer px={[2, 4, 0]}>
          <Badge iconOnly onClick={invertValues}>
            <InvertIcon size="16" />
          </Badge>
          <Flex flex="1" justifyContent="center">
            {base.index !== target.index && (
              <Badge>
                {isLoading || !rates ? (
                  <Spinner size="xs" />
                ) : (
                  <>
                    <TrendingUp size="16" />
                    <Text fontWeight="700" fontSize={['xs', 'sm']} ml={2}>
                      {base.config.symbol}1 = {target.config.symbol}{' '}
                      {roundNumber(rates[target.name])}
                    </Text>
                  </>
                )}
              </Badge>
            )}
          </Flex>
          <Box w={10} />
        </StyledCenterContainer>
      </Flex>
    </Flex>
  );
};
