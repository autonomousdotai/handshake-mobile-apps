import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
import { TokenERC20 } from '@/services/Wallets/TokenERC20.js';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');
const BigNumber = require('bignumber.js');
const BN = Web3.utils.BN;
const compiled = require('@/contracts/Wallet/Constant.json');

const erc20Abi = compiled.abi;

export class Constant extends TokenERC20 {
  constructor() {
    super();
    this.name = 'CONST';
    this.title = 'Constant';
    this.className = 'Constant';
    this.decimals = 2;
    this.customToken = false; // autonomous add.
  }
  async getBalance() {
    const web3 = this.getWeb3();
    const contract = new web3.eth.Contract(
      erc20Abi,
      configs.network[this.chainId].constantTokenAddress
    );

    const balanceOf = await contract.methods.balanceOf(this.address).call();
    const tokenBalance = new BigNumber(balanceOf) / Math.pow(10, this.decimals);
    return tokenBalance;
  }

  async transfer(toAddress, amountToSend) {
    this.contractAddress = configs.network[this.chainId].constantTokenAddress;  
    return super.transfer(toAddress, amountToSend);
  }
}

export default { Constant };
