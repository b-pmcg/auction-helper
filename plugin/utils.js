import BigNumber from 'bignumber.js';

export const toRad = amount => {
  return BigNumber(amount.toString()).shiftedBy(45);
};
