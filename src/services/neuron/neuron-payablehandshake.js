import configs from '../../configs';

export default class PayableHandshake {
  constructor(_neuron) {
    const web3 = _neuron.getWeb3();
    const compiled = _neuron.getCompiled('PayableHandshake');
    this.instance = new web3.eth.Contract(
      compiled.abi,
      configs.payableHandshakeAddress,
    );
    this.neuron = _neuron;
    this.web3 = web3;
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
      'init',
      address,
      privateKey,
      toAddress,
      value,
      deliveryDate,
      offchain,
    );
    const weiValue = this.web3.utils.toWei(value, 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .init(toAddress, weiValue, deliveryDate, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: configs.payableHandshakeAddress,
        arguments: {
          toAddress,
          value,
          deliveryDate,
          offchain,
        },
        gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
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
    const payloadData = this.instance.methods
      .initByPayer(payee, weiValue, deliveryDate, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: configs.payableHandshakeAddress,
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
    const payloadData = this.instance.methods
      .shake(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      amount,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  deliver = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('deliver', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .deliver(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  withdraw = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('withdraw', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .withdraw(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  reject = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('reject', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .reject(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  accept = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('accept', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .accept(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  cancel = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('cancel', address, privateKey, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .cancel(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.payableHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId ? 100 : 20))(),
    });
  };
  handshakesOf = (address) => {
    console.log('payableHandshakesOf', address);
    return this.instance.methods.handshakesOf(address).call();
  };
}
