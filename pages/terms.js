/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import TermsMDX from '../text/terms.mdx';
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
          pb: 5
        }}
      >
        <Head>
          <title>Terms</title>
        </Head>
        <Heading variant="h1" py="y">
          Terms and Conditions
        </Heading>

        <Box>
          <TermsMDX />
        </Box>
      </Box>
    </GuttedLayout>
  );
};

export default Index;
