import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CryptoZodiacs.json');

export class CryptoZodiacs extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CryptoZodiacs';
      this.isToken = true;
      this.contractAddress = '0x59c36e47c4490efb7a48d5ec4c68ea8a725c1c56';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CryptoZodiacs";
      this.name = "CZ";
    }  
}

export default { CryptoZodiacs };
