import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import Button from '@/components/core/controls/Button';
import Web3 from 'web3';
import * as Metamask from '@/guru/services/metamask/connect';

import CopyIcon from '@/assets/images/icon/icon-copy.svg';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

import './TopUp.scss';



class TopUp extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    name: PropTypes.string
  };

  static defaultProps = {
    address: null,
    balance: null,
    name: null
  };

  constructor(props) {
    super(props);

    this.state = {
      installedMetaMask: false
    };
  }
  componentDidMount() {
    const metaMaskStatus = this.getStatusMetaMask();
    console.log('Status MetaMask:', metaMaskStatus);
    if (typeof window.ethereum !== 'undefined') {
      this.setState({
        installedMetaMask: metaMaskStatus
      });
    }

  }

  copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {
      position: 'absolute',
      left: '-9999px'
    };
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  connect = async () => {
    const web3Provider = new Web3.providers.HttpProvider('http://localhost:8080');
    const web3 = new Web3(web3Provider);
    //const accounts = web3.eth.accounts;
    const accounts = await web3.eth.getAccounts();

    console.log('Web3:', web3);
    console.log('Account:', accounts);
    console.log("new web3");
  }
  getStatusMetaMask = () => {
    return Metamask.getMetamaskStatus();
  }

  onChangeMetamaskStatus = async (status) => {
    Metamask.changeMetamaskStatus(status);
    if (!status) {
      return;
    }
    Metamask.connectMetamask();
    // const account = await Metamask.loginMetaMask();
    // console.log('Account MetaMask:', account);
    // this.setState({
    //   installedMetaMask: Metamask.getMetamaskStatus()
    // });
  };

  metaMask = (props) => {
    const { installedMetaMask } = this.state;
    console.log('Install Meta Mask:', this.state.installedMetaMask);

    //if (!installedMetaMask) return null;
    return (
      <Button
        className="metaMaskButton"
        onClick={() => this.onChangeMetamaskStatus(!installedMetaMask)}
      >
        {installedMetaMask ? 'Active MetaMask Wallet' : 'Install MetaMask to active MetaMask wallet'}
      </Button>
    );
  }

  balance = (props) => {
    const { balance, name } = props || { balance: 0, name: 'ETH' };
    return (
      <div className="TopUpCard BalanceCard">
        <div className="Label">Your balance</div>
        <div className="Value">
          <span className="Number">{Number((parseFloat(balance)).toFixed(8))}</span>
          <span className="Unit">{name}</span>
        </div>
      </div>
    );
  };

  howTo = (props) => {
    const { address } = props || { address: ''};
    return (
      <div className="TopUpCard HowToCard">
        <div className="Quest">How to top up?</div>
        <div className="Describe">Send ETH to your ninja prediction wallet address</div>
        <div className="WalletAddress">
          <span className="Address">{address}</span>
          <span className="HelpIcon" title="Copy to clipboard" onClick={this.copyToClipboard(address)}>
            <img src={CopyIcon} alt="Copy to clipboard" />
          </span>
        </div>
        <span className="Separate">Or</span>
        <div className="QRCodeAddress">
          <QRCode value={address} />
        </div>
      </div>
    );
  };

  render() {
    const wallets = MasterWallet.getMasterWallet();
    const walletProps = wallets[1];
    return (
      <div className="TopUpContainer">
        { this.metaMask(walletProps) }
        { this.balance(walletProps) }
        { this.howTo(walletProps) }

      </div>
    );
  }
}

export default TopUp;
