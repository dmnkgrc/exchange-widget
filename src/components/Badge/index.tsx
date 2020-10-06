import * as React from 'react';

import { DefaultTheme, Flex, FlexProps } from '@chakra-ui/core';
import styled from '@emotion/styled';

interface BadgeProps extends FlexProps {
  iconOnly?: boolean;
  theme: DefaultTheme;
}

const StyledBadge = styled(Flex)<BadgeProps>(
  ({ theme, iconOnly }) => `
  display: inline-flex;
  background-color: white;
  border: 1px solid;
  width: ${iconOnly ? theme.sizes[10] : 'auto'};
  border-color: ${theme.colors.gray[200]};
  padding: ${theme.space[2]} ${iconOnly ? theme.space[3] : theme.space[4]};
  color: ${theme.colors.blue[400]};
  border-radius: ${theme.radii.full};
  align-items: center;
  cursor: pointer;
  transition-property: background-color, border-color;
  transition-duration: .3s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  &:hover {
    background-color: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[100]};
  }
`
);

export const Badge = ({ children, ...props }: Omit<BadgeProps, 'theme'>) => (
  <StyledBadge {...props}>{children}</StyledBadge>
);
