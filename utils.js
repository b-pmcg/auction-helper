import {balanceRounding} from './constants';

export const getValueOrDefault = (value, def = '-') => {
  return value ? value : def;
};

export const formatBalance = value => {
  if (!value) return;
  if (typeof value === 'string') value = parseFloat(value);
  if (value < 1)
    return value.toLocaleString(undefined, {
      minimumFractionDigits: balanceRounding.zeroToOne,
      maximumFractionDigits: balanceRounding.zeroToOne
    });
  else if (value > 1 && value < 10000)
    return value.toLocaleString(undefined, {
      minimumFractionDigits: balanceRounding.oneTo10K,
      maximumFractionDigits: balanceRounding.oneTo10K
    });
  else
    return value.toLocaleString(undefined, {
      minimumFractionDigits: balanceRounding.over10K,
      maximumFractionDigits: balanceRounding.over10K
    });
};
