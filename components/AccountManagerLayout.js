/** @jsx jsx */

import React, { useState, useEffect } from 'react';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import {
  Heading,
  Text,
  jsx,
  Box,
  Button,
  Grid,
  Styled,
  Input,
  Flex
} from 'theme-ui';

const AccountManagerLayout = ({ topActions, balances, balanceActions }) => {
  return (
    <Grid>
      {topActions}
      {balances}
      {balanceActions}
    </Grid>
  );
};
export default AccountManagerLayout;
