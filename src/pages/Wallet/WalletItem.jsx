import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import { Col, Row } from 'react-bootstrap';
import {Bitcoin} from '@/services/Wallets/Bitcoin.js';
import {Ethereum} from '@/services/Wallets/Ethereum.js';

import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

import iconChecked from '@/assets/images/wallet/icons/checked-green.svg';
import iconQRCode from '@/assets/images/wallet/icons/icon-qrcode-black.svg';
import bgCollectibles from '@/assets/images/pages/wallet/tokenerc721-mainnet.svg'

import dontIcon from '@/assets/images/wallet/icons/3-dot-icon-black.svg';
import needBackup from '@/assets/images/wallet/icons/need-backup.svg';


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

    let html = '';
    // if(settingWallet && settingWallet.cryptoAddress == 3)
    //   html = ""
    // else if(settingWallet && settingWallet.cryptoAddress == 2)
    //   html = wallet.getShortestAddress();
    // else
    //   html = wallet.getShortAddress();

    return (<div>
        <img src={iconQRCode} /> {html}
      </div>)
  }

  get showBackup(){
    const { messages } = this.props.intl;
    const {wallet, settingWallet, onWarningClick} =  this.props;
    let html = <div><img className="safe" src={needBackup} /> <span className="warning" onClick={onWarningClick}>{messages.wallet.action.protect.text.need_backup}</span></div>;

    return (html)
  }

  render(){
      const {wallet, onMoreClick, onAddressClick, isSortable, onItemClick} =  this.props;
      const { messages } = this.props.intl;
      //const iconProtected = !wallet.protected ? iconWarning : iconSafe;
      let logo = require("@/assets/images/wallet/icons/coins/" + wallet.icon);
      try{ logo = require("@/assets/images/wallet/icons/coins/" + wallet.getCoinLogo());} catch (e){};

      // const itemSelected = wallet.default ? "feed feed-selected" : "feed";
      return  (

        <div>
            {!wallet.protected && <img className="safe" src={needBackup} /> }
            <img onClick={onItemClick} className="coin-logo" src={logo}/>
            <div className="item-center" onClick={onItemClick}>
              <div className="name">
                {wallet.title}
                {wallet.default ? <img className="iconDefault" src={iconChecked}/> : ''}
              </div>
              {!wallet.hideBalance ?
              <span className="balance"> {wallet.getShortBalance()} {wallet.name} </span>
              :<span className="balance">[{messages.wallet.action.history.label.balance_hidden}]</span> }
            </div>

            {!isSortable ?
              <span className="item-right">
                <span className="address hidden-xss-down" onClick={onAddressClick}>
                    {this.showCryptoAddress}
                </span>
                <span className="more" onClick={onMoreClick}><img src={dontIcon}/></span>

              </span>
            : ""}


            {/* <div className="address" onClick={onAddressClick}>
              {this.showCryptoAddress}
            </div> */}
          </div>
      );
  }
}

WalletItem.propTypes = {
  settingWallet: PropTypes.any,
  wallet: PropTypes.object,
  onMoreClick: PropTypes.func,
  onWarningClick: PropTypes.func,
  onAddressClick: PropTypes.func,
  isSortable: PropTypes.any,
  onItemClick: PropTypes.func,
};
export default injectIntl(WalletItem);
