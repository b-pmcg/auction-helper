import { useEffect, useState } from 'react';
import useMaker from './useMaker';
import { fromRad } from '../pages/index';

const useAuctionActions = () => {
  const { maker, web3Connected } = useMaker();

  async function callTend(auctionId, lotSize, bidAmount) {
    console.log('auctionId, lotSize, bidAmount', auctionId, lotSize, bidAmount);
    try {
      const tend = await maker
        .service('validator')
        .tend(auctionId, lotSize, bidAmount.toNumber());
    } catch (err) {
      window.alert(err);
    }
  }

  async function callFlopDent(auctionId, lotSize, bidAmount) {
    console.log('auctionId, lotSize, bidAmount', auctionId, lotSize, bidAmount);
    try {
      const flopDent = await maker
        .service('validator')
        .flopDent(auctionId, lotSize.toNumber(), bidAmount);
    } catch (err) {
      window.alert(err);
    }
  }

  return { callTend, callFlopDent };
};

export default useAuctionActions;
