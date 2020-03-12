import { map, prop } from 'ramda';

const FLIPPER = 'FLIPPER';

import ValidatorService from './ValidatorService';

export default {
  addConfig: function(config, { network = 'mainnet', staging = false }) {
    const contractAddresses = {
      mainnet: require('../contracts/addresses/mainnet.json')
    };

    const addContracts = {
      [FLIPPER]: {
        address: map(prop('FLIPPER'), contractAddresses),
        abi: require('../contracts/abis/Flipper.json')
      }
    };

    const makerConfig = {
      ...config,
      additionalServices: [
        'validator'
      ],
      validator: [ValidatorService],
      smartContract: { addContracts },
    };

    return makerConfig;
  }
};