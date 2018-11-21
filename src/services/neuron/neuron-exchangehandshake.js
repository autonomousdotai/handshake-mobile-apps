import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const TAG = 'ExchangeHandshake';
export default class ExchangeHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'ExchangeHandshake';
  }

  get contractFolder() {
    return 'ATM';
  }

  checkBalance = () => {
    const balance = wallet.getBalance();
    return balance;
  }

  get address() {
    const wallet = MasterWallet.getWalletDefault('ETH');
    return wallet.address;
  }
  get privateKey() {
    const wallet = MasterWallet.getWalletDefault('ETH');
    return wallet.privateKey;
  }
  get gasPrice() {
    return this.chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
  }

  /**
   * @dev Initiate handshake by CoinOwner
   */
  initByCoinOwner = (value, offchain) => {
    console.log(
      TAG,
      ' initByCoinOwner = ',
      value,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCoinOwner(bytesOffchain)
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // shaker agree and make a handshake
  shake = (hid, offchain) => {
    console.log(
      TAG,
      ' shake = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .shake(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CoinOwner accept transaction
  accept = (hid, offchain) => {
    console.log(
      TAG,
      ' accept = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .accept(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // cancel the handshake
  cancel = (hid, offchain) => {
    console.log(
      TAG,
      ' cancel = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .cancel(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // get handshake stage by hid
  getState = (hid) => {
    console.log(
      TAG,
      ' getState = ',
      hid,
    );
    const payloadData = this.handshakeInstance.methods
      .getState(hid)
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }
}
