import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/models/MasterWallet';

const wallet = MasterWallet.getWalletDefault('ETH');
const address = wallet.address;
const privateKey = wallet.privateKey;
console.log('Address, PrivateKey:', address, privateKey);
const gasPrice = wallet.chainId === 4 ? 100 : 20;
const TAG = 'PredictionHandshake';


export default class PredictionHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }
  get contractFileNameWithoutExtension() {
    // return process.env.isProduction ? 'PredictionHandshake' : 'PredictionHandshakeDev';
    return process.env.PredictionHandshakeFileName;
  }
  async getEstimateGas(hid = 0, side = 1, odds = 3) {
    const oddsValue = odds * 100;
    // const payoutValue = Web3.utils.toWei(payout, 'ether');
    const bytesOffchain = this.web3.utils.asciiToHex('cryptosign_m562');
    // const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const payloadData = this.handshakeInstance.methods
      .init(hid, side, oddsValue, bytesOffchain)
      .encodeABI();
    const estimateGas = await this.neuron.caculateEstimatGasWithEthUnit(
      payloadData,
      address,
      gasPrice,
    );
    return estimateGas;
  }
  // new functions here
  createMarket = async (fee, source, closingWindow, reportWindow, disputeWindow, offchain) => {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const bytesOffchain = this.web3.utils.asciiToHex(`cryptosign_createMarket${offchain}`);
    const sourceBytes = this.web3.utils.asciiToHex(source);
    const payloadData = this.handshakeInstance.methods
      .createMarket(fee, sourceBytes, closingWindow, reportWindow, disputeWindow, bytesOffchain)
      .encodeABI();
    console.log('Payload Data:', payloadData);

    const dataBlockChain = await this.neuron.sendRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  }

  initBet = async (hid, side, stake, odds, offchain) => {
    console.log(
      TAG,
      ' initBet = Address, private Key, hid, side, stake, odds, offchain',
      address,
      privateKey,
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

    const dataBlockChain = await this.neuron.sendRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        amount: stake,
        gasPrice,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  };

  shake = async (hid, side, stake, takerOdds, maker, makerOdds, offchain) => {
    console.log(
      TAG,
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
    const payloadData = this.handshakeInstance.methods
      .shake(hid, side, oddsTakerValue, maker, oddsMakerValue, bytesOffchain)
      .encodeABI();

    const dataBlockChain = await this.neuron.sendRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        amount: stake,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
  // Cancel Bet when it isn't matched
  cancelBet = async (hid, side, stake, odds, offchain) => {
    console.log(
      'cancelBet address, privateKey, hid, side, stake, odds, offchain',
      address,
      privateKey,
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
    const dataBlockChain = await this.neuron.makeRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        // amount: stake,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
  // Refund if outcome draw
  refund = async (hid, offchain) => {
    console.log(
      'refund address, privateKey, hid, offchain',
      address,
      privateKey,
      hid,
      offchain,
    );

    const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const payloadData = this.handshakeInstance.methods
      .refund(hid, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        // amount: stake,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  };

  withdraw = async (hid, offchain) => {
    console.log(
      'withdraw address, privateKey, hid, offchain',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.asciiToHex(offchain);

    const payloadData = this.handshakeInstance.methods
      .collect(hid, bytesOffchain)
      .encodeABI();
    const dataBlockChain = await this.neuron.sendRawTransaction(
      address,
      privateKey,
      payloadData,
      {
        // amount,
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
}
