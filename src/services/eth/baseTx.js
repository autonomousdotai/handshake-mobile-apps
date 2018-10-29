import EthereumTx from 'ethereumjs-tx';

import initWeb3 from './initWeb3';
import { resultCallback, eventCallBack } from './callback';

/**
 * Account nonce: a transaction counter of an account
 * @param address
 * @param defaultBlock
 * @param callback
 * @returns {Promise<number>}
 */
export function getTxCount({ address, defaultBlock, callback = resultCallback }) {
  const web3 = initWeb3();
  return web3.eth.getTransactionCount(address, defaultBlock, callback);
}

/**
 * Creating, signing and sending a raw ethereum transaction
 * @param from - The address to get the numbers of transactions from
 * @param defaultBlock - (Number | 'genesis' | 'latest' | 'pending') (default: latest)
 * @param privateKey - a private key used to sign the transaction
 * @param chainId - The chain id to use when signing this transaction (web3.eth.net.getId())
 * @param gasLimit - transaction gas limit
 * @param gasPrice - transaction gas price
 * @param to - the account to send Ether to
 * @param value - the amount of Ether sent
 * @param data - the data of the message or the init of a contract
 */
export function sendRawTxBase({
  from, defaultBlock, privateKey,
  chainId, gasLimit, gasPrice, to, value, data,
}) {
  const web3 = initWeb3();

  getTxCount({ from, defaultBlock }).then(nonce => {
    const txParams = {
      chainId,
      gasLimit: web3.utils.toHex(gasLimit),
      gasPrice: web3.utils.toHex(gasPrice),
      to,
      nonce: web3.utils.toHex(nonce),
      value: web3.utils.toHex(value || 0),
      data,
    };

    const pKeyHex = Buffer.from(privateKey, 'hex');
    const tx = new EthereumTx(txParams);
    tx.sign(pKeyHex);
    const serializedTx = web3.utils.toHex(tx.serialize());
    eventCallBack(web3.eth.sendSignedTransaction(serializedTx));
  });
}
