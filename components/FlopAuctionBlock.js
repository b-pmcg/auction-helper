/** @jsx jsx */

import React, { useState, useEffect } from 'react';
import useMaker from '../hooks/useMaker';
import { Text, jsx, Grid, Box } from 'theme-ui';
import BigNumber from 'bignumber.js';
import Moment from 'react-moment';
import { etherscanLink } from '../utils';
import MiniFormLayout from './MiniFormLayout';
import useAuctionActions from '../hooks/useAuctionActions';
import useBalances from '../hooks/useBalances';
import ActionTabs from './ActionTabs';
import AuctionBlockLayout from './AuctionBlockLayout';
import {
  IN_PROGRESS,
  COMPLETED,
  CAN_BE_DEALT,
  CAN_BE_RESTARTED
} from '../constants';
import useAuctionsStore, { selectors } from '../stores/auctionsStore';
import InfoPill from './InfoPill';

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
  const { maker, network } = useMaker();

  const fields = [
    ['Event Type', type],
    ['Bid Value', bid],
    ['Lot Size', `${lot} MKR`, { color: 'primary' }],
    ['Current Bid Price', currentBid, { fontWeight: 600 }],
    // ['Price', price],
    ['Timestamp', timestamp],

    [
      'Sender',
      <a href={etherscanLink(sender, network)} target="_blank">
        {' '}
        {sender.slice(0, 7) + '...' + sender.slice(-4)}
      </a>,
      {
        fontWeight: maker.currentAddress() === sender ? 500 : 400
      }
    ],
    [
      'Tx',
      <a href={etherscanLink(tx, network)} target="_blank">
        {' '}
        {tx.slice(0, 7) + '...' + tx.slice(-4)}
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
const OrderSummary = ({
  currentBid,
  minMkrAsk,
  calculatedBidPrice,
  remainingBal
}) => {
  const fields = [
    ['Max bid amount', minMkrAsk, { fontWeight: 600 }],
    ['Current bid amount', currentBid, { fontWeight: 600 }],
    ['VAT balance after bid', calculatedBidPrice, { fontWeight: 600 }]
  ];

  const SummaryLine = ({ title, value, styling }) => (
    <Grid
      columns={2}
      sx={{
        justifyContent: 'space-between'
      }}
    >
      <Text
        sx={{
          fontSize: 1
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
    </Grid>
  );

  return (
    <Grid gap={2}>
      <Text
        variant="caps"
        sx={{
          fontSize: '13px'
        }}
      >
        {'Order Summary'}
      </Text>
      <Grid
        width={'500px'}
        gap={2}
        rows={[2, 4, 7]}
        sx={{
          bg: 'background',
          p: 5,
          borderRadius: 5
        }}
      >
        {fields.map(([title, value, styling]) => {
          return <SummaryLine title={title} value={value} styling={styling} />;
        })}
      </Grid>
      <Grid
        gap={2}
        rows={[2, 4, 7]}
        sx={{
          bg: 'background',
          p: 5,
          borderRadius: 5
        }}
      >
        <SummaryLine
          title={'Balance Remaining'}
          value={remainingBal}
          styling={{ fontWeight: 600 }}
        />
      </Grid>
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

export default ({ events, id: auctionId, end, tic, stepSize, allowances }) => {
  const { maker } = useMaker();
  const [calculatedBidPrice, setCalculatedBidPrice] = useState(BigNumber(0));
  const { hasDaiAllowance, hasFlopHope, hasJoinDaiHope } = allowances;
  let { vatDaiBalance } = useBalances();
  const { callFlopDent, callFlopDeal } = useAuctionActions();
  const fetchAuctionsSet = useAuctionsStore(state => state.fetchSet);
  const sortedEvents = events.sort(byTimestamp); // DEAL , [...DENT] , KICK ->
  const chickenDinner =
    sortedEvents[0].type !== 'Kick' &&
    maker.currentAddress() === sortedEvents[0].fromAddress;

  const { bid: latestBid, lot: latestLot } = sortedEvents.find(
    event => event.type != 'Deal'
  );

  const BNwad = BigNumber.clone({
    DECIMAL_PLACES: 18,
    ROUNDING_MODE: BigNumber.ROUND_DOWN
  });
  const minMkrAsk = new BNwad(latestLot).div(stepSize);

  const hasDent = sortedEvents[0].type === 'Dent';

  const now = new Date().getTime();
  let auctionStatus = IN_PROGRESS;
  // if the auction has been dealt, it must be over
  if (sortedEvents[0].type === 'Deal') {
    auctionStatus = COMPLETED;
    // if `tic` is greater than 0, then a bid has been submitted. in this case...
    //  1. if the current time is later than `end`, the auction has finished, it just hasn't been dealt yet
    //  2. if `tic` is less than the current time, the auction can also be dealt
  } else if (tic.gt(0) && (new BigNumber(now).gt(end) || tic.lt(now))) {
    auctionStatus = CAN_BE_DEALT;
    // if a bid has NOT been submitted and the current time is later than `end`, the auction can be restarted (w a higher mkr price)
  } else if (tic.eq(0) && new BigNumber(now).gt(end)) {
    auctionStatus = CAN_BE_RESTARTED;
  }

  const handleTendCTA = value => {
    return callFlopDent(auctionId, value, latestBid);
  };

  const handleInstantBid = () => {
    return callFlopDent(auctionId, minMkrAsk, latestBid);
  };

  useEffect(() => {
    const timerID = setTimeout(async () => {
      const newEvents = await maker
        .service('validator')
        .fetchFlopAuctionsByIds([auctionId]);
    }, 1000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  // const bidDisabled = state.error;
  const mainValidation = [];

  const canBid = hasDaiAllowance && hasJoinDaiHope && hasFlopHope;

  const bidValidationTests = [
    // [() => !web3Connected],
    [
      val => {
        return minMkrAsk.lt(val);
      },
      `Must ask for at least ${new BigNumber(stepSize)
        .minus(1)
        .multipliedBy(100)
        .toString()}% less MKR than the current lot`
    ],
    [
      () => {
        return new BigNumber(latestBid).gt(vatDaiBalance);
      },
      `Must have at least ${new BigNumber(latestBid).toFixed(
        2
      )} DAI in the Vat to bid`
    ]
  ];

  const calculateBidPrice = inputState => {
    if (!inputState || inputState.eq(0) || inputState.isNaN()) {
      const bidPrice = BigNumber(latestBid)
        .div(minMkrAsk)
        .toFixed(2);
      setCalculatedBidPrice(bidPrice);
    } else {
      const bidPrice = BigNumber(latestBid)
        .div(inputState)
        .toFixed(2);
      setCalculatedBidPrice(bidPrice);
    }
  };

  return (
    <AuctionBlockLayout
      latestEvent={{
        bid: new BigNumber(latestBid),
        lot: new BigNumber(latestLot)
      }}
      auctionStatus={auctionStatus}
      auctionId={auctionId}
      pill={
        !chickenDinner ? null : (
          <InfoPill bg="yellow" color="orange">
            Current Winning Bidder
          </InfoPill>
        )
      }
      hasDent={hasDent}
      end={end}
      tic={tic}
      actions={
        <ActionTabs
          actions={[
            [
              'Instant Bid',
              <MiniFormLayout
                disabled={auctionStatus !== IN_PROGRESS || !canBid}
                text={'Bid for the next minimum increment'}
                buttonOnly
                onSubmit={handleInstantBid}
                onTxFinished={() => fetchAuctionsSet([auctionId])}
                small={calculateBidPrice}
                actionText={'Bid Now'}
              />
            ],
            [
              'Custom Bid',
              <MiniFormLayout
                disabled={auctionStatus !== IN_PROGRESS || !canBid}
                text={'Enter the amount of MKR requested for this auction'}
                inputUnit="MKR"
                onSubmit={handleTendCTA}
                onTxFinished={() => fetchAuctionsSet([auctionId])}
                small={calculateBidPrice}
                inputValidation={bidValidationTests}
                actionText={'Bid Now'}
              />
            ],
            auctionStatus === CAN_BE_DEALT && [
              'Deal Auction',
              <MiniFormLayout
                disabled={auctionStatus !== CAN_BE_DEALT}
                text={'Call deal to end auction and mint MKR'}
                buttonOnly
                onTxFinished={() => fetchAuctionsSet([auctionId])}
                onSubmit={() => callFlopDeal(auctionId)}
                small={''}
                actionText={'Call deal'}
              />
            ]
          ]}
        />
      }
      auctionEvents={events.map(
        (
          { type, ilk, lot, bid, timestamp, hash, fromAddress, price },
          index
        ) => {
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
                <Text>
                  <Moment format="HH:mm, DD MMM" withTitle>
                    {timestamp}
                  </Moment>
                </Text>
              }
            />
          );
        }
      )}
      orderSummary={
        <OrderSummary
          key={`${latestLot}-${vatDaiBalance}`}
          remainingBal={
            vatDaiBalance &&
            `${BigNumber(vatDaiBalance)
              .minus(BigNumber(latestBid))
              .toFormat(0, 4)} DAI`
          }
          currentBid={`${new BigNumber(latestLot).toFixed(2, 1)} MKR`}
          minMkrAsk={`${minMkrAsk.toFixed(2, 1)} MKR`}
          calculatedBidPrice={`${calculatedBidPrice} MKR/DAI`}
        />
      }
    />
  );
};
