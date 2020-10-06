import * as React from 'react';
import { Spinner, Text, Flex } from '@chakra-ui/core';

export const Loading = () => (
  <Flex
    flexDirection="column"
    width="100%"
    height="100vh"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner size="xl" />
    <Text textAlign="center" fontSize="lg" py={1}>
      Loading...
    </Text>
  </Flex>
);
