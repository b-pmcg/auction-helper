/** @jsx jsx */

import React from 'react';
import {
  Heading,
  Text,
  jsx,
  Button,
  Grid,
  Box,
  Styled,
  Input,
  Flex
} from 'theme-ui';

const AuctionEvent = () => {
  const fields = [
    ['Event Type', 'Dent'],
    ['Lot Size', 'x'],
    ['Current Bid Price', 'x'],
    ['Bid Value', 'x'],
    ['Timestamp', 'x'],
    ['Transaction', 'x'],
    ['Sender', 'x']
  ];
  return (
    <Grid
      gap={2}
      columns={[7]}
      sx={{
        bg: 'background',
        p: 5,
        borderRadius: 5
      }}
    >
      {fields.map(([title, value]) => {
        return (
          <Box>
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
                fontSize: 1
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
export default ({web3Connected}) => {
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
      <Flex>
        <Heading as="h5" variant="h2">
          Auction ID: 22
        </Heading>
        <Heading
          as="h5"
          variant="h2"
          sx={{
            ml: 'auto'
          }}
        >
          Time remaining: 1h 20m 20s
        </Heading>
      </Flex>
      <Box>
        <AuctionEvent />
      </Box>
      <Grid gap={2}>
        <Text variant="boldBody">Enter your bid in MKR for this Auction</Text>
        <Flex>
          <Input
            sx={{
              maxWidth: 100,
              borderColor: 'border'
            }}
          ></Input>
          <Button sx={{ ml: 2 }} disabled={!web3Connected}>Bid Now</Button>
        </Flex>
        <Text variant="small">info / error msgg</Text>
      </Grid>
    </Grid>
  );
};


