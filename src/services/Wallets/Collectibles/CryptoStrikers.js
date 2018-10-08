import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');

const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CryptoStrikers.json');

export class CryptoStrikers extends TokenERC721 {
  constructor() {
    super();
    this.className = 'CryptoStrikers';
    this.isToken = true;
    this.contractAddress = '0xdcaad9fd9a74144d226dbf94ce6162ca9f09ed7e';
    this.decimals = 0;
    this.customToken = true;
    this.title = 'CryptoStrikers';
    this.name = 'STRK';
  }
}

export default { CryptoStrikers };
