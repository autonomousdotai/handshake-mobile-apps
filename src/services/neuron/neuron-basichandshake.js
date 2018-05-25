import configs from '../../configs';

export default class BasicHandshake {
  constructor(_neuron) {
    this.neuron = _neuron;
    const web3 = this.neuron.getWeb3();
    this.web3 = web3;
    const compiled = this.neuron.getCompiled('BasicHandshake');
    this.instance = new web3.eth.Contract(
      compiled.abi,
      configs.network[this.neuron.chainId].basicHandshakeAddress,
    );
  }

  init = (address, privateKey, toAddress, offchain = 'unknown') => {
    console.log('init', address, toAddress, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .init(toAddress, bytesOffchain)
      .encodeABI();
    const hash = this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        toAddress: configs.network[this.neuron.chainId].basicHandshakeAddress,
        arguments: { toAddress, offchain },
        gasPrice: (() => (this.neuron.chainId === 4 ? 100 : 20))(),
      },
    );
    return hash;
  };

  shake = (address, privateKey, hid, offchain = 'unknown') => {
    console.log('shake', address, hid, offchain);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.instance.methods
      .shake(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      toAddress: configs.network[this.neuron.chainId].basicHandshakeAddress,
      arguments: { hid, offchain },
      gasPrice: (() => (this.neuron.chainId == 4 ? 100 : 20))(),
    });
  };
  handshakesOf = (address) => {
    console.log('basicHandshakesOf', address);
    return this.instance.methods.handshakesOf(address).call();
  };
}
