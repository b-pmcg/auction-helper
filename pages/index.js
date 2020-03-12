import React, { useState } from "react";
import Head from "next/head";
import useMaker from "../hooks/useMaker";
import { Text, Input, Grid, Button } from "@makerdao/ui-components-core";
import BigNumber from "bignumber.js";

const Index = () => {
  const { maker } = useMaker();
  const [daiBalance, setDaiBalance] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(false);

  async function connectBrowserWallet() {
    try {
      if (maker) {
        await maker.authenticate();
        setWeb3Connected(true);
        const daiBalance = await maker
          .getToken("MDAI")
          .balanceOf(maker.currentAddress());
        setDaiBalance(daiBalance);
      }
    } catch (err) {
      window.alert(err);
    }
  }

  async function callTend(auctionId) {
    try {
      const t = await maker.service("validator").tend(auctionId);
      console.log("tend", t);
    } catch (err) {
      window.alert(err);
    }
  }

  async function callBids() {
    try {
      const t = await maker.service("validator").getBid();
      console.log("bids", t);
    } catch (err) {
      window.alert(err);
    }
  }

  const [auctionId, setAuctionId] = useState(0);
  function handleInputChange({ target }) {
    console.log("target", target.value);
    setAuctionId(target.value);
  }

  const [tendAmount, setTendAmount] = useState(0);
  const [joinAmount, setJoinAmount] = useState("");

  async function joinDaiToAdapter() {
    const DaiJoinAdapter = maker
      .service("smartContract")
      .getContract("MCD_JOIN_DAI");

    await maker.getToken("MDAI").approveUnlimited(DaiJoinAdapter.address);
    console.log(
      "Joining",
      BigNumber(joinAmount).toNumber(),
      "address:",
      maker.currentAddress()
    );
    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmount).toString()
    );
    console.log("success");
  }
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
          <Input
            type="number"
            min="0"
            // value={tendAmount}
            onChange={handleInputChange}
            // placeholder={`0.00 ${symbol}`}
            // failureMessage={amountErrors}
            data-testid="deposit-input"
          />
          <button onClick={() => callTend(auctionId)}>Call Tend</button>
          {/* <button onClick={callBids}>Call Bids</button> */}
          <Input
            type="number"
            min="0"
            value={joinAmount}
            placeholder={"0.00 DAI"}
            onChange={e => setJoinAmount(e.target.value)}
            // placeholder={`0.00 ${symbol}`}
            // failureMessage={amountErrors}
            data-testid="deposit-input"
          />
          <br />
          <button onClick={() => joinDaiToAdapter()}>Send To Adapter</button>
          <br />
          <br />
          <button onClick={callTend}>Call Tend</button>
          <button onClick={callBids}>Call Bids</button>
        </div>
      )}
    </div>
  );
};

export default Index;
