/** @jsx jsx */

import React, { useState } from 'react';
import {
  Heading,
  Text,
  jsx,
  Button,
  Grid,
  Box,
  Styled,
  Select,
  Label,
  Input,
  Flex
} from 'theme-ui';
import CollapseToggle from './CollapseToggle';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';
import useMaker from '../hooks/useMaker';

const AuctionFilters = ({ title, text, action, forceExpanded }) => {
  const { maker, web3Connected } = useMaker();
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedGloss, setCollapsedGloss] = useState(true);

  const sortCriteria = useAuctionsStore(state => state.sortBy);
  const filterByCurrentBidder = useAuctionsStore(
    state => state.filterByCurrentBidder
  );
  const filterByNotCompleted = useAuctionsStore(
    state => state.filterByNotCompleted
  );
  const setSortBy = useAuctionsStore(state => state.setSortBy);
  const setFilterByIdValue = useAuctionsStore(
    state => state.setFilterByIdValue
  );
  const setFilterByBidderValue = useAuctionsStore(
    state => state.setFilterByBidderValue
  );
  const toggleFilterByCurrentBidder = useAuctionsStore(
    state => state.toggleFilterByCurrentBidder
  );

  const toggleFilterByNotCompleted = useAuctionsStore(
    state => state.toggleFilterByNotCompleted
  );

  const filters = [
    [
      'Filter by ID',
      <Input
        sx={{
          bg: 'white',
          borderColor: 'border',
          maxWidth: ['100%', '180px']
        }}
        placeholder="Auction ID"
        onChange={({ target: { value } }) => setFilterByIdValue(value)}
      />
    ],
    [
      'Filter By Bidder Address',
      <Input
        sx={{
          bg: 'white',
          borderColor: 'border',
          maxWidth: ['100%', '240px']
        }}
        placeholder="Bidder Address"
        onChange={({ target: { value } }) => setFilterByBidderValue(value)}
      />
    ]
  ];

  const toggles = [
    [
      '',
      <Button
        variant={filterByNotCompleted ? 'pill' : 'pillInactive'}
        onClick={toggleFilterByNotCompleted}
      >
        Hide Complete Auctions
      </Button>
    ],
    [
      '',
      <Button
        variant={filterByCurrentBidder ? 'pill' : 'pillInactive'}
        onClick={() => toggleFilterByCurrentBidder(maker.currentAddress())}
      >
        Show Only Participating
      </Button>
    ]
  ];

  return (
    <Box
      sx={{
        p: 0,
        mb: 4
      }}
    >
      <Flex
        sx={{
          // p: 6,
          py: 0,
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Button
          key={``}
          variant={collapsed ? 'pillInactive' : 'pill'}
          sx={{
            mr: 2
          }}
          onClick={() => (forceExpanded ? null : setCollapsed(!collapsed))}
        >
          Filter By...
        </Button>
        <Box>
          <Button
            variant={collapsedGloss ? 'pillInactive' : 'pill'}
            onClick={() => setCollapsedGloss(!collapsedGloss)}
          >
            Glossary
          </Button>
        </Box>
        <Box ml="auto">
          <Select
            sx={{
              width: ['100%', '300px'],
              borderColor: 'border',
              bg: 'white'
            }}
            defaultValue="Sort By Id (Desc)"
            onChange={({ target: { value } }) => setSortBy(value)}
          >
            <option value="byLatestDesc">Sort By Id (Desc)</option>
            <option value="byLatestAsc">Sort By Id (Asc)</option>
            <option value="byTimeAsc">Time Remaining (Asc)</option>
            <option value="byTimeDesc">Time Remaining (Desc)</option>
            <option value="byBidPriceAsc">Current Bid Price (Asc)</option>
            <option value="byBidPriceDesc">Current Bid Price (Desc)</option>
          </Select>
        </Box>
      </Flex>
      {collapsedGloss ? null : (
        <Box>
          <Box
            px="6"
            pb="4"
            mt="4"
            sx={{
              variant: 'styles.roundedCard'
            }}
          >
            {' '}
            <Text>
              glossary, kick, tend, dent, deal, vat, flop, flip, bid, lot,
              price, tau, tll, adapter, end...
            </Text>
          </Box>
        </Box>
      )}
      {collapsed ? null : (
        <Box
          px="6"
          pb="4"
          mt="4"
          sx={{
            variant: 'styles.roundedCard'
          }}
        >
          <Flex>
            {toggles.map(([text, body], index) => {
              return (
                <Box mr="4" key={index}>
                  {body}
                </Box>
              );
            })}
          </Flex>
          <Flex mt="4">
            {filters.map(([text, body], index) => {
              return (
                <Box mr="4" key={index}>
                  <Text
                    variant="caps"
                    sx={{
                      mb: 2
                    }}
                  >
                    {text}
                  </Text>
                  {body}
                </Box>
              );
            })}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default AuctionFilters;
