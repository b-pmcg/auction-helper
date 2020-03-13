import Maker from '@makerdao/dai';
import mcdPlugin, { MDAI } from '@makerdao/dai-plugin-mcd';
import validatorPlugin from './plugin/index';
import { createCurrency } from '@makerdao/currency';

export const SAI = createCurrency('SAI');
export const ETH = Maker.ETH;
export const USD = Maker.USD;
export const DAI = MDAI;

let maker;

export async function instantiateMaker(network) {
  const config = {
    log: true,
    autoAuthenticate: false,
    plugins: [
      [
        mcdPlugin,
        {
          cdpTypes: [{ currency: ETH, ilk: 'ETH-A' }]
        }
      ],
      validatorPlugin
    ],
    web3: {
      transactionSettings: {
        gasLimit: '150000'
      }
    }
  };

  maker = await Maker.create('browser', config);
  window.maker = maker; // for debugging
  return maker;
}
