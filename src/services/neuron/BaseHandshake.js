import configs from '@/configs';
import { toCamelCase } from '@/utils/string';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const TAG = 'BaseHandshake';
export default class BaseHandshake {
  constructor(chainId) {
    this.chainId = chainId || 4;
    if (this.contractFileNameWithoutExtension) {
      this.combine();
    }
  }

  combine() {
    this.neuron =
      this.chainId === 4 ? MasterWallet.neutronTestNet : MasterWallet.neutronMainNet; // new Neuron(chainId);
    this.configs = configs.network[this.chainId];
    const web3 = this.neuron.getWeb3();
    this.web3 = web3;
    console.log(TAG, 'contractFileNameWithoutExtension:', this.contractFileNameWithoutExtension, 'contractAddress:', this.contractAddress);

    const fileName = this.contractFolder ? `${this.contractFolder}/${this.contractFileNameWithoutExtension}` : this.contractFileNameWithoutExtension;

    const compiled = this.neuron.getCompiled(fileName);

    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      this.contractAddress,
    );
    // console.log('Hanshake instance:', this.handshakeInstance);
  }

  get contractAddress() {
    return this.configs[
      `${toCamelCase(this.contractFileNameWithoutExtension)}Address`
    ];
  }

  get contractFileNameWithoutExtension() {
    return TAG;
  }

  get contractFolder() {
    return '';
  }

  get gasPrice() {
    return this.chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
  }
}
