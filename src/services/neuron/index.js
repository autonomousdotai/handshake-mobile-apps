// const configs = require('../../configs');
import configs from '../../configs';
import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import Token from './neuron-token';
import Handshake from './neuron-handshake';

const BN = Web3.utils.BN;

class Neuron {
  constructor(chainId = 4) {
    this.chainId = chainId || 4;
    this.web3 = null;
    this.instance = {};
    this.handshake = new Handshake(this);
    this.token = new Token(this);
  }

  getWeb3 = () => {
    if (!this.web3) {
      console.log(this.chainId);
      this.web3 = new Web3(new Web3.providers.HttpProvider(configs.network[this.chainId].blockchainNetwork));
    }
    return this.web3;
  };
  createAccount = () => {
    const web3 = this.getWeb3();
    const rs = web3.eth.accounts.create();
    return rs;
  };
  getBalance = async (address) => {
    const web3 = this.getWeb3();
    const balance = await web3.eth.getBalance(address);
    console.log(balance);
    return Web3.utils.fromWei(balance.toString());
  };
  /**
   * Retrieve contract from compiled contracts folder
   * @param {string} contractName the contract name
   * @param {string|null} address address of contract
   */
  getCompiled = (contractName) => {
    const compiled = require(`../../contracts/${contractName}.json`);
    return compiled;
  };
  /**
   *
   * @param {string} address
   * @param {string} privateKey
   * @param {string} payloadData
   * @param {object} options {
   *                      toAddress: address to send,
   *                      amount: eth to send,
   *                      gasPrice: modify default gas price 10gwei (gwei)
   *                    }
   */
  makeRawTransaction = (address, privateKey, payloadData, options) =>
    // console.log('makeRawTransaction', payloadData, options);
    new Promise(async (resolve, reject) => {
      const _options = options || {};
      const web3 = this.getWeb3();
      if (privateKey.startsWith('0x')) {
        privateKey = privateKey.substr(2);
      }

      let gasPrice = new BN(await web3.eth.getGasPrice());

      // console.log(typeof _options.gasPrice);
      if (_options.gasPrice) {
        gasPrice = new BN(Web3.utils.toWei(_options.gasPrice.toString(), 'gwei'));
      }

      const nonce = await web3.eth.getTransactionCount(address);
      const balance = new BN(await web3.eth.getBalance(address));

      const estimateGas = balance.div(gasPrice);
      const limitedGas = 200000;

      const estimatedGas = Math.min(estimateGas, limitedGas);
      console.log('gasPrice->', parseInt(gasPrice));
      console.log('estimatedGas->', parseInt(estimatedGas));
      const chainId = await web3.eth.net.getId();
      const rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(parseInt(gasPrice)),
        gasLimit: estimatedGas,
        data: payloadData,
        from: address,
        chainId,
        // gas: estimatedGas,
        gas: 2000000,
      };
      if (_options.toAddress) {
        rawTx.to = _options.toAddress;
      }
      if (_options.amount) {
        rawTx.value = web3.utils.toHex(web3.utils.toWei(_options.amount.toString(), 'ether'));
      }
      console.log('rawTx->', rawTx);
      const tx = new Tx(rawTx);

      // tx.sign(new Buffer(privateKey, 'hex'));
      tx.sign(Buffer.from(privateKey, 'hex'));

      const serializedTx = tx.serialize();
      const rawTxHex = `0x${serializedTx.toString('hex')}`;
      console.log('rawTxHex->', rawTxHex);
      web3.eth.sendSignedTransaction(rawTxHex, (err, hash) => {
        if (err) {
          console.log('makeRawTransaction creation error', err);
          reject(err);
          return;
        }
        resolve({
          hash,
          payload: payloadData,
          fromAddress: address,
          toAddress: _options.toAddress || '',
          amount: _options.amount || 0,
          arguments: _options.arguments || {},
        });
      });
    });
  makeRawTransfer = (address, privateKey, options) => {
    console.log('makeRawTransfer', address, privateKey, options);
    return new Promise(async (resolve, reject) => {
      try {
        const _options = options || {};
        const web3 = this.getWeb3();
        // no need
        // privateKey = crypto.decrypt(privateKey);
        // ////
        if (privateKey.startsWith('0x')) {
          privateKey = privateKey.substr(2);
        }
        let gasPrice = await web3.eth.getGasPrice();
        if (_options.gasPrice) {
          gasPrice = web3.utils.toWei(_options.gasPrice.toString(), 'gwei');
        }
        console.log(parseInt(gasPrice));
        const nonce = await web3.eth.getTransactionCount(address);
        const gasLimit = 3000000;
        const estimatedGas = 3000000;
        const rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(parseInt(gasPrice)),
          gasLimit: web3.utils.toHex(gasLimit),
          from: address,
          gas: estimatedGas,
          to: _options.toAddress || '',
          value: web3.utils.toHex(web3.utils.toWei(_options.amount.toString(), 'ether')),
        };
        // console.log(rawTx);
        const tx = new Tx(rawTx);
        tx.sign(Buffer.from(privateKey, 'hex'));
        const serializedTx = tx.serialize();
        const rawTxHex = `0x${serializedTx.toString('hex')}`;
        web3.eth.sendSignedTransaction(rawTxHex, (err, hash) => {
          if (err) {
            console.log('makeRawTransfer creation error', err);
            reject(err);
            return;
          }
          resolve({
            hash,
            fromAddress: address,
            toAddress: _options.toAddress || '',
            amount: _options.amount || 0,
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  };
  getTransactionReceipt = async (hash) => {
    const web3 = this.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(hash);
    console.log(`getTransactionReceipt ${JSON.stringify(receipt)}`);
    return receipt;
  };
}

export default Neuron;
