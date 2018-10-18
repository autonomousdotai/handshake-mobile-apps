import React from 'react';
import PropTypes from 'prop-types';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { Wallet } from '@/services/Wallets/Wallet';
import CopyIcon from '@/assets/images/icon/icon-copy.svg';

import './TopUp.scss';

class TopUp extends React.Component {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number,
    name: PropTypes.string,
  };

  static defaultProps = {
    address: null,
    balance: null,
    name: null,
  };

  state = {
    wallets: [],
  };

  componentDidMount() {
    const wallets = MasterWallet.getMasterWallet();
    this.setState({ wallets });
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

  balance = (props) => {
    const { balance, name } = props || { balance: 0, name: 'ETH'};
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
      </div>
    );
  };

  render() {
    const { wallets } = this.state;
    const walletProps = wallets[0];
    return (
      <div className="TopUpContainer">
        { this.balance(walletProps) }
        { this.howTo(walletProps) }
      </div>
    );
  }
}

export default TopUp;
