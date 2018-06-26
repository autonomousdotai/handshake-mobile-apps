import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/models/Ethereum.js';

const Web3 = require('web3');
const BN = Web3.utils.BN;

// var erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"}];
var erc20Abi = [{"constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address"}, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" } ];
export class TokenERC20 extends Ethereum {

    constructor() {
      super();
      this.className = 'TokenERC20';
      this.isToken = true;
      this.contractAddress = '';
      this.decimals = 18;
      this.customToken = true;
    }

    async init(contractAddress, wallet){            

      this.network = wallet.network;      
      this.address = wallet.address;
      this.chainId = wallet.chainId;
      this.coinType = wallet.coinType;
      this.privateKey = wallet.privateKey;
      this.protected = wallet.protected;      
      this.mnemonic = wallet.mnemonic;      
      this.contractAddress = contractAddress;
      
      try{
        const web3 = this.getWeb3();      
        let instance = new web3.eth.Contract(
            erc20Abi,
            this.contractAddress,
        );        
        this.title = await instance.methods.name().call();
        this.name = await instance.methods.symbol().call();
        this.decimals = await instance.methods.decimals().call();        
        return true;

      }
      catch (e){
        console.log("error: ", e);
      }
      return false;
    }

    async getBalance(){
      const web3 = this.getWeb3();
      let instance = new web3.eth.Contract(
        erc20Abi,
        this.contractAddress
      );

      let balance = await instance.methods.balanceOf(this.address).call();

      return Web3.utils.fromWei(balance.toString());

    }
    
}

export default { TokenERC20 };
