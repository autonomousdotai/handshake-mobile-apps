import React from 'react';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import iconChecked from '@/assets/images/icon/icon-checked-wallet.svg';



import PropTypes from 'prop-types';
import './Wallet.scss';

class CoinTemp extends React.Component {

    isMainnet(wallet){
        return [Ethereum.Network.Mainnet, Bitcoin.Network.Mainnet].indexOf(wallet.network) > -1;
    }

    
    render(){ 
        const {wallet, onClick} =  this.props;        
        const bgImg = require("@/assets/images/pages/wallet/" + wallet.getBackgroundImg());
        const itemSelected = wallet.default ? "feed feed-selected" : "feed";

        return  ( 
            <Col sm={6} md={6} xs={6} className="feed-wrapper-wallet">              
              <div onClick={onClick}  className={itemSelected} style={{backgroundImage: "url('"+bgImg+"')"}}>
                <span className="name">{wallet.getNetworkName() + " (" + wallet.name + ")"}</span>                 
                
                {wallet.default ? <img className="iconChecked" src={iconChecked}/> : ''}
                
              </div>        
            </Col>
          );
    }
}
    
CoinTemp.propTypes = {    
    wallet: PropTypes.object, 
    onClick: PropTypes.func,    
};
export default CoinTemp;