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
  pill
}) => {
  const [timer, setTimer] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const auctionStatusHeadings = {
    [COMPLETED]: 'Auction Completed',
    [IN_PROGRESS]: `Time remaining: ${timer}`,
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

  const latestPrice = latestLot.eq(ZERO)
  ? latestLot
  : latestBid.div(latestLot);

  const onCollapseData = [
    {label:'Bid', value: latestBid.toFormat(2,4), notation: 'DAI',} ,
    {label:'Lot', value: latestLot.toFormat(4,6), notation: 'MKR', styling: { color: 'primary' }},
    {label:'Price', value: latestPrice.toFormat(2,4), notation: 'MKR/DAI', styling:{ fontWeight: 600 } }
  ]

  useEffect(() => {
    // if there is no Dent first will be Kick
    // If there is Deal first will be Deal
    // If first is Dent it's an ongoing auction

    var countDownDate = new Date((hasDent ? tic : end).toNumber()).getTime();

    var timerId = setInterval(function() {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer(days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ');

      if (distance <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => {
      console.log('Called with:', timerId);

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
          justifyContent: 'space-between',
          borderBottom: collapsed ? null : '1px solid',
          borderColor: 'border',
          alignItems: 'center'
        }}
      >
        <Heading as="h5" variant="h2" sx={{ flex: '1 0 0 ',}}>
          Auction ID: {auctionId}
        </Heading>
        <Flex
          sx={{
            margin: 'auto',
            alignItems: 'center',
          }}        
        >
          {!pill ? null : <Box ml="4">{pill}</Box>}
          {
            collapsed &&
            <Flex sx={{
              flex: '2 0 0 ',
              flexDirection: ['column', 'row'],
            }}> {onCollapseData.map(
              data => {
                return (
                  <Heading
                    key={`${auctionId}-${data.label}`}
                    as="h5"
                    variant="h2"
                    sx={{
                      fontSize: 4,
                      ml: [0, 'auto'],
                      mr: [0, 20]
                    }}
                  >
                    <Flex sx={{
                        alignItems:'baseline',
                        justifyContent: 'center'
                      }}>
                      <Text variant="caps" sx={{
                        fontSize: 1,
                        mr: 2
                      }}>
                        {data.label}
                      </Text>  
                      <Text sx={data.styling}>{data.value} {data.notation}</Text>
                    </Flex>
                  </Heading>
                )
              })
            }
            </Flex>
          }
        </Flex>
        <Heading
          as="h5"
          variant="h2"
          sx={{
            pt: [2, 0],
            flex: '1 1 0',
            fontSize: 4,
            ml: collapsed ? 0 : [0, 'auto'],
            color: auctionStatusColors[auctionStatus]
          }}
        >
          {auctionStatusHeadings[auctionStatus]}
        </Heading>
        <Box
          sx={{
            ml: 4
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
            <Box pt="6">{actions}</Box>
          </Box>
        </>
      )}
    </Box>
  );
};
