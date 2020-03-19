import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerProvider({ children, network }) {
  const [maker, setMaker] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(null);
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    if (!network) return;
    instantiateMaker(network).then(maker => {
      setMaker(maker);
    });
  }, [network]);

  useEffect(() => {
    if (maker && web3Connected) {
      maker.service('web3').onNewBlock(blockHeight => {
        setBlockHeight(blockHeight);
      });
    }
  }, [maker, web3Connected]);
  return (
    <MakerObjectContext.Provider
      value={{ maker, network, web3Connected, setWeb3Connected, blockHeight }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerProvider;
