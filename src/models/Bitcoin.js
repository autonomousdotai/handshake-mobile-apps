
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

    setDefaultNetwork(){      
      bitcore.Networks.defaultNetwork = bitcore.Networks.livenet; 
      console.log("Bitcoin network: ", bitcore.Networks.defaultNetwork);     
    }

    createAddressPrivatekey(){

      this.setDefaultNetwork();
      
      let Mnemonic = require('bitcore-mnemonic');
           
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
      this.privateKey  = derived.privateKey.toString();
      //this.xprivateKey = derived.xprivkey;

  }

    async getBalance() {

      this.setDefaultNetwork();

      var url = this.network + '/addr/' + this.address + '/balance';

      var response = await axios.get(url);

      if (response.status == 200){
        return await satoshi.toBitcoin(response.data);
      }
      return false;
    }


  async transfer(toAddress, amountToSend){ 
    
    await this.setDefaultNetwork();

    console.log('bitcore.Networks.defaultNetwork', bitcore.Networks.defaultNetwork);
    console.log('server', this.network);

    try{
      console.log("transfered from address:" + this.address);

      //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
      var amountBig = new BigNumber(amountToSend.toString());
      var satoShiRate = new BigNumber('100000000');
      amountToSend = amountBig.times(satoShiRate).toString();

      var data = {};
      var fee = await this.getFee(4);
      
      console.log("fee:", + fee);
      
      if(fee){
        
        data.fee = fee;
        var utxos = await this.utxosForAmount(Number(amountToSend));
        
        console.log("utxos", utxos);
        
        if(utxos){                
          
          data.utxos = utxos;
          var fromAddress = this.address;
          var privateKey = this.privateKey;
          var transaction = new bitcore.Transaction()
            .from(data.utxos)
            .change(fromAddress)
            .fee(data.fee)
            .to(toAddress, Number(amountToSend))
            .sign(privateKey);

          console.log("transaction", transaction);
          var rawTx = transaction.serialize();
          var txHash = await this.sendRawTx(rawTx);
          
          console.log(txHash);

          return "Please allow for 30 seconds before transaction appears on blockchain";
        }
        else{
          // need update error code:
            return "You don't have enough Satoshis to cover the miner fee.";            
        }
      }
    }
    catch (error) {
      return error;
    }
    return false;
  }

  async retrieveUtxos () {
    
    var url = this.network +'/addr/' + this.address + '/utxo';

    var response = await axios.get(url);    

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
    var utxos = await this.retrieveUtxos();    
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
   
     var txHash = await axios.post(uri, {
       rawtx: rawTx
     });
     if (txHash.status == 200) {
       return txHash.data;
     }
      return false;
   }
}