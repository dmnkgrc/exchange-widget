import * as React from 'react';
import { Flex, Box, Text, Button, ButtonProps } from '@chakra-ui/core';
import { Check } from 'react-feather';

export const ExchangeSuccess = ({
  baseAmount,
  targetAmount,
  onDone,
}: {
  baseAmount: string;
  targetAmount: string;
  onDone: ButtonProps['onClick'];
}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      maxWidth="4xl"
      mx="auto"
      top="0"
      bottom="0"
      left="0"
      right="0"
      px={8}
    >
      <Flex
        size={24}
        alignItems="center"
        border="3px solid"
        borderRadius="full"
        borderColor="blue.400"
        justifyContent="center"
        color="blue.400"
      >
        <Check size="60" />
      </Flex>
      <Box width="xs" py={6}>
        <Text textAlign="center" fontWeight="600">
          You exchanged {baseAmount} to {targetAmount}
        </Text>
      </Box>

      <Box
        position="absolute"
        bottom="0"
        maxWidth="sm"
        mx="auto"
        width="100%"
        p={8}
      >
        <Button
          variantColor="pink"
          size="lg"
          borderRadius="full"
          width="100%"
          onClick={onDone}
        >
          Done
        </Button>
      </Box>
    </Flex>
  );
};
