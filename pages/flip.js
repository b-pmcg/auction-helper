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

const Index = (props) => {
  const initialPage = {start: 0, end: 10, step: 10};
  const { maker, web3Connected } = useMaker();
  const [auctions, setAuctions] = useState(null);
  const [auctionIds , filterAuctionIds] = useState(null);
  const { vatDaiBalance, daiBalance, mkrBalance } = useBalances();
  const [filterById, updateFilterById] = useState(undefined);
  const [sortBy, updateSortBy] = useState(undefined);
  const [ page , updatePage ] = useState(initialPage);

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions();
      }
    }
  }, [web3Connected]);

  function byId(auctionId){
    return  filterById ? auctionId.includes(filterById) : auctionId;    
  }
1
  useEffect(() => {    
    filterAuctionIds(Object.keys(auctions || []).reverse().filter(byId))
  }, [auctions, filterById]);  

  useEffect(() => {
    updatePage(initialPage)
  }, [auctionIds])

  async function fetchAuctions() {
    const service = maker.service(AUCTION_DATA_FETCHER);

    const auctions = await service.getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  const next = () => {
    updatePage({
      ...page,
      start: page.start + page.step,
      end: page.end + page.step
    });
  }

  const prev = () => {
    updatePage({
      ...page,
      start: page.start - page.step,
      end: page.end - page.step
    });
  }
  
  const hasPrev = page.start - page.step >= 0;
  const hasNext = page.end - (auctionIds || []).length < 0;

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
            {
              auctionIds && auctionIds
                .slice(page.start, page.end)
                .map(auctionId => {
                  return (
                    <FlipAuctionBlock
                      key={auctionId}
                      lot={auctions[auctionId][0].lot}
                      auctionId={auctionId}
                      auction={auctions[auctionId]}
                      web3Connected={web3Connected}
                    />
                  );
                })
              }
          </Grid>
          <Flex sx={{
            justifyContent:'center',
            mt: 5,
            mb: 5
          }}>
            <Button variant="primary" sx={{mr: 5}} disabled={!hasPrev} onClick={prev}>PREV</Button>
            <Button variant="primary" disabled={!hasNext} onClick={next}>NEXT</Button>
          </Flex>
        </>
      )}
    </GuttedLayout>
  );
};

export default Index;
