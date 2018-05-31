import Web3 from 'web3';
import configsAll from '../../configs';

let configs = {};
export default class Handshake {
  constructor(_neuron) {
    const web3 = _neuron.getWeb3();
    this.neuron = _neuron;
    this.web3 = web3;
    const compiled = _neuron.getCompiled('HandshakeProtocol');
    configs = configsAll.network[_neuron.chainId];
    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      configs.handshakeAddress,
    );
  }
  init = (
    address,
    privateKey,
    amount,
    value,
    term,
    deliveryDate,
    escrowDate,
    offchain,
  ) => {
    console.log(
      'eth-contract-service init',
      address,
      privateKey,
      amount,
      value,
      term,
      deliveryDate,
      escrowDate,
      offchain,
    );
    value = Web3.utils.toWei(value.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .init(value, term, deliveryDate, escrowDate, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  initByPayer = (
    address,
    privateKey,
    amount,
    value,
    term,
    deliveryDate,
    payee,
    offchain,
  ) => {
    console.log(
      'eth-contract-service initByPayer',
      address,
      privateKey,
      amount,
      value,
      term,
      deliveryDate,
      payee,
      offchain,
    );
    value = Web3.utils.toWei(value.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .initByPayer(value, term, deliveryDate, payee, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  shake = (address, privateKey, amount, hid, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, amount, hid);
    const payloadData = this.handshakeInstance.methods
      .shake(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  unshake = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service unshake',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .unshake(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  deliver = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service deliver',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .deliver(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  withdraw = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service withdraw',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .withdraw(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  reject = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service reject',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .reject(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  accept = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service accept',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .accept(hid, offchain, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  cancel = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .cancel(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
}
