/** @jsx jsx */

import React from 'react';
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

export default ({ web3Connected }) => {
  const { maker } = useMaker();
  const AUCTION_DATA_FETCHER = 'validator'; //TODO update this when we change the name
  const service = maker.service(AUCTION_DATA_FETCHER);
  const [daiApprovePending, setDaiApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});

  const giveDaiAllowance = async address => {
    setDaiApprovePending(true);
    try {
      await maker.getToken('MDAI').approveUnlimited(address);
      setProxyDetails(proxyDetails => ({
        ...proxyDetails,
        hasDaiAllowance: true
      }));
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
      // addToastWithTimeout(errMsg, dispatch);
    }
    setDaiApprovePending(false);
  };
  const giveHope = async address => {
    await maker
      .service('smartContract')
      .getContract('MCD_VAT')
      .hope(address);
  };
  if (!web3Connected) {
    return (
      <Flex
        sx={{
          justifyContent: 'center',
          py: 4
        }}
      >
        <Heading
          as="h2"
          variant="h2"
          sx={{
            mb: 2
          }}
        >
          To participate in auctions, connect your wallet
        </Heading>
      </Flex>
    );
  }
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
        <Button onClick={() => giveDaiAllowance(maker.currentAddress())}>
          Unlock Dai in your wallet
        </Button>
        <Button onClick={() => giveHope(service.flipEthAddress)}>
          Unlock Dai in the adapter
        </Button>
        <Button onClick={() => giveHope(service.joinDaiAdapterAddress)}>
          Unlock Dai in the VAT
        </Button>
      </Grid>
    </Box>
  );
};
