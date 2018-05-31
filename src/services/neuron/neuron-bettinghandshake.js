import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';

const TAG = 'BettingHandshake';
export default class BettingHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }
  get contractFileNameWithoutExtension() {
    return 'BettingHandshake';
  }
  initBet = (
    address,
    privateKey,
    acceptors = [],
    goal,
    escrow,
    deadline,
    offchain,
  ) => {
    console.log(
      TAG,
      ' init = ',
      address,
      privateKey,
      goal,
      escrow,
      deadline,
      offchain,
    );
    console.log(TAG, ' initBet ', this.contractAddress);
    const goalValue = Web3.utils.toWei(goal.toString(), 'ether');
    // const goalValue = this.web3.utils.toHex(Web3.utils.toWei(goal.toString(), 'ether'));
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    // const escrowValue = this.web3.utils.toHex(Web3.utils.toWei(escrow.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const bytesArrayAcceptor = [];
    for (let i = 0; i < acceptors.length; i++) {
      bytesArrayAcceptor[i] = this.web3.utils.fromAscii(acceptors[i].toString().trim());
    }
    const payloadData = this.handshakeInstance.methods
      .initBet(
        bytesArrayAcceptor,
        goalValue,
        escrowValue,
        deadline,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount: escrow,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  };
 
  shake = (address, privateKey, hid, amount, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, hid);
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .shake(hid,bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: this.contractAddress,
    });
  };
  cancelBet = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .cancelBet(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  closeBet = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .closeBet(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  iniatorWon = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .initiatorWon(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.configs.handshakeBettingAddress,
    });
  };
  betorWon = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .betorWon(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddressax,
    });
  };
  draw = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .draw(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  
  withdraw = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service withdraw',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .withdraw(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  reject = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service reject',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .reject(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  setWinner = (address, privateKey, hid, result, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      result,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .setWinner(hid, state, result, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
}
