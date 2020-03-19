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

  function joinDaiToAdapter(amount) {
    // amount set in MiniFormLayout is cast a BigNumber
    const joinAmountInDai = maker
      .service('web3')
      ._web3.utils.toWei(amount.toFixed());

    return maker
      .service('validator')
      .joinDaiToAdapter(
        maker.currentAddress(),
        BigNumber(joinAmountInDai).toFixed()
      );
  }

  async function updateDaiBalances() {
    const [vatBal, daiBal] = await fetchBalances();
    setVatDaiBalance(fromRad(vatBal).toFixed());
    setDaiBalance(daiBal.toNumber());
  }

  function exitDaiFromAdapter(amount) {
    const exitAmountInDai = maker
      .service('web3')
      ._web3.utils.toWei(amount.toFixed());

    return maker
      .service('validator')
      .exitDaiFromAdapter(
        maker.currentAddress(),
        BigNumber(exitAmountInDai).toFixed()
      );
  }

  return {
    vatDaiBalance,
    daiBalance,
    mkrBalance,
    joinDaiToAdapter,
    exitDaiFromAdapter,
    updateDaiBalances
  };
};

export default useBalances;
