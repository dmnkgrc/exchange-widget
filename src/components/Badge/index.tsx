import * as React from 'react';

import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/core';

const baseProps: Partial<ButtonProps> = {
  color: 'blue.400',
  size: 'sm',
  backgroundColor: 'white',
  border: '1px solid',
  borderColor: 'gray.200',
};

export const IconBadge = (props: IconButtonProps) => (
  <IconButton isRound {...baseProps} {...props} />
);

export const Badge = ({ children, ...props }: ButtonProps) => (
  <Button borderRadius="full" {...baseProps} {...props}>
    {children}
  </Button>
);
