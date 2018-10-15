const TAG = 'neuron-token';
// refactor not yet
export default class Token {
  constructor(_neuron) {
    this.neuron = _neuron;
  }
  generateTokenName = (features) => {
    const NAMES = {
      base: 'BAE',
      burnable: 'BUE',
      mintable: 'MIE',
      timelock: 'TIK',
      vesting: 'VET',
    };
    let name = 'TokenBAE';
    if (features) {
      features.sort().forEach((feature) => {
        if (NAMES[feature]) {
          name += NAMES[feature];
        }
      });
    }
    return name;
  };
  combineDeployInputs = (compiled, data) => {
    const result = [];
    const constructor = compiled.abi.find(item => item.type === 'constructor');
    constructor.inputs.forEach((input) => {
      let value = '';
      if (data[input.name]) {
        value = input.type.match('int')
          ? parseInt(data[input.name])
          : data[input.name];
      } else if (data[input.name.replace('_', '')]) {
        value = input.type.match('int')
          ? parseInt(data[input.name.replace('_', '')])
          : data[input.name.replace('_', '')];
      } else {
        value = input.type.match('int') ? 0 : '';
      }
      result.push(value);
    });
    return result;
  };
  // deploy = async (address, privateKey, features, data) => {
  //   try {
  //     const web3 = this.neuron.getWeb3();
  //     const tokenName = this.generateTokenName(features);
  //     const compiled = this.neuron.getCompiled(tokenName);
  //     const contract = new web3.eth.Contract(compiled.abi);
  //     const deployInputs = this.combineDeployInputs(compiled, data);
  //     const contractData = contract
  //       .deploy({ data: compiled.bytecode, arguments: deployInputs })
  //       .encodeABI();
  //     const hash = await this.neuron.makeRawTransaction(
  //       address,
  //       privateKey,
  //       contractData,
  //     );
  //     console.log(`${TAG} deloy hash = ${hash}`);
  //     const receipt = await this.neuron.getTransactionReceipt(hash);
  //     return {
  //       contractAddress: receipt.contractAddress,
  //       contractName: tokenName,
  //     };
  //   } catch (e) {
  //     console.log(`token deploy fail: ${e.message}`);
  //   }
  //   return false;
  // };
  balanceOf = async (address, tokenName, tokenAddress, owner) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const balance = await instance.methods
      .balanceOf(owner)
      .call({ from: address });
    return balance;
  };
  getPrice = async (address, tokenName, tokenAddress) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const price = await instance.methods.getPrice().call({ from: address });
    return price;
  };
  setPrice = async (address, privateKey, tokenName, tokenAddress, price) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods.setPrice(price).encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
  mint = async (
    address,
    privateKey,
    tokenName,
    tokenAddress,
    toAddress,
    amount,
    type,
  ) => {
    if (tokenName.match('MIE')) {
      throw new Error('The token can\'t mint');
    }
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods
      .mint(toAddress, amount)
      .encodeABI();
    const hash = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
  burnMultiSig = async (abi, contractName, address, amount, type) => {
    if (tokenName.match('BUE')) {
      throw new Error('The token can\'t burn');
    }
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods.burnMultiSig(amount).encodeABI();
    const hash = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
  transfer = async (
    address,
    privateKey,
    tokenName,
    tokenAddress,
    toAccount,
    amount,
  ) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods
      .transfer(toAccount, amount)
      .encodeABI();
    const hash = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
  transferMultiSig = async (
    address,
    privateKey,
    tokenName,
    tokenAddress,
    ref,
    daoAddress,
    toAccount,
    amount,
  ) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods
      .transferMultiSig(ref, daoAddress, toAccount, amount)
      .encodeABI();
    const hash = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
  setPriceMultiSig = async (
    address,
    privateKey,
    tokenName,
    tokenAddress,
    ref,
    price,
  ) => {
    const web3 = this.neuron.getWeb3();
    const compiled = await this.neuron.getCompiled(tokenName);
    const instance = new web3.eth.Contract(compiled.abi, tokenAddress);
    const payloadData = await instance.methods
      .setPriceMultiSig(ref, price)
      .encodeABI();
    const hash = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: tokenAddress,
      },
    );
    return hash;
  };
}
