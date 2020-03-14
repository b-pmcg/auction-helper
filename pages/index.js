/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { Heading, Text, jsx, Box, Button, Styled, Input, Flex } from 'theme-ui';
import AuctionBlock from '../components/AuctionBlock';

export function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Index = ({ web3Connected }) => {
  const { maker } = useMaker();
  const [auctions, setAuctions] = useState(null);

  // const [auctionId, setAuctionId] = useState('');
  // const [lotSize, setLotSize] = useState('');
  // const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions();
      }
    }
  }, [web3Connected, auctions]);

  console.log(auctions, 'auctionsss');
  async function callTend(auctionId, lotSize, bidAmount) {
    try {
      const t = await maker
        .service('validator')
        .tend(auctionId, lotSize, bidAmount);
    } catch (err) {
      window.alert(err);
    }
  }

  // seth send “$MCD_VAT” ‘hope(address)’ "$MCD_FLIP_ETH"
  async function hope(address) {
    await maker
      .service('smartContract')
      .getContract('MCD_VAT')
      .hope(address);
  }

  function handleAuctionIdInputChange({ target }) {
    console.log('auctionid', target.value);
    setAuctionId(target.value);
  }
  function handleLotSizeInputChange({ target }) {
    console.log('lotSize', target.value);
    setLotSize(target.value);
  }
  function handleBidAmountInputChange({ target }) {
    console.log('bidAmount', target.value);
    setBidAmount(target.value);
  }

  const [joinAmount, setJoinAmount] = useState('');
  const [exitAmount, setExitAmount] = useState('');

  async function joinDaiToAdapter() {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    const joinAmountInDai = maker.service('web3')._web3.utils.toWei(joinAmount);

    await maker.getToken('MDAI').approveUnlimited(DaiJoinAdapter.address);

    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toString()
    );
  }

  async function exit() {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    const exitAmountInDai = maker.service('web3')._web3.utils.toWei(exitAmount);

    await DaiJoinAdapter.exit(
      maker.currentAddress(),
      BigNumber(exitAmountInDai).toString()
    );
  }

  async function fetchAuctions() {
    const auctions = await maker.service('validator').getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  const getValueOrDefault = (value, def = '-') => {
    return value ? value : def;
  };

  console.log(auctions, 'yo');

  return (
    <Box
      sx={{
        p: 10
      }}
    >
      <Head>
        <title>Maker Auctions</title>
      </Head>

      <Text>Welcome to maker auctions</Text>
      <Box sx={{ my: 2 }}>
        <Link href="/flip">
          <Button p={2}>Flip Auctions</Button>
        </Link>
      </Box>
      <Box>
        <Link href="/flop">
          <Button p={2}>Flop Auctions</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Index;
