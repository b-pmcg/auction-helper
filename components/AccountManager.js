/** @jsx jsx */

import React from 'react';
import { Heading, Text, jsx, Box, Button, Grid, Styled, Input, Flex } from 'theme-ui'

export default ({ web3Ready }) => {
  return <Box sx={{
    textAlign: 'center',
    mx: 'auto',
    maxWidth: '500px'
  }}>

    <Text sx={{
      mb: 2,
      fontWeight: 'bold'
    }}>
    If you would like to participate in auctions you need to sign these 3 approval transactions
    </Text>
    
    <Grid>
      <Button>Unlock Dai in your wallet</Button>
      <Button>Unlock Dai in the adaptor</Button>
      <Button>Unlock Dai in the VAT</Button>
      </Grid>
     </Box>;
};
