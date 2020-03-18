import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import BigNumber from 'bignumber.js';
import { Button, Grid, Input, Flex, Select } from 'theme-ui';

const ASCENDING = -1;
const DESCENDING = 1;

const sortByBidPrice = (auctions, direction) => {
  return Object.keys(auctions || [])
    .map(auctionId => {
      return auctions[auctionId].events.find(event => event.type !== 'Deal');
    })
    .map(event => {
      const bid = new BigNumber(event.bid);
      const lot = new BigNumber(event.lot);
      const bidPrice = lot.eq(new BigNumber(0)) ? lot : bid.div(lot);
      return {
        ...event,
        bid,
        lot,
        bidPrice
      };
    })
    .sort((prev, next) => {
      if (next.bidPrice.gt(prev.bidPrice)) return 1 * direction;
      if (next.bidPrice.lt(prev.bidPrice)) return -1 * direction;
      return 0;
    })
    .map(event => {
      return event.auctionId;
    });
};

const sortByTime = (auctions, direction) => {
  return Object.keys(auctions || []).sort((prevId, nextId) => {
    const now = new Date().getTime();

    const prev = auctions[prevId];
    const next = auctions[nextId];

    const prevTicEndMin = prev.tic.lt(prev.end) ? prev.tic : prev.end;
    const prevEndTime = prev.tic.eq(0) ? prev.end : prevTicEndMin;
    const prevTimeRemaining = prevEndTime.lte(now)
      ? new BigNumber(0)
      : prevEndTime.minus(now);

    const nextTicEndMin = next.tic.lt(next.end) ? next.tic : next.end;
    const nextEndTime = next.tic.eq(0) ? next.end : nextTicEndMin;
    const nextTimeRemaining = nextEndTime.lte(now)
      ? new BigNumber(0)
      : nextEndTime.minus(now);
  
    if (prevTimeRemaining.eq(0) || nextTimeRemaining.eq(0)) return -1 * direction;
    if (prevTimeRemaining.eq(nextTimeRemaining)) return 0;
    else if (prevTimeRemaining.lt(nextTimeRemaining)) return -1 * direction;
    else return 1 * direction;
  });
};

const sortByLatest = auctions => {
  return Object.keys(auctions || []).reverse();
};

const filterById = (ids, id) => {
  return ids.filter(auctionId => (id ? auctionId.includes(id) : auctionId));
};

const AuctionsLayout = ({ auctions, stepSize, type }) => {
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
    switch (sortCriteria) {
      case 'byBidPriceDesc': {
        filterAuctionIds(filterById(sortByBidPrice(auctions, DESCENDING), idFilter));
        break;
      }
      case 'byBidPriceAsc': {
        filterAuctionIds(filterById(sortByBidPrice(auctions, ASCENDING), idFilter));
        break;
      }
      case 'byTimeAsc': {
        filterAuctionIds(filterById(sortByTime(auctions,ASCENDING), idFilter));
        break;
      }
      case 'byTimeDesc': {
        filterAuctionIds(filterById(sortByTime(auctions,DESCENDING), idFilter));
        break;
      }
      default: {
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
          <option value="byTimeDesc">Time Remaining (Desc)</option>
          <option value="byTimeAsc">Time Remaining (Asc)</option>
          <option value="byBidPriceDesc">Current Bid Price (Desc)</option>
          <option value="byBidPriceAsc">Current Bid Price (Asc)</option>
        </Select>
      </Flex>
      <Grid gap={5}>
        {auctionIds.slice(page.start, page.end).map(auctionId => {
          const { events, end, tic } = auctions[auctionId];
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
