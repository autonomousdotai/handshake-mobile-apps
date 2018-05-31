import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';

const TAG = 'HandshakeProtocol';
export default class HandshakeProtocol extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }
  get contractFileNameWithoutExtension() {
    return 'HandshakeProtocol';
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
      TAG,
      ' init',
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
      toAddress: this.contractAddress,
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
      TAG,
      ' initByPayer',
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
      toAddress: this.contractAddress,
    });
  };
  shake = (address, privateKey, amount, hid, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, amount, hid);
    const payloadData = this.handshakeInstance.methods
      .shake(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: this.contractAddress,
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
      toAddress: this.contractAddress,
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
      toAddress: this.contractAddress,
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
      toAddress: this.contractAddress,
    });
  };
  reject = (address, privateKey, amount, hid, offchain) => {
    console.log(TAG, ' reject', address, privateKey, amount, hid, offchain);
    const payloadData = this.handshakeInstance.methods
      .reject(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: this.contractAddress,
    });
  };
  accept = (address, privateKey, amount, hid, offchain) => {
    console.log(TAG, ' accept', address, privateKey, amount, hid, offchain);
    const payloadData = this.handshakeInstance.methods
      .accept(hid, offchain, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: this.contractAddress,
    });
  };
  cancel = (address, privateKey, amount, hid, offchain) => {
    console.log(TAG, ' cancel', address, privateKey, amount, hid, offchain);
    const payloadData = this.handshakeInstance.methods
      .cancel(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: this.contractAddress,
    });
  };
}
