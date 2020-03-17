/** @jsx jsx */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBalances from '../hooks/useBalances';
import * as _ from 'lodash';
import BigNumber from 'bignumber.js';
import { Text, jsx, Flex, Button, Heading, Spinner } from 'theme-ui';
import FlipAccountManager from '../components/FlipAccountManager';
import GuttedLayout from '../components/GuttedLayout';
import { AUCTION_DATA_FETCHER } from '../constants';
import Moment from 'react-moment';
import AuctionsLayout from '../components/AuctionsLayout';
function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Index = () => {
  const { maker, web3Connected } = useMaker();
  const [rawAuctionData, updateRawAuctionData] = useState([]);
  const [lastSynced, updateLastSynced] = useState(undefined);
  const [auctions, setAuctions] = useState(null);

  useEffect(() => {
    if (web3Connected) {
      if (!auctions) {
        fetchAuctions();
      }
    }
  }, [web3Connected]);

  async function fetchAuctions(shouldSync = false) {
    const service = maker.service(AUCTION_DATA_FETCHER);

    updateLastSynced(new Date());

    let currentAuctions = await service.fetchFlipAuctions(shouldSync);
    if (shouldSync) {
      currentAuctions = [...rawAuctionData, ...currentAuctions];
    }
    updateRawAuctionData(currentAuctions);
    setAuctions(_.groupBy(currentAuctions, auction => auction.auctionId));
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
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading
            variant="h1"
            sx={{
              py: 7
            }}
          >
            Collateral Auctions
          </Heading>

          <FlipAccountManager web3Connected={web3Connected} />
          {!web3Connected ? null : (
            <Flex
              sx={{
                py: 6,
                alignItems: 'center'
              }}
            >
              <Text variant="h2">Active Auctions</Text>
              <Button
                variant="pill"
                sx={{ ml: 5 }}
                disabled={!web3Connected}
                onClick={() => fetchAuctions(true)}
              >
                Sync
              </Button>
              {lastSynced && (
                <Text title={lastSynced} sx={{ ml: 5, fontSize: 2 }}>
                  (Last synced: <Moment local>{lastSynced.getTime()}</Moment>)
                </Text>
              )}
            </Flex>
          )}
          {!web3Connected ? null : !auctions ? (
            <Flex
              sx={{
                justifyContent: 'center'
              }}
            >
              <Spinner />
            </Flex>
          ) : !auctions.length ? (
            <Flex>
              <Text variant="boldBody">
                No auctions found, check back later.
              </Text>
            </Flex>
          ) : (
            <AuctionsLayout auctions={auctions} type="flip" />
          )}
        </>
      )}
    </GuttedLayout>
  );
};

export default Index;
