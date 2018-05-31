import BaseHandshake from './BaseHandshake';

export default class BasicHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'BasicHandshake';
  }

  init = (address, privateKey, toAddress, offchain = 'unknown') => {
    console.log('init', address, toAddress, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .init(toAddress, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: this.contractAddress,
        arguments: { toAddress, offchain },
        gasPrice: (() => (this.chainId === 4 ? 100 : 20))(),
      },
    );
    return hash;
  };

  shake = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('shake', address, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .shake(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: this.contractAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.chainId === 4 ? 100 : 20))(),
    });
  };
  handshakesOf = (address) => {
    console.log('basicHandshakesOf', address);
    return this.handshakeInstance.methods.handshakesOf(address).call();
  };
}
