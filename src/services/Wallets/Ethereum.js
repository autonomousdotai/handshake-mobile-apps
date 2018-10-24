import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
import {MasterWallet} from "./MasterWallet";
import Tx from 'ethereumjs-tx';
import { getEstimateGas } from "@/components/handshakes/betting/utils";
import { getGasPrice } from "@/utils/gasPrice";
import { set, getJSON } from 'js-cookie';

const Web3 = require('web3');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');
const moment = require('moment');
const BN = Web3.utils.BN;

var MobileDetect = require('mobile-detect');
const defaultGasLimit = 21000;
const COOKIE_LEVEL_FEES = 'eth_level_fees';

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

  async getBalance(isFormatNumber) {
    try {
      const web3 = this.getWeb3();
      const balance = await web3.eth.getBalance(this.address);
      if(isFormatNumber)
        return this.formatNumber(Web3.utils.fromWei(balance.toString()));
      else
        return Web3.utils.fromWei(balance.toString());
    } catch (error) {
      //alert(error);
      return this.balance;
    }
  }

  getGasPrice = async (speed=1) => {
    return new Promise((resolve, reject) => {
    axios.get('https://ethgasstation.info/json/ethgasAPI.json')
      .then(({ data }) => {// 10 gwei units - so divide by 10 to get in gwei
        let result = 41;
        if(speed == 0){
          result = (data.safeLow / 10).toString();
        }
        else if(speed == 2){
          result = (data.fast / 10).toString();
        }
        else if(speed == 3){
          result= (data.fastest / 10).toString();
        }
        else{
          result = (data.average / 10).toString();
        }

        resolve(result);
      })
      .catch((error) => {
        console.log('Failed to get data from ethGasStation: ', error);
        resolve(41);
        // axios
        //   .get(`https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${process.env.apikeyEtherscan}`)
        //   .then(({ data }) => {
        //     const gasPrice = Number(data.result).toString();
        //     resolve(Web3.utils.fromWei(gasPrice, 'gwei'));
        //   })
        //   .catch((error) => {
        //     resolve(41);
        //   });
      });
    })
  }

  getLevelFee = async () => {
    return new Promise((resolve, reject) => {
      let result = getJSON(COOKIE_LEVEL_FEES);
      if(result && result.length){
        resolve(result);
      }
      else{
        result = [];
        const web3 = this.getWeb3();
        let calcGasTimeFee = (data, title, min) => {
          try{
            let gasPrice = Number(data / 10);
            let estimatedGas = defaultGasLimit * (new BN(gasPrice * 1000000000));
            let ethEstimateGas = Number(web3.utils.fromWei(estimatedGas.toString()));
            let feePrice = ethEstimateGas;
            ethEstimateGas = this.formatNumber(ethEstimateGas, 8);

            return {title, description: `${ethEstimateGas} ETH ~ ${min} min${min > 1 ? 's' : ''}`, value: gasPrice.toString(), feePrice};
          }
          catch(e){
            console.error(e);
          }

          return {title, description: '', value: 0, feePrice: 0};
        }

        axios.get('https://ethgasstation.info/json/ethgasAPI.json')
        .then(({ data }) => {// 10 gwei units - so divide by 10 to get in gwei

          if(data.safeLow){
            result.push(calcGasTimeFee(data.safeLow, 'Low', 30));
          }

          if(data.average){
            result.push(calcGasTimeFee(data.average, 'Normal', 5));
          }

          if(data.fast){
            result.push(calcGasTimeFee(data.fast, 'Priority', 2));
          }

          if(data.fastest){
            result.push(calcGasTimeFee(data.fastest, 'Urgent', 1));
          }

          let now = new Date();
          now.setTime(now.getTime() + (60 * 1000));
          set(COOKIE_LEVEL_FEES, JSON.stringify(result), {expires: now});
          resolve(result);
        })
        .catch((error) => {
          console.log('getLevelFee:', error);
          resolve(false);
        });
      }
    })
  }

  async getFee() {
    await getGasPrice();
    return await getEstimateGas();
  }


  checkAddressValid(toAddress) {
    const web3 = this.getWeb3();

    if (!web3.utils.isAddress(toAddress)) {
      return 'messages.ethereum.error.invalid_address';
    }
    return true;
  }

