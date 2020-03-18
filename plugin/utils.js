import BigNumber from 'bignumber.js';

export const toRad = amount => {
  return BigNumber(amount.toString()).shiftedBy(45);
};

export const fromWad = amount => {
  return BigNumber(amount.toString()).shiftedBy(-18);
};

export const fromWei = amount => {
  return BigNumber(amount).shiftedBy(-18);
};

export const toWei = amount => {
  return BigNumber(amount).shiftedBy(18);
};
