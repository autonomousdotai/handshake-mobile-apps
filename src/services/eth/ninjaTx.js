import { sendRawTx } from './baseTx';
import * as constant from './constants';
import { getPrivateKey, getUserAddress, getChainId } from './ninjaAccount';

const data = contractMethod('handshake', 'contractAddr', )
export function sendRawNinjaTx({
  coinName,
  defaultBlock = 'pending',
  chainId = getChainId(),
  to,
  data,
}) {
  const from = getUserAddress(coinName);
  const privateKey = getPrivateKey(coinName);
  const gasLimit = '';
  const gasPrice = '';
  const value = '';

  sendRawTx({
    from,
    defaultBlock,
    privateKey,
    chainId,
    gasLimit,
    gasPrice,
    to,
    value,
    data,
  });
}
