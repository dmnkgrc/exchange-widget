import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/core';
import { ChevronDown } from 'react-feather';

import { BalanceResponse } from '../../api/balance';
import {
  currencies,
  currenciesConfig,
  Currency,
} from '../../config/currencies';

export const CurrenciesMenu = ({
  currentCurrency,
  balances,
  onItemClick,
}: {
  currentCurrency: Currency;
  balances: BalanceResponse['balances'];
  onItemClick: (value: Currency) => void;
}) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        {...{
          variant: 'ghost',
          rightIcon: function customRightIcon() {
            return <ChevronDown size="42" />;
          },
          size: 'lg',
        }}
        fontSize="6xl"
        height={20}
        fontWeight="300"
      >
        {currenciesConfig[currentCurrency].symbol}
        {balances[currentCurrency].toLocaleString()}
      </MenuButton>
      <MenuList>
        {currencies.map((currency) => (
          <MenuItem
            key={currency}
            py="2"
            backgroundColor={
              currency === currentCurrency ? 'gray.200' : 'white'
            }
            onClick={() => onItemClick(currency)}
            {...{ justifyContent: 'space-between' }}
          >
            <Text>
              {currenciesConfig[currency].symbol}
              {balances[currency].toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.400">
              {currenciesConfig[currency].name}
            </Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
