/** @jsx jsx */

import React, { useState, useEffect } from 'react';
import useMaker from '../hooks/useMaker';
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
import { AUCTION_DATA_FETCHER } from '../constants';

const REQUIRED_ALLOWANCE = 0;

export default ({ web3Connected }) => {
  const { maker } = useMaker();
  const [daiApprovePending, setDaiApprovePending] = useState(false);
  const [hopeApprovePending, setHopeApprovePending] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [joinAddress, setJoinAddress] = useState('');

  useEffect(() => {
    if (web3Connected) {
      (async () => {
        const joinDaiAdapterAddress = maker
          .service('smartContract')
          .getContractByName('MCD_JOIN_DAI').address;
        setJoinAddress(joinDaiAdapterAddress);
        const allowance = await maker
          .getToken('MDAI')
          .allowance(maker.currentAddress(), joinDaiAdapterAddress);
        setHasAllowance(allowance.gt(REQUIRED_ALLOWANCE) ? true : false);
      })();
    }
  }, [maker, web3Connected]);

  const giveDaiAllowance = async address => {
    setDaiApprovePending(true);
    try {
      await maker.getToken('MDAI').approveUnlimited(address);
      setHasAllowance(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
    }
    setDaiApprovePending(false);
  };

  const giveHope = async address => {
    setHopePending(true);
    try {
      await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .hope(address);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `hope tx failed ${message}`;
      console.error(errMsg);
    }
    setHopeApprovePending(false);
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 'auto',
        py: 8
      }}
    >
      <Heading
        as="h2"
        variant="h2"
        sx={{
          mb: 5
        }}
      >
        To participate in auctions you need to sign these 3 approval
        transactions
      </Heading>

      <Grid
        sx={{
          maxWidth: '200px',
          mx: 'auto'
        }}
      >
        <Button
          onClick={() => giveDaiAllowance(joinAddress)}
          disabled={!web3Connected || hasAllowance}
        >
          {hasAllowance ? 'Dai Unlocked' : 'Unlock Dai in your wallet'}
        </Button>
        <Button
          onClick={() => {
            const flipEthAddress = maker
              .service('smartContract')
              .getContractByName('MCD_FLIP_ETH_A').address;
            giveHope(flipEthAddress);
          }}
          disabled={!web3Connected}
        >
          Unlock Dai in the adapter
        </Button>
        <Button onClick={() => giveHope(joinAddress)} disabled={!web3Connected}>
          Unlock Dai in the VAT
        </Button>
      </Grid>
    </Box>
  );
};
