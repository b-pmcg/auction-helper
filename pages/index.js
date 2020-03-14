/** @jsx jsx */
import React, { useState } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import * as _ from 'lodash';
import BigNumber from "bignumber.js";
import { Heading, Text, jsx, Button, Styled, Input, Flex } from 'theme-ui'
import AuctionBlock from '../components/AuctionBlock';

// const Button = styled.button`
//   display: inline-flex;
//   height: 48px;
//   width: 130px;
//   padding: 12px;
//   font-size: 16px;
//   line-height: 24px;
//   justify-content: center;
//   border: 1px solid #1AAB9B;
//   align-items: center;
//   background: #1AAB9B;
//   border-radius: 4px;
//   color: white;

//   &:hover:not(:disabled) {
//     border: 1px solid #139d8d;
//     background: #139d8d;
//     cursor: pointer;
//   }

//   &:disabled {
//     cursor: not-allowed;
//     opacity: 0.5;
//     pointerEvents: none;
//   }
// `;

// const Panel = Styled.div`
//   flex-direction: column;
//   display: flex;
//   border: 1px solid #D8E0E3;
//   box-sizing: border-box;
//   border-radius: 6px;
//   width: 100%;
//   max-width: 1140px;
//   background: white;
//   margin:auto;
//   margin-bottom: 22px;
// `;

// const PanelHeader = Styled.div`
//   display: flex;

// `;

// const PanelBody = Styled.div`
//   display: flex;
//   flexWrap: wrap;
//   padding: 36px 28px;
// `;



function fromRad(value) {
  return BigNumber(value).shiftedBy(-45);
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
      <Heading as="h1">Auction Helper (Beta)</Heading>
      {!maker ? (
        <div>
          <Heading as="h3">Loading...</Heading>
        </div>
      ) : !web3Connected ? (
        <button onClick={connectBrowserWallet}>Connect Wallet</button>
      ) : (
        <div>
          <Heading as="h3">Connected Account</Heading>
          <Text>{maker.currentAddress()}</Text>
          <div>
            {daiBalance ? (
              <Text>{daiBalance.toNumber()} DAI in your wallet</Text>
            ) : (
              <Text>Loading your DAI balance...</Text>
            )}
          </div>
          <div>
            {joinBalance ? (
              <Text>{joinBalance} DAI in the adapter</Text>
            ) : (
              <Text>Loading your adapter balance...</Text>
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
                console.log(auctionId, 'here')
                return <AuctionBlock lot={lot} auctionId={auctionId} />
        
              }
            )}

          </div>
      )}
    </div>
  );
};

export default Index;
