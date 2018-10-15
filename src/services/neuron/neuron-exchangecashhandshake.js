import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

// const wallet = MasterWallet.getWalletDefault('ETH');
// const address = wallet.address;
// const privateKey = wallet.privateKey;
// console.log('Address, PrivateKey:', address, privateKey);

const TAG = 'ExchangeCashHandshake';
export default class ExchangeCashHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'ExchangeCash';
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
   * @dev Initiate handshake by stationOwner
   * @param value funds required for this handshake
   * @param offchain record ID in offchain backend database
   */
  initByStationOwner = async (value, offchain) => {
    console.log(TAG, ' initByStationOwner = ', value, offchain);

    // const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    // let balance = await wallet.getBalance();

    // console.log('initByStationOwner balance', balance);

    const payloadData = this.handshakeInstance.methods
      .initByStationOwner(
        // payoutValue,
        bytesOffchain)
      .encodeABI();

    // this.neuron.caculateEstimatGasWithEthUnit(payloadData, address, 20).then((gas) => {
    //   console.log(TAG, ' contructor -- gas = ', gas.toString());
    // });

    // console.log('address', address);
    // console.log('privateKey', privateKey);

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CoinOwner close the transaction after init
  closeByStationOwner = (hid, offchain) => {
    console.log(TAG, ' closeByStationOwner = ', hid, offchain);

    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .closeByStationOwner(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  addInventory = async (value, hid, offchain) => {
    console.log(TAG, ' addInventory = ', value, hid, offchain);

    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .addInventory(
        hid,
        bytesOffchain)
      .encodeABI();


    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // CoinOwner releaseFundByShopOwner transaction
  releasePartialFund = (hid, customer, value, offchainP, offchainC) => {
    console.log(TAG, ' releasePartialFund = ', hid, customer, value, offchainP, offchainC);

    const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchainP = this.web3.utils.fromAscii(offchainP);
    const bytesOffchainC = this.web3.utils.fromAscii(offchainC);

    const payloadData = this.handshakeInstance.methods
      .releasePartialFund(
        hid,
        customer,
        payoutValue,
        bytesOffchainP,
        bytesOffchainC,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  initByCustomer = (stationOwner, value, offchain) => {
    console.log(TAG, ' initByCustomer = ', stationOwner, value, offchain);

    // const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCustomer(
        stationOwner,
        // payoutValue,
        bytesOffchain,
      )
      .encodeABI();

    // console.log('address', address);
    // console.log('privateKey', privateKey);

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // coinOwner cancel the handshake
  cancel = (hid, offchain) => {
    console.log(TAG, ' cancel = ', hid, offchain);

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

  // stationOwner agree and make a handshake
  shake = (hid, offchain) => {
    console.log(TAG, ' shake = ', hid, offchain);

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

  // CashOwner reject the transaction
  reject = (hid, offchain) => {
    console.log(TAG, ' reject = ', hid, offchain);

    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .reject(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }

  // customer finish transaction for sending the coin to stationOwner
  finish = (hid, offchain) => {
    console.log(TAG, ' finish = ', hid, offchain);

    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .finish(
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
    console.log(TAG, ' getState = ', hid);
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
