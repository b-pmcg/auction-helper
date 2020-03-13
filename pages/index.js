import React, { useState } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import * as _ from 'lodash';
import { Text, Grid, Input, Flex } from "@makerdao/ui-components-core";
import BigNumber from "bignumber.js";
import styled, { withTheme } from "styled-components";

const Button = styled.button`
  display: inline-flex;
  height: 48px;
  width: 130px;
  padding: 12px;
  font-size: 16px;
  line-height: 24px;
  justify-content: center;
  border: 1px solid #1AAB9B;
  align-items: center;
  background: #1AAB9B;
  border-radius: 4px;
  color: white;

  &:hover:not(:disabled) {
    border: 1px solid #139d8d;
    background: #139d8d;
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointerEvents: none;
  }
`;

const Panel = styled.section`
  flex-direction: column;
  display: flex;
  border: 1px solid #D8E0E3;
  box-sizing: border-box;
  border-radius: 6px;
  width: 100%;
  max-width: 1140px;
  background: white;
  margin:auto;
  margin-bottom: 22px;
`;

const PanelHeader = styled.header`
  display: flex;
  padding: 24px 18px 24px 36px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #D8E0E3;
`;

const PanelBody = styled.div`
  display: flex;
  flexWrap: wrap;
  padding: 36px 28px;
`;

const thStyle = {
  width: 'calc(100% / 5 )',
  textAlign:'left',
  fontSize:'11px',
  fontWeight: 'bold',
  color: '#48495F',
  textTransform:'uppercase',
  letterSpacing:'0.05em',
};

const tdStyle = {
  width: 'calc(100% / 5 )',
  textAlign:'left',
  fontSize:'15px',
  color: '#231536',
}

const trStyle = {
  width: '100%',
  height: '48px',
  borderBottom: '1px solid #D8E0E3'
}

const AuctionId = ({id}) => <span style={{
  fontSize: '20px',
  color: '#231536',
  letterSpacing: '.3px',
}}>
  Auction ID: {id}
</span>;

function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Bidform = props => {
  const [amount, setAmount] = useState(undefined);
  const { auctionId, lot, onClick } = props;

  const bid = () => {
    onClick(auctionId, lot, amount);
  };

  return (
    <div style={{display: 'flex'}}>
      <input  type="text"
              placeholder="Bid Amount"
              onChange={
              event => {
                const inputValue = event.target.value;

                if(inputValue === '') {
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
                  color: '#231536',
              }}
      />
      <Button disabled={!amount || !lot || !auctionId}
              onClick={bid}
      >
                Bid
      </Button>
    </div>
  )
}

const Index = () => {
  const { maker } = useMaker();
  const [daiBalance, setDaiBalance] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(false);
  const [auctions, setAuctions] = useState([]);

  const [joinBalance, setJoinBalance] = useState(null);

  async function connectBrowserWallet() {
    try {
      if (maker) {
        await maker.authenticate();
        setWeb3Connected(true);
        const daiBalance = await maker
          .getToken('MDAI')
          .balanceOf(maker.currentAddress());

        const vatBalance = await maker
          .service('smartContract')
          .getContract('MCD_VAT')
          .dai(maker.currentAddress());

        setDaiBalance(daiBalance);
        setJoinBalance(fromRad(vatBalance).toFixed());
      }
    } catch (err) {
      window.alert(err);
    }
  }
  const [auctionId, setAuctionId] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  async function callTend(auctionId, lotSize, bidAmount) {
    try {
      const t = await maker
        .service('validator')
        .tend(auctionId, lotSize, bidAmount);
    } catch (err) {
      window.alert(err);
    }
  }

  // seth send “$MCD_VAT” ‘hope(address)’ "$MCD_FLIP_ETH"
  async function hope(address) {
    await maker
      .service('smartContract')
      .getContract('MCD_VAT')
      .hope(address);
  }

  function handleAuctionIdInputChange({ target }) {
    console.log('auctionid', target.value);
    setAuctionId(target.value);
  }
  function handleLotSizeInputChange({ target }) {
    console.log('lotSize', target.value);
    setLotSize(target.value);
  }
  function handleBidAmountInputChange({ target }) {
    console.log('bidAmount', target.value);
    setBidAmount(target.value);
  }

  const [joinAmount, setJoinAmount] = useState('');
  const [exitAmount, setExitAmount] = useState('');

  async function joinDaiToAdapter() {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    const joinAmountInDai = maker.service('web3')._web3.utils.toWei(joinAmount);

    await maker.getToken('MDAI').approveUnlimited(DaiJoinAdapter.address);

    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toString()
    );
  }

  async function exit() {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    const exitAmountInDai = maker.service('web3')._web3.utils.toWei(exitAmount);

    await DaiJoinAdapter.exit(
      maker.currentAddress(),
      BigNumber(exitAmountInDai).toString()
    );
  }

  async function fetchAuctions() {
    const auctions = await maker.service('validator').getAllAuctions();
    setAuctions(_.groupBy(auctions, auction => auction.auctionId));
  }

  const getValueOrDefault = (value, def = '-') => {
    return value ? value : def;
  };

  const autoConnect = async () => {
    if(!web3Connected) {
      connectBrowserWallet();
    } else if(auctions.length === 0) {
      fetchAuctions();
    }
  }
  
  autoConnect();

  return (
    
    <div className="wrap">
      <Head>
        <title>Auction Helper (Beta)</title>
      </Head>
      <h1>Auction Helper (Beta)</h1>
      {!maker ? (
        <div>
          <h3>Loading...</h3>
        </div>
      ) : !web3Connected ? (
        <button onClick={connectBrowserWallet}>Connect Wallet</button>
      ) : (
        <div>
          <h3>Connected Account</h3>
          <p>{maker.currentAddress()}</p>
          <div>
            {daiBalance ? (
              <p>{daiBalance.toNumber()} DAI in your wallet</p>
            ) : (
              <p>Loading your DAI balance...</p>
            )}
          </div>
          <div>
            {joinBalance ? (
              <p>{joinBalance} DAI in the adapter</p>
            ) : (
              <p>Loading your adapter balance...</p>
            )}
          </div>
          <Input
            type="number"
            min="0"
            onChange={handleAuctionIdInputChange}
            placeholder={'Auction ID'}
          />
          <Input
            type="number"
            min="0"
            onChange={handleLotSizeInputChange}
            placeholder={'Lot Size'}
          />
          <Input
            type="number"
            min="0"
            onChange={handleBidAmountInputChange}
            placeholder={'Bid Amount'}
          />
          <button onClick={() => callTend(auctionId, lotSize, bidAmount)}>
            Call Tend
          </button>
          <Input
            type="number"
            min="0"
            value={joinAmount}
            placeholder={'0.00 DAI'}
            onChange={e => setJoinAmount(e.target.value)}
          />
          <br />
          <button onClick={() => joinDaiToAdapter()}>Send To Adapter</button>

          <Input
            type="number"
            min="0"
            value={exitAmount}
            placeholder={'0.00 DAI'}
            onChange={e => setExitAmount(e.target.value)}
          />
          <br />
          <button onClick={() => exit()}>Exit from Adapter</button>

          <br />
          <br />
          <h3>Hope</h3>
          <br />
          <br />
          <button
            onClick={() =>
              hope(
                maker.service('smartContract').getContract('MCD_FLIP_ETH_A')
                  .address
              )
            }
          >
            ETH_A_FLIP
          </button>

          <br />
          <br />
          <button
            onClick={() =>
              hope(
                maker.service('smartContract').getContract('MCD_JOIN_DAI')
                  .address
              )
            }
          >
            DAI_JOIN
          </button>
          <br />
          <br />
          <button onClick={fetchAuctions}>List Auctions</button>
          
            { !auctions && <span> Loading Auctions...</span >}
            { auctions && Object.keys(auctions).reverse().map(
              auctionId => {
                const kickEvent = auctions[auctionId].find(event=>event.type === 'Kick');
                const firstTend = auctions[auctionId].find(event=>event.type === 'Tend');
                let lot = kickEvent ? kickEvent.lot : firstTend.lot;
                return <Panel key={auctionId}>
                  <PanelHeader>
                    <AuctionId id={auctionId}/>
                    <Bidform auctionId={auctionId} lot={lot} onClick={callTend}/>
                  </PanelHeader>
                  <PanelBody>
                    <table style={{width: '100%',  borderCollapse: 'collapse'}}>
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
                        {
                        auctions[auctionId].map(event => {
                          return (
                            <tr key={`${auctionId}-${event.id}` } style={trStyle}>
                              <td style={tdStyle}>{ event.type }</td>
                              <td style={tdStyle}>{ new BigNumber(getValueOrDefault(event.lot)).toFormat(5,4) } ETH</td>
                              <td style={tdStyle}>
                                { new BigNumber(getValueOrDefault(event.bid))
                                  .div(new BigNumber(getValueOrDefault(event.lot)))
                                  .toFormat(5,4)
                                } DAI
                              </td>
                              <td style={tdStyle}>{ new BigNumber(getValueOrDefault(event.bid)).toFormat(5,4)} DAI</td>
                              <td style={tdStyle} title={event.timestamp}>{ new Date(event.timestamp).toDateString() }</td>
                            </tr>
                          )
                        })
                      }  
                      </tbody>
                    </table>
                                     
                  </PanelBody>
                </Panel>
              }
            )}

          </div>
      )}
    </div>
  );
};

export default Index;
