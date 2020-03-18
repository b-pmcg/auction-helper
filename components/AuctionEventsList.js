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
  Label,
  Input,
  Flex
} from 'theme-ui';

export const AuctionEventsList = ({ events }) => {
  const [shouldSeeAllEvents, toggleEventsList] = useState(false);

  const visibleAuctionEvents = shouldSeeAllEvents ? events : [events[0]];

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <Grid gap={2} >{visibleAuctionEvents}</Grid>
      {events.length > 1 && (
        <Button
          variant="textual"
          sx={{ textAlign: 'right', alignSelf: 'flex-end', pr: 0, position: 'absolute', top: '100%' }}
          onClick={() => {
            toggleEventsList(!shouldSeeAllEvents);
          }}
        >
          {shouldSeeAllEvents ? 'Hide' : 'See'} all other events (
          {events.length - 1})
        </Button>
      )}
    </Flex>
  );
};

export default AuctionEventsList;
