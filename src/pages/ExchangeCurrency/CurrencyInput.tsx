import React, { forwardRef, useMemo } from 'react';

import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/core';
import Slide from 'react-slick';

import { currencies, currenciesConfig } from '../../config/currencies';
import { roundNumber } from '../../utils/numbers';

interface CurrencyInputProps extends BoxProps {
  paginateCurrency: (args: {
    type: 'SetTargetIndex' | 'SetBaseIndex';
    value: number;
  }) => void;
  handleAmountChange: (
    type: 'SetBaseAmount' | 'SetTargetAmount',
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type: 'target' | 'base';
  initialSlide: number;
  value: number | '';
  balance?: number;
  isLoading: boolean;
}

export const CurrencyInput = forwardRef<Slide | null, CurrencyInputProps>(
  (
    {
      paginateCurrency,
      handleAmountChange,
      initialSlide,
      value,
      type,
      isLoading,
      balance,
      ...props
    }: CurrencyInputProps,
    ref
  ) => {
    const isBase = type === 'base';
    const mathSymbol = useMemo(() => {
      if (value === '' || value === 0) {
        return '';
      }
      return isBase ? '-' : '+';
    }, [value, isBase]);
    return (
      <Box flex="1" p={[4, 8]} {...props}>
        <Slide
          dots
          infinite
          beforeChange={(_, value) =>
            paginateCurrency({
              type: isBase ? 'SetBaseIndex' : 'SetTargetIndex',
              value,
            })
          }
          initialSlide={initialSlide}
          ref={ref}
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
              <Box>
                <Heading fontSize={['4xl', '6xl']}>{currency}</Heading>
                {isLoading ? (
                  <Spinner size="xs" />
                ) : (
                  <Text color="gray.500" fontSize="sm">
                    Balance: {currenciesConfig[currency].symbol}
                    {balance?.toLocaleString()}
                  </Text>
                )}
              </Box>

              <Flex w={['50%', '40%']} alignItems="center">
                <Text fontSize={['4xl', '6xl']}>{mathSymbol}</Text>
                <Input
                  variant="unstyled"
                  placeholder="0"
                  type="number"
                  step=".01"
                  fontSize={['4xl', '6xl']}
                  value={value !== '' ? roundNumber(value, 2) : value}
                  data-test-id={`exchange-currency-input-${type}-${currency}`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAmountChange(
                      isBase ? 'SetBaseAmount' : 'SetTargetAmount',
                      e
                    )
                  }
                />
              </Flex>
            </Flex>
          ))}
        </Slide>
      </Box>
    );
  }
);
