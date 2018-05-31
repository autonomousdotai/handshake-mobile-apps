import React from 'react';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import iconChecked from '@/assets/images/icon/icon-checked.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

class WalletItem extends React.Component {

    getShortAddres(address){
        return address.replace(address.substr(12, 27), '...');
    }

    getBgClass(wallet){
        var bgClassName = 'testnet-wallet-bg';
        if ([Ethereum.Network.Mainnet, Bitcoin.Network.Mainnet].indexOf(wallet.network) > -1){
          switch(wallet.name) {
            case 'ETH':
                bgClassName = 'eth-wallet-bg';
                break;
            case 'BTC':
                bgClassName = 'btc-wallet-bg';
                break;
            case 'XRP':
                bgClassName = 'xrp-wallet-bg';
            default:
              bgClassName = 'testnet-wallet-bg';
          }
        }
        return  "feed " + bgClassName;
      }
    render(){ 
        const {wallet, onMoreClick, onWarningClick} =  this.props;   
        const iconProtected = !wallet.protected ? iconWarning : iconSafe;
        
        return  ( 
            <Col sm={6} md={6} xs={6} key={wallet.address+wallet.network} className="feed-wrapper">
              <div className={this.getBgClass(wallet)}>
              
                <div className="name">{wallet.title}
                {wallet.default ? <img className="iconDefault" src={iconChecked}/> : ''}
                </div> 
                <p className="balance"> {wallet.balance} {wallet.name} </p>
                <img className="more" src={dontIcon} onClick={onMoreClick}/> 
                <img className="safe" src={iconProtected} onClick={onWarningClick}/>          
                <p className="address">{wallet.getShortAddress()}</p>
              </div>        
            </Col>
          );
    }
}
    
WalletItem.propTypes = {    
    wallet: PropTypes.object, 
    onMoreClick: PropTypes.func,
    onWarningClick: PropTypes.func,
};
export default WalletItem;