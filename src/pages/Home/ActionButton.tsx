import * as React from 'react';
import { Flex, Button, Text, ButtonProps } from '@chakra-ui/core';

interface ActionButtonProps extends ButtonProps {
  text: string;
}

export const ActionButton = ({
  text,
  children,
  onClick,
}: ActionButtonProps) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      as={Button}
      {...{ variant: 'ghost', onClick }}
      height="auto"
      py={2}
      backgroundColor="white"
      data-test-id="action-button"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        size={10}
        backgroundColor="blue.400"
        color="white"
      >
        {children}
      </Flex>
      <Text fontSize="sm" color="blue.400" mt={2}>
        {text}
      </Text>
    </Flex>
  );
};
