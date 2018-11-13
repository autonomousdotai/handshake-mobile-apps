import { parseBigNumber } from './number';

export const possibleWinning = (amount, odds) => {
  return parseBigNumber(amount).times(parseBigNumber(odds)).toNumber() || 0;
};
