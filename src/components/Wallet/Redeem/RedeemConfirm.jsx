import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { verifyRedeemCode } from '@/reducers/auth/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Redeem.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import ConfirmButton from '@/components/Wallet/ConfirmButton';

import gitfBox from '@/assets/images/wallet/images/gift-gift-box.svg';
import success from '@/assets/images/wallet/icons/success.svg';

import { MasterWallet } from '@/services/Wallets/MasterWallet';

import ListCoin from '@/components/Wallet/ListCoin';

import {getFiatCurrency} from '@/reducers/exchange/action';
import { API_URL } from "@/constants";
import Helper from '@/services/helper';
import { renderToString } from 'react-dom/server';
import Button from '@/components/core/controls/Button';
const moment = require('moment');

function changeIconConfirmButton(icon){
  try{
    document.querySelector(".confirm-button .rangeslider__handle").style.backgroundImage = 'url("'+icon+'")';    
  }
  catch (e){}
  
}


class RedeemConfirm extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {      
      redeemCode: this.props.data.promotion_code || '',
      error: '',
      giftcardValue: this.props.data.amount || 0,
      cryptoValue: "",      
      walletSelected: null,
      listWalletCoin: [],
      contentWalletSelected: '',
      modalListCoin: '',            
      cryptoValue: "",
      expired_date: this.props.data.expiration_date || "",
    };    
  }

  componentDidMount(){
    this.getWalletDefault();    
  }

  onRedeemConfirm=()=>{
    if (this.walletSelected){      
      this.props.verifyRedeemCode({
        PATH_URL: "wallet/gift-card/redeem",
        data: {"code": this.state.redeemCode,"to_eth_address": this.state.walletSelected.address},
        METHOD: 'POST',
        successFn: (res) => {        
          if(res){
            this.modalRedeenSuccessRef.open();
          }        
        },
        errorFn: (e) =>{ 
          if (e.message)       
            this.setState({error: e.message});
          else
            console.log(e);
        }
      });
    }
    
  }

  getWalletDefault = () =>{    

    let support = ["ETH"];

    let wallets = MasterWallet.getMasterWallet();
    
    // set name + value for list:
    let listWalletCoin = [];
    let walletSelected = this.state.walletSelected;
    
    if (wallets.length > 0){
    
      wallets.forEach((wallet) => {
         if (support.indexOf(wallet.name) != -1){
            wallet.text = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
            if (process.env.isLive){
              wallet.text = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
            }
            wallet.id = wallet.address + wallet.getNetworkName() + wallet.name;
            listWalletCoin.push(wallet);        
         }          
      });
    }
    
    
    if (listWalletCoin.length > 0){
      walletSelected = listWalletCoin[0];
    }        
    
    this.setState({listWalletCoin: listWalletCoin, walletSelected: walletSelected}, ()=>{
      this.genWalletSelect();
    });   
  }
  
  selectWallet=(wallet)=>{
    this.setState({walletSelected: wallet}, ()=> {    
      this.genWalletSelect();  
      this.modalListCoinRef.close();
    });
  }

  onCloseSelectCoin=()=>{
    this.setState({modalListCoin: ''});
  }

  openListCoin=()=>{
    this.setState({modalListCoin:
      <div className="wallets-wrapper"><ListCoin
        wallets={this.state.listWalletCoin}
        walletSelected={this.state.walletSelected}
        onSelect={wallet => { this.selectWallet(wallet); }}
      /></div>
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }
  
  genWalletSelect=()=>{
    
    const { messages } = this.props.intl;  
    
    let redeemData = this.props.data;


    if(this.state.walletSelected){
      let icon = ''; try{ icon = require("@/assets/images/icon/wallet/coins/" + this.state.walletSelected.name.toLowerCase() + '.svg')} catch (ex){};
      
      // this.props.getFiatCurrency({
      //   PATH_URL: API_URL.EXCHANGE.GET_FIAT_CURRENCY,
      //   qs: {fiat_currency: 'USD', currency: this.state.walletSelected.name},
      //   successFn: (res) => {
      //     let data = res.data;
      //     let rate = data.price;
      //     let money = 25;//this.state.giftcardValue;

      //     let amount = Number(money)/rate;
      //     // if(amount && amount < 1e-6){
      //     //   amount = Number(amount).toFixed(8);
      //     // }
      //     amount = Number((parseFloat(amount)).toFixed(8));
      //     let cryptoValue = `${amount} ${this.state.walletSelected.name}`;
      //     this.setState({cryptoValue: cryptoValue});        
      //   },
      //   errorFn: (err) => {
      //     console.log("Error", err);          
      //     let cryptoValue = `0 ${this.state.walletSelected.name}`;
      //     this.setState({cryptoValue: cryptoValue});        
      //   },
      // });                
      
      this.setState({
        contentWalletSelected:                      
            <div className="wallet-from" onClick={() => {this.openListCoin() }}>
              <img className="logo" src={icon} alt=""/>
              <span className="re-name"> {this.state.walletSelected.title} </span> <span className="re-address">({this.state.walletSelected.getShortAddress()})</span>
              <img className="arrow-down" src={ExpandArrowSVG} />
            </div>                  
      }, ()=>{
        changeIconConfirmButton(icon);
      })            
    }
  }


  render() { 
    const { messages } = this.props.intl;      
    let expired_date = moment(this.state.expired_date).format('MMM Do YY')
        
    return (                      
        <div className="redeem-page"> 

            <Modal onClose={()=> {this.onCloseSelectCoin();}} title={messages.wallet.action.transfer.placeholder.select_wallet} onRef={modal => this.modalListCoinRef = modal}>
                {this.state.modalListCoin}
            </Modal>

            <ModalDialog onRef={modal => this.modalRedeenTermRef = modal}>
            <div className="re-term-header">Terms and Conditions </div>
            <div className="re-term-body">
              <ol>
              <li type="1">Autonomous is not liable in the case of loss, theft, damage or fraudulent use.</li>
              <li type="1">The Ninja code is single use and cannot be reloaded, resold or exchanged for cash.</li>
              <li type="1">The Ninja code is pre-loaded with USD and can only be converted into Bitcoin, Ethereum or Bitcoin cash. No refunds or exchanges are accepted.</li>
              <li type="1">The cryptocurrency exchange rate is based on the market price at the time of conversion on the Ninja platform.</li>
              </ol>
            </div>           
            </ModalDialog>

            <ModalDialog onRef={modal => this.modalRedeenSuccessRef = modal} onClose={this.props.onFinish}> 
              <div className="box-header-success"><img src={success} /></div>
              <div className="re-term-header">Redeem Successful</div>

              <div className="box-header-success">Thank you, fund will be soon available on your Ninja Wallet.</div>

              <Button onClick={()=>{this.modalRedeenSuccessRef.close()}} className="button-done"> Done </Button>
            </ModalDialog>

            < div className="titleBox"> 
                <img src={gitfBox} /> 
                <div className="title code">{this.state.redeemCode}</div>    
                <div>Redeem until {expired_date}</div>              
            </div>

            <div className="box-value">
                <div className="giftcard-value">
                  <div className="v-title">{messages.wallet.action.redeem.giftcard}</div> 
                  <div className="v-value">{this.state.giftcardValue} ETH</div></div>   

                {/* <div className="coin-value">
                  <div className="v-title">{messages.wallet.action.redeem.value}</div> 
                  <div className="v-value">{this.state.cryptoValue}</div>
                </div>      */}
            </div>

                

            {/* wallet receive  */}        
            <div className="wallet-select-title">Choose a wallet</div>    
            {this.state.contentWalletSelected}

            <div className="term">
              {/* {term}  */}
              By clicking REDEEM, you agree to Gift Card & Promotional code <span onClick={()=>{this.modalRedeenSuccessRef.open()}} className="term-link">Terms and Conditions </span> as applicable
            </div>
            <div className="buttonConfirmRedeem">              
              <ConfirmButton onConfirmed={this.onRedeemConfirm} buttonText={messages.wallet.action.redeem.swipe_button_redeem}/>
            </div>
        </div>       
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({  
  verifyRedeemCode: bindActionCreators(verifyRedeemCode, dispatch),   
  getFiatCurrency: bindActionCreators(getFiatCurrency, dispatch),
});

RedeemConfirm.propTypes = {  
  onFinish: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RedeemConfirm));
