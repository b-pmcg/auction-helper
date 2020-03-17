/** @jsx jsx */

import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Heading,

  jsx,

  Grid,
  Box,

  Flex
} from 'theme-ui';

import EventsList from './AuctionEventsList';

export default ({ auctionId, end, tic, auctionStatus, auctionEvents, actions, hasDent}) => {
  
  const [timer, setTimer] = useState([]);

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

      if (distance < 0) {
        clearInterval(timerId);
      }
    }, 1000);

    return () => {
      console.log('Called with:', timerId);

      clearInterval(timerId);
    };
  }, [end, tic]);

  return (
    <Grid
      gap={5}
      sx={{
        bg: '#fff',
        p: 6,
        borderRadius: 5,
        border: '1px solid',
        borderColor: 'border'
      }}
    >
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          justifyContent: 'space-between'
        }}
      >
        <Heading as="h5" variant="h2">
          Auction ID: {auctionId}
        </Heading>
        <Heading
          as="h5"
          variant="h2"
          sx={{
            pt: [2, 0],
            fontSize: 4,
            color: auctionStatus === 'completed' ? 'primaryHover' : 'text'
          }}
        >
          {auctionStatus === 'completed'
            ? 'Auction Completed'
            : `Time remaining: ${timer}`}
        </Heading>
      </Flex>
      <Box>
        <EventsList
          events={auctionEvents}
        />
      </Box>
      {actions}
    </Grid>
  );
};
