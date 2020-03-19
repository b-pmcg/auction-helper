/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import {
  Heading,
  Text,
  jsx,
  Box,
  Link as StyledLink,
  Button,
  Styled,
  Input,
  Flex
} from 'theme-ui';
import GuttedLayout from '../components/GuttedLayout';
export function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Index = () => {
  const { maker, web3Connected } = useMaker();

  return (
    <GuttedLayout>
      <Box
        sx={{
          py: 5
        }}
      >
        <Head>
          <title>Maker Auctions</title>
        </Head>

        {/* <Text variant="boldBody">Welcome to Maker auctions</Text> */}
        <Heading
            variant="h1"
            sx={{
              py: 7
            }}
          >
            Maker Auctions
          </Heading>

        {/* <Box sx={{ my: 2 }}>
          <Link href="/flip">
            <StyledLink variant="nav">Collateral Auctions →</StyledLink>
          </Link>
        </Box> */}
        <Box pt="6">
          <Link href="/flop">
            <StyledLink variant="nav">Debt Auctions →</StyledLink>
          </Link>
        </Box>
      </Box>
    </GuttedLayout>
  );
};

export default Index;
