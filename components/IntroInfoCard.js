/** @jsx jsx */

import React, { useState } from 'react';
import {
  Heading,
  Text,
  jsx,
  Button,
  Grid,
  Box,
  Styled,
  Label,
  Input,
  Flex
} from 'theme-ui';
import CollapseToggle from './CollapseToggle';

const IntroInfoCard = ({ title, text, action, forceExpanded }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Box
      sx={{
        variant: 'styles.roundedCard',
        p: 0,
        mb: 6
      }}
    >
      <Flex
        p="6"
        sx={{
          borderBottom: collapsed ? null : '1px solid',
          borderColor: 'border',
          alignItems: 'center'
        }}
      >
        <Heading variant="h2">{title}</Heading>
        <Box
          sx={{
            ml: 'auto'
          }}
        >
          <CollapseToggle onClick={() => forceExpanded ? null : setCollapsed(!collapsed) } active={!collapsed} />
        </Box>
      </Flex>
      {collapsed ? null : (
        <>
          <Box px="6" pb="4">
            {text}
          </Box>
          {action}
        </>
      )}
    </Box>
  );
};

export default IntroInfoCard;
