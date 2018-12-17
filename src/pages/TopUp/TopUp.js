import React from 'react';
import QRCode from 'qrcode.react';
import { injectIntl } from 'react-intl';
import Modal from '@/components/core/controls/Modal';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import Button from '@/components/core/controls/Button';
import CopyIcon from '@/assets/images/icon/icon-copy.svg';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';
import { isEmpty } from '@/utils/is';
import { EXT } from '@/constants';

import './TopUp.scss';

class TopUp extends React.Component {
  static displayName = 'TopUp';

  constructor(props) {
    super(props);

    this.state = {
      isMetaMaskReady: false,
      isMetaMaskLoggedIn: false,
      metaMaskExtension: {}
    };
  }

  componentDidMount() {
    window.addEventListener('message', (event) => {
      const { data } = event;
      const { action_key, send_data } = data;
      console.log('ACTION_KEY', action_key, send_data, this.state.isMetaMaskLoggedIn);
      if (action_key === 'isMetaMaskReady') {
        this.setState({ isMetaMaskReady: !!send_data });
        // window.parent.postMessage({ action_key: 'receivedMetaMaskInfo' }, '*');
      }
      if (action_key === 'isMetaMaskLoggedIn') {
        this.setState({ isMetaMaskLoggedIn: send_data });
        // window.parent.postMessage({ action_key: 'receivedMetaMaskLoggedIn' }, '*');
      }

      if (this.state.isMetaMaskLoggedIn) {
        if (action_key === 'amount') {
          this.setState({ metaMaskExtension: JSON.parse(send_data) });
          // window.parent.postMessage({ action_key: 'receivedMetaMaskAccount' }, '*');
        }
      } else {
        this.setState({ metaMaskExtension: {} });
      }
    });
  }

  handleLoginMetaMask = () => {
    window.parent.postMessage({ action_key: 'loginMetaMask' }, '*');
  }

  handleGetMetaMask = () => {
    window.open(EXT.METAMASK_URL);
  }

  metaMaskStatus = (state) => {
    const { isMetaMaskReady, isMetaMaskLoggedIn, metaMaskExtension } = state;
    if (!isMetaMaskReady) {
      return (
        <button title="Get MetaMask Extension" className="btn btn-primary" onClick={this.handleGetMetaMask}>
          Get MetaMask Extension
        </button>
      );
    }

    if (isEmpty(metaMaskExtension) || !isMetaMaskLoggedIn) {
      return (
        <button className="btn btn-primary" onClick={this.handleLoginMetaMask}>Login With MetaMask</button>
      );
    }

    return (
      <span className="btn btn-link">MetaMask is ready!</span>
    );
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
    const { balance, name } = props.ninjaWallet || { balance: 0, name: 'ETH' };
    const value = this.state.metaMaskExtension.amount || balance;
    return (
      <div className="TopUpCard BalanceCard">
        <div className="Label">Your balance</div>
        <div className="Value">
          <span className="Number">{Number((parseFloat(value)).toFixed(8))}</span>
          <span className="Unit">{name}</span>
        </div>
      </div>
    );
  };

  howTo = (props) => {
    const { address } = props.ninjaWallet || { address: '' };
    const addressValue = this.state.metaMaskExtension.selectedAddress || address;
    return (
      <div className="TopUpCard HowToCard">
        <div className="Quest">How to top up?</div>
        <div className="Describe">Send ETH to your Ninja wallet address</div>
        <div className="WalletAddress">
          <span className="Address">{addressValue}</span>
          <span className="HelpIcon" title="Copy to clipboard" onClick={this.copyToClipboard(addressValue)}>
            <img src={CopyIcon} alt="Copy to clipboard" />
          </span>
        </div>
        <span className="Separate">Or</span>
        <div className="QRCodeAddress">
          <QRCode value={addressValue} />
        </div>
      </div>
    );
  };

  restoreWallet = () => {
    return (
      <div className="RestoreButton">
        <Button onClick={() => {
          this.modalRestoreRef.open();
        }}
        >
          I have a wallet. Restore my wallet.
        </Button>
      </div>
    );
  }

  renderModalRestor = () => {
    const { messages } = this.props.intl;
    const modalHeaderStyle = { color: "#fff", background: "#546FF7" };
    return (
      <Modal
        customBackIcon={BackChevronSVGWhite}
        modalHeaderStyle={modalHeaderStyle}
        title={messages.wallet.action.restore.header}
        onRef={modal => { this.modalRestoreRef = modal; return null; }}
        onClose={this.closeRestoreWalletAccount}
      >
        <RestoreWallet />
      </Modal>
    );
  }

  render() {
    console.log('top up', this.props);
    const wallets = MasterWallet.getMasterWallet();
    const walletDefault = MasterWallet.getWalletDefault('ETH');
    const ninjaWallet = wallets.filter(w => w.network === walletDefault.network)[0];
    return (
      <div className="TopUpContainer">
        {this.metaMaskStatus(this.state)}
        {this.balance({ ...this.props, ninjaWallet })}
        {this.howTo({ ...this.props, ninjaWallet })}
        {this.restoreWallet()}
        {this.renderModalRestor()}
      </div>
    );
  }
}

export default injectIntl(TopUp);
