import React, { useState } from "react";
import Head from "next/head";
import useMaker from "../hooks/useMaker";
import * as _ from 'lodash';
import { Text, Input, Grid, Button, Flex } from "@makerdao/ui-components-core";
import BigNumber from "bignumber.js";
import { withTheme } from "styled-components";

const panelStyle = {
  display: 'flex',
  maxWidth:'1440px',
  width: '100%',
  flexWrap: 'wrap',
  padding: '16px',
  border: '1px solid rgb(212, 217, 225)',
  background: 'white',
  margin:'auto',
  marginBottom: '8px'
};

const panelHeader = {
  display:'flex',
  padding: '16px 0',
  width: `100%`,
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgb(212, 217, 225)'
}

const panelBody = {
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  padding: '16px 0'
}

const eventData = {
  display: 'flex',
  padding: '16px',
  justifyContent: 'space-between',
  width: '100%'
}

const eventParam = {
  width: 'auto'
}

const bidButton = {
  padding: '4px',
  height: '40px',
  width: '60px',
  fontSize: '18px',
  backgroundColor: 'rgb(26, 171, 155)',
  border: '1px solid rgb(26, 171, 155)',
  color: 'white'
}

const bidInput = {
  width: '100px',
  marginRight: '16px',
  height: '30px',
  padding: '4px',
}

function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
}

const Bidform = (props) => {
  const [amount, setAmount] = useState(undefined);
  const {auctionId, lot, onClick} = props;

  const bid = () => {
    onClick(auctionId, lot, amount);
  }

  return (
    <div>
    <input style={bidInput} type="text" placeholder="Bid Amount" onChange={
      event => {
        const inputValue = event.target.value;
        if(inputValue === '') {
          setAmount(undefined);
        }
        setAmount(inputValue);
      }
    }/>
    <Button style={bidButton} 
            onClick={() => {console.log(amount, auctionId, lot)}}
            disabled={!amount || !lot || !auctionId}
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

  async function callBids() {
    try {
      const t = await maker.service('validator').getBid();
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
    setAuctions(_.groupBy(auctions, (auction) => auction.auctionId));
  }

  const getValueOrDefault = (value, def = '-')=> {
    return value ? value : def;
  }

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
          <br/>
          <br/>
          <button onClick={fetchAuctions}>List Auctions</button>
          <div>
            { !auctions && <span> Loading Auctions...</span >}
            { auctions && Object.keys(auctions).map(
              auctionId => {
                const kickEvent = auctions[auctionId].find(event=>event.type === 'Kick');
                const firstTend = auctions[auctionId].find(event=>event.type === 'Tend');
                let lot = kickEvent ? kickEvent.lot : firstTend.lot;
                return <div key={auctionId} style={panelStyle}>
                  <div style={panelHeader}>
                    Auction ID: {auctionId} 
                    <span> Lot: { lot }
                    </span>
                    <Bidform auctionId={auctionId} lot={lot} onClick={callTend}/>
                  </div>
                  <div style={panelBody}>
                    {
                      auctions[auctionId].map(event => {
                        return (
                          <div style={eventData} key={`${auctionId}-${event.id}`}>
                            <div style={eventParam} ><span>Type: <span></span></span><span>{ event.type }</span></div>
                            <div style={eventParam}><span>Lot: <span></span></span><span>{ getValueOrDefault(event.lot) }</span></div>
                            <div style={eventParam}><span>Bid: <span></span></span><span>{ getValueOrDefault(event.bid)}</span></div>
                            <div style={eventParam}><span>Ink: <span></span></span><span>{ getValueOrDefault(event.ink)}</span></div>
                            <div style={eventParam}><span>Tab: <span></span></span><span>{ getValueOrDefault(event.tab) }</span></div>
                            <div style={eventParam}><span>Timestamp: <span></span></span><span>{ event.timestamp}</span></div>
                          </div>
                        )
                      })
                    }                   
                  </div>
                </div>
              }
            )}

          </div>

        </div>
      )}
    </div>
  );
};

export default Index;
