
import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import {Wallet} from '@/models/Wallet.js'
var bitcore=  require('bitcore-lib');
var BigNumber = require('bignumber.js');

export class Bitcoin extends Wallet{

    static Network = {"Mainnet": 'https://test-insight.bitpay.com/api'}

    constructor() {
      super();
      this.coinType = 0;
      this.name = 'BTC';
      this.title = 'Bitcoin';
      this.className = "Bitcoin";
    }

    getShortAddress(){
      return this.address.replace(this.address.substr(12, 19), '...');
    }

    createAddressPrivatekey(){

      let Mnemonic = require('bitcore-mnemonic');

      let  code = new Mnemonic(this.mnemonic);

      let xpriv1 = code.toHDPrivateKey();

      let hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
      let hdPublicKey = hdPrivateKey.hdPublicKey;

      let address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.livenet);

      var derived = hdPrivateKey.derive("m/{0}'".format(this.coinType));
      var wif = derived.privateKey.toWIF();

      this.address = address.toString();
      this.privateKey = derived.xprivkey;
  }

    async getBalance() {
      var url = this.network + '/addr/' + this.address + '/balance';

      var response = await axios.get(url);

      if (response.status == 200){
        return await satoshi.toBitcoin(response.data);
      }
      return false;
    }


  async transfer(privateKey, to, amount){
    var server = "https://test-insight.bitpay.com/api";
    console.log("server:" + server);

    if(server.toString().includes("test")){
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
    }

    var prKey = bitcore.HDPrivateKey(privateKey).privateKey.toString();

    var pubKey = bitcore.HDPublicKey(privateKey);

    var address = new bitcore.Address(pubKey.publicKey).toString();

    console.log("transfered from address:" + address);

    //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    var amountBig = new BigNumber(amount.toString());
    var satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    var data = {};
    var fee = await this.getFee(server, 4);
    //console.log("fee:" + fee);
    if(fee){
      data.fee = fee;
      var utxos = await this.utxosForAmount(server, address,Number(amount));
      //console.log("utxos:" + utxos);
      if(utxos){
        console.log(utxos);
        data.utxos = utxos;

        var transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(address)
          .fee(data.fee)
          .to(to,Number(amount))
          .sign(prKey);

        console.log(transaction);
        var rawTx = transaction.serialize();
        var txHash = await this.sendRawTx(server,rawTx);
        //console.log(txHash);
        return txHash;
      }
    }
  }



  async retrieveUtxos (server, address) {
    var url = server +'/addr/' + address + '/utxo';

    var response = await axios.get(url);
    console.log(response);

    if (response.status == 200){
      var utxos = response.data;
      utxos.sort(function(a, b) {
        return b.satoshis - a.satoshis;
      });
      return utxos;

    }
    return false;
  }

  async utxosForAmount(server, address, amount) {
    var utxos = await this.retrieveUtxos(server, address);


    if (utxos && utxos.length > 0 ){
      var result = this.findUtxos(utxos, 0, amount, []);
      if(!result)
        return reject({"error": "Insufficent Balance"});
      return result;
    }
    return false;
  }

  findUtxos (utxos, pos, amount , result) {
      //console.log("findUtxos");
    if(pos >= utxos.length)
      return null;

    var utxo = utxos[pos];
    result.push(utxo);
    //console.log("utxo.satoshis >= amount"+utxo.satoshis+":"+ amount);

    if(utxo.satoshis >= amount){ //in case of enough money
      return result;
    }
    else{
      amount = amount - utxo.satoshis;

      return findUtxos(utxos, pos+1, amount, result);
    }
  }

  async getFee(server, blocks) {
    var url = server +'/utils/estimatefee?nbBlocks=' + blocks;
    var response = await axios.get(url);

    if (response.status == 200){

      var txFee = bitcore.Unit.fromBTC(response.data[blocks]).toSatoshis();
      //console.log("data.txFee:" + txFee);

      return txFee;
    }
    return false;

  }

   async sendRawTx(server, rawTx) {
     console.log("sendRawTx");

     var txHash = await axios.post(server + '/tx/send', {
       rawtx: rawTx
     });
     if (txHash.status == 200) {
       return txHash.data;
     }
      return false;
   }
}