async transfer(toAddress, amountToSend, opt) {

    let data = opt.data || "";
    let fee = opt.fee || 0
    let gasLimit = opt.gasLimit || defaultGasLimit;

    console.log('toAddress:', toAddress,
    '\n data:', data,
    '\n gasLimit:', gasLimit,
    '\n fee:', fee);

    const web3 = this.getWeb3();
    if (!web3.utils.isAddress(toAddress)) {
      return { status: 0, message: 'messages.ethereum.error.invalid_address2' };
    }

     try {

      let balance = await web3.eth.getBalance(this.address);
      balance = await web3.utils.fromWei(balance.toString());

      if (balance == 0 || balance <= amountToSend) {
        return { status: 0, message: 'messages.ethereum.error.insufficient' };
      }

      if(!fee){
        fee = await this.getGasPrice(3);
      }
      let gasPrice = new BN(Number(fee) * 1000000000);// converts the gwei price to wei;

      const estimateGas = new BN(balance).div(gasPrice);
      const limitedGas = gasLimit;
      const estimatedGas = await BN.min(estimateGas, limitedGas);
      const chainId = await web3.eth.net.getId();

      console.log('transfer gasPrice:', parseInt(gasPrice),
      '\n estimatedGas:', String(estimatedGas),
      '\n limitedGas:', String(limitedGas),
      '\n chainid:', chainId);

      const totalEstimatedGas = limitedGas * gasPrice;
      const totalAmountFee = Number(amountToSend)+Number(web3.utils.fromWei(String(totalEstimatedGas)));

      console.log('totalAmountFee:', totalAmountFee,
      '\n balance=', balance,
      '\n gasLimit=', gasLimit,
      '\n totalEstimatedGas=', totalEstimatedGas, Number(web3.utils.fromWei(String(totalEstimatedGas))),
      '\n amountToSend=', amountToSend);

      if(totalAmountFee > Number(balance)) {
        return { status: 0, message: 'messages.ethereum.error.insufficient_gas' };
      }

      return this.getNonce(this.address).then((_nonce) => {
        const nonce = _nonce;
        const rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: web3.utils.toHex(estimatedGas),
          data: data,
          from: this.address,
          chainId: this.chainId,
          to: toAddress,
          value: Web3.utils.toHex(web3.utils.toWei(String(amountToSend || 0), 'ether'))
        };
        console.log('rawTx->', rawTx);
        const tx = new Tx(rawTx);
        console.log('tx.value->', tx.value);
        tx.sign(Buffer.from(this.privateKey, 'hex'));
        console.log('tx.sign->...', tx);
        const serializedTx = tx.serialize();
        const rawTxHex = `0x${serializedTx.toString('hex')}`;
        console.log('trawTxHex->', rawTxHex);
        return new Promise((resolve, reject) => {
          web3.eth
            .sendSignedTransaction(rawTxHex)
            .on('transactionHash', (hash) => {
              console.log('hash->', hash);
              resolve({ status: 1, message: 'messages.ethereum.success.transaction',
                data: {hash: hash}
              });
            })
            .on('error', error => ({
              hash: -1,
              error,
            }));
        });
      })
      .catch(error => {
        console.log("error", error);
        return { status: 0, message: 'messages.ethereum.error.insufficient' };
      });
    } catch (error) {
      console.log("error", error);
      return { status: 0, message: 'messages.ethereum.error.insufficient' };
    }
  }

   async getNonce(accountAddress){
    const web3 = this.getWeb3();
    const nonce = await web3.eth
      .getTransactionCount(accountAddress, 'pending', (error, result) => {
        console.log(' getNonce error', error, ' result = ', result);
      })
      .then((_nonce) => {
        this.lastResultNonce =
          this.lastResultNonce >= _nonce ? this.lastResultNonce + 1 : _nonce;
        console.log('getNonce 0000-- ', this.lastResultNonce);
        return this.lastResultNonce;
      });
    return nonce;
  };

  // Transction history....
  getAPIUrlAddress(tab) {
    let url = this.network == Ethereum.Network.Mainnet ? "https://etherscan.io/address/"+this.address : "https://rinkeby.etherscan.io/address/"+this.address;
    if(tab == 1) url += "#internaltx";
    return url;
  }

  getAPIUrlTransaction(hash) {
    let url = this.network == Ethereum.Network.Mainnet ? "https://etherscan.io/tx/"+hash : "https://rinkeby.etherscan.io/tx/"+hash;
    return url;
  }

  async getBalanceEthScan(){
    try{
      const API_KEY = configs.network[4].apikeyEtherscan;
      const url = `${this.constructor.API[this.getNetworkName()]}?module=account&action=balance&address=${this.address}&tag=latest&apikey=${API_KEY}`;
      const response = await axios.get(url);
      if (response.status == 200) {
        return Web3.utils.fromWei(response.data.result);
      }
    }
    catch (error) {
      return this.balance;
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

  async listInternalTransactions() {
    let result = [];
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url = `${this.constructor.API[this.getNetworkName()]}?module=account&action=txlistinternal&address=${this.address}&startblock=0&endblock=99999999&sort=desc&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      result = response.data.result;
    }
    return result;
  }

  async getInternalTransactions(hash) {
    let result = [];
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url = `${this.constructor.API[this.getNetworkName()]}?module=account&action=txlistinternal&txhash=${hash}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      let arr = response.data.result;
      if(arr && arr.length > 0) {
        const w = new Ethereum();
        arr.forEach((e) => {
          let from = e.from;
          w.address = from;
          from = w.getShortAddress();

          let to = e.to;
          w.address = to;
          to = w.getShortAddress();

          let amount = e.value;
          amount = Number(amount / 1000000000000000000);

          result.push({from: from, to: to, amount: amount})
        });
      }
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

  formatNumber(value, decimal=6){
    let result = value, count = 0;
    try {
      if(!isNaN(value)) result = Number(value);

      if (Math.floor(value) !== value)
          count = value.toString().split(".")[1].length || 0;

      if(count > decimal)
        result = Number(value).toFixed(decimal);
    }
    catch(e) {
      result = value;
    }

    return result;
  }

  cook(data){
    let value = 0, transaction_date = new Date(), addresses = [],
      is_sent = 0, is_error = false, transaction_no = "", token = {}, coin_name = "ETH";

    if(data){
      try{
        value = Number(data.value / 1000000000000000000);
        value = this.formatNumber(value);
        transaction_date = new Date(data.timeStamp*1000);
        is_error = Boolean(data.isError == "1");
        transaction_no = data.hash;

        if(String(data.from).toLowerCase() == this.address.toLowerCase() && String(data.to).toLowerCase() != this.address.toLowerCase())
          is_sent = 1;
        else if (String(data.from).toLowerCase() != this.address.toLowerCase() && String(data.to).toLowerCase() == this.address.toLowerCase())
          is_sent = 2;
      }
      catch(e){
        console.error(e);
      }

      let addr = data.from;
      if(is_sent == 1) addr = data.to;

      token = this.checkToken(addr);
      if(token.result){
        coin_name = token.name
        //let a = this.getTransactionReceipt(transaction_no);
      }

      addresses.push(addr.replace(addr.substr(4, 34), '...'));
    }

    return {
      coin_name: coin_name,
      value: value,
      transaction_no: transaction_no,
      transaction_date: transaction_date,
      transaction_relative_time:  moment(transaction_date).fromNow(),
      addresses: addresses,
      is_sent: is_sent,
      is_error: is_error
    };
  }

  async getTransaction(hash) {
    let result = false;
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url = `${this.constructor.API[this.getNetworkName()]}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      result = response.data.result;

      const web3 = this.getWeb3();
      result.gas = web3.utils.hexToNumber(result.gas);
      result.gasPrice = web3.utils.hexToNumber(result.gasPrice);
      result.value = web3.utils.hexToNumber(result.value);
      result.transactionIndex = web3.utils.hexToNumber(result.transactionIndex);
    }
    return result;
  }

  cookIT(data){
    let value = 0, transaction_date = new Date(), toAddress = "", is_error = false,
    transaction_no = "", is_sent = 0, addresses = [];

    if(data){
      try{
        value = Number(data.value / 1000000000000000000);
        value = this.formatNumber(value);
        transaction_date = new Date(data.timeStamp*1000);
        is_error = Boolean(data.isError == "1");
        transaction_no = data.hash;

        if(data.type == "create")
          is_sent = 3;
        else if(String(data.from).toLowerCase() == this.address.toLowerCase() && String(data.to).toLowerCase() != this.address.toLowerCase())
          is_sent = 1;
        else if (String(data.from).toLowerCase() != this.address.toLowerCase() && String(data.to).toLowerCase() == this.address.toLowerCase())
          is_sent = 2;

        const w = new Ethereum();
        w.address = data.to;
        toAddress = w.getShortAddress();
      }
      catch(e){
        console.error(e);
      }

      let addr = data.from;
      if(is_sent == 1) addr = data.to;

      addresses.push(addr.replace(addr.substr(4, 34), '...'));
    }

    return {
      value: value,
      transaction_no: transaction_no,
      transaction_date: transaction_date,
      transaction_relative_time:  moment(transaction_date).fromNow(),
      addresses: addresses,
      is_error: is_error,
      is_sent: is_sent
    };
  }


  checkToken(addr){
    return {result: addr == "0xc2f227834af7b44a11a9286f1771cade7ecd316c", name: "SHURI"}
  }

  getTokenValue(hash){

  }
}


export default { Ethereum };
