/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import { Heading, Text, jsx, Box, Button, Styled, Input, Flex } from 'theme-ui';
import AuctionBlock from '../components/FlopAuctionBlock';
import AccountManager from '../components/FlopAccountManager';
import GuttedLayout from '../components/GuttedLayout';
import { AUCTION_DATA_FETCHER } from '../constants';

const Index = () => {
  const { maker, web3Connected } = useMaker();
  const [auctions, setAuctions] = useState(null);
  const { vatDaiBalance, daiBalance, mkrBalance } = useBalances();

  async function fetchAuctions() {
    const service = maker.service(AUCTION_DATA_FETCHER);

    const auctions = await service.getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions();
      }
    }
  }, [web3Connected, auctions]);

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
          <AccountManager web3Connected={web3Connected} />
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
                  return (
                    <AuctionBlock
                      lot={lot}
                      auctionId={auctionId}
                      web3Connected={web3Connected}
                    />
                  );
                })}
          </div>
        </>
      )}
    </GuttedLayout>
  );
};

export default Index;
