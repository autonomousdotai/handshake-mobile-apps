import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/models/MasterWallet';


const TAG = 'BettingHandshake';
export default class BettingHandshake extends BaseHandshake {
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
  get address(){
    const wallet = MasterWallet.getWalletDefault('ETH');
    return wallet.address;
  }
  get privateKey(){
    const wallet = MasterWallet.getWalletDefault('ETH');
    return wallet.privateKey;
  }
  get gasPrice(){
    const wallet = MasterWallet.getWalletDefault('ETH');
   // return wallet.chainId === 4 ? 100 : 20;
   return wallet.chainId === 4 ? 20 : 20;

  }
  async getEstimateGas(hid=0, side=1, odds=3) {

    const oddsValue = odds * 100;
    //const payoutValue = Web3.utils.toWei(payout, 'ether');
    const bytesOffchain = this.web3.utils.asciiToHex('cryptosign_m562');
    //const bytesOffchain = this.web3.utils.asciiToHex(offchain);
    const payloadData = this.handshakeInstance.methods
      .init(hid, side, oddsValue, bytesOffchain)
      .encodeABI();
      /*
    const estimateGas = await this.neuron.caculateEstimatGasWithEthUnit(
      payloadData,
      this.address,
      this.gasPrice,
    );
    */
    const estimateGas = await this.neuron.caculateLimitGasWithEthUnit(this.gasPrice);
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
    console.log('Sa debug OddsTaker OddsMaker:', oddsTakerValue, oddsMakerValue)

    const payloadData = this.handshakeInstance.methods
      .shake(hid, side, oddsTakerValue, maker, oddsMakerValue, bytesOffchain)
      .encodeABI();

    const dataBlockChain = await this.neuron.sendRawTransaction(
      this.address,
      this.privateKey,
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
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);
    return dataBlockChain;
  };

  withdraw = async (hid, offchain) => {
    console.log(
      'withdraw address, privateKey, hid, offchain',
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
        toAddress: this.contractAddress,
      },
    );
    console.log('Data Blockchain:', dataBlockChain);

    return dataBlockChain;
  };
}
