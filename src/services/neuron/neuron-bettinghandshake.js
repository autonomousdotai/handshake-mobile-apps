import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const TAG = 'NEURON-BETTING';
export default class BettingHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
    this.contractFileName = null;
    this.contractFileAddress = null;

    // / test
    // this.getEstimateGas().then((gas) => {
    //   console.log(TAG, ' contructor -- gas = ', gas.toString());
    // });
  }
  get contractFileNameWithoutExtension() {
    // return process.env.isProduction ? 'PredictionHandshake' : 'PredictionHandshakeDev';
    //return process.env.PredictionHandshakeFileName;
    if (this.contractFileName) {
      const folder = process.env.isLive ? 'live' : 'stag';
      return `Prediction/${folder}/${this.contractFileName}`;
    }
    return null;
  }

  get contractAddress() {
    return this.contractFileAddress;
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
    // const wallet = MasterWallet.getWalletDefault('ETH');
    // return this.chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
    return this.chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
    // return this.chainId === 4 ? 64 : 64;
  }
  updateContract(contractAddress, contractName) {
    this.contractFileAddress = contractAddress;
    this.contractFileName = contractName;
    console.log(TAG, 'updateContract', 'contractFileAddress:', this.contractFileAddress, 'contractFileName:', contractName);
    this.combine();
  }
  // async getEstimateGas() {

  //   const estimateGas = await this.neuron.caculateLimitGasWithEthUnit(this.gasPrice);
  //   return estimateGas;
  // }
  initBet = async (hid, side, stake, odds, offchain) => {
    console.log(
      TAG,
      ' initBet = Address, private Key, hid, side, stake, odds, offchain',
      this.address,
      this.privateKey,
      hid,
      side,
      stake,
      odds,
      offchain,
    );

    const oddsValue = odds * 100;
    const bytesOffchain = this.web3.utils.asciiToHex(offchain);

    const payloadData = this.handshakeInstance.methods
      .init(hid, side, oddsValue, bytesOffchain)
      .encodeABI();
    console.log('Payload Data:', payloadData);
    console.log('Gas Price:', this.gasPrice);
    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        amount: stake,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  };

  shake = async (hid, side, stake, takerOdds, maker, makerOdds, offchain) => {
    console.log(
      TAG,
      'side: ',
      side,
      ' shake stake : ',
      stake,
      ' takerOdds : ',
      takerOdds,
      ' maker : ',
      maker,
      ' makerOdds : ',
      makerOdds,
      ' hid = ',
      hid,
      ' offchain = ',
      offchain,
    );
    // const payoutValue = Web3.utils.toWei(payout.toString(), 'ether');
    const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const oddsTakerValue = takerOdds * 100;
    const oddsMakerValue = makerOdds * 100;
    console.log(
      'Sa debug OddsTaker OddsMaker:',
      oddsTakerValue,
      oddsMakerValue,
    );
    console.log('Gas Price:', this.gasPrice);

    const payloadData = this.handshakeInstance.methods
      .shake(hid, side, oddsTakerValue, maker, oddsMakerValue, bytesOffchain)
      .encodeABI();

    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        amount: stake,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
  // Cancel Bet when it isn't matched
  cancelBet = async (hid, side, stake, odds, offchain) => {
    console.log(
      TAG, 'cancelBet address, privateKey, hid, side, stake, odds, offchain',
      this.address,
      this.privateKey,
      hid,
      side,
      stake,
      odds,
      offchain,
    );
    const stakeValue = Web3.utils.toWei(stake.toString(), 'ether');
    // const payoutValue = Web3.utils.toWei(payout.toString(), 'ether');
    const oddsValue = odds * 100;

    const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const payloadData = this.handshakeInstance.methods
      .uninit(hid, side, stakeValue, oddsValue, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        // amount: stake,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
  // Refund if outcome draw
  refund = async (hid, offchain) => {
    console.log(
      TAG, 'refund address, privateKey, hid, offchain',
      this.address,
      this.privateKey,
      hid,
      offchain,
    );

    const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const payloadData = this.handshakeInstance.methods
      .refund(hid, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        // amount: stake,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  };

  withdraw = async (hid, offchain) => {
    console.log(
      TAG, 'withdraw address, privateKey, hid, offchain',
      this.address,
      this.privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.asciiToHex(offchain);

    const payloadData = this.handshakeInstance.methods
      .collect(hid, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        // amount,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };

  dispute = async (hid, offchain) => {
    console.log(
      TAG, 'dispute address, privateKey, hid, offchain',
      this.address,
      this.privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.asciiToHex(offchain);

    const payloadData = this.handshakeInstance.methods
      .dispute(hid, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        // amount,
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };

  createMarket = async (fee, source, closingWindow, reportWindow, disputeWindow, offchain) => {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const bytesOffchain = this.web3.utils.fromUtf8(offchain);
    const sourceBytes = this.web3.utils.fromUtf8(`${source || '-'}`);
    const payloadData = this.handshakeInstance.methods
      .createMarket(fee, sourceBytes, closingWindow, reportWindow, disputeWindow, bytesOffchain)
      .encodeABI();
    console.log('Payload Data:', payloadData);

    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  }
  report = async (hid, side, offchain) => {
    const bytesOffchain = this.web3.utils.fromUtf8(offchain);
    const payloadData = this.handshakeInstance.methods
    .report(hid, side, bytesOffchain)
    .encodeABI();

    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
      payloadData,
      {
        gasPrice: this.gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  }

}
