import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');

const BN = Web3.utils.BN;

export class Ethereum extends Wallet {
    static Network = { Mainnet: 'https://mainnet.infura.io/', Rinkeby: 'https://rinkeby.infura.io/' }
    static API = { Mainnet: 'https://api.etherscan.io/api', Rinkeby: 'https://api-rinkeby.etherscan.io/api' }

    constructor() {
      super();
      this.coinType = 60;
      this.name = 'ETH';
      this.title = 'Ethereum';
      this.className = 'Ethereum';
    }

    createAddressPrivatekey() {
      const t0 = performance.now();

      if (this.mnemonic == '') {
        this.mnemonic = bip39.generateMnemonic(); // generates string
      }
      const seed = bip39.mnemonicToSeed(this.mnemonic); // creates seed buffer
      const root = hdkey.fromMasterSeed(seed);

      // Create address for eth ...
      const addrNode = root.derive(StringHelper.format('m/44\'/{0}\'/0\'/0/0', this.coinType));

      const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
      const addr = ethUtil.publicToAddress(pubKey).toString('hex');
      const address = ethUtil.toChecksumAddress(addr);
      const privateKey = addrNode._privateKey.toString('hex');

      this.address = address;
      this.privateKey = privateKey;

      this.chainId = this.network == Ethereum.Network.Mainnet ? 1 : 4;

      const t1 = performance.now();
      console.log(`Call to createAddressPrivatekey for each Ether (${address}) took ${t1 - t0} milliseconds.`);
    }

    getWeb3() {
      return new Web3(new Web3.providers.HttpProvider(this.network));
    }

    async getBalance() {
      try {
        const web3 = this.getWeb3();
        const balance = await web3.eth.getBalance(this.address);
        return Web3.utils.fromWei(balance.toString());
      } catch (error) { return 0; }
    }

    async getFee() {
      const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
      const gasPrice = new BN(await web3.eth.getGasPrice());

      const limitedGas = new BN(3000000);

      const estimatedGas = limitedGas.mul(gasPrice);

      // console.log('getFee, gasPrice', gasPrice.toString());
      // console.log('getFee, estimateGas', estimatedGas.toString());

      return Web3.utils.fromWei(estimatedGas);
    }

    checkAddressValid(toAddress) {
      const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
      if (!web3.utils.isAddress(toAddress)) {
        return 'You can only send tokens to Ethereum address';
      }
      return true;
    }

    async transfer(toAddress, amountToSend) {
      const insufficientMsg = 'You have insufficient coin to make the transfer. Please top up and try again.';

      try {
        console.log(`transfered from address:${this.address}`);


        const web3 = new Web3(new Web3.providers.HttpProvider(this.network));

        if (!web3.utils.isAddress(toAddress)) {
          return { status: 0, message: 'Please enter a valid receiving address.' };
        }
        // check amount:
        let balance = await web3.eth.getBalance(this.address);
        balance = await Web3.utils.fromWei(balance.toString());

        console.log(StringHelper.format('Your wallet balance is currently {0} ETH', balance));

        if (balance == 0 || balance <= amountToSend) {
          return { status: 0, message: insufficientMsg };
        }

        const gasPrice = new BN(await web3.eth.getGasPrice());

        console.log(StringHelper.format('Current ETH Gas Prices (in GWEI): {0}', gasPrice));

        const nonce = await web3.eth.getTransactionCount(this.address);

        const value = web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether'));

        console.log(StringHelper.format('Value to send: {0}', value));

        const details = {
          to: toAddress,
          value,
          gas: 210000,
          gasPrice: await web3.utils.toHex(parseInt(gasPrice)), // converts the gwei price to wei
          nonce,
          chainId: this.chainId,
        };
        console.log('send details: ', details);

        const transaction = new EthereumTx(details);
        transaction.sign(Buffer.from(this.privateKey, 'hex'));
        const serializedTransaction = transaction.serialize();
        const addr = transaction.from.toString('hex');
        console.log('Based on your private key, your wallet address is', addr);
        const transactionId = web3.eth.sendSignedTransaction(`0x${serializedTransaction.toString('hex')}`);
        console.log('transactionId:', transactionId);
        const url = StringHelper.format('{0}/tx/{1}', this.network, transactionId);
        console.log('url', url);

        return { status: 1, message: 'Your transaction will appear on etherscan.io in about 30 seconds.' };
      } catch (error) {
        // return {"status": 0, "message": error};
        return { status: 0, message: insufficientMsg };
      }
    }


    async getTransactionHistory(pageno) {
      let result = [];
      const API_KEY = configs.network[4].apikeyEtherscan;
      const url = `${this.constructor.API[this.getNetworkName()]}?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&page=${pageno}&offset=20&sort=desc&apikey=${API_KEY}`;
      const response = await axios.get(url);
      if (response.status == 200) {
        result = response.data.result;
      }
      return result;
    }

    async getTransactionCount() {
      let result = [];
      const API_KEY = configs.network[4].apikeyEtherscan;
      const url = `${this.constructor.API[this.getNetworkName()]}?module=proxy&action=eth_getTransactionCount&address=${this.address}&tag=latest&apikey=${API_KEY}`;
      const response = await axios.get(url);
      if (response.status == 200) {
        const web3 = this.getWeb3();
        result = web3.utils.hexToNumber(response.data.result);
      }
      return result;
    }
}


export default { Ethereum };
