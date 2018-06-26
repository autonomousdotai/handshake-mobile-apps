import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/models/Ethereum.js';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');

const BN = Web3.utils.BN;
const compiled = require('@/contracts/Shuriken.json');

export class Shuriken extends Ethereum {
  constructor() {
    super();
    this.name = 'SHURI';
    this.title = 'Shuriken';
    this.className = 'Shuriken';
  }
  async getBalance() {
    const web3 = this.getWeb3();
    const instance = new web3.eth.Contract(
      compiled.abi,
      configs.network[this.chainId].shurikenTokenAddress,
    );

    const balance = await instance.methods.balanceOf(this.address).call();

    return Web3.utils.fromWei(balance.toString());
  }
}

export default { Ethereum };
