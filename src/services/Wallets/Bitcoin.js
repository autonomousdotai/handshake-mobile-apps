import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { StringHelper } from '@/services/helper';
import { Wallet } from '@/services/Wallets/Wallet';
import { NB_BLOCKS } from '@/constants';
import { set, getJSON } from 'js-cookie';

const bitcore = require('bitcore-lib');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const COOKIE_LEVEL_FEES = 'btc_level_fees';

export class Bitcoin extends Wallet {
  static Network = { Mainnet: 'https://insight.bitpay.com/api' }

  constructor() {
    super();

    this.coinType = 0;
    this.name = 'BTC';
    this.title = 'Bitcoin';
    this.className = 'Bitcoin';
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 26), '...');
  }

  setDefaultNetwork() {
    bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;
  }

  getAPIUrlTransaction(transaction_no) {
    let url = `https://${bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? '' : 'test-'}insight.bitpay.com/tx/${transaction_no}`;
    return url;
  }

  getAPIUrlAddress() {
    let url = `https://${bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? '' : 'test-'}insight.bitpay.com/address/${this.address}`;
    return url;
  }

  createAddressPrivatekey() {
    this.setDefaultNetwork();

    const Mnemonic = require('bitcore-mnemonic');

    let code = null;

    if (this.mnemonic == '') {
      code = new Mnemonic();
      this.mnemonic = code.phrase;
    } else { code = new Mnemonic(this.mnemonic); }

    const xpriv = code.toHDPrivateKey();

    const hdPrivateKey = new bitcore.HDPrivateKey(xpriv);
    const derived = hdPrivateKey.derive(StringHelper.format('m/44\'/{0}\'/0\'/0/0', this.coinType));
    this.address = derived.privateKey.toAddress().toString();
    this.privateKey = derived.privateKey.toString();
  }

  async getBalance(isFormatNumber) {
    this.setDefaultNetwork();

    const url = `${this.network}/addr/${this.address}/balance`;
    const response = await axios.get(url);

    if (response.status == 200) {
      if(isFormatNumber)
        return this.formatNumber(await satoshi.toBitcoin(response.data));
      else
        return await satoshi.toBitcoin(response.data);
    }
    return false;
  }

  checkAddressValid(toAddress) {
    if (!bitcore.Address.isValid(toAddress)) {
      return 'messages.bitcoin.error.invalid_address';
    }
    return true;
  }


  async transfer(toAddress, amountToSend, opt) {
    try {
      if (!bitcore.Address.isValid(toAddress)) {
        return { status: 0, message: 'messages.bitcoin.error.invalid_address2' };
      }

      let blocks = opt.blocks || NB_BLOCKS;
      let fee = opt.fee || 0;

      console.log('toAddress:', toAddress,
      '\n param blocks:', blocks,
      '\n param fee:', fee);

      // Check balance:
      const balance = await this.getBalance();
      amountToSend = parseFloat(amountToSend).toFixed(8)

      console.log('defaultNetwork: ', bitcore.Networks.defaultNetwork,
      '\n server', this.network,
      '\n balance:', balance,
      '\n amountToSend:', amountToSend);

      if (!balance || balance == 0 || balance <= amountToSend) {
        return { status: 0, message: 'messages.bitcoin.error.insufficient' };
      }

      // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
      const amountBig = new BigNumber(amountToSend.toString());
      const satoshiRate = new BigNumber('100000000');
      amountToSend = amountBig.times(satoshiRate).toString();

      if(!fee){
        fee = await this.getFee(blocks);
      }

      if (fee) {
        const utxos = await this.utxosForAmount(Number(amountToSend) + Number(fee));

        if (utxos != false) {
          const fromAddress = this.address;
          const privateKey = this.privateKey;
          const transaction = new bitcore.Transaction()
            .from(utxos)
            .change(fromAddress)
            .fee(fee)
            .to(toAddress, Number(amountToSend))
            .sign(privateKey);

          const rawTx = transaction.serialize();
          const txHash = await this.sendRawTx(rawTx);

          return { status: 1, message: 'messages.bitcoin.success.transaction', data: { hash: txHash.txid } };
        }

        return { status: 0, message: 'messages.bitcoin.error.insufficient' };
      }
    } catch (error) {
      console.log('error', error);
      return { status: 0, message: 'messages.bitcoin.error.insufficient' };
    }
  }

  async retrieveUtxos() {
    const url = `${this.network}/addr/${this.address}/utxo`;

    const response = await axios.get(url);

    if (response.status == 200) {
      const utxos = response.data;
      utxos.sort((a, b) => b.satoshis - a.satoshis);
      return utxos;
    }
    return false;
  }

  async utxosForAmount(amount) {
    const utxos = await this.retrieveUtxos();
    if (utxos && utxos.length > 0) {
      const result = this.findUtxos(utxos, 0, amount, []);
      if (!result) return false;
      return result;
    }
    return false;
  }

  findUtxos(utxos, pos, amount, result) {
    if (pos >= utxos.length) { return null; }

    const utxo = utxos[pos];
    result.push(utxo);

    // in case of enough money
    if (utxo.satoshis >= amount) {
      return result;
    }
    amount -= utxo.satoshis;
    return this.findUtxos(utxos, pos + 1, amount, result);
  }

  async getFee(blocks = NB_BLOCKS, toBTC) {
    const url = `${this.network}/utils/estimatefee?nbBlocks=${blocks}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      let txFee = '';
      if (toBTC) {
        txFee = bitcore.Unit.fromBTC(response.data[blocks]).toBTC();
      } else {
        txFee = bitcore.Unit.fromBTC(response.data[blocks]).toSatoshis();
      }
      return txFee;
    }
    return false;
  }

  async sendRawTx(rawTx) {
    const uri = `${this.network}/tx/send`;
    const txHash = await axios.post(uri, {
      rawtx: rawTx,
    });
    if (txHash.status == 200) {
      return txHash.data;
    }
    return false;
  }

  async listInternalTransactions() {
    return [];
  }

  async getTransaction() {
    return false;
  }

  async getTransactionHistory(pageno) {
    const from = (pageno - 1) * 20;
    const to = from + 20;
    const url = `${this.network}/addrs/${this.address}/txs/?from=${from}&to=${to}`;
    const response = await axios.get(url);
    let result = [];
    if (response.status == 200) {
      if (response.data && response.data.items) {
        result = response.data.items;
      }
    }

    return result;
  }

  async getTransactionCount() {
    const url = `${this.network}/addrs/${this.address}/txs/?from=0&to=1`;
    const response = await axios.get(url);
    let result = 0;
    if (response.status == 200) {
      if (response.data && response.data.totalItems) {
        result = response.data.totalItems;
      }
    }

    return result;
  }

  formatNumber(value, decimal=6){
    let result = value, count = 0;
    try {
      if (Math.floor(value) !== value)
          count = value.toString().split(".")[1].length || 0;

      if(count > decimal)
        result = value.toFixed(decimal);
    }
    catch(e) {
      result = value;
    }

    return result;
  }

  cook(data){
    let vin = {}, vout = {}, coin_name = this.name,
        is_sent = 2, value = 0,
        addresses = [], confirmations = 0, transaction_no = "",
        transaction_date = new Date();

    if(data){
      transaction_no = data.txid;
      vin = data.vin;
      vout = data.vout;
      confirmations = data.confirmations,
      transaction_date = data.time ? new Date(data.time*1000) : "";

      try{
        //check transactions are send
        for(let tin of vin){
          if(!tin.addr) tin.addr = "";

          if(tin.addr.toLowerCase() == this.address.toLowerCase()){
            is_sent = 1;

            for(let tout of vout){
              if(tout.scriptPubKey.addresses){
                let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();
                if(tout_addresses.indexOf(this.address.toLowerCase()) < 0){
                  value += Number(tout.value);
                  addresses.push(tout_addresses.replace(tout_addresses.substr(4, 26), '...'));
                }
              }

            }

            break;
          }
        }

        //check transactions are receive
        if(is_sent != 1 && vout){
          for(let tout of vout){
            if(tout.scriptPubKey.addresses){
              let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();

              if(tout_addresses.indexOf(this.address.toLowerCase()) >= 0){
                value += tout.value;
              }
              else{
                addresses.push(tout_addresses.replace(tout_addresses.substr(4, 26), '...'));
              }
            }
          }
        }
      }
      catch(e){
        console.error(e);
      }

      value = this.formatNumber(value);
      if(addresses.length < 1) addresses.push("Unparsed address");
    }

    return {
      coin_name: coin_name,
      value: value,
      transaction_no: transaction_no,
      transaction_date: transaction_date,
      addresses: addresses,
      transaction_relative_time:  transaction_date ? moment(transaction_date).fromNow() : "",
      confirmations: confirmations,
      is_sent: is_sent
    };
  }

  cookIT(data) {
    return false;
  }

  getLevelFee = async () => {
    return new Promise((resolve, reject) => {
      let result = getJSON(COOKIE_LEVEL_FEES);
      if(result && result.length){
        resolve(result);
      }
      else{
        result = [];

        let calcTimeFee = (item) => {
          try{
            let value = (item.feePerKb / 100000000);
            let feePrice = value;
            value = this.formatNumber(value, 8);

            let min = item.nbBlocks * 10;
            let title = item.level.charAt(0).toUpperCase() + item.level.slice(1);;
            if(title == "Economy")
              title = 'Low';
            else if(title == "SuperEconomy")
              title = 'Lowest';
            else if(title == "Urgent")
              min = min/2;

            return {title, description: `${value} BTC ~ ${min} min${min > 1 ? 's' : ''}`, value: item.feePerKb, feePrice};
          }
          catch(e){
            console.error(e);
          }

          return {title: title, description: '', value: 0, feePrice: 0};
        }


        axios.get(`https://bws.bitpay.com/bws/api/v2/feelevels/?coin=btc&network=${bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? 'livenet' : 'testnet'}`)
        .then(({ data }) => {
          let isDup = false, lastValue = 0, removeLevel = 'superEconomy';
          for(let item of data){
            if(lastValue == item.feePerKb){
              isDup = true;
              removeLevel = '';
            }

            if(!isDup && item.level != removeLevel){
              result.unshift(calcTimeFee(item));
            }

            lastValue = item.feePerKb;
            isDup = false;
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
}

export default { Bitcoin };
