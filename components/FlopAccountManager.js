/** @jsx jsx */

import React, { useState, useEffect } from 'react';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import useAllowances from '../hooks/useAllowances';
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
import BalanceFormVat from './BalanceFormVat';
import BalanceOf from './BalanceOf';
import AccountManagerLayout from '../components/AccountManagerLayout';

const REQUIRED_ALLOWANCE = 0;

export default () => {
  const { maker, web3Connected } = useMaker();
  const {
    vatDaiBalance,
    daiBalance,
    mkrBalance,
    joinDaiToAdapter,
    exitDaiFromAdapter
  } = useBalances();

  const {
    hasDaiAllowance,
    hasMkrAllowance,
    hasEthFlipHope,
    hasJoinDaiHope,
    giveDaiAllowance,
    giveMkrAllowance,
    giveFlipEthHope,
    giveJoinDaiHope
  } = useAllowances();

  const [daiApprovePending, setDaiApprovePending] = useState(false);
  const [mkrApprovePending, setMkrApprovePending] = useState(false);
  const [hopeApprovePending, setHopeApprovePending] = useState(false);
  const [joinAddress, setJoinAddress] = useState('');

  useEffect(() => {
    if (web3Connected) {
      (async () => {
        const joinDaiAdapterAddress = maker
          .service('smartContract')
          .getContractByName('MCD_JOIN_DAI').address;
        setJoinAddress(joinDaiAdapterAddress);
      })();
    }
  }, [maker, web3Connected]);

  return (
    <AccountManagerLayout
      topActions={
        <Box>
          <Text
            as="h2"
            variant="boldBody"
            sx={{
              mb: 5
            }}
          >
            To participate in auctions you need to sign these 3 approval
            transactions
          </Text>

          <Grid
            gap={4}
            columns={[1, 3]}
            sx={{
              // maxWidth: '200px',
              flexDirection: ['column', 'row'],

              width: 'auto',
              mx: 'auto'
            }}
          >
            <Button
              onClick={() => giveDaiAllowance(joinAddress)}
              disabled={!web3Connected || hasDaiAllowance}
            >
              {hasDaiAllowance ? 'Dai Unlocked' : 'Unlock Dai in your wallet'}
            </Button>
            <Button
              onClick={() => {
                const flipEthAddress = maker
                  .service('smartContract')
                  .getContractByName('MCD_FLIP_ETH_A').address;
                giveFlipEthHope(flipEthAddress);
              }}
              disabled={!web3Connected || hasEthFlipHope}
            >
              Unlock Dai in the adapter
            </Button>
            <Button
              onClick={() => giveJoinDaiHope(joinAddress)}
              disabled={!web3Connected || hasJoinDaiHope}
            >
              Unlock Dai in the VAT
            </Button>
          </Grid>
        </Box>
      }
      balances={
        <Box
          sx={{
            // bg: '#fff',
            // p: 6,
            // mb: 5,
            // borderRadius: 5,
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'border'
          }}
        >
          {web3Connected ? (
            <Grid
              gap={0}
              columns={3}
              sx={{
                pt: 5
              }}
            >
              <BalanceOf type={'Dai in your Wallet'} balance={daiBalance} />
              <BalanceOf
                type={'Dai in Adaptor'}
                balance={vatDaiBalance}
                vatActions={
                  <BalanceFormVat
                    joinDaiToAdapter={joinDaiToAdapter}
                    exitDaiFromAdapter={exitDaiFromAdapter}
                  />
                }
                sx={{
                  borderLeft: '1px solid',
                  borderRight: '1px solid',
                  borderColor: 'border'
                }}
              />
              <BalanceOf
                type={'MKR'}
                balance={mkrBalance}
                actions={
                  <Box>
                    <Button
                      disabled={!web3Connected || hasMkrAllowance}
                      onClick={() => giveMkrAllowance(joinAddress)}
                    >
                      Unlock to withdraw
                    </Button>
                  </Box>
                }
              />
            </Grid>
          ) : null}
        </Box>
      }
    />
  );
};
