import React, { createContext, useState, useEffect } from 'react';
import { instantiateMaker } from '../maker';

export const MakerObjectContext = createContext();

function MakerProvider({ children, network }) {
  const [maker, setMaker] = useState(null);
  const [web3Connected, setWeb3Connected] = useState(null);

  useEffect(() => {
    if (!network) return;
    instantiateMaker(network).then(maker => {
      setMaker(maker);
    });
  }, [network]);

  return (
    <MakerObjectContext.Provider
      value={{ maker, network, web3Connected, setWeb3Connected }}
    >
      {children}
    </MakerObjectContext.Provider>
  );
}

export default MakerProvider;
