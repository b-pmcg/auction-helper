import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import { Button, Grid, Input, Flex, Select } from 'theme-ui';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';
import AuctionFilters from './AuctionFilters';
const AuctionsLayout = ({ auctions, stepSize, type }) => {
  const { hasPrevPageSelector, hasNextPageSelector } = selectors;
  const next = useAuctionsStore(state => state.nextPage);
  const prev = useAuctionsStore(state => state.prevPage);
  const filteredAuctions = useAuctionsStore(selectors.filteredAuctions());
  const auctionsPage = useAuctionsStore(
    selectors.auctionsPage(filteredAuctions)
  );
  const hasPrev = useAuctionsStore(hasPrevPageSelector());
  const hasNext = useAuctionsStore(hasNextPageSelector(filteredAuctions));
  // const sortCriteria = useAuctionsStore(state => state.sortBy);
  // const setSortBy = useAuctionsStore(state => state.setSortBy);
  // const setFilterByIdValue = useAuctionsStore(
  //   state => state.setFilterByIdValue
  // );

  const AuctionBlockLayout =
    type === 'flip' ? FlipAuctionBlock : FlopAuctionBlock;
  const initialPage = { pageStart: 0, pageEnd: 10, pageStep: 10 };

  // hooks
  const [idFilter, updateFilterById] = useState(undefined);
  const [auctionIds, filterAuctionIds] = useState([]);
  // const [sortCriteria, sortBy] = useState(undefined);
  const [page, updatePage] = useState(initialPage);

  // effects

  console.log(filteredAuctions, 'fultereddd');
  // useEffect(() => {
  //   switch (sortCriteria) {
  //     case 'byBidPrice': {
  //       console.log('Sorted by Bid Price');
  //       filterAuctionIds(filterById(sortByBidPrice(auctions), idFilter));
  //       break;
  //     }
  //     case 'byTime': {
  //       console.log('Sorted by Time Remaining');
  //       filterAuctionIds(filterById(sortByTime(auctions), idFilter));
  //       break;
  //     }
  //     default: {
  //       console.log('Sorted by Latest');
  //       filterAuctionIds(filterById(sortByLatest(auctions), idFilter));
  //     }
  //   }
  // }, [sortCriteria, idFilter]);

  return (
    <>
      {/* <Flex
        sx={{
          justifyContent: ['center', 'space-between'],
          flexDirection: ['column', 'row'],
          mb: 5
        }}
      > */}
        <AuctionFilters />

        
      {/* </Flex> */}
      <Grid gap={5}>
        {auctionsPage.map(({ events, end, tic, auctionId }) => {
          // const { events, end, tic } = auctions[auctionId];
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
