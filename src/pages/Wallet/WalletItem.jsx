import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/services/Wallets/Bitcoin.js';
import {Ethereum} from '@/services/Wallets/Ethereum.js';
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import iconChecked from '@/assets/images/icon/icon-check-blue.svg';
import iconQRCode from '@/assets/images/icon/icon-qr-code.svg';
import bgCollectibles from '@/assets/images/pages/wallet/tokenerc721-mainnet.svg'
import './Wallet.scss';

class WalletItem extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  getShortAddres(address){
    return address.replace(address.substr(12, 27), '...');
  }

  get showCryptoAddress(){
    const {wallet, settingWallet} =  this.props;

    let html;
    if(settingWallet && settingWallet.cryptoAddress == 3)
      html = ""
    else if(settingWallet && settingWallet.cryptoAddress == 2)
      html = wallet.getShortestAddress();
    else
      html = wallet.getShortAddress();


    return (<div>
        <img src={iconQRCode} /> {html}
      </div>)
  }

  get showIconSafe(){
    const { messages } = this.props.intl;
    const {wallet, settingWallet, onWarningClick} =  this.props;
    let html;
    if(settingWallet && settingWallet.cryptoAddress == 3)
      html = !wallet.protected ? <div className="warning" onClick={onWarningClick}>{messages.wallet.action.protect.text.need_secure}</div> : "";
    else
      html = <img className="safe" src={wallet.protected ? iconSafe : iconWarning} onClick={onWarningClick}/>

    return (html)
  }

  render(){
      const {wallet, onMoreClick, onAddressClick} =  this.props;
      //const iconProtected = !wallet.protected ? iconWarning : iconSafe;
      let bgImg = bgCollectibles;
      try{ bgImg = require("@/assets/images/pages/wallet/" + wallet.getBackgroundImg());} catch (e){};

      // const itemSelected = wallet.default ? "feed feed-selected" : "feed";
      return  (

        <Col sm={6} md={6} xs={6} className="feed-wrapper-wallet">
          <div className='feed' style={{backgroundImage: "url('"+bgImg+"')"}}>

            <div className="name">{wallet.title}
            {wallet.default ? <img className="iconDefault" src={iconChecked}/> : ''}
            </div>
            <p className="balance"> {wallet.getShortBalance()} {wallet.name} </p>
            <div className="more" onClick={onMoreClick}><img src={dontIcon}/></div>
            {this.showIconSafe}
            <div className="address" onClick={onAddressClick}>
              {this.showCryptoAddress}
            </div>
          </div>
        </Col>
      );
  }
}

WalletItem.propTypes = {
  settingWallet: PropTypes.any,
  wallet: PropTypes.object,
  onMoreClick: PropTypes.func,
  onWarningClick: PropTypes.func,
  onAddressClick: PropTypes.func,
};
export default injectIntl(WalletItem);
