/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import { Heading, Text, jsx, Box, Button, Styled, Input, Flex, Grid, Select } from 'theme-ui';
import FlipAuctionBlock from '../components/FlipAuctionBlock';
import FlipAccountManager from '../components/FlipAccountManager';
import GuttedLayout from '../components/GuttedLayout';
import { AUCTION_DATA_FETCHER } from '../constants';
function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Index = () => {
  const { maker, web3Connected } = useMaker();
  const [auctions, setAuctions] = useState(null);
  const { vatDaiBalance, daiBalance, mkrBalance } = useBalances();
  const [filterById, updateFilterById] = useState(undefined);
  const [sortBy, updateSortBy] = useState(undefined)

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions();
      }
    }
  }, [web3Connected, auctions]);

  function byId(auctionId){
    return  filterById ? auctionId.includes(filterById) : auctionId;    
  }

  async function fetchAuctions() {
    const service = maker.service(AUCTION_DATA_FETCHER);

    const auctions = await service.getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  return (
    <GuttedLayout>
      <Head>
        <title>Auction Helper (Beta)</title>
      </Head>

      {!maker ? (
        <Flex
          sx={{
            justifyContent: 'center',
            p: 8
          }}
        >
          <Text variant="boldBody">Loading...</Text>
        </Flex>
      ) : (
        <>
          <FlipAccountManager web3Connected={web3Connected} />
          <Box
            sx={{
              py: 5
            }}
          >
            <Text variant="boldBody">Active Auctions</Text>
          </Box>
          <Box
            sx={{
              mt: 2,
              pb: 5
            }}
          >
          </Box>
          <Flex sx={{
            justifyContent: ['center', 'space-between'],
            flexDirection: ['column', 'row'],
            mb:5
          }}>
            <Input sx={{
              bg: 'white',
              maxWidth:['100%', '180px'],
            }} placeholder="Filter by ID" onChange={({target: {value}}) => updateFilterById(value)}/>
            <Select sx={{
                width: ['100%', '200px'],
                bg: 'white', 
              }}
              defaultValue='Sort By'
              onChange={({target: {value}}) => console.log(value)}>
              <option value=''>Sort By</option>
              <option value="byTime">Time Remaining</option>
              <option value="byBidPrice">Current Bid Price</option>
            </Select>
          </Flex>
          <Grid gap={5}>
            {auctions &&
              Object.keys(auctions)
                .filter(byId)
                .reverse()
                .map(auctionId => {
                  const kickEvent = auctions[auctionId].find(
                    event => event.type === 'Kick'
                  );
                  const firstTend = auctions[auctionId].find(
                    event => event.type === 'Tend'
                  );
                  let lot = kickEvent ? kickEvent.lot : firstTend.lot;
                  return (
                    <FlipAuctionBlock
                      key={auctionId}
                      lot={lot}
                      auctionId={auctionId}
                      auction={auctions[auctionId]}
                      web3Connected={web3Connected}
                    />
                  );
                })}
          </Grid>
        </>
      )}
    </GuttedLayout>
  );
};

export default Index;
