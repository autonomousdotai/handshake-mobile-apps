import React from 'react';
import PropTypes from 'prop-types';
import { Field, clearFields, change } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm';
import ListCoin from '@/components/Wallet/ListCoin';
import { getCryptoPrice } from '@/reducers/exchange/action';
import { bindActionCreators } from 'redux';
import { MasterWallet } from "@/services/Wallets/MasterWallet";
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import iconClock from '@/assets/images/icon/pay/clock.svg';
import Countdown from '@/components/Countdown/Countdown';

// style
import './Checkout.scss';


const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

class Checkout extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletSelected: false,
      amountCrypto: this.props.amountCrypto,
      toAddress: false,
      isDisableCheckout: false,
      isRestoreLoading: false,
      event: false,
      isExpired: false,
      isWarning: false,
      modalListCoin: ''
    }
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 5000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }

  async componentDidMount() {
    this.props.showLoading();
    await this.getWalletDefault();
    this.props.hideLoading();

    this.getBalanceWallets();
  }

  getBalanceWallets = async () => {
    let { wallets, walletSelected, walletDefault } = this.state;

    if(wallets){
      for(let i in wallets){
        wallets[i].balance = await wallets[i].getBalance(true);
        if(walletSelected.name == wallets[i].name && walletSelected.address == wallets[i].address && walletSelected.network == wallets[i].network){
          walletSelected.balance = wallets[i].balance;
          MasterWallet.UpdateBalanceItem(walletSelected);
          this.checkValid();
        }
      }

      this.setState({wallets, walletSelected, walletDefault});
    }
  }


  copyToClipboard =(text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  onFinish = (data) => {
    const { onFinish } = this.props;

    if (onFinish) {
      let result = {
        'fromWallet': this.state.walletSelected,
        'hash': data ? data.hash : ""
      };

      onFinish(result);
    }
  }

  onRefesh = () => {
    const { onRefesh } = this.props;
    if (onRefesh && typeof onRefesh === 'function') {
      this.showLoading();
      this.setState({isExpired: false, isWarning: false});
      onRefesh();
    }
  }

  getWalletDefault = async () =>{
    const { cryptoCurrency } = this.props;
    let walletDefault = await MasterWallet.getWalletDefault(cryptoCurrency);
    let wallets = MasterWallet.getWallets(cryptoCurrency);

    // set name + text for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      for(let wal of wallets){
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }

          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;
          listWalletCoin.push(wal);
        }
      }
    }

    if (!walletDefault){
      if (listWalletCoin.length > 0){
        walletDefault = listWalletCoin[0];
      }
    }

    if (walletDefault){
      walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";
      if (process.env.isLive){
        walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
      }
      walletDefault.id = walletDefault.address + "-" + walletDefault.getNetworkName() + walletDefault.name;
    }

    let endDate = new Date(), warningDate = new Date();
    // endDate.setSeconds(endDate.getSeconds() + 15);
    // warningDate.setSeconds(warningDate.getSeconds() + 5);
    endDate.setMinutes(endDate.getMinutes() + 5);
    warningDate.setMinutes(warningDate.getMinutes() + 1);

    this.setState({wallets: listWalletCoin, walletSelected: walletDefault, event:{end: endDate.getTime(), warning: warningDate.getTime()}, isExpired: false, isWarning: false});
  }

  checkValid = () =>{
    const { amountCrypto, toAddress } = this.props;
    const wallet = this.state.walletSelected;

    let result = true;
    if(wallet && toAddress && amountCrypto) {
      if(amountCrypto <= wallet.balance) {
        result = false;
      }
    }
    this.setState({isDisableCheckout: result})
  }

  sendCoin = () => {
    const { messages } = this.props.intl;
    const { amountCrypto, toAddress} = this.props;

    const {walletSelected:wallet} = this.state;
    if(wallet && toAddress && amountCrypto) {
      if(amountCrypto > wallet.balance) {
        this.showError(messages.wallet.action.payment.error.insufficient);
        return;
      }
      else{
        this.submitSendCoin(wallet, toAddress, amountCrypto);
      }
    }

  }

  invalidateTransferCoins = (value) => {
    const { messages } = this.props.intl;

    if (!this.state.walletSelected) return {};
    let errors = {};
    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['to_address']);
      if (result !== true)
          errors.to_address = this.getMessage(result);
      // check amount:

      if (parseFloat(this.state.walletSelected.balance) <= parseFloat(value['amountCoin']))
        errors.amountCoin = `${messages.wallet.action.transfer.error}`
    }
    return errors
  }

  getMessage(str){
    const { messages } = this.props.intl;

    let result = "";
    try{
      result = eval(str);
    }
    catch(e){
      console.error(e);
    }

    return result;
  }

  copyAddress=()=>{
    const { messages } = this.props.intl;

    Clipboard.copy(this.state.toAddress);
    this.showToast(messages.wallet.action.copy.message);
  }

  selectWallet = (walletSelected) => {

    this.setState({walletSelected, modalListCoin: ''}, ()=> {
      this.modalListCoinRef.close()
      this.checkValid();
    });
  }


  submitSendCoin=(wallet, toAddress, amountCrypto)=>{
    const {toCrypto} = this.props;

    this.setState({isRestoreLoading: true});

    wallet.transfer(toAddress, amountCrypto).then(success => {
      this.setState({isRestoreLoading: false});
      if (success.hasOwnProperty('status')){
        if (success.status == 1){
          this.onFinish(success.data);
        }
        else{
          this.showError(this.getMessage(success.message));
        }
      }
    });
  }

  openListCoin=()=>{
    this.setState({modalListCoin:
      <ListCoin
        wallets={this.state.wallets}
        crypto={this.state.walletSelected.name}
        walletSelected={this.state.walletSelected}
        onSelect={wallet => { this.selectWallet(wallet); }}
      />
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }

  renderEvenTimeLeft=(event) => {
    const {rate, fiatCurrency, cryptoCurrency} = this.props;
    const {isExpired, isWarning} = this.state;

    return !isExpired && event && (
      <div className={isWarning ? "ratelock warning": "ratelock"}>
        <div className="timer">
          <Countdown endTime={event.end} timeLeftToWarning={event.warning}
            onComplete={() => this.setState({isExpired: true})}
            onWarning={() => this.setState({isWarning: true})}
            hideHours
          />
        </div>
        <div className="msg">
          <span className="title">{isWarning ? "Checkout expiring soon" : "Awaiting Payment..."}</span>
          <span className="rate">{rate && fiatCurrency && cryptoCurrency ? `Rate locked 1 ${cryptoCurrency} = ${rate} ${fiatCurrency}` : "Crypto amount is requested from shop."}</span>
        </div>
      </div>
    );
  }

  get showPayment(){
    const { amount, fiatCurrency, amountCrypto, cryptoCurrency} = this.props;
    let icon = '';
    try{ icon = require("@/assets/images/icon/wallet/coins/" + cryptoCurrency.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

    return !this.state.isExpired && (
      <div className="amount-info">
        <div className="icon"><img src={icon} /></div>
        <div className="crypto-amount">{amountCrypto} {cryptoCurrency}</div>
        {fiatCurrency && <div className="amount">{amount} {fiatCurrency}</div>}
      </div>
    )
  }

  get showExpiredPayment(){

    return this.state.isExpired && (
      <div className="expired-info">
        <div className="icon"><img src={iconClock} /></div>
        <div className="title">Your payment window has expired.</div>
        <div className="msg">Hit the Refresh button below to lock in a new exchange rate and start again.</div>
        <Button className="button-wallet-cpn btn" block={true} onClick={()=> this.onRefesh() }>Refesh</Button>
      </div>
    )
  }

  get showTabs(){

    return !this.state.isExpired && (
      <nav className="nav nav-pills nav-fill">
        <a className="nav-item nav-link active" href="#">Wallet</a>
        {/* <a className="nav-item nav-link" href="#">Scan to pay another device</a>
        <a className="nav-item nav-link" href="#">Copy</a> */}
      </nav>
    )
  }

  get showWallet(){
    const { messages } = this.props.intl;
    const { modalListCoin } = this.state;
    return !this.state.isExpired && (
      <div className="wallet-info">
        <div className="wallet" onClick={() => {this.openListCoin() }}>
          <div className="name">{this.state.walletSelected && this.state.walletSelected.title}</div>
          <div className="value">{this.state.walletSelected && this.state.walletSelected.getShortAddress()}</div>
          <div className="clearfix"></div>
          <div className="name">Balance</div>
          <div className="value">{this.state.walletSelected && this.state.walletSelected.balance + " " + this.state.walletSelected.name}</div>
        </div>

        <ModalDialog className="wallets-wrapper" title="Select wallets" onRef={modal => this.modalListCoinRef = modal}>
          {modalListCoin}
        </ModalDialog>
        {/* <div className ="dropdown-wallet-tranfer">
          <Field
            name="walletSelected"
            component={fieldDropdown}
            placeholder={messages.wallet.action.payment.placeholder.select_wallet}
            defaultText={this.state.walletSelected.text}
            list={this.state.wallets}
            onChange={(item) => {
                this.onItemSelectedWallet(item);
              }
            }
          />
        </div>

        <label className='label-balance'>{messages.wallet.action.payment.label.wallet_balance} { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>
        */}

        <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading} disabled={this.state.isDisableCheckout} onClick={()=> this.sendCoin()} block={true}>{messages.wallet.action.payment.button.checkout}</Button>

        <div className="help"><div className="badge badge-light" onClick={()=> window.location.href = '/wallet'}>Go to Ninja Wallet</div></div>
      </div>
    )
  }

  render() {
    const { messages } = this.props.intl;
    return (<div className="checkout-container">
        {this.renderEvenTimeLeft(this.state.event)}
        {this.showExpiredPayment}
        {this.showPayment}
        {/* {this.showTabs} */}
        {this.showWallet}
      </div>)

  }
}

const mapState = (state) => ({
});

const mapDispatch = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
});

Checkout.propTypes = {
  onCountdownComplete: PropTypes.func,
  onRefesh: PropTypes.func,
  onFinish: PropTypes.func
};

Checkout.defaultProps = {
  onCountdownComplete: undefined,
};


export default injectIntl(connect(mapState, mapDispatch)(Checkout));
