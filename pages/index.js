import React, { useState } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import { Input } from '@makerdao/ui-components-core';
import BigNumber from 'bignumber.js';

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
    const a = await maker.service('validator').getAllAuctions();
    setAuctions(a);
    // try {
    //   const a = [];
    //   for(let i =2600; i< 2603; i++) {
    //
    //     const auction = await maker.service('validator').getAuction(i);
    //     a.push(auction);
    //   }
    //   console.log('set a',);
    //   setAuctions(a);
    // } catch (err) {
    //   window.alert(err);
    // }
  }

  console.log('auctions', auctions);
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
          <button onClick={fetchAuctions}>Get auctions</button>
          <table style={{border: '1px solid #e5e5e5'}}>
            <tbody>
            <tr>
              <th>Auction Id</th>
              <th>Event</th>
              <th>Ilk</th>
              <th>Amount</th>
              <th>Lot</th>
              <th>Bid</th>
              <th>Ink</th>
              <th>Tab</th>
            </tr>
            {
              auctions ? auctions.map( (a) => {
                return (
                  <tr key={a.id}>
                    <td>{a.auctionId}</td>
                    <td>{a.type}</td>
                    <td>{a.ilk}</td>
                    <td>{a.amount}</td>
                    <td>{a.lot}</td>
                    <td>{a.bid}</td>
                    <td>{a.ink}</td>
                    <td>{a.tab}</td>
                  </tr>
                )
              }) : <>Empty</>
            }


            </tbody>
          </table>

        </div>
      )}
    </div>
  );
};

export default Index;
