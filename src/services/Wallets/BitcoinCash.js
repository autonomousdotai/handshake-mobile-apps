import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { StringHelper } from '@/services/helper';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import { NB_BLOCKS } from '@/constants';

const bitcore = require('bitcore-lib-cash');
const BigNumber = require('bignumber.js');
const moment = require('moment');

export class BitcoinCash extends Bitcoin {
  static Network = { Mainnet: 'https://bch-insight.bitpay.com/api' }

  constructor() {
    super();

    this.coinType = 0;
    this.name = 'BCH';
    this.title = 'Bitcoin Cash';
    this.className = 'BitcoinCash';
  }

  setDefaultNetwork() {
    bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;
  }

  getAPIUrlTransaction(transaction_no) {
    let url = `https://${bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? '' : 'test-'}bch-insight.bitpay.com/#/tx/${transaction_no}`;
    return url;
  }

  getAPIUrlAddress() {
    let url = `https://${bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? '' : 'test-'}bch-insight.bitpay.com/address/${this.address}`;
    return url;
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 34), '...');
  }

  checkAddressValid(toAddress) {
    if (!bitcore.Address.isValid(toAddress)) {
      return 'messages.bitcoin_cash.error.invalid_address';
    }
    return true;
  }

  createAddressPrivatekey() {
    super.createAddressPrivatekey();
    this.setDefaultNetwork();
    // get Cashaddr
    var address = new bitcore.PrivateKey(this.privateKey).toAddress();
    this.address = address.toString().split(':')[1];
  }
  async getBalance(isFormatNumber) {
    this.setDefaultNetwork();

    const url = `${this.network}/addr/${this.address}/balance`;
    const response = await axios.get(url);

    if (response.status == 200) {
      if(isFormatNumber)
        return this.formatNumber(response.data);
      else
        return response.data;
    }
    return false;
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
      console.log('defaultNetwork: ', bitcore.Networks.defaultNetwork,
      '\n server', this.network,
      '\n balance:', balance,
      '\n amountToSend:', amountToSend);

      if (!balance || balance == 0 || balance <= amountToSend) {
        return { status: 0, message: 'messages.bitcoin.error.insufficient' };
      }

      // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
      const amountBig = new BigNumber(amountToSend.toString());
      const satoShiRate = new BigNumber('100000000');
      amountToSend = amountBig.times(satoShiRate).toString();

      const data = {};
      if(!fee){
        fee = await this.getFee(blocks);
      }

      if (fee) {
        data.fee = fee;
        const utxos = await this.utxosForAmount(Number(amountToSend) + Number(fee));

        if (utxos != false) {
          data.utxos = utxos;
          const fromAddress = this.address;
          const privateKey = this.privateKey;
          const transaction = new bitcore.Transaction()
            .from(data.utxos)
            .change(fromAddress)
            .fee(data.fee)
            .to(toAddress, Number(amountToSend))
            .sign(privateKey);

          const rawTx = transaction.serialize();
          const txHash = await this.sendRawTx(rawTx);

          return { status: 1, message: 'messages.bitcoin.success.transaction', data: { hash: txHash.txid } };
        }

        return { status: 0, message: 'messages.bitcoin.error.insufficient' };
      }
    } catch (error) {
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

  cook(data){
    let vin = {}, vout = {}, coin_name = this.name,
        is_sent = false, value = 0,
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
          if(tin.addr.toLowerCase() == this.address.toLowerCase()){
            is_sent = true;

            for(let tout of vout){
              if(tout.scriptPubKey.addresses){
                let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();
                if(tout_addresses.indexOf(this.address.toLowerCase()) < 0){
                  value += Number(tout.value);
                  addresses.push(tout_addresses.replace(tout_addresses.substr(4, 34), '...'));
                }
              }
            }
            break;
          }
        }

        //check transactions are receive
        if(!is_sent && vout){
          for(let tout of vout){
            if(tout.scriptPubKey.addresses){
              let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();
              if(tout_addresses.indexOf(this.address.toLowerCase()) >= 0){
                value += tout.value;
              }
              else{
                addresses.push(tout_addresses.replace(tout_addresses.substr(4, 34), '...'));
              }
            }
          }
        }
      }
      catch(e){
        console.error(e);
      }
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

  getLevelFee = async () => {
    return new Promise((resolve, reject) => {
      resolve(false);
    });
  }
}

export default { BitcoinCash };
