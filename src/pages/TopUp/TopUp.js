import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import Modal from '@/components/core/controls/Modal';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { injectIntl } from 'react-intl';
import CopyIcon from '@/assets/images/icon/icon-copy.svg';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import Button from '@/components/core/controls/Button';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';

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
  restoreWallet=(props) => {
    return (
      <div className="RestoreButton">
      <Button onClick={() => {
        this.modalRestoreRef.open();
        }}
      >I have a wallet. Restore my wallet.
      </Button>
      </div>
    );
  }
  renderModalRestor = () => {
    const { messages } = this.props.intl;
    const modalHeaderStyle = {color: "#fff", background: "#546FF7"};
    return (
      <Modal
        customBackIcon={BackChevronSVGWhite}
        modalHeaderStyle={modalHeaderStyle}
        title={messages.wallet.action.restore.header}
        onRef={modal => this.modalRestoreRef = modal}
        onClose={this.closeRestoreWalletAccount}
      >
        <RestoreWallet />
      </Modal>
    );
  }

  render() {
    const wallets = MasterWallet.getMasterWallet();
    const walletDefault = MasterWallet.getWalletDefault('ETH');
    const walletProps = wallets.filter(w => w.network === walletDefault.network)[0];
    console.log('Wallet Props:', walletProps);
    return (
      <div className="TopUpContainer">
        { this.balance(walletProps) }
        { this.howTo(walletProps) }
        { this.restoreWallet(walletProps) }
        { this.renderModalRestor()}
      </div>
    );
  }
}

export default injectIntl(TopUp);
