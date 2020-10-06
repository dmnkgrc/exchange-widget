import { Flex } from '@chakra-ui/core';
import styled from '@emotion/styled';

export const StyledCenterContainer = styled(Flex)(
  () => `
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
`
);
