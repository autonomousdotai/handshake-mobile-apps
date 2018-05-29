
import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { Wallet } from '@/models/Wallet.js';

const bitcore = require('bitcore-lib');
const BigNumber = require('bignumber.js');

export class Bitcoin extends Wallet {
    static Network = { Mainnet: 'https://test-insight.bitpay.com/api' }

    constructor() {
      super();
      this.coinType = 0;
      this.name = 'BTC';
      this.title = 'Bitcoin';
      this.className = 'Bitcoin';
    }

    getShortAddress() {
      return this.address.replace(this.address.substr(12, 19), '...');
    }

    createAddressPrivatekey() {
      const Mnemonic = require('bitcore-mnemonic');

      const code = new Mnemonic(this.mnemonic);

      const xpriv1 = code.toHDPrivateKey();

      const hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
      const hdPublicKey = hdPrivateKey.hdPublicKey;

      const address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.livenet);

      const derived = hdPrivateKey.derive('m/{0}\''.format(this.coinType));
      const wif = derived.privateKey.toWIF();

      this.address = address.toString();
      this.privateKey = derived.xprivkey;
    }

    async getBalance() {
      const url = `${this.network}/addr/${this.address}/balance`;

      const response = await axios.get(url);

      if (response.status == 200) {
        return await satoshi.toBitcoin(response.data);
      }
      return false;
    }


    async transfer(privateKey, to, amount) {
      const server = 'https://test-insight.bitpay.com/api';
      console.log(`server:${server}`);

      if (server.toString().includes('test')) {
        bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
      }

      const prKey = bitcore.HDPrivateKey(privateKey).privateKey.toString();

      const pubKey = bitcore.HDPublicKey(privateKey);

      const address = new bitcore.Address(pubKey.publicKey).toString();

      console.log(`transfered from address:${address}`);

      // each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
      const amountBig = new BigNumber(amount.toString());
      const satoShiRate = new BigNumber('100000000');
      amount = amountBig.times(satoShiRate).toString();

      const data = {};
      const fee = await this.getFee(server, 4);
      // console.log("fee:" + fee);
      if (fee) {
        data.fee = fee;
        const utxos = await this.utxosForAmount(server, address, Number(amount));
        // console.log("utxos:" + utxos);
        if (utxos) {
          console.log(utxos);
          data.utxos = utxos;

          const transaction = new bitcore.Transaction()
            .from(data.utxos)
            .change(address)
            .fee(data.fee)
            .to(to, Number(amount))
            .sign(prKey);

          console.log(transaction);
          const rawTx = transaction.serialize();
          const txHash = await this.sendRawTx(server, rawTx);
          // console.log(txHash);
          return txHash;
        }
      }
    }


    async retrieveUtxos(server, address) {
      const url = `${server}/addr/${address}/utxo`;

      const response = await axios.get(url);
      console.log(response);

      if (response.status == 200) {
        const utxos = response.data;
        utxos.sort((a, b) => b.satoshis - a.satoshis);
        return utxos;
      }
      return false;
    }

    async utxosForAmount(server, address, amount) {
      const utxos = await this.retrieveUtxos(server, address);


      if (utxos && utxos.length > 0) {
        const result = this.findUtxos(utxos, 0, amount, []);
        if (!result) { return reject({ error: 'Insufficent Balance' }); }
        return result;
      }
      return false;
    }

    findUtxos(utxos, pos, amount, result) {
      // console.log("findUtxos");
      if (pos >= utxos.length) { return null; }

      const utxo = utxos[pos];
      result.push(utxo);
      // console.log("utxo.satoshis >= amount"+utxo.satoshis+":"+ amount);

      if (utxo.satoshis >= amount) { // in case of enough money
        return result;
      }
      amount -= utxo.satoshis;

      return findUtxos(utxos, pos + 1, amount, result);
    }

    async getFee(server, blocks) {
      const url = `${server}/utils/estimatefee?nbBlocks=${blocks}`;
      const response = await axios.get(url);

      if (response.status == 200) {
        const txFee = bitcore.Unit.fromBTC(response.data[blocks]).toSatoshis();
        // console.log("data.txFee:" + txFee);

        return txFee;
      }
      return false;
    }

    async sendRawTx(server, rawTx) {
      console.log('sendRawTx');

      const txHash = await axios.post(`${server}/tx/send`, {
        rawtx: rawTx,
      });
      if (txHash.status == 200) {
        return txHash.data;
      }
      return false;
    }
}

export default { Bitcoin };
