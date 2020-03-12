import React, { useState } from "react";
import Head from "next/head";
import useMaker from "../hooks/useMaker";
import { Text, Input, Grid, Button } from "@makerdao/ui-components-core";
import BigNumber from "bignumber.js";

const Index = () => {
  const { maker } = useMaker();
  const [daiBalance, setDaiBalance] = useState(null);
  const [joinBalance, setJoinBalance] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(false);
  const [auctions, setAuctions] = useState([]);

  async function connectBrowserWallet() {
    try {
      if (maker) {
        await maker.authenticate();
        setWeb3Connected(true);
        const daiBalance = await maker
          .getToken("MDAI")
          .balanceOf(maker.currentAddress());
        const joinBalance = await maker
          .getToken("MDAI")
          .balanceOf(maker
            .service("smartContract")
            .getContract("MCD_JOIN_DAI").address);
        setDaiBalance(daiBalance);
        setJoinBalance(joinBalance);
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
      const t = await maker.service("validator").tend(auctionId, lotSize, bidAmount);
      // console.log("tend", t);
    } catch (err) {
      window.alert(err);
    }
  }

  async function callBids() {
    try {
      const t = await maker.service("validator").getBid();
      // console.log("bids", t);
    } catch (err) {
      window.alert(err);
    }
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

  const [joinAmount, setJoinAmount] = useState("");

  async function joinDaiToAdapter() {
    const DaiJoinAdapter = maker
      .service("smartContract")
      .getContract("MCD_JOIN_DAI");

    const joinAmountInDai = maker.service("web3")._web3.utils.toWei(joinAmount);

    await maker.getToken("MDAI").approveUnlimited(DaiJoinAdapter.address);
    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toString()
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
        <title>Next.js Dai.js Example</title>
      </Head>

      <h1>Next.js Dai.js Example</h1>
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
              <p>{joinBalance.toNumber()} DAI in the adapter</p>
            ) : (
              <p>Loading your adapter balance...</p>
            )}
          </div>
          <Input
            type="number"
            min="0"
            onChange={handleAuctionIdInputChange}
            placeholder={"Auction ID"}
          />
          <Input
            type="number"
            min="0"
            onChange={handleLotSizeInputChange}
            placeholder={"Lot Size"}
          />
          <Input
            type="number"
            min="0"
            onChange={handleBidAmountInputChange}
            placeholder={"Bid Amount"}
          />
          <button onClick={() => callTend(auctionId, lotSize, bidAmount)}>Call Tend</button>
          <Input
            type="number"
            min="0"
            value={joinAmount}
            placeholder={"0.00 DAI"}
            onChange={e => setJoinAmount(e.target.value)}
          />
          <br />
          <button onClick={() => joinDaiToAdapter()}>Send To Adapter</button>
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
