import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import PropTypes from 'prop-types';
import { setLanguage } from '@/reducers/app/action';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import './Remind.scss';
import { ICON } from '@/styles/images';
import { set, getJSON } from 'js-cookie';
import { PAYMENT_REMIND } from '@/constants';

const supportWallets = ['BTC', 'ETH', 'BCH', 'XRP', 'EOS'];

class Remind extends React.Component {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      payment: '',
      modalRemind: ''
    }
  }

  componentDidMount(){
    this.init();
  }

  init(){
    const payment = getJSON(PAYMENT_REMIND);
    if(payment){
      this.setState({payment})
    }
  }

  openRemind=()=>{
    const payment = this.state.payment;
    this.setState({modalRemind: <div  className="remind-checkout-wrapper">
      <div className="text">You have a missing payment. Do you want to continue checkout?</div>
      <div>
        <Button className="mr-2" cssType="primary" onClick={this.goRemind}>Checkout now</Button>
        <Button className="float-right" cssType="secondary" onClick={this.removeRemind}>Remove</Button>
      </div>

    </div>}, ()=>{
      this.modalRemindRef.open();
    })
  }

  removeRemind=()=>{
    this.setState({modalRemind: '', payment: ''}, ()=>{
      set(PAYMENT_REMIND, "");
      this.modalRemindRef.close();
    });
  }

  goRemind=()=>{
    const payment = this.state.payment;
    if(payment){
      this.setState({modalRemind: '', payment: ''}, ()=>{
        window.location.href = payment.url;
        this.modalRemindRef.close();
      });
    }

  }

  get showRemind(){
    const payment = this.state.payment;
    if(payment){
      return (<div className="float-button-remind-payment" onClick={()=> this.openRemind()}>{ICON.ArrowLeft('#FFF', '1x')} Payment</div>);
    }

    return "";
  }

  render() {
    const { messages } = this.props.intl;
    const { modalRemind } = this.state;

    return (

      <div>
        {this.showRemind}
        <ModalDialog onRef={modal => this.modalRemindRef = modal} close={true} title="">
          {modalRemind}
        </ModalDialog>
      </div>

    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatch = ({
  setLanguage,
  showAlert,
  showLoading,
  hideLoading
});


export default injectIntl(connect(mapStateToProps, mapDispatch)(Remind));
