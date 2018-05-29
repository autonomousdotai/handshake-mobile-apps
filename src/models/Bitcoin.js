
import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import {Wallet} from '@/models/Wallet.js'
var bitcore=  require('bitcore-lib');
var BigNumber = require('bignumber.js');

export class Bitcoin extends Wallet{

    static Network = {"Mainnet": 'https://insight.bitpay.com/api'}

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

    getNetwork(){
      return bitcore.Networks.livenet;
    }

    createAddressPrivatekey(){

      let bitcore = require('bitcore-lib');
      let Mnemonic = require('bitcore-mnemonic');
      
      bitcore.Networks.defaultNetwork = this.getNetwork();      

      var code = null;
      
      if (this.mnemonic == ''){
        code = new Mnemonic();
        this.mnemonic = code.phrase;
      }
      else
        code = new Mnemonic(this.mnemonic);

      let xpriv = code.toHDPrivateKey();

      let hdPrivateKey = new bitcore.HDPrivateKey(xpriv);
      var derived = hdPrivateKey.derive("m/44'/{0}'/0'/0/0".format(this.coinType));
      this.address = derived.privateKey.toAddress().toString();

      console.log(bitcore.Networks.defaultNetwork);
            
      this.privateKey = derived.xprivkey;
      //this.privateKey = derived1.keyPair.toWIF(); ? why don't use it?
  }

    async getBalance() {
      var url = this.network + '/addr/' + this.address + '/balance';

      var response = await axios.get(url);

      if (response.status == 200){
        return await satoshi.toBitcoin(response.data);
      }
      return false;
    }


  async transfer(to, amount){    

    console.log("transfered from address:" + this.address);

    //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    var amountBig = new BigNumber(amount.toString());
    var satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    var data = {};
    var fee = await this.getFee(this.network, 4);
    
    // console.log("fee:" + fee);
    
    if(fee){
      data.fee = fee;
      var utxos = await this.utxosForAmount(this.network, this.address, Number(amount));      
      
      if(utxos){                
        
        data.utxos = utxos;

        var transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(address)
          .fee(data.fee)
          .to(to,Number(amount))
          .sign(prKey);

        console.log(transaction);
        var rawTx = transaction.serialize();
        var txHash = await this.sendRawTx(this.network, rawTx);
        // console.log(txHash);
        return txHash;
      }
    }
  }

  async retrieveUtxos () {
    
    var url = this.network +'/addr/' + this.address + '/utxo';

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

  async utxosForAmount(amount) {
    var utxos = await this.retrieveUtxos(this.network, this.address);
    if (utxos && utxos.length > 0 ){
      var result = this.findUtxos(utxos, 0, amount, []);
      if(!result)
        return reject({"error": "Insufficent Balance"});
      return result;
    }
    return false;
  }

  findUtxos (utxos, pos, amount , result) {      
    if(pos >= utxos.length)
      return null;

    var utxo = utxos[pos];
    result.push(utxo);    

    //in case of enough money
    if(utxo.satoshis >= amount){ 
      return result;
    }
    else{
      amount = amount - utxo.satoshis;
      return this.findUtxos(utxos, pos+1, amount, result);
    }
  }

  async getFee(blocks) {
    var url = this.network +'/utils/estimatefee?nbBlocks=' + blocks;
    var response = await axios.get(url);

    if (response.status == 200){

      var txFee = bitcore.Unit.fromBTC(response.data[blocks]).toSatoshis();      
      return txFee;
    }
    return false;
  }

   async sendRawTx(rawTx) {     

     var txHash = await axios.post(this.network + '/tx/send', {
       rawtx: rawTx
     });
     if (txHash.status == 200) {
       return txHash.data;
     }
      return false;
   }
}