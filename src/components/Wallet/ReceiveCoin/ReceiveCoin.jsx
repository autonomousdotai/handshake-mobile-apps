import React from 'react';
import PropTypes from 'prop-types';

import {injectIntl} from 'react-intl';
import {Field, change, clearFields} from "redux-form";
import {fieldDropdown, fieldInput} from '@/components/core/form/customField'
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import Button from '@/components/core/controls/Button';
import { API_URL } from "@/constants";
import {getFiatCurrency} from '@/reducers/exchange/action';
import {MasterWallet} from "@/services/Wallets/MasterWallet";

import { showLoading, hideLoading, showAlert } from '@/reducers/app/action';
import { StringHelper } from '@/services/helper';
import createForm from '@/components/core/form/createForm';
import './ReceiveCoin.scss';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-green.svg';
import iconSwitch from '@/assets/images/icon/icon-switch.png';

const QRCode = require('qrcode.react');

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy;

    function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
      textArea = document.createElement('textArea');
      textArea.value = text; document.body.appendChild(textArea);
    }

    function selectText() {
    let range,
      selection;
      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges(); selection.addRange(range);
        textArea.setSelectionRange(0, 999999); } else { textArea.select();
        }
  }
  function copyToClipboard() {
    document.execCommand('copy'); document.body.removeChild(textArea); }

    copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);
const nameFormReceiveWallet = 'receiveWallet';
const ReceiveWalletForm = createForm({ propsReduxForm: { form: nameFormReceiveWallet, enableReinitialize: true, clearSubmitErrors: true}});

const nameFormShowAddressWallet = 'showAddressWallet';
const ShowAddressWalletForm = createForm({ propsReduxForm: { form: nameFormShowAddressWallet}});

class ReceiveCoin extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletDefault: false,
      walletSelected: false,
      rate: 0,
      inputSendAmountValue: '',
      inputSendMoneyValue: '',
      isCurrency: false,
      switchValue: 0,
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

  componentDidMount() {
    this.getWalletDefault();
    this.setRate()
  }

  setRate = async (cryptoCurrency) => {
    let rate = await this.getRate(cryptoCurrency);
    this.setState({rate: rate});
  }

  getRate(cryptoCurrency){
    return new Promise((resolve, reject) => {
      let {wallet, currency} = this.props, result = 0;

      if(wallet && currency){
        this.props.getFiatCurrency({
          PATH_URL: API_URL.EXCHANGE.GET_FIAT_CURRENCY,
          qs: {fiat_currency: currency ? currency : 'USD', currency: cryptoCurrency ? cryptoCurrency : wallet.name},
          successFn: (res) => {
            let data = res.data;
            result = currency == 'USD' ? data.price : data.fiat_amount;
            resolve(result);
          },
          errorFn: (err) => {
            resolve(0);
          },
        });
      }
      else{
        resolve(0);
      }
    });
  }

  resetForm(){
    this.props.clearFields(nameFormReceiveWallet, false, false, "amountCoin", "amountCoinTemp");
  }

  onFinish = () => {
    const { onFinish } = this.props;

    if (onFinish) {
      let result = {"fromWallet": this.state.walletSelected, "amount": this.state.inputSendAmountValue}
      onFinish(result);
    } else {

    }
  }

  getWalletDefault = () =>{

    const { coinName, listWallet, wallet } = this.props;

    let wallets = listWallet;
    let walletDefault = null;
    if (!wallets){
      wallets = MasterWallet.getMasterWallet();
    }

    if (coinName){
        walletDefault = MasterWallet.getWalletDefault(coinName);
    }
    if (!walletDefault){
      if (wallets.length > 0){
        walletDefault = wallets[0];
      }
    }
    // set name + value for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      wallets.forEach((wallet) => {
        // if(!wallet.isCollectibles){

          wallet.text = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
          if (process.env.isLive){
            wallet.text = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
          }
          wallet.id = wallet.address + wallet.getNetworkName() + wallet.name;
          listWalletCoin.push(wallet);
        // }
      });
    }

    // set name for walletDefault:
    if (wallet){
      walletDefault = wallet;
    }

    if (walletDefault){
      walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";
      if (process.env.isLive){
        walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
      }
      walletDefault.id = walletDefault.address + walletDefault.getNetworkName() + walletDefault.name;

    }
    MasterWallet.log(walletDefault, "walletSelected");
    this.setState({wallets: listWalletCoin, walletDefault: walletDefault, walletSelected: walletDefault});

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

  onCloseReceive = () => {
    this.resetForm();
  }

  updateAddressAmountValue = (evt) => {
    this.calculator(evt.target.value);
  }

  switchValue = (showDivAmount) => {
    if (showDivAmount){
      let isCurrency = !this.state.isCurrency;
      this.setState({isCurrency: isCurrency}, () =>{
        this.calculator(this.state.inputSendAmountValue);
      });
    }
  }

  calculator(value){
    const alternateCurrency = this.props.currency;

    this.setState({ inputSendAmountValue: value});

    let symbol = this.state.isCurrency ? alternateCurrency : (this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : '');
    let placeholder = value.toString() == '' ? "" : value.toString() + " " + symbol

    this.props.rfChange(nameFormReceiveWallet, 'amountCoinTemp', placeholder);
    let isCurrency = this.state.isCurrency;
    if (isCurrency){
      let money = value, amount = 0;

      if (this.state.rate && !isNaN(money)){
        amount = money/this.state.rate;

        this.setState({
          switchValue: amount
        });
      }
    }
    else{
      let amount = value, money = 0;

      if (this.state.rate && !isNaN(amount)){
        money = amount * this.state.rate;
        if(money >= 1000){
          money = Math.round(money).toLocaleString();
        }
        else{
          money = money.toLocaleString();
        }

        this.setState({
          switchValue: money
        });
      }
    }
  }

  download = (value) => {
    const canvas = document.querySelector('.box-qr-code > canvas');
    this.downloadRef.href = canvas.toDataURL();
    this.downloadRef.download = this.state.walletSelected.getShortAddress() + "-" + value.toString() + "-" + this.state.walletSelected.name + ".png";
 }

  onItemSelectedWallet = (item) =>{
    let wallet = MasterWallet.convertObject(item);

    // if(wallet.name != this.state.walletSelected.name){
    //   this.resetForm();
    //   this.setState({rate: 0});
    // }

    this.setState({ walletSelected: wallet}, async () => {
      if(wallet.name != this.state.currency)
        await this.setRate(wallet.name);

      this.calculator(this.state.inputSendAmountValue);
    });
  }

  // get qrcode value
  genQRCodeValue(){
    if (this.state.walletSelected){
      let amountValue = this.state.inputSendAmountValue.trim() != "" ? this.state.inputSendAmountValue.trim() : "";
      if(this.state.isCurrency){
        amountValue = this.state.switchValue != '' ? this.state.switchValue.toString() : "";
      }
      if (amountValue != ""){
        //<coin-title>:<address>?amount=<amount>
        return ((this.state.walletSelected.className.replace(/\s/g,'')).toLowerCase() + ":" + this.state.walletSelected.address + "?amount=" + amountValue.toString()).trim();;
      }
      // address only if amount is none
      return this.state.walletSelected.address;
    }
    return "";
  }

  render() {
    const { messages } = this.props.intl;
    let { currency } = this.props;
    if(!currency) currency = "USD";

    const qrCodeValue = this.genQRCodeValue();

    let showDivAmount = this.state.walletSelected && this.state.rate;

    // let value = (this.state.inputSendAmountValue != '' ? `,${this.state.inputSendAmountValue}` : '');
    // if (this.state.isCurrency){
    //   value = (this.state.switchValue != '' ? `,${this.state.switchValue}` : '');
    // }
    // let qrCodeValue = (this.state.walletSelected ? this.state.walletSelected.address : '') + value;

    let symbol = this.state.isCurrency ? currency : (this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : '');

    let placeholder = ((this.state.inputSendAmountValue == 0 || this.state.inputSendAmountValue.toString() == '') ? "0.0" : this.state.inputSendAmountValue.toString() ) + " " + symbol

    return (
      <div className="receive-coins">
          {/* <div className="bodyTitle"><span>{messages.wallet.action.receive.message} { this.state.walletSelected ? this.state.walletSelected.name : ''} </span></div> */}
          <div className={['bodyBackup bodyShareAddress']}>

          {/* <div className="bodyTitle">
            <span>{messages.wallet.action.receive.title2}</span>
          </div> */}

          <div className="box-addresses">

              <div className="box-address">
                  <div className="addressDivPopup">{ this.state.walletSelected ? this.state.walletSelected.address : ''}&nbsp;
                  <img className="expand-arrow" src={ExpandArrowSVG} alt="expand" />
                  </div>
              </div>

              <div className="box-hide-wallet">
                <ShowAddressWalletForm className="receivewallet-wrapper">
                { this.state.walletSelected ?

                  <Field
                    name="showWalletSelected"
                    component={fieldDropdown}
                    placeholder={messages.wallet.action.receive.placeholder.choose_wallet}
                    defaultText={this.state.walletSelected.text}
                    list={this.state.wallets}
                      onChange={(item) => {
                        this.onItemSelectedWallet(item);
                      }
                    }
                    />

                :""}
                </ShowAddressWalletForm>
              </div>

            </div>

            <div className="box-qr-code">
                <QRCode size={230} value={qrCodeValue} onClick={() => { Clipboard.copy(this.state.walletSelected.address); this.showToast(messages.wallet.action.receive.success.share);}} />
            </div>

            {/* Don't support for Collectibles */}
            { !this.state.walletSelected.isCollectibles ?
            <ReceiveWalletForm className="receivewallet-wrapper">
              <div className="div-amount">
               { showDivAmount ?
                <div onClick={() => {this.switchValue(showDivAmount)}} className={"prepend-button"}>
                  <img src={iconSwitch}/>
                  {/* ⋮  */}
                </div>
               : ""}

                <Field
                  key="0"
                  name="amountCoinTemp"
                  placeholder={placeholder}
                  type="text"
                  className={["form-control", "amountCoinTemp"]}
                  component={fieldInput}
                  autoComplete="off"
                />

                <Field
                  key="2"
                  name="amountCoin"
                  placeholder={"0.0"}
                  type="text"
                  className={["form-control", "amountCoin"]}
                  component={fieldInput}
                  value={this.state.inputSendAmountValue}
                  onChange={evt => this.updateAddressAmountValue(evt)}
                  validate={[amountValid]}
                  autoComplete="off"
                />
              </div>

            </ReceiveWalletForm>
            : ""}

            { !showDivAmount ? "" :
                <div className="switch-value">
                    ≈ {this.state.switchValue}&nbsp;
                    <b>{!this.state.isCurrency ? currency
                    : (this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : '') } </b>
                </div>
              }

            {/* <div className="link-request-custom-amount" onClick={() => { this.modalCustomAmountRef.open(); this.setState({ inputSendAmountValue: '' }); }}>{messages.wallet.action.receive.button.request_amount}</div> */}

            <a className="button-download" ref={(ref) => this.downloadRef = ref} onClick={()=> {this.download(value);}}>
                {messages.wallet.action.receive.link.download_qrcode}
            </a>

            <Button className="button" cssType="primary" onClick={() => { Clipboard.copy(this.state.walletSelected.address); this.showToast(messages.wallet.action.receive.success.share);}} >
              {messages.wallet.action.receive.button.text}
            </Button>
          </div>

      </div>
    )
  }
}

ReceiveCoin.propTypes = {
  wallet: PropTypes.any,
  currency: PropTypes.string,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  getFiatCurrency: bindActionCreators(getFiatCurrency, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReceiveCoin));
