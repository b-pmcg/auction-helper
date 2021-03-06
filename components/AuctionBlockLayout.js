/** @jsx jsx */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Heading, jsx, Grid, Box, Flex, Text } from 'theme-ui';

import EventsList from './AuctionEventsList';
import CollapseToggle from './CollapseToggle';

import {
  IN_PROGRESS,
  COMPLETED,
  CAN_BE_DEALT,
  CAN_BE_RESTARTED,
  ZERO
} from '../constants';

export default ({
  latestEvent,
  auctionId,
  end,
  tic,
  auctionStatus,
  auctionEvents,
  actions,
  forceExpanded,
  hasDent,
  pill,
  orderSummary
}) => {
  const [timer, setTimer] = useState({
    end: undefined,
    tic: undefined
  });
  const [collapsed, setCollapsed] = useState(false);
  const auctionStatusHeadings = {
    [COMPLETED]: 'Auction completed',
    [IN_PROGRESS]: (
      <Box>
        {timer.tic && <Text variant={'styles.time.major'}>{timer.tic}</Text>}
        <Text variant={timer.tic ? 'styles.time.minor' : 'styles.time.major'}>
          {timer.end}
        </Text>
      </Box>
    ),
    [CAN_BE_DEALT]: 'Auction Can Be Dealt',
    [CAN_BE_RESTARTED]: 'Auction Can Be Restarted'
  };

  const auctionStatusColors = {
    [COMPLETED]: 'primaryHover',
    [IN_PROGRESS]: 'text',
    [CAN_BE_DEALT]: 'text',
    [CAN_BE_RESTARTED]: 'text'
  };
  const { lot: latestLot, bid: latestBid } = latestEvent;

  const latestPrice = latestLot.eq(ZERO) ? latestLot : latestBid.div(latestLot);

  const onCollapseData = [
    { label: 'Bid', value: latestBid.toFormat(2, 4), notation: 'DAI' },
    {
      label: 'Lot',
      value: latestLot.toFormat(4, 6),
      notation: 'MKR',
      styling: { color: 'primary' }
    },
    {
      label: 'Price',
      value: latestPrice.toFormat(2, 4),
      notation: 'MKR/DAI',
      styling: { fontWeight: 600 }
    }
  ];

  const parseRemainingTime = time => {
    var days = Math.floor(time / (1000 * 60 * 60 * 24));
    var hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const formatRemainingTime = time => {
    const { days, hours, minutes } = time;
    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    // if there is no Dent first will be Kic
    // If there is Deal first will be Deal
    // If first is Dent it's an ongoing auction

    var countDownDate = new Date((hasDent ? tic : end).toNumber()).getTime();
    var overallDownDate = new Date(end.toNumber()).getTime();

    var timerId = setInterval(function() {
      var now = new Date().getTime();
      const distance = hasDent ? countDownDate - now : overallDownDate - now;

      setTimer({
        end: formatRemainingTime(parseRemainingTime(overallDownDate - now)),
        tic: hasDent
          ? formatRemainingTime(parseRemainingTime(distance))
          : undefined
      });

      if (distance <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [end, tic]);

  return (
    <Box
      gap={5}
      sx={{
        variant: 'styles.roundedCard',
        p: 0
      }}
    >
      <Flex
        sx={{
          p: 6,
          py: 5,
          flexDirection: ['column', 'row'],
          justifyContent: 'flex-start',
          borderBottom: collapsed ? null : '1px solid',
          borderColor: 'border',
          alignItems: ['flex-start', 'center']
        }}
      >
        <Heading as="h5" variant="h2">
          Auction ID: {auctionId}
        </Heading>
        <Flex
          sx={{
            // margin: 'auto',
            // alignItems: 'center',
            mt: [2, 0],
            position: 'relative'
          }}
        >
          {!pill ? null : <Box ml={[0, 4]}>{pill}</Box>}
          {collapsed && auctionStatus === IN_PROGRESS && (
            <Flex
              sx={{
                // flex: '2 1 0',
                // ml: '4',
                flexDirection: ['column', 'row']
              }}
            >
              {' '}
              {onCollapseData.map(data => {
                return (
                  <Heading
                    key={`${auctionId}-${data.label}`}
                    as="h5"
                    variant="boldBody"
                    sx={{
                      // fontSize: 4,
                      ml: [0, '6'],
                      mb: [2, 0],

                      // mr: [0, 20],
                      ...data.styling
                    }}
                  >
                    {data.value} {data.notation}
                  </Heading>
                );
              })}
            </Flex>
          )}
        </Flex>
        <Heading
          as="h5"
          variant="boldBody"
          sx={{
            pt: [2, 0],
            flex: '1 1 0',
            textAlign: ['left', 'right'],
            // fontSize: 4,
            ml: collapsed ? 0 : [0, 'auto'],
            color: auctionStatusColors[auctionStatus]
          }}
        >
          {auctionStatusHeadings[auctionStatus]}
        </Heading>
        <Box
          sx={{
            ml: [0, 4],
            position: ['absolute', 'relative'],
            right: [0, null],
            mr: [7, 0]
          }}
        >
          <CollapseToggle
            onClick={() => (forceExpanded ? null : setCollapsed(!collapsed))}
            active={!collapsed}
          />
        </Box>
      </Flex>
      {collapsed ? null : (
        <>
          <Box p="6">
            <EventsList events={auctionEvents} />
            {auctionStatus === COMPLETED ? (
              <Box variant="styles.statusBox.warning">
                {' '}
                {auctionStatusHeadings[COMPLETED]}.{' '}
              </Box>
            ) : (
              <Grid columns={1}>
                <Box pt={['7', '6']}>{actions}</Box>
                {/* <Box pt="6">{orderSummary}</Box> */}
              </Grid>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
