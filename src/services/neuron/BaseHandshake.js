import configs from '@/configs';
import Neuron from './index';
import { camelCase } from 'lodash';
import { MasterWallet } from '@/models/MasterWallet';

const TAG = 'BaseHandshake';
export default class BaseHandshake {
  constructor(chainId) {
    this.chainId = chainId || 4;
    this.neuron =
      chainId === 4 ? MasterWallet.neutronTestNet : MasterWallet.neutronMainNet; // new Neuron(chainId);
    this.configs = configs.network[this.chainId];
    const web3 = this.neuron.getWeb3();
    this.web3 = web3;
    const compiled = this.neuron.getCompiled(this.contractFileNameWithoutExtension);

    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      this.contractAddress,
    );
    // console.log('Hanshake instance:', this.handshakeInstance);
  }

  get contractAddress() {
    return this.configs[
      `${camelCase(this.contractFileNameWithoutExtension)}Address`
    ];
  }

  get contractFileNameWithoutExtension() {
    return TAG;
  }
}
