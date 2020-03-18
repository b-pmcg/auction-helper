/** @jsx jsx */

import React, { useState } from 'react';
import { Text, jsx, Grid, Box } from 'theme-ui';
import BigNumber from 'bignumber.js';
import Moment from 'react-moment';
import MiniFormLayout from './MiniFormLayout';
import useAuctionActions from '../hooks/useAuctionActions';
import ActionTabs from './ActionTabs';
import AuctionBlockLayout from './AuctionBlockLayout';

const AuctionEvent = ({
  type,
  ilk,
  price,
  lot,
  bid,
  currentBid,
  timestamp,
  tx,
  sender
}) => {
  const fields = [
    ['Event Type', type],
    ['Bid Value', bid],
    ['Lot Size', lot, {color: 'primary'}],
    ['Current Bid Price', currentBid],
    // ['Price', price],
    ['Timestamp', timestamp],
    [
      'Tx',
      <a href={`https://etherscan.io/tx/${tx}`} target="_blank">
        {' '}
        {tx.slice(0, 7) + '...' + tx.slice(-4)}
      </a>
    ],
    [
      'Sender',
      <a href={`https://etherscan.io/address/${sender}`} target="_blank">
        {' '}
        {sender.slice(0, 7) + '...' + sender.slice(-4)}
      </a>
    ]
  ];
  return (
    <Grid
      gap={2}
      columns={[2, 4, 7]}
      sx={{
        bg: 'background',
        p: 5,
        borderRadius: 5
      }}
    >
      {fields.map(([title, value, styling]) => {
        return (
          <Box key={title}>
            <Text
              variant="caps"
              sx={{
                fontSize: '10px',
                mb: 2
              }}
            >
              {title}
            </Text>
            <Text
              sx={{
                fontSize: 1,
                ...styling
              }}
            >
              {value}
            </Text>
          </Box>
        );
      })}
    </Grid>
  );
};

const byTimestamp = (prev, next) => {
  const nextTs = new Date(next.timestamp).getTime();
  const prevTs = new Date(prev.timestamp).getTime();

  if (nextTs > prevTs) return 1;
  if (nextTs < prevTs) return -1;
  if (nextTs === prevTs) {
    if (next.type === 'Dent') return 1;
    if (next.type === 'Deal') return 2;
    if (next.type === 'Kick') return -1;
  }
  return 0;
};

export default ({ events, id: auctionId, end, tic }) => {
  const { callFlopDent } = useAuctionActions();
  const sortedEvents = events.sort(byTimestamp); // DEAL , [...DENT] , KICK ->

  const { bid: latestBid, lot: latestLot } = sortedEvents.find(
    event => event.type != 'Deal'
  );
  const hasAuctionCompleted = sortedEvents[0].type === 'Deal';
  const hasDent = sortedEvents[0].type === 'Dent';

  const handleTendCTA = value => {
    console.log('value', value);
    callFlopDent(auctionId, value, latestBid);
  };

  /**
   * disabled when:
   * - allowances & hopes not set
   * - 'deal' has been called (if deal event exists for auctionId)
   * - 'end' has passed
   * - MKR 'bid' is gt DAI 'lot' size
   * - MKR 'bid' is gte the current 'bid' (must be smaller by a certain % [3?])
   * - when the latest bid duration (ttl) has passed
   * - OR when the auction duration (tau) has passed.
   */
  // const bidDisabled = state.error;
  const bidDisabledTests = [
    // [() => !web3Connected],
    [
      val => {
        const _val = new BigNumber(val);
        const max = new BigNumber(latestLot);
        console.log(_val, max, _val.gt(max));
        return _val.gte(max);
      },
      'Bid too high'
    ]
  ];

  return (
    <AuctionBlockLayout
      auctionStatus={hasAuctionCompleted ? 'completed' : 'inprogress'}
      auctionId={auctionId}
      hasDent={hasDent}
      end={end}
      tic={tic}
      actions={
        <ActionTabs
          actions={[
            [
              'Instant Bid',
              <MiniFormLayout
                text={'Bid for the next minimum increment'}
                buttonOnly
                onSubmit={handleTendCTA}
                small={'Price 1 MKR = 300 DAI'}
                actionText={'Bid Now'}
              />
            ],
            [
              'Custom Bid',
              <MiniFormLayout
                text={'Enter your bid in MKR for this Auction'}
                inputUnit="MKR"
                onSubmit={handleTendCTA}
                small={'Price 1 MKR = 300 DAI'}
                inputValidation={bidDisabledTests}
                actionText={'Bid Now'}
              />
            ]
          ]}
        />
      }
      auctionEvents={events.map(
        ({ type, ilk, lot, bid, timestamp, hash, fromAddress, price }, index) => {
          const eventBid = type === 'Deal' ? latestBid : bid;
          const eventLot = type === 'Deal' ? latestLot : lot;

          const currentBid = new BigNumber(eventLot).eq(new BigNumber(0))
            ? new BigNumber(eventLot)
            : new BigNumber(eventBid).div(new BigNumber(eventLot));

          return (
            <AuctionEvent
              key={`${timestamp}-${index}`}
              type={type}
              ilk={ilk}
              tx={hash}
              price={price}
              sender={fromAddress}
              lot={new BigNumber(eventLot).toFormat(4, 6)}
              bid={`${new BigNumber(eventBid).toFormat(2, 4)} DAI`}
              currentBid={`${currentBid.toFormat(2, 4)} MKR/DAI`}
              timestamp={
                <Text title={new Date(timestamp)}>
                  <Moment fromNow ago>
                    {timestamp}
                  </Moment>{' '}
                  ago
                </Text>
              }
            />
          );
        }
      )}
    />
  );
};
