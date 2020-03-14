/** @jsx jsx */

import React from 'react';
import { Heading, Text, jsx, Button, Grid, Box, Styled, Input, Flex } from 'theme-ui'

const thStyle = {
  width: 'calc(100% / 5 )',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 'bold',
  color: '#48495F',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = {
  width: 'calc(100% / 5 )',
  textAlign: 'left',
  fontSize: '15px',
  color: '#231536'
};

const trStyle = {
  width: '100%',
  height: '48px',
  borderBottom: '1px solid #D8E0E3'
};

const AuctionId = ({ id }) => (
  <span
    style={{
      fontSize: '20px',
      color: '#231536',
      letterSpacing: '.3px'
    }}
  >
    Auction ID: {id}
  </span>
);

const Bidform = props => {
  const [amount, setAmount] = useState(undefined);
  const { auctionId, lot, onClick } = props;

  const bid = () => {
    onClick(auctionId, lot, amount);
  };

  return (
    <div style={{ display: 'flex' }}>
      <input
        type="text"
        placeholder="Bid Amount"
        onChange={event => {
          const inputValue = event.target.value;

          if (inputValue === '') {
            setAmount(undefined);
          }

          setAmount(inputValue);
        }}
        style={{
          border: '1px solid #546978',
          boxSizing: 'border-box',
          height: '48px',
          borderRadius: '4px',
          marginRight: '10px',
          padding: '16px',
          color: '#231536'
        }}
      />
      <Button disabled={!amount || !lot || !auctionId} onClick={bid}>
        Bid
      </Button>
    </div>
  );
};



const AuctionEvent = () => {
  const fields = [
    ['Event Type', 'Dent'],
    ['Lot Size', 'x'],
    ['Current Bid Price', 'x'],
    ['Bid Value', 'x'],
    ['Timestamp', 'x'],
    ['Transaction', 'x'],
    ['Sender', 'x'],
  ]
  return (
    <Grid   gap={2}
    columns={[ 7 ]} sx={{
      bg: 'background',
      p: 3,
    }}>
      {fields.map(([title, value]) => {
        return (
          <Box>
            <Text variant="caps" sx={{
              fontSize: '10px',
              mb: 1
            }}>{title}</Text>
            <Text sx={{
              fontSize: 1
            }}>{value}</Text>
          </Box>
        )
      })}
    </Grid>
  )
}
 export default ({}) => {
  return (
    <Grid sx={{
      bg: '#fff',
      p: 3,
      borderRadius: 5

    }
    }>
      <Flex>
        <Heading as="h5">Auction ID: 22</Heading>
        <Heading as="h5" sx={{
          ml: 'auto'
        }}>1h 20m 20s</Heading>
      </Flex>
      <Box>
        <AuctionEvent />
      </Box>
      <Grid gap={2}>
        <Text>Enter your bid in MKR for this Auction</Text>
        <Flex>
          <Input sx={{
        maxWidth: 100
      }}></Input>
          <Button sx={{ml: 2}}>Bid Now</Button>
        </Flex>
        <Text variant="small">info / error msgg</Text>
      </Grid>
    </Grid>
  )
}

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
