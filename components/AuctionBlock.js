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
export default ({}) => {
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
          <Button sx={{ ml: 2 }}>Bid Now</Button>
        </Flex>
        <Text variant="small">info / error msgg</Text>
      </Grid>
    </Grid>
  );
};

// export default ({ auctionId, lot }) => {
//   return (
//     <Flex key={auctionId}>
//       <Flex>
//         <AuctionId id={auctionId} />
//         <Bidform auctionId={auctionId} lot={lot} onClick={callTend} />
//       </Flex>
//       <Flex>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={trStyle}>
//               <th style={thStyle}>Event Type:</th>
//               <th style={thStyle}>Lot Size:</th>
//               <th style={thStyle}>Current Bid Price:</th>
//               <th style={thStyle}>Bid Value:</th>
//               <th style={thStyle}>Timestamp:</th>
//             </tr>
//           </thead>
//           <tbody>
//             {auctions[auctionId].map(event => {
//               return (
//                 <tr key={`${auctionId}-${event.id}`} style={trStyle}>
//                   <td style={tdStyle}>{event.type}</td>
//                   <td style={tdStyle}>
//                     {new BigNumber(getValueOrDefault(event.lot)).toFormat(5, 4)}{' '}
//                     ETH
//                   </td>
//                   <td style={tdStyle}>
//                     {new BigNumber(getValueOrDefault(event.bid))
//                       .div(new BigNumber(getValueOrDefault(event.lot)))
//                       .toFormat(5, 4)}{' '}
//                     DAI
//                   </td>
//                   <td style={tdStyle}>
//                     {new BigNumber(getValueOrDefault(event.bid)).toFormat(5, 4)}{' '}
//                     DAI
//                   </td>
//                   <td style={tdStyle} title={event.timestamp}>
//                     {new Date(event.timestamp).toDateString()}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </Flex>
//     </Flex>
//   );
// };
