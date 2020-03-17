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

  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const vatBal = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .dai(maker.currentAddress());
      setVatDaiBalance(fromRad(vatBal).toFixed());
    })();
  }, [maker, web3Connected]);

  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const daiBal = await maker.getToken(daiSymbol).balance();
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

  //TODO update state to display amount in adapter after join & exit
  async function joinDaiToAdapter(amount) {
    const DaiJoinAdapter = maker
      .service('smartContract')
      .getContract('MCD_JOIN_DAI');

    //amount set in MiniFormLayout is cast a BigNumber
    const joinAmountInDai = maker
      .service('web3')
      ._web3.utils.toWei(amount.toFixed());
    console.log('joinamountInDai', joinAmountInDai);

    await DaiJoinAdapter.join(
      maker.currentAddress(),
      BigNumber(joinAmountInDai).toString()
    );
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
      BigNumber(exitAmountInDai).toString()
    );
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
