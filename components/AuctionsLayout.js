import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import { Button, Grid, Input, Flex, Select } from 'theme-ui';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';
import useMaker from '../hooks/useMaker';

const AuctionsLayout = ({ auctions, stepSize, type }) => {
  const { hasPrevPageSelector, hasNextPageSelector } = selectors;
  const next = useAuctionsStore(state => state.nextPage);
  const prev = useAuctionsStore(state => state.prevPage);

  const { maker } = useMaker();

  const filteredAuctions = useAuctionsStore(selectors.filteredAuctions(maker.currentAddress()));
  const auctionsPage = useAuctionsStore(
    selectors.auctionsPage(filteredAuctions)
  );
  const hasPrev = useAuctionsStore(hasPrevPageSelector());
  const hasNext = useAuctionsStore(hasNextPageSelector(filteredAuctions));
  const sortCriteria = useAuctionsStore(state => state.sortBy);
  const setSortBy = useAuctionsStore(state => state.setSortBy);
  const setFilterByIdValue = useAuctionsStore(
    state => state.setFilterByIdValue
  );

  const AuctionBlockLayout =
    type === 'flip' ? FlipAuctionBlock : FlopAuctionBlock;
  const initialPage = { pageStart: 0, pageEnd: 10, pageStep: 10 };

  // hooks
  const [idFilter, updateFilterById] = useState(undefined);
  const [auctionIds, filterAuctionIds] = useState([]);
  // const [sortCriteria, sortBy] = useState(undefined);
  const [page, updatePage] = useState(initialPage);

  // effects

  // console.log(filteredAuctions, 'fultereddd');
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
      <Flex
        sx={{
          justifyContent: ['center', 'space-between'],
          flexDirection: ['column', 'row'],
          mb: 5
        }}
      >
        <Input
          sx={{
            bg: 'white',
            borderColor: 'border',
            maxWidth: ['100%', '180px']
          }}
          placeholder="Filter by ID"
          onChange={({ target: { value } }) => setFilterByIdValue(value)}
        />
        <Select
          sx={{
            width: ['100%', '200px'],
            borderColor: 'border',
            bg: 'white'
          }}
          defaultValue="Sort By Id (Desc)"
          onChange={({ target: { value } }) => setSortBy(value)}
        >
          <option value="byLatest">Sort By Id (Desc)</option>
          <option value="byTime">Time Remaining</option>
          <option value="byBidPrice">Current Bid Price</option>
          <option value="filterByCurrentAddress">Current Address</option>
        </Select>
      </Flex>
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
          PREV
        </Button>
        <Button variant="primary" disabled={!hasNext} onClick={next}>
          NEXT
        </Button>
      </Flex>
    </>
  );
};

export default AuctionsLayout;
