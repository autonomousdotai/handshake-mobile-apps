import BaseHandshake from './BaseHandshake';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const TAG = 'CreditATM';
export default class CreditATM extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'CreditATM';
  }

  get contractFolder() {
    return 'ATM';
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
   * @dev deposit coin to escrow
   * @param offchain record ID in offchain backend database
   */
  deposit = (value, percentage, offchain) => {
    console.log(
      TAG,
      ' deposit = ',
      value,
      percentage,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .deposit(bytesOffchain, percentage)
      .encodeABI();

    return this.neuron.makeRawTransaction(this.address, this.privateKey, payloadData, {
      amount: value,
      gasPrice: this.gasPrice,
      toAddress: this.contractAddress,
    });
  }
}
