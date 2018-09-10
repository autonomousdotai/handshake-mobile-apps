import { sendRawTxBase } from './baseTx';
import constant from './constants';
import { getPrivateKey, getUserAddress, getChainId } from './ninjaAccount';

export function sendRawTx({
  coinName,
  defaultBlock = 'pending',
  chainId = getChainId(),
  to,
  value,
  data,
}) {
  const from = getUserAddress(coinName);
  const privateKey = getPrivateKey(coinName);
  const gasLimit = constant.GAS_LIMIT;
  const gasPrice = '';

  sendRawTxBase({ from, defaultBlock, privateKey, chainId, gasLimit, gasPrice, to, value, data });
}
