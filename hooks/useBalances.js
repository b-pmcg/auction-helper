import { useEffect, useState } from 'react';
import useMaker from './useMaker';
import { fromRad } from '../pages/index';
import BigNumber from 'bignumber.js';

const useBalances = () => {
  const { maker, web3Connected } = useMaker();
  const [vatDaiBalance, setVatDaiBalance] = useState(null);
  const [daiBalance, setDaiBalance] = useState(null);
  const [mkrBalance, setMkrBalance] = useState(null);

  const daiSymbol = 'MDAI';
  const mkrSymbol = 'MKR';

  const fetchVatDaiBalance = () => {
    return maker
      .service('smartContract')
      .getContract('MCD_VAT')
      .dai(maker.currentAddress());
  };

  const fetchDaiBalance = () => {
    return maker.getToken(daiSymbol).balance();
  };

  const fetchBalances = () => {
    return Promise.all([fetchVatDaiBalance(), fetchDaiBalance()]);
  };

  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const [vatBal, daiBal] = await fetchBalances();
      setVatDaiBalance(fromRad(vatBal).toFixed());
      setDaiBalance(daiBal.toNumber());
    })();
  }, [maker, web3Connected]);

  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const mkrBal = await maker.getToken(mkrSymbol).balance();
      setMkrBalance(mkrBal.toNumber());
    })();
  }, [maker, web3Connected]);

  async function joinDaiToAdapter(amount) {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    //amount set in MiniFormLayout is cast a BigNumber
    const joinAmountInDai = maker
      .service('web3')
      ._web3.utils.toWei(amount.toFixed());

    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toFixed()
    );
    
    const [vatBal, daiBal] = await fetchBalances();
    setVatDaiBalance(fromRad(vatBal).toFixed());
    setDaiBalance(daiBal.toNumber());
  }

  async function exitDaiFromAdapter(amount) {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    const exitAmountInDai = maker
      .service('web3')
      ._web3.utils.toWei(amount.toFixed());

    await DaiJoinAdapter.exit(
      maker.currentAddress(),
      BigNumber(exitAmountInDai).toFixed()
    );
    const [vatBal, daiBal] = await fetchBalances();
    setVatDaiBalance(fromRad(vatBal).toFixed());
    setDaiBalance(daiBal.toNumber());
  }

  return {
    vatDaiBalance,
    daiBalance,
    mkrBalance,
    joinDaiToAdapter,
    exitDaiFromAdapter
  };
};

export default useBalances;
