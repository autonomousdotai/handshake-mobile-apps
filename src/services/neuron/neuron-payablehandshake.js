import BaseHandshake from './BaseHandshake';

const TAG = 'PayableHandshake';
export default class PayableHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }
  get contractFileNameWithoutExtension() {
    return 'PayableHandshake';
  }
  init = (
    address,
    privateKey,
    toAddress,
    value,
    deliveryDate,
    offchain = 'unknown',
  ) => {
    console.log(
      TAG,
      ' init',
      address,
      privateKey,
      toAddress,
      value,
      deliveryDate,
      offchain,
    );
    const weiValue = this.web3.utils.toWei(value, 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .init(toAddress, weiValue, deliveryDate, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: this.contractAddress,
        arguments: {
          toAddress,
          value,
          deliveryDate,
          offchain,
        },
        gasPrice: this.chainId ? 100 : 20,
      },
    );
    return hash;
  };
  initByPayer = (
    address,
    privateKey,
    payee,
    value,
    deliveryDate,
    offchain = 'unknown',
  ) => {
    console.log(
      'init by payer',
      address,
      privateKey,
      value,
      payee,
      deliveryDate,
      offchain,
    );
    const weiValue = this.web3.utils.toWei(value.toString(), 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .initByPayer(payee, weiValue, deliveryDate, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: this.contractAddress,
        amount: value,
        arguments: {
          payee,
          value,
          deliveryDate,
          offchain,
        },
      },
    );
    return hash;
  };

  shake = (address, privateKey, hid, amount, offchain = 'unknown') => {
    console.log('shake', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .shake(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      amount,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  deliver = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('deliver', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .deliver(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  withdraw = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('withdraw', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .withdraw(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  reject = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('reject', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .reject(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: this.chainId ? 100 : 20,
    });
  };
  accept = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('accept', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .accept(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  cancel = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('cancel', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .cancel(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  handshakesOf = (address) => {
    console.log('payableHandshakesOf', address);
    return this.handshakeInstance.methods.handshakesOf(address).call();
  };
}
