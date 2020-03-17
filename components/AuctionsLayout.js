import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import BigNumber from "bignumber.js";
import { Button, Grid, Input, Flex, Select } from 'theme-ui';

const sortByBidPrice = (auctions) => {  
  return Object.keys(auctions || [])
  .map(auctionId => {
    return auctions[auctionId].events.find(event => event.type !== "Deal");
  })
  .map(event => {    
    const bid = new BigNumber(event.bid);
    const lot = new BigNumber(event.lot);
    const bidPrice = lot.eq(new BigNumber(0)) ? lot : bid.div(lot)
    return {
      ...event,
      bid,
      lot,
      bidPrice
    }
  })
  .sort((prev, next) => {
    if ( next.bidPrice.gt(prev.bidPrice) ) return 1;
    if ( next.bidPrice.lt(prev.bidPrice) ) return -1;
    return 0;
  })
  .map(event => {
    return event.auctionId;
  });
}

const sortByTime = (auctions) => {
  return [];
}

const sortByLatest = (auctions) => {
  return Object.keys(auctions || [])
    .reverse();
}

const filterById = (ids, id) => {
  return ids.filter(auctionId => id ? auctionId.includes(id) : auctionId);
}

const AuctionsLayout = ({ auctions, type }) => {
  const AuctionBlockLayout =
    type === 'flip' ? FlipAuctionBlock : FlopAuctionBlock;
  const initialPage = { start: 0, end: 10, step: 10 };

  // hooks
  const [idFilter, updateFilterById] = useState(undefined);
  const [auctionIds, filterAuctionIds] = useState([]);
  const [sortCriteria, sortBy] = useState(undefined);
  const [page, updatePage] = useState(initialPage);
  

  // effects
  useEffect(() => {
    updatePage(initialPage);
  }, [auctionIds]);

  useEffect(() => {
    switch(sortCriteria){
      case 'byBidPrice': {
        console.log("Sorted by Bid Price")
        filterAuctionIds(filterById(sortByBidPrice(auctions), idFilter));
        break;
      };
      case 'byTime': {
        console.log("Sorted by Time Remaining")
        filterAuctionIds(filterById(sortByTime(auctions), idFilter));
        break;
      };
      default: {
        console.log("Sorted by Latest")
        filterAuctionIds(filterById(sortByLatest(auctions), idFilter));
      }
    }
  }, [sortCriteria, idFilter]);

  const next = () => {
    updatePage({
      ...page,
      start: page.start + page.step,
      end: page.end + page.step
    });
  };

  const prev = () => {
    updatePage({
      ...page,
      start: page.start - page.step,
      end: page.end - page.step
    });
  };

  const hasPrev = page.start - page.step >= 0;
  const hasNext = page.end - (auctionIds || []).length < 0;

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
          onChange={({ target: { value } }) => updateFilterById(value)}
        />
        <Select
          sx={{
            width: ['100%', '200px'],
            borderColor: 'border',
            bg: 'white'
          }}
          defaultValue="Sort By Id (Desc)"
          onChange={({ target: { value } }) => sortBy(value)}
        >
          <option value="byIdDescending">Sort By Id (Desc)</option>
          <option value="byTime">Time Remaining</option>
          <option value="byBidPrice">Current Bid Price</option>
        </Select>
      </Flex>
      <Grid gap={5}>
        {auctionIds.slice(page.start, page.end).map(auctionId => {
          const {events, end, tic} = auctions[auctionId];
          return (
            <AuctionBlockLayout
              key={auctionId}
              events={events}
              id={auctionId}
              end={end}
              tic={tic}
            />
          )
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
