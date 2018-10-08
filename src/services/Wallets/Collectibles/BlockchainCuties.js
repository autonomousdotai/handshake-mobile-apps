import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/BlockchainCuties.json');

export class BlockchainCuties extends TokenERC721 {

    constructor() {
      super();
      this.className = 'BlockchainCuties';
      this.isToken = true;
      this.contractAddress = '0xd73be539d6b2076bab83ca6ba62dfe189abc6bbe';
      this.decimals = 0;
      this.customToken = true;
      this.title = "BlockchainCuties";
      this.name = "BC";
    }  
}

export default { BlockchainCuties };
