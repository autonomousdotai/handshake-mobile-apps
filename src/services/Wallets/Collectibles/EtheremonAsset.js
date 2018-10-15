import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/EtheremonAsset.json');

export class EtheremonAsset extends TokenERC721 {

    constructor() {
      super();
      this.className = 'EtheremonAsset';
      this.isToken = true;
      this.contractAddress = '0xb2c0782ae4a299f7358758b2d15da9bf29e1dd99';
      this.decimals = 0;
      this.customToken = true;
      this.title = "EtheremonAsset";
      this.name = "EMONA";
    }  
}

export default { EtheremonAsset };
