import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { StringHelper } from '@/services/helper';
import { Wallet } from '@/services/Wallets/Wallet';
import { NB_BLOCKS } from '@/constants';

const bitcore = require('bitcore-lib');
const BigNumber = require('bignumber.js');
const moment = require('moment');

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

  async getBalance() {
    this.setDefaultNetwork();

    const url = `${this.network}/addr/${this.address}/balance`;
    const response = await axios.get(url);

    if (response.status == 200) {
      return await satoshi.toBitcoin(response.data);
    }
    return false;
  }

  getAPIUrlAddress() {
    let url = bitcore.Networks.defaultNetwork == bitcore.Networks.livenet ? "https://bitpay.com/api/txs/?address="+this.address : "https://test-insight.bitpay.com/address/"+this.address;
    return url;
  }

  checkAddressValid(toAddress) {
    if (!bitcore.Address.isValid(toAddress)) {
      return 'messages.bitcoin.error.invalid_address';
    }
    return true;
  }


  async transfer(toAddress, amountToSend, blocks = NB_BLOCKS) {
    try {
      if (!bitcore.Address.isValid(toAddress)) {
        return { status: 0, message: 'messages.bitcoin.error.invalid_address2' };
      }

      console.log(`transfered from address:${this.address}`);

      // Check balance:
      const balance = await this.getBalance();

      console.log('bitcore.Networks.defaultNetwork', bitcore.Networks.defaultNetwork);
      console.log('server', this.network);
      console.log(StringHelper.format('Your wallet balance is currently {0} ETH', balance));

      if (!balance || balance == 0 || balance <= amountToSend) {
        return { status: 0, message: 'messages.bitcoin.error.insufficient' };
      }

      // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
      const amountBig = new BigNumber(amountToSend.toString());
      const satoShiRate = new BigNumber('100000000');
      amountToSend = amountBig.times(satoShiRate).toString();

      const data = {};
      const fee = await this.getFee(blocks);

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

  async listInternalTransactions() {
    return [];
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

  formatNumber(value){
    let result = value, count = 0;
    try {
      if (Math.floor(value) !== value)
          count = value.toString().split(".")[1].length || 0;

      if(count > 6)
        result = value.toFixed(6);
    }
    catch(e) {

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
}

export default { Bitcoin };
