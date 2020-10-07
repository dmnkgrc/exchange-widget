import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Flex, Heading, IconButton, Spinner, Text } from '@chakra-ui/core';
import { TrendingUp, X } from 'react-feather';
import Slide from 'react-slick';

import { API_URL } from '../../config/constants';
import {
  Currency,
  exchangeCurrenciesConfig,
  currencies,
} from '../../config/exchange-currencies';
import { Badge } from '../../components/Badge';
import { InvertIcon } from '../../components/InvertIcon';
import { roundNumber } from '../../utils/numbers';
import type { ExchangeResult } from '../../types/exchange-result';
import { StyledCenterContainer } from './styles';

import './carousel.css';
import Slider from 'react-slick';

const fetchExchangeRates = async (_key: string, baseCurrency: Currency) => {
  const res = await fetch(`${API_URL}?base=${baseCurrency}`);
  return await res.json();
};

export const ExchangeCurrencyPage = () => {
  const [baseCurrencyIndex, setBaseCurrency] = useState(0);
  const [targetCurrencyIndex, setTargetCurrency] = useState(1);
  const baseRef = useRef<Slider | null>(null);
  const targetRef = useRef<Slider | null>(null);

  const [baseCurrency, baseCurrencyConfig] = useMemo(() => {
    const value = currencies[baseCurrencyIndex];
    return [value, exchangeCurrenciesConfig[value]];
  }, [baseCurrencyIndex]);
  const [targetCurrency, targetCurrencyConfig] = useMemo(() => {
    const value = currencies[targetCurrencyIndex];
    return [value, exchangeCurrenciesConfig[value]];
  }, [targetCurrencyIndex]);

  const { data, isError, isLoading } = useQuery<ExchangeResult>(
    ['exchange', baseCurrency],
    fetchExchangeRates,
    {
      refetchInterval: 10 * 1000,
    }
  );

  const paginateTargetCurrency = (_: number, value: number) => {
    let index = value % currencies.length;
    if (value < 0 && Math.abs(index) !== 0) {
      index += currencies.length;
    }
    setTargetCurrency(index);
  };

  const paginateBaseCurrency = (_: number, value: number) => {
    let index = value % currencies.length;
    if (value < 0 && Math.abs(index) !== 0) {
      index += currencies.length;
    }
    setBaseCurrency(index);
  };

  const invertValues = useCallback(() => {
    const temp = baseCurrencyIndex;
    baseRef?.current?.slickGoTo(targetCurrencyIndex, true);
    targetRef?.current?.slickGoTo(temp, true);
  }, [baseCurrencyIndex, targetCurrencyIndex]);

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
              >
                <Heading fontSize={['4xl', '6xl']}>{currency}</Heading>
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
            initialSlide={1}
            ref={targetRef}
            arrows={false}
          >
            {currencies.map((currency) => (
              <Flex
                width="100%"
                alignItems="center"
                height="100%"
                key={currency}
              >
                <Heading fontSize={['4xl', '6xl']}>{currency}</Heading>
              </Flex>
            ))}
          </Slide>
        </Box>
        <StyledCenterContainer px={[2, 4, 0]}>
          <Badge iconOnly onClick={invertValues}>
            <InvertIcon size="16" />
          </Badge>
          <Flex flex="1" justifyContent="center">
            {baseCurrencyIndex !== targetCurrencyIndex && (
              <Badge>
                {isLoading || !data ? (
                  <Spinner size="xs" />
                ) : (
                  <>
                    <TrendingUp size="16" />
                    <Text fontWeight="700" fontSize={['xs', 'sm']} ml={2}>
                      {baseCurrencyConfig.symbol}1 ={' '}
                      {targetCurrencyConfig.symbol}{' '}
                      {roundNumber(data.rates[targetCurrency])}
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
