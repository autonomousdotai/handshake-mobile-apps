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
import { shortenUser } from '@/services/offer-util';
import Button from '@/components/core/controls/Button';
import Input from '../Input';
import Modal from '@/components/core/controls/Modal';
import ConfirmButton from '@/components/Wallet/ConfirmButton';

import gitfBox from '@/assets/images/wallet/images/gift-gift-box.svg';
import RedeemConfirm from '@/components/Wallet/Redeem/RedeemConfirm';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';


class Redeem extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      redeemCode: this.props.data.code || ' ',
      error: ''      ,
      contentRedeemConfirm: '',
      data: '', 
    };    
    this.modalHeaderStyle = {color: "#fff", background: "#546FF7"};
    this.modalBodyStyle = {padding: 0};
  }

  handleNameChange =(value)=>{
    this.setState({redeemCode: value, error: ''});
  }

  checkRedeemCode=()=>{
    const { messages } = this.props.intl;    
    let data = {"code": this.state.redeemCode}
    this.props.verifyRedeemCode({
      PATH_URL: 'wallet/gift-card/check',
      data: data,
      METHOD: 'POST',
      successFn: (res) => { 
        this.setState({data: res.data}, ()=>{            
          this.openConfirm();
        })       
        if(res && res.data){
          if (res.data.amount > 0 && !res.data.status){
            this.setState({data: res.data}, ()=>{            
              this.openConfirm();
            })
          } 
          else{
            this.setState({error: messages.wallet.action.redeem.invalid_code});
          }                   
        }  
        else{
          this.setState({error: messages.wallet.action.redeem.invalid_code});
        }      
      },
      errorFn: (e) =>{    
        this.openConfirm();     
        if (e.message)       
          this.setState({error: e.message});
        else
          console.log(e);
      }
    });
  }  

  openConfirm=()=>{
    this.setState({contentRedeemConfirm: <RedeemConfirm onFinish={this.props.onFinish} data={this.state.data} />}, ()=>{
      this.modalRedeemConfirmRef.open();
    });
  }

  render() {
    const { messages } = this.props.intl;    
    
    return (
      <div>  

          <Modal onRef={modal => this.modalRedeemConfirmRef = modal} title={messages.wallet.action.redeem.title} modalBodyStyle={this.modalBodyStyle} customBackIcon={BackChevronSVGWhite} modalHeaderStyle={this.modalHeaderStyle}   >
              {this.state.contentRedeemConfirm}
          </Modal>

        <div className="redeem-page">   
          <div className="titleBox">
            <img src={gitfBox} /> 
            <div className="title">{messages.wallet.action.redeem.title}</div>
          </div>
          <div className="body">
              <div className="redeem-code">
                <Input required placeholder={messages.wallet.action.redeem.your_code} maxLength="40" value={this.state.redeemCode} onChange={this.handleNameChange} /> 
                {this.state.error && <div className="error">{this.state.error}</div>}
              </div>                     
              <div className="buttonRedeem">              
                <Button onClick={this.checkRedeemCode}>{messages.wallet.action.redeem.button_check}</Button>
              </div>
              <div className="findcode">
                <a target="_blank" href="https://www.autonomous.ai/gift-card?ref=ninja-wallet-redeem">
                  {messages.wallet.action.redeem.find_code}
                </a>            
              </div>
          </div>
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
});

RedeemConfirm.propTypes = {  
  onFinish: PropTypes.func,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Redeem));
