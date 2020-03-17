import { useEffect, useState } from 'react';
import useMaker from './useMaker';

const REQUIRED_ALLOWANCE = 0;

const useAllowances = () => {
  const { maker, web3Connected } = useMaker();
  const [hasDaiAllowance, setHasDaiAllowance] = useState(false);
  const [hasMkrAllowance, setHasMkrAllowance] = useState(false);
  const [hasEthFlipHope, setHasFlipEthHope] = useState(false);
  const [hasJoinDaiHope, setHasJoinDaiHope] = useState(false);
  const [hasFlopHope, setHasFlopHope] = useState(false);

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

  // Flop has Hope
  useEffect(() => {
    if (!web3Connected) return;
    (async () => {
      const flopAddress = maker
        .service('smartContract')
        .getContractByName('MCD_FLOP').address;
      const can = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .can(maker.currentAddress(), flopAddress);
      setHasFlopHope(can.toNumber() === 1 ? true : false);
    })();
  }, [maker, web3Connected]);

  const giveDaiAllowance = async address => {
    // setDaiApprovePending(true);
    try {
      await maker.getToken('MDAI').approveUnlimited(address);
      setHasDaiAllowance(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock dai tx failed ${message}`;
      console.error(errMsg);
    }
    // setDaiApprovePending(false);
  };

  const giveMkrAllowance = async address => {
    // setMkrApprovePending(true);
    try {
      await maker.getToken('MKR').approveUnlimited(address);
      setHasMkrAllowance(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock mkr tx failed ${message}`;
      console.error(errMsg);
    }
    // setMkrApprovePending(false);
  };

  const giveFlipEthHope = async address => {
    // setHopePending(true);
    try {
      await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .hope(address);
      setHasFlipEthHope(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `hope tx failed ${message}`;
      console.error(errMsg);
    }
    // setHopeApprovePending(false);
  };
  const giveJoinDaiHope = async address => {
    // setHopePending(true);
    try {
      await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .hope(address);
      setHasJoinDaiHope(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `hope tx failed ${message}`;
      console.error(errMsg);
    }
    // setHopeApprovePending(false);
  };
  const giveFlopHope = async address => {
    // setHopePending(true);
    try {
      await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .hope(address);
      setHasFlopHope(true);
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `hope tx failed ${message}`;
      console.error(errMsg);
    }
    // setHopeApprovePending(false);
  };

  return {
    hasDaiAllowance,
    hasMkrAllowance,
    hasEthFlipHope,
    hasJoinDaiHope,
    hasFlopHope,
    giveDaiAllowance,
    giveMkrAllowance,
    giveFlipEthHope,
    giveJoinDaiHope,
    giveFlopHope
  };
};

export default useAllowances;
