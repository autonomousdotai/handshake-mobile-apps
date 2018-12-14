import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { injectIntl } from 'react-intl';
import Modal from '@/components/core/controls/Modal';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import Button from '@/components/core/controls/Button';
import CopyIcon from '@/assets/images/icon/icon-copy.svg';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';
import { putMetaMaskInfo } from './action';
import './TopUp.scss';


class TopUp extends React.Component {
  static displayName = 'TopUp';

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      installedMetaMask: undefined,
      metaMaskWallet: undefined
    };
  }

  componentWillMount() {
    window.addEventListener('message', (event) => {
      console.log(event.data.action_key);
      if ((event.data.action_key === 'installedMetaMask' && event.data) && !this.updateMessage) {
        console.log('installed', event.data.data);
        this.setState({ installedMetaMask: true });
        this.updateMessage = true;
        window.parent.postMessage({
          action_key: 'metaMaskReady'
        }, '*');
      }
    });
  }

  componentDidMount() {
    window.addEventListener('message', (event) => {
      console.log(event.data.action_key);
      if (event.data.action_key === 'amount' && !this.componentUpdated) {
        console.log('amount', event.data.data);
        window.parent.postMessage({
          action_key: 'gotAmountMetaMask'
        }, '*');
        this.props.dispatch(putMetaMaskInfo(event.data.data));
        this.componentUpdated = true;
      }
    });
  }

  onChangeMetamaskStatus = () => {
    window.parent.postMessage({
      action_key: 'activeMetaMask',
      data: {}
    }, '*');
  };

  metaMask = (state) => {
    const { installedMetaMask } = state;
    if (installedMetaMask === undefined) return null;
    return (
      <Button
        className="metaMaskButton"
        onClick={this.onChangeMetamaskStatus}
      >
        {installedMetaMask ? 'Login With MetaMask' : 'Get MetaMask Extension'}
      </Button>
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
    const { ninjaWallet } = props;
    const { balance, name } = ninjaWallet || { balance: 0, name: 'ETH' };
    const amount = (props.metaMaskWallet && props.metaMaskWallet.amount) || 0;
    console.log(amount, props.metaMaskExtension);
    return (
      <div className="TopUpCard BalanceCard">
        <div className="Label">Your balance</div>
        <div className="Value">
          <span className="Number">{Number((parseFloat(amount)).toFixed(8))}</span>
          <span className="Number">{Number((parseFloat(balance)).toFixed(8))}</span>
          <span className="Unit">{name}</span>
        </div>
      </div>
    );
  };

  howTo = (props) => {
    const { address } = props || { address: '' };
    return (
      <div className="TopUpCard HowToCard">
        <div className="Quest">How to top up?</div>
        <div className="Describe">Send ETH to your Ninja wallet address</div>
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
    const wallets = MasterWallet.getMasterWallet();
    const walletDefault = MasterWallet.getWalletDefault('ETH');
    const ninjaWallet = wallets.filter(w => w.network === walletDefault.network)[0];
    return (
      <div className="TopUpContainer">
        {this.metaMask(this.state)}
        {this.balance({ ...this.props, ninjaWallet })}
        {this.howTo(ninjaWallet)}
        {this.restoreWallet()}
        {this.renderModalRestor()}
      </div>
    );
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      // installedMetaMask: state.guru.extension.installedMetaMask,
      metaMaskExtension: state.guru.extension,
      metaMaskWallet: state.guru.extension.metaMaskWallet
    };
  }
)(TopUp));
