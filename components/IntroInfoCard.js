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

const IntroInfoCard = ({ title, text, action }) => {
  return (
    <Box
      sx={{
        variant: 'styles.roundedCard',
        p: 0,
        mb: 6
      }}
    >
      <Box
        p="6"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'border'
        }}
      >
        <Heading variant="h2">{title}</Heading>
      </Box>
      <Box px="6" pb="4">
        {text}
      </Box>
      {action}
    </Box>
  );
};

export default IntroInfoCard;
