import React from 'react';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import iconChecked from '@/assets/images/icon/icon-check-blue.svg';
import iconQRCode from '@/assets/images/icon/icon-qr-code.svg';


import PropTypes from 'prop-types';
import './Wallet.scss';

class WalletItem extends React.Component {

    getShortAddres(address){
        return address.replace(address.substr(12, 27), '...');
    }

    render(){ 
        const {wallet, onMoreClick, onWarningClick, onAddressClick} =  this.props;   
        const iconProtected = !wallet.protected ? iconWarning : iconSafe;
        const bgImg = require("@/assets/images/pages/wallet/" + wallet.getBackgroundImg());
        // const itemSelected = wallet.default ? "feed feed-selected" : "feed";
        return  ( 
            
            <Col sm={6} md={6} xs={6} key={wallet.address+wallet.network} className="feed-wrapper-wallet">
              <div className='feed' style={{backgroundImage: "url('"+bgImg+"')"}}>
                
                <div className="name">{wallet.title}
                {wallet.default ? <img className="iconDefault" src={iconChecked}/> : ''}
                </div> 
                <p className="balance"> {wallet.getShortBalance()} {wallet.name} </p>
                <img className="more" src={dontIcon} onClick={onMoreClick}/> 
                <img className="safe" src={wallet.protected ? iconSafe : iconProtected} onClick={onWarningClick}/>   

                <div className="address" onClick={onAddressClick}><img src={iconQRCode} /> {wallet.getShortAddress()}</div>
              </div>        
            </Col>
          );
    }
}
    
WalletItem.propTypes = {    
    wallet: PropTypes.object, 
    onMoreClick: PropTypes.func,
    onWarningClick: PropTypes.func,
    onAddressClick: PropTypes.func,
};
export default WalletItem;