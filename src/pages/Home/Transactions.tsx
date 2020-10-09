import * as React from 'react';
import { Box, Flex, Text, Heading } from '@chakra-ui/core';
import { format } from 'date-fns';
import { RefreshCw } from 'react-feather';

import { formatAmount } from '../../utils/numbers';
import type { Currency } from '../../config/currencies';
import type { GroupedTransactions } from '../../api/transactions';

export const Transactions = ({
  groupedTransactions,
  currency,
}: {
  groupedTransactions: GroupedTransactions;
  currency: Currency;
}) => {
  return (
    <Flex flexDirection="column" flex="1" overflow="auto">
      {Object.keys(groupedTransactions).map((key) => {
        const { transactions } = groupedTransactions[key];
        return (
          <Box key={key} px={4}>
            <Flex justifyContent="space-between" py={6}>
              <Text color="gray.400" fontSize="sm">
                {key}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {formatAmount(groupedTransactions[key].total, currency)}
              </Text>
            </Flex>
            {transactions.map((transaction) => (
              <Flex
                key={transaction.id}
                alignItems="center"
                py={2}
                borderBottom="1px solid"
                borderColor="gray.200"
                data-test-id="transaction"
              >
                <Flex
                  borderRadius="full"
                  size={10}
                  backgroundColor="gray.200"
                  alignItems="center"
                  justifyContent="center"
                  color="blue.600"
                >
                  <RefreshCw size="20" />
                </Flex>
                <Box px={2} flex="1">
                  <Heading fontSize="md">{transaction.description}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {format(new Date(transaction.date), 'MMM dd, HH:mm')}{' '}
                  </Text>
                </Box>
                <Box px={2} textAlign="right">
                  <Heading fontSize="md">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {formatAmount(
                      transaction.exchangeAmount,
                      transaction.exchangeCurrency
                    )}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
        );
      })}
    </Flex>
  );
};
