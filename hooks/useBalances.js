import { useEffect, useState } from 'react';
import useMaker from './useMaker';
import { fromRad } from '../pages/index';

const useBalances = () => {
  const { maker } = useMaker();
  const [vatDaiBalance, setVatDaiBalance] = useState(null);
  const [daiBalance, setDaiBalance] = useState(null);
  const [mkrBalance, setMkrBalance] = useState(null);

  const daiSymbol = 'MDAI';
  const mkrSymbol = 'MKR';

  useEffect(() => {
    if (!maker) return;
    (async () => {
      const vatBal = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .dai(maker.currentAddress());
      setVatDaiBalance(fromRad(vatBal).toFixed());
    })();
  }, [maker]);

  useEffect(() => {
    if (!maker) return;
    (async () => {
      const daiBal = await maker.getToken(daiSymbol).balance();
      setDaiBalance(daiBal.toNumber());
    })();
  }, [maker]);

  useEffect(() => {
    if (!maker) return;
    (async () => {
      const mkrBal = await maker.getToken(mkrSymbol).balance();
      setMkrBalance(mkrBal.toNumber());
    })();
  }, [maker]);

  return { vatDaiBalance, daiBalance, mkrBalance };
};

export default useBalances;
