import Web3 from 'web3';
import bitcore from 'bitcore-lib';

class Blockchain {
  constructor(type) {
    this.type = type;
    switch (this.type) {
      case 'ERC20': this.isERC20 = true; break;
      case 'BTC': this.isBTC = true; break;
      default: throw Error('This type is not valid');
    }
    this.initObj = {};
    return this;
  }

  setInitObj(initObj) {
    this.initObj = initObj;
    return this;
  }

  connect(endpoint) {
    this.network = endpoint;
    if (this.isERC20) {
      const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
      this.connection = web3;
    }
    if (this.isBTC) {
      this.connection = bitcore;
    }
    return this;
  }

  setTest(needTest = true) {
    if (needTest) {
      this.isTest = true;
    }
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setUnit(unit) {
    this.unit = unit;
    return this;
  }

  setChainId(chainId) {
    this.chainId = chainId;
    return this;
  }
}

export default Blockchain;
