import React, { useState, useEffect } from 'react';
import FlipAuctionBlock from './FlipAuctionBlock';
import FlopAuctionBlock from './FlopAuctionBlock';
import {
  Text,
  Button,
  Grid,
  Box,
  Input,
  Flex,
  Select,
} from 'theme-ui';

const AuctionsLayout = ({ auctions, type }) => {

  const AuctionBlockLayout = type === 'flip' ? FlipAuctionBlock : FlopAuctionBlock;
  const initialPage = { start: 0, end: 10, step: 10 };

  // hooks 
  const [filterById, updateFilterById] = useState(undefined);
  const [auctionIds, filterAuctionIds] = useState([]);
  const [sortBy, updateSortBy] = useState(undefined);
  const [page, updatePage] = useState(initialPage);

  // effects
  useEffect(() => {
    filterAuctionIds(Object.keys(auctions || []).reverse().filter(byId))
  }, [auctions, filterById]);

  useEffect(() => {
    updatePage(initialPage)
  }, [auctionIds])

  function byId(auctionId) {
    return filterById ? auctionId.includes(filterById) : auctionId;
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
    <>
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
        mb: 5
      }}>
        <Input sx={{
          bg: 'white',
          borderColor: 'border',
          maxWidth: ['100%', '180px'],
        }}
          placeholder="Filter by ID"
          onChange={({ target: { value } }) => updateFilterById(value)} />
        <Select sx={{
          width: ['100%', '200px'],
          borderColor: 'border',
          bg: 'white',
        }}
          defaultValue='Sort By'
          onChange={({ target: { value } }) => console.log(value)}>
          <option value=''>Sort By</option>
          <option value="byTime">Time Remaining</option>
          <option value="byBidPrice">Current Bid Price</option>
        </Select>
      </Flex>
      <Grid gap={5}>
        {
          auctionIds
            .slice(page.start, page.end)
            .map(auctionId =>
              < AuctionBlockLayout key={auctionId} events={auctions[auctionId]} id={auctionId} />
            )
        }
      </Grid>
      <Flex sx={{
        justifyContent: 'center',
        mt: 5,
        mb: 5
      }}>
        <Button variant="primary" sx={{ mr: 5 }} disabled={!hasPrev} onClick={prev}>PREV</Button>
        <Button variant="primary" disabled={!hasNext} onClick={next}>NEXT</Button>
      </Flex>
    </>
  );
}

export default AuctionsLayout