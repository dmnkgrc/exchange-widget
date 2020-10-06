import React, { useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/core';
import { TrendingUp, X } from 'react-feather';
import Carousel, { Dots } from '@brainhubeu/react-carousel';

import { Loading } from '../../components/Loading';
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

import '@brainhubeu/react-carousel/lib/style.css';
import './carousel.css';

const fetchExchangeRates = async (_key: string, baseCurrency: Currency) => {
  const res = await fetch(`${API_URL}?base=${baseCurrency}`);
  return await res.json();
};

export const ExchangeCurrencyPage = () => {
  const [baseCurrencyIndex, setBaseCurrency] = useState(0);
  const [targetCurrencyIndex, setTargetCurrency] = useState(1);
  const [baseCurrencySlide, setBaseCurrencySlide] = useState(baseCurrencyIndex);
  const [targetCurrencySlide, setTargetCurrencySlide] = useState(
    targetCurrencyIndex
  );

  const baseCurrency = useMemo(() => {
    return currencies[baseCurrencyIndex];
  }, [baseCurrencyIndex]);
  const targetCurrency = useMemo(() => {
    let index = targetCurrencyIndex;
    if (index < 0) {
      index = Math.abs(index) - 1;
    }
    return currencies[targetCurrencyIndex];
  }, [targetCurrencyIndex]);
  const baseCurrencyConfig = useMemo(
    () => exchangeCurrenciesConfig[baseCurrency],
    [baseCurrency]
  );
  const targetCurrencyConfig = useMemo(
    () => exchangeCurrenciesConfig[targetCurrency],
    [targetCurrency]
  );

  const { data, isError, isLoading } = useQuery<ExchangeResult>(
    ['exchange', baseCurrency],
    fetchExchangeRates,
    {
      refetchInterval: 10 * 1000,
    }
  );

  const paginateTargetCurrency = (value: number) => {
    setTargetCurrencySlide(value);
    let index = value % currencies.length;
    if (value < 0 && Math.abs(index) !== 0) {
      index += currencies.length;
    }
    setTargetCurrency(index);
  };

  const paginateBaseCurrency = (value: number) => {
    setBaseCurrencySlide(value);
    let index = value % currencies.length;
    if (value < 0 && Math.abs(index) !== 0) {
      index += currencies.length;
    }
    setBaseCurrency(index);
  };

  const invertValues = useCallback(() => {
    const temp = baseCurrencyIndex;
    setBaseCurrency(targetCurrencyIndex);
    setTargetCurrency(temp);
  }, [baseCurrencyIndex, targetCurrencyIndex]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !data) {
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
        <Box
          flex="1"
          p={[4, 8]}
          pb={12}
          id="base-currency"
          position="relative"
          display="grid"
        >
          <Carousel
            plugins={['infinite']}
            onChange={paginateBaseCurrency}
            value={baseCurrencySlide}
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
          </Carousel>
          <Dots
            value={baseCurrencySlide}
            onChange={paginateBaseCurrency}
            number={currencies.length}
          />
        </Box>

        <Box
          flex="1"
          backgroundColor="gray.100"
          p={[4, 8]}
          id="target-currency"
          position="relative"
          display="grid"
        >
          <Carousel
            plugins={['infinite']}
            onChange={paginateTargetCurrency}
            value={targetCurrencySlide}
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
          </Carousel>
          <Dots
            value={targetCurrencySlide}
            onChange={paginateTargetCurrency}
            number={currencies.length}
          />
        </Box>
        <StyledCenterContainer px={[2, 4, 0]}>
          <Badge iconOnly onClick={invertValues}>
            <InvertIcon size="16" />
          </Badge>
          <Flex flex="1" justifyContent="center">
            {baseCurrencyIndex !== targetCurrencyIndex && (
              <Badge>
                <TrendingUp size="16" />
                <Text fontWeight="700" fontSize={['xs', 'sm']} ml={2}>
                  {baseCurrencyConfig.symbol}1 = {targetCurrencyConfig.symbol}{' '}
                  {roundNumber(data.rates[targetCurrency])}
                </Text>
              </Badge>
            )}
          </Flex>
          <Box w={10} />
        </StyledCenterContainer>
      </Flex>
    </Flex>
  );
};
