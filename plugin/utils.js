import BigNumber from 'bignumber.js';

export const toRad = amount => {
  return BigNumber(amount.toString()).shiftedBy(45);
};

export const fromWad = amount => {
  return BigNumber(amount.toString()).shiftedBy(-18);
};
