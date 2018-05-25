// const configs = require('../../configs');
import configs from '../../configs';

const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const BN = Web3.utils.BN;

class Neuron {
  constructor(chainId = 4) {
    this.chainId = chainId || 4;
    this.web3 = null;
    this.instance = {};
  }

  getWeb3 = () => {
    if (!this.web3) {
      console.log(this.chainId);
      this.web3 = new Web3(new Web3.providers.HttpProvider(configs.network[this.chainId].blockchainNetwork));
    }
    return this.web3;
  };
  createAccount = () => {
    const web3 = this.getWeb3();
    const rs = web3.eth.accounts.create();
    return rs;
  };
  getBalance = async (address) => {
    const web3 = this.getWeb3();
    const balance = await web3.eth.getBalance(address);
    console.log(balance);
    return Web3.utils.fromWei(balance.toString());
  };

  getTransactionReceipt = async (hash) => {
    const web3 = this.getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(hash);
    console.log(`getTransactionReceipt ${JSON.stringify(receipt)}`);
    return receipt;
  };
}

export default Neuron;
