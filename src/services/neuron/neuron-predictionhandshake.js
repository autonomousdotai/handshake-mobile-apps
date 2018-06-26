import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/models/MasterWallet';


const TAG = 'predictionHandshake';
export default class predictionHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);

    // / test
    // this.getEstimateGas().then((gas) => {
    //   console.log(TAG, ' contructor -- gas = ', gas.toString());
    // });
  }
  get contractFileNameWithoutExtension() {
    // return process.env.isProduction ? 'PredictionHandshake' : 'PredictionHandshakeDev';
    return process.env.PredictionHandshakeFileName;
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
      this.address,
      this.gasPrice,
    );
    return estimateGas;
  }
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
  createMarket = async (fee, source, closingWindow, reportWindow, disputeWindow, offchain) => {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const bytesOffchain = this.web3.utils.asciiToHex(`cryptosign_createMarket${offchain}`);
    const sourceBytes = this.web3.utils.asciiToHex(source);
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
}
