import { useEffect, useState } from 'react';
import useMaker from './useMaker';

const REQUIRED_ALLOWANCE = 0;

const useAllowances = () => {
  const { maker, web3Connected } = useMaker();
  const [hasDaiAllowance, setHasDaiAllowance] = useState(false);
  const [hasMkrAllowance, setHasMkrAllowance] = useState(false);
  const [hasEthFlipHope, setHasFlipEthHope] = useState(false);
  const [hasJoinDaiHope, setHasJoinDaiHope] = useState(false);

  // DAI Allowance
  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const joinDaiAdapterAddress = maker
        .service('smartContract')
        .getContractByName('MCD_JOIN_DAI').address;
      const daiAllowance = await maker
        .getToken('MDAI')
        .allowance(maker.currentAddress(), joinDaiAdapterAddress);
      setHasDaiAllowance(daiAllowance.gt(REQUIRED_ALLOWANCE) ? true : false);
    })();
  }, [maker, web3Connected]);

  // MKR Allowance
  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const joinDaiAdapterAddress = maker
        .service('smartContract')
        .getContractByName('MCD_JOIN_DAI').address;
      const mkrAllowance = await maker
        .getToken('MDAI')
        .allowance(maker.currentAddress(), joinDaiAdapterAddress);
      setHasMkrAllowance(mkrAllowance.gt(REQUIRED_ALLOWANCE) ? true : false);
    })();
  }, [maker, web3Connected]);

  // Flip ETH has Hope
  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const flipEthAddress = maker
        .service('smartContract')
        .getContractByName('MCD_FLIP_ETH_A').address;
      const can = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .can(maker.currentAddress(), flipEthAddress);
      console.log('flipEth CAN', can.toNumber());
      setHasFlipEthHope(can.toNumber() === 1 ? true : false);
    })();
  }, [maker, web3Connected]);

  // Join DAI has Hope
  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const joinDaiAdapterAddress = maker
        .service('smartContract')
        .getContractByName('MCD_JOIN_DAI').address;
      const can = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .can(maker.currentAddress(), joinDaiAdapterAddress);
      console.log('joinDai CAN', can.toNumber());
      setHasJoinDaiHope(can.toNumber() === 1 ? true : false);
    })();
  }, [maker, web3Connected]);

  return {
    hasDaiAllowance,
    hasMkrAllowance,
    hasEthFlipHope,
    hasJoinDaiHope
  };
};

export default useAllowances;
