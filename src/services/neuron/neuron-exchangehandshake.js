import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/models/MasterWallet';

// const wallet = MasterWallet.getWalletDefault('ETH');
// const address = wallet.address;
// const privateKey = wallet.privateKey;
// console.log('Address, PrivateKey:', address, privateKey);

const TAG = 'ExchangeHandshake';
export default class ExchangeHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'ExchangeHandshake';
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
    const wallet = MasterWallet.getWalletDefault('ETH');
    return wallet.chainId === 4 ? 100 : 20;
  }

  /**
   * @dev Initiate handshake by cashOwner
   * @param exchanger exchanger address
   * @param adrFeeRefund adrFeeRefund address
   * @param value funds required for this handshake
   * @param offchain record ID in offchain backend database
   */
  initByCashOwner = (exchanger, value, offchain) => {
    console.log(
      TAG,
      ' initByCashOwner = ',
      exchanger,
      value,
      offchain,
    );

    const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCashOwner(
        exchanger,
        payoutValue,
        bytesOffchain,
      )
      .encodeABI();

    // console.log('address', address);
    // console.log('privateKey', privateKey);

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  /**
   * @dev Initiate handshake by CoinOwner
   */
  initByCoinOwner = (exchanger, offchain) => {
    console.log(
      TAG,
      ' initByCoinOwner = ',
      exchanger,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCoinOwner(
        exchanger,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // shaker agree and make a handshake
  shake = (hid, value, offchain) => {
    console.log(
      TAG,
      ' shake = ',
      hid,
      value,
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
      amount: value,
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
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CashOwner withdraw funds from a handshake
  withdraw = (hid, offchain) => {
    console.log(
      TAG,
      ' withdraw = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .withdraw(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CashOwner reject the transaction
  reject = (hid, offchain) => {
    console.log(
      TAG,
      ' reject = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .reject(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // coinOwner cancel the handshake
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
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CashOwner close the transaction after init
  closeByCashOwner = (hid, offchain) => {
    console.log(
      TAG,
      ' closeByCashOwner = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .closeByCashOwner(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      // amount: value,
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
      // amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }
}
