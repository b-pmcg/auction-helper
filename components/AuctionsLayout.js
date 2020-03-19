import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import { Button, Grid, Input, Flex, Select } from 'theme-ui';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';
import AuctionFilters from './AuctionFilters';
import useMaker from '../hooks/useMaker';

const AuctionsLayout = ({ auctions, stepSize, type }) => {
  const { blockHeight } = useMaker();
  const { hasPrevPageSelector, hasNextPageSelector } = selectors;
  const next = useAuctionsStore(state => state.nextPage);
  const prev = useAuctionsStore(state => state.prevPage);
  const filteredAuctions = useAuctionsStore(selectors.filteredAuctions());
  const auctionsPage = useAuctionsStore(
    selectors.auctionsPage(filteredAuctions)
  );

  useEffect(() => {
    const ids = auctionsPage.map(a => a.auctionId);
  }, [blockHeight, auctionsPage]);
  const hasPrev = useAuctionsStore(hasPrevPageSelector());
  const hasNext = useAuctionsStore(hasNextPageSelector(filteredAuctions));
  const AuctionBlockLayout =
    type === 'flip' ? FlipAuctionBlock : FlopAuctionBlock;

  return (
    <>
      <AuctionFilters />
      <Grid gap={5}>
        {auctionsPage.map(({ events, end, tic, auctionId }) => {
          return (
            <AuctionBlockLayout
              stepSize={stepSize}
              key={auctionId}
              events={events}
              id={auctionId}
              end={end}
              tic={tic}
            />
          );
        })}
      </Grid>
      <Flex
        sx={{
          justifyContent: 'center',
          mt: 5,
          mb: 5
        }}
      >
        <Button
          variant="primary"
          sx={{ mr: 5 }}
          disabled={!hasPrev}
          onClick={prev}
        >
          Prev
        </Button>
        <Button variant="primary" disabled={!hasNext} onClick={next}>
          Next
        </Button>
      </Flex>
    </>
  );
};

export default AuctionsLayout;
