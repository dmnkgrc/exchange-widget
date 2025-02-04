import * as React from 'react';
import { IconProps } from '@chakra-ui/core';

export const InvertIcon = ({
  size = '24',
  color = 'currentColor',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 3L5 6.99H8V14H10V6.99H13L9 3ZM16 17.01V10H14V17.01H11L15 21L19 17.01H16Z"
      fill={color}
    />
  </svg>
);
