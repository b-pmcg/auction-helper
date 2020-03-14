/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import { Heading, Text, jsx, Box, Button, Styled, Input, Flex } from 'theme-ui';
import AuctionBlock from '../components/AuctionBlock';
import AccountManager from '../components/AccountManager';
import GuttedLayout from '../components/GuttedLayout';
import {AUCTION_DATA_FETCHER} from '../constants';
function fromRad(value) {
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

  async function callTend(auctionId, lotSize, bidAmount) {
    try {
      const t = await maker
        .service('validator')
        .tend(auctionId, lotSize, bidAmount);
    } catch (err) {
      window.alert(err);
    }
  }

  const { vatDaiBalance, daiBalance, mkrBalance } = useBalances();
  console.log(
    'vatDaiBalance, daiBalance, mkrBalance',
    vatDaiBalance,
    daiBalance,
    mkrBalance
  );

  // seth send “$MCD_VAT” ‘hope(address)’ "$MCD_FLIP_ETH"
  // async function hope(address) {
  //   await maker
  //     .service('smartContract')
  //     .getContract('MCD_VAT')
  //     .hope(address);
  // }

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

  async function join() {
    const joinAmountInDai = maker.service('web3')._web3.utils.toWei(joinAmount);
  const service = maker.service(AUCTION_DATA_FETCHER);
    
    await service.joinDaiToAdapter(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toString()
    );
  }

  async function exit() {
    const exitAmountInDai = maker.service('web3')._web3.utils.toWei(exitAmount);
  const service = maker.service(AUCTION_DATA_FETCHER);
    
    await service.exitDaiFromAdapter(
      maker.currentAddress(),
      BigNumber(exitAmountInDai).toString()
    );
  }

  async function fetchAuctions() {
  const service = maker.service(AUCTION_DATA_FETCHER);

    const auctions = await service.getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  const getValueOrDefault = (value, def = '-') => {
    return value ? value : def;
  };


  return (
    <GuttedLayout>
      <Head>
        <title>Auction Helper (Beta)</title>
      </Head>

      {!maker ? (
        <Flex sx={{
          justifyContent: 'center',
          p: 8
        }}>
          <Heading as="h3">Loading...</Heading>
        </Flex>
      ) : (
        <>
          <AccountManager web3Connected={web3Connected}/>
          <Box
            sx={{
              mt: 5,
              pb: 8
            }}
          >
            <AuctionBlock />
          </Box>
          <div>
            {auctions &&
              Object.keys(auctions)
                .reverse()
                .map(auctionId => {
                  const kickEvent = auctions[auctionId].find(
                    event => event.type === 'Kick'
                  );
                  const firstTend = auctions[auctionId].find(
                    event => event.type === 'Tend'
                  );
                  let lot = kickEvent ? kickEvent.lot : firstTend.lot;
                  console.log(auctionId, 'here');
                  return <AuctionBlock lot={lot} auctionId={auctionId} web3Connected={web3Connected} />;
                })}
          </div>
        </>
      )}
    </GuttedLayout>
  );
};

export default Index;
