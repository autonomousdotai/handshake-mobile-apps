import Web3 from 'web3';
import Tx from 'ethereumjs-tx';
import configs from '../../configs';

const LIMIT_GAS = 350000;

const BN = Web3.utils.BN;
const TAG = 'Neuron';
class Neuron {
  constructor(chainId = 4) {
    this.chainId = chainId || 4;
    this.getWeb3();
    this.lastResultNonce = -1;
    this.instance = {};
  }

  getWeb3 = () => {
    if (!this.web3) {
      //console.log(this.chainId);
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
  getNonce = async (accountAddress) => {
    const web3 = this.getWeb3();
    const nonce = await web3.eth
      .getTransactionCount(accountAddress, 'pending', (error, result) => {
        console.log(TAG, ' getNonce error', error, ' result = ', result);
      })
      .then((_nonce) => {
        this.lastResultNonce =
          this.lastResultNonce >= _nonce ? this.lastResultNonce + 1 : _nonce;
        console.log(TAG, ' getNonce 0000-- ', this.lastResultNonce);
        return this.lastResultNonce;
      });
    return nonce;
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

  getGasPriceDefaultWithEthUnit = async () =>
    Web3.utils.fromWei(await this.web3.eth.getGasPrice());

  get gasPrice() {
    return this.chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
  }

  getEstimateGas = async (payloadData, toAddress = undefined) => {
    const estimateGasData = {
      data: payloadData,
      to: toAddress,
    };

    const estimatedGas = await this.web3.eth.estimateGas(estimateGasData);
    return estimatedGas;
  };
  caculateLimitGasWithEthUnit = async (
    gasPrice = undefined,
  ) => {
    gasPrice = new BN(gasPrice
      ? Web3.utils.toWei(String(gasPrice), 'gwei')
      : await this.web3.eth.getGasPrice());

    return Web3.utils.fromWei(String(LIMIT_GAS * gasPrice));
  }

  caculateEstimatGasWithEthUnit = async (
    payloadData,
    toAddress,
    gasPrice = undefined,
  ) => {
    gasPrice = new BN(gasPrice
      ? Web3.utils.toWei(String(gasPrice), 'gwei')
      : await this.web3.eth.getGasPrice());
    // console.log('caculateEstimatGasWithEthUnit gasPrice = ', String(gasPrice));
    const estimateGas = await this.getEstimateGas(payloadData, toAddress);
    // console.log(
    //   'caculateEstimatGasWithEthUnit estiGas = ',
    //   String(estimateGas),
    // );

    // console.log(
    //   'caculateEstimatGasWithEthUnit estimatedGas = ',
    //   String(estimatedGas),
    // );
    return Web3.utils.fromWei(String(estimateGas * gasPrice));
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
  makeRawTransaction = (
    address,
    privateKey = '',
    payloadData,
    {
      toAddress, amount, gasPrice, argumentsParams,
    },
  ) =>
    // console.log('makeRawTransaction', payloadData, options);
    new Promise(async (resolve, reject) => {
      const web3 = this.getWeb3();
      if (privateKey.startsWith('0x')) {
        privateKey = privateKey.substr(2);
      }

      // let gasPrice = new BN();
      gasPrice = new BN(gasPrice
        ? Web3.utils.toWei(String(gasPrice), 'gwei')
        : await web3.eth.getGasPrice());
      // console.log(typeof _options.gasPrice);
      // if (_options.gasPrice) {
      //   gasPrice = new BN(Web3.utils.toWei(_options.gasPrice.toString(), 'gwei'));
      // }

      let nonce = await this.getNonce(address);

      nonce = nonce.toString(16);
      const balance = new BN(await web3.eth.getBalance(address));

      const estimateGas = balance.div(gasPrice);
      // const limitedGas = 3000000; // await this.getEstimateGas(payloadData, address);
      const limitedGas = LIMIT_GAS;

      const estimatedGas = await BN.min(estimateGas, limitedGas);

      const chainId = await web3.eth.net.getId();
      console.log('gasPrice->', parseInt(gasPrice));
      console.log('estimatedGas->', String(estimatedGas));
      console.log('limitedGas->', String(limitedGas));
      console.log('chainid ->', chainId);
      const rawTx = {
        // nonce: web3.utils.toHex(nonce),
        nonce: `0x${nonce}`,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: estimatedGas,
        data: payloadData,
        from: address,
        123123: 123123,
        chainId,
        // gas: estimatedGas,
        to: toAddress,
      };

      // if (_options.toAddress) {
      //   rawTx.to = _options.toAddress;
      // }
      // if (_options.amount) {
      //   rawTx.value = web3.utils.toHex(web3.utils.toWei(_options.amount.toString(), 'ether'));
      // }
      console.log('rawTx->', rawTx);
      const tx = new Tx(rawTx);
      if (amount) {
        tx.value = Web3.utils.toHex(web3.utils.toWei(String(amount), 'ether'));
      }
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
          toAddress: toAddress || '',
          amount: amount || 0,
          arguments: argumentsParams || {},
        });
      });
    });

  sendRawTransaction = async (
    address,
    privateKey = '',
    payloadData,
    {
      toAddress, amount, gasPrice, argumentsParams,
    },
  ) => {
    const web3 = this.getWeb3();
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.substr(2);
    }
    // let gasPrice = new BN();
    gasPrice = new BN(gasPrice
      ? Web3.utils.toWei(String(gasPrice), 'gwei')
      : await web3.eth.getGasPrice());
    const balance = new BN(await web3.eth.getBalance(address));
    const estimateGas = balance.div(gasPrice);
    // const limitedGas = 3000000;
    // const limitedGas = 350000;
    const limitedGas = LIMIT_GAS;
    const estimatedGas = await BN.min(estimateGas, limitedGas);
    const chainId = await web3.eth.net.getId();
    console.log('sendRawTransaction gasPrice->', parseInt(gasPrice));
    console.log('sendRawTransaction estimatedGas->', String(estimatedGas));
    console.log('sendRawTransaction limitedGas->', String(limitedGas));
    console.log('sendRawTransaction chainid ->', chainId);
    console.log('sendRawTransaction', payloadData);
    return this.getNonce(address)
      .then((_nonce) => {
        const nonce = _nonce;
        const rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: estimatedGas,
          data: payloadData,
          from: address,
          chainId,
          // gas: estimatedGas,
          to: toAddress,
        };
        console.log('rawTx->', rawTx);
        const tx = new Tx(rawTx);
        if (amount) {
          tx.value = Web3.utils.toHex(web3.utils.toWei(String(amount), 'ether'));
        }
        tx.sign(Buffer.from(privateKey, 'hex'));
        const serializedTx = tx.serialize();
        const rawTxHex = `0x${serializedTx.toString('hex')}`;
        return new Promise((resolve, reject) => {
          web3.eth
            .sendSignedTransaction(rawTxHex)
            .on('transactionHash', (hash) => {
              console.log(
                TAG,
                ' sendRawTransaction sendSignedTransaction hash = ',
                hash,
              );
              resolve({
                hash,
                payload: payloadData,
                fromAddress: address,
                toAddress: toAddress || '',
                amount: amount || 0,
                arguments: argumentsParams || {},
              });
            })
            .on('error', error => ({
              hash: -1,
              error,
            }));
        });
      })
      .catch(error => ({
        hash: -1,
        error,
      }));
  };
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
        // const gasLimit = 3000000;
        const gasLimit = LIMIT_GAS;
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
