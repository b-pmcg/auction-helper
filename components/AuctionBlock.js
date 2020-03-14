/** @jsx jsx */

import React from 'react';
import { Heading, Text, jsx, Button, Styled, Input, Flex } from 'theme-ui'

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

export default ({ auctionId, lot }) => {
  return (
    <Flex key={auctionId}>
      <Flex>
        <AuctionId id={auctionId} />
        <Bidform auctionId={auctionId} lot={lot} onClick={callTend} />
      </Flex>
      <Flex>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={trStyle}>
              <th style={thStyle}>Event Type:</th>
              <th style={thStyle}>Lot Size:</th>
              <th style={thStyle}>Current Bid Price:</th>
              <th style={thStyle}>Bid Value:</th>
              <th style={thStyle}>Timestamp:</th>
            </tr>
          </thead>
          <tbody>
            {auctions[auctionId].map(event => {
              return (
                <tr key={`${auctionId}-${event.id}`} style={trStyle}>
                  <td style={tdStyle}>{event.type}</td>
                  <td style={tdStyle}>
                    {new BigNumber(getValueOrDefault(event.lot)).toFormat(5, 4)}{' '}
                    ETH
                  </td>
                  <td style={tdStyle}>
                    {new BigNumber(getValueOrDefault(event.bid))
                      .div(new BigNumber(getValueOrDefault(event.lot)))
                      .toFormat(5, 4)}{' '}
                    DAI
                  </td>
                  <td style={tdStyle}>
                    {new BigNumber(getValueOrDefault(event.bid)).toFormat(5, 4)}{' '}
                    DAI
                  </td>
                  <td style={tdStyle} title={event.timestamp}>
                    {new Date(event.timestamp).toDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Flex>
    </Flex>
  );
};
