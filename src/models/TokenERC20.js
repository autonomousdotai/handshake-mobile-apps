import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/models/Ethereum.js';

const Web3 = require('web3');
const BN = Web3.utils.BN;

var erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"}];

export class TokenERC20 extends Ethereum {

    constructor() {
      super();
      this.className = 'TokenERC20';
      this.isToken = true;
      this.contractAddress = '';
      this.decimals = 18;
    }

    async initInfo(){
        const web3 = this.getWeb3();      
        let instance = new web3.eth.Contract(
            erc20Abi,
            this.contractAddress,
        );
        this.title = await instance.methods.name().call();
        this.name = await instance.methods.symbol().call();
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

export default { Ethereum };
