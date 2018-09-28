import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import {fieldDropdown, fieldInput} from '@/components/core/form/customField'
import { API_URL } from "@/constants";
import local from '@/services/localStore';
import {APP} from '@/constants';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import {getFiatCurrency} from '@/reducers/exchange/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import './TransferCoin.scss';
import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';
import iconArrowDown from '@/assets/images/icon/expand-arrow.svg';
import BrowserDetect from '@/services/browser-detect';
import ListCoin from '@/components/Wallet/ListCoin';

const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

const TAB = {
  Transaction: 0,
  Internal: 1
}


class Transfer extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletDefault: false,
      walletSelected: false,
      currency: this.props.currency,
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,
      rate: 0,
      inputSendAmountValue: 0,
      inputSendMoneyValue: 0,
      legacyMode: false,
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
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentWillReceiveProps() {
    const {currency} = this.props;
    this.setState({inputSendAmountValue: 0, inputSendMoneyValue: 0, currency: currency ? currency : 'USD'});
    this.resetForm();

  }

  async componentDidMount() {
    let legacyMode = (BrowserDetect.isChrome && BrowserDetect.isIphone); // show choose file or take photo
    this.setState({legacyMode: legacyMode});

    //this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin", "amountMoney");

    if (this.props.amount){
      this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
    }

    if (this.props.toAddress){
      this.setState({inputAddressAmountValue: this.props.toAddress});
      this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
    }

    await this.getWalletDefault();
    this.setRate();
  }

  resetForm(){
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin", "amountMoney");
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }


  onFinish = async (data) => {
    const { onFinish } = this.props;

    if (onFinish) {
      let result = {"toAddress": this.state.inputAddressAmountValue, "fromWallet": this.state.walletSelected, "amountCoin": this.state.inputSendAmountValue, data: data}

      try{
        if(data && data.hash){
          let transactions = this.getSessionStore(this.state.walletSelected, TAB.Transaction);
          if(!transactions)
            transactions = [];

          let newTran = await this.state.walletSelected.getTransaction(data.hash);
          newTran.isError = "0";
          newTran.is_sent =  1;
          newTran.confirmations = 0;
          newTran.timeStamp = new Date().getTime()/1000;
          newTran.gasUsed = newTran.gas;
          newTran.pending = true;
          transactions.unshift(newTran);
          this.setSessionStore(this.state.walletSelected, TAB.Transaction, transactions);
        }
      }
      catch(e){
      }


      onFinish(result);
    } else {

    }
  }

  getSessionStore(wallet, tab){
    let result = false;
    if(wallet){
      let key = `${wallet.name}_${tab}_${wallet.address}`;
      let data = window.sessionStorage.getItem(key);

      try{
        if(data){
          result = JSON.parse(data);
        }
      }
      catch(e){

      }
    }

    return result;
  }

  setSessionStore(wallet, tab, data){
    let result = false;
    if(wallet && data){
      let key = `${wallet.name}_${tab}_${wallet.address}`;
      window.sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  getSetting(){
    let setting = local.get(APP.SETTING), alternateCurrency = "USD";

    //alternate_currency
    if(setting && setting.wallet && setting.wallet.alternateCurrency) {
      alternateCurrency = setting.wallet.alternateCurrency;
    }

    return alternateCurrency;
  }

  setRate = async (cryptoCurrency) => {
    let {wallet, currency} = this.props, result = 0;
    if(!wallet && !cryptoCurrency){
      wallet = this.state.walletSelected ? this.state.walletSelected : this.state.walletDefault;
    }

    if(!currency){
      currency = this.getSetting();
    }

    let rate = 0;
    if((wallet || cryptoCurrency) && currency){
      rate = await this.getRate(currency ? currency : 'USD', cryptoCurrency ? cryptoCurrency : wallet.name);
    }
    this.setState({rate: rate, currency: currency});
  }

  getRate(fiat_currency, currency){
    return new Promise((resolve, reject) => {

      this.props.getFiatCurrency({
        PATH_URL: API_URL.EXCHANGE.GET_FIAT_CURRENCY,
        qs: {fiat_currency: fiat_currency, currency: currency},
        successFn: (res) => {
          let data = res.data;
          let result = fiat_currency == 'USD' ? data.price : data.fiat_amount;
          resolve(result);
        },
        errorFn: (err) => {
          console.error("Error", err);
          resolve(0);
        },
      });
    });
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

    // set name + text for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      wallets.forEach(async (wal) => {
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }

          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;
          wal.balance = wal.formatNumber(await wal.getBalance());
          listWalletCoin.push(wal);
        }
      });
    }

    if (!walletDefault && listWalletCoin.length > 0){
      walletDefault = listWalletCoin[0];
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
      walletDefault.id = walletDefault.address + "-" + walletDefault.getNetworkName() + walletDefault.name;

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = walletDefault.formatNumber(result);
        this.setState({walletSelected: walletDefault});
        MasterWallet.UpdateBalanceItem(walletDefault);
      });
    }

    this.setState({wallets: listWalletCoin, walletDefault: walletDefault, walletSelected: walletDefault}, ()=>{
      this.props.rfChange(nameFormSendWallet, 'walletSelected', walletDefault);
    });
  }

  sendCoin = () => {
      this.modalConfirmTranferRef.open();
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

  updateAddressAmountValue = (evt, val) => {
    let amount = evt ? evt.target.value : null, rate = 0, money = 0;
    if(!amount) amount = val;

    rate = this.state.rate;
    if (rate && !isNaN(amount)){
      money = amount * rate;
      if(money >= 1000){
        money = Math.round(money).toLocaleString();
      }
      else{
        money = money.toLocaleString();
      }
    }

    this.setState({
      inputSendAmountValue: amount,
      inputSendMoneyValue: money
    }, ()=>{
      this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
      this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
    });
  }

  getMessage(str){
    const { messages } = this.props.intl;
    let result = str
    try{
      result = eval(str);
    }
    catch(e){
      console.log(e);
    }

    return result;
  }

  updateAddressMoneyValue = (evt) => {
    let money = evt.target.value, rate = 0, amount = 0;
    money = money.replace(/,/g, "");
    rate = this.state.rate;
    if (rate && !isNaN(money)){
      amount = Number(money)/rate;
      if(amount && amount < 1e-6){
        amount = Number(amount).toFixed(6);
      }

      this.setState({
        inputSendAmountValue: amount,
        inputSendMoneyValue: money
      });

      this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
      this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
    }
  }


  updateSendAddressValue = (evt) => {
    this.setState({
      inputAddressAmountValue: evt.target.value,
    });
  }

submitSendCoin=()=>{
  this.setState({isRestoreLoading: true});
  this.modalConfirmTranferRef.close();
    this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {

        this.setState({isRestoreLoading: false});
        if (success.hasOwnProperty('status')){
          if (success.status == 1){
            this.showSuccess(this.getMessage(success.message));
            this.onFinish(success.data);
            MasterWallet.NotifyUserTransfer(this.state.walletSelected.address, this.state.inputAddressAmountValue);
            // start cron get balance auto ...
            // todo hanlde it ...
          }
          else{
            this.showError(this.getMessage(success.message));
          }
        }
    });
}

// For Qrcode:
handleScan=(data) =>{
  const { rfChange } = this.props
  if(data){
    let value = data.split(',');
    this.setState({
      inputAddressAmountValue: value[0],
    });
    rfChange(nameFormSendWallet, 'to_address', value[0]);
    if (value.length == 2){
      this.setState({
        inputSendAmountValue: value[1],
      });

      //rfChange(nameFormSendWallet, 'amountCoin', value[1]);
      this.updateAddressAmountValue(null, value[1]);
    }
    this.modalScanQrCodeRef.close();
  }
}

handleError(err) {
  consolelog('error wc', err);
}

oncloseQrCode=() => {
  this.setState({ qrCodeOpen: false });
}

openQrcode = () => {
  if (!this.state.legacyMode){
    this.setState({ qrCodeOpen: true });
    this.modalScanQrCodeRef.open();
  }
  else{
    this.openImageDialog();
  }
}
openImageDialog = () => {
  this.refs.qrReader1.openImageDialog();
}

openListCoin=()=>{
  this.setState({modalListCoin:
    <ListCoin
      wallets={this.state.wallets}
      walletSelected={this.state.walletSelected}
      onSelect={wallet => { this.selectWallet(wallet); }}
    />
  }, ()=> {
    this.modalListCoinRef.open();
  });
}

selectWallet = async (walletSelected) => {

  this.setState({walletSelected, modalListCoin: ''}, ()=> {
    MasterWallet.UpdateBalanceItem(walletSelected);
    this.modalListCoinRef.close();
  });

  if(walletSelected.name != this.state.currency){
    await this.setRate(walletSelected.name);
    this.updateAddressAmountValue(null, this.state.inputSendAmountValue);
  }
}

get showWallet(){
  const walletSelected = this.state.walletSelected;
  let icon = '';
  try{ icon = require("@/assets/images/icon/wallet/coins/" + walletSelected.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

  return (
    <div className="walletSelected" onClick={() => {this.openListCoin() }}>
      <div className="row">
        <div className="col-2 icon"><img src={icon} /></div>
        <div className="col-5">
          <div className="name">{walletSelected && walletSelected.title}</div>
          <div className="address">{walletSelected && walletSelected.getShortAddress()}</div>
        </div>
        <div className="col-5 lastCol">
          <div className="balance">{walletSelected && walletSelected.balance + " " + walletSelected.name}</div>
          <div className="arrow"><img src={iconArrowDown} /></div>
        </div>
      </div>
    </div>);
}

render() {
  let { currency } = this.props;
  if(!currency) currency = "USD";
  const { messages } = this.props.intl;
  let showDivAmount = this.state.walletSelected && this.state.rate;
  const { modalListCoin } = this.state;

  return (
    <div>
        {/* Dialog confirm transfer coin */}
        <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmTranferRef = modal}>
        <div className="bodyConfirm"><span>{messages.wallet.action.transfer.text.confirm_transfer} {this.state.inputSendAmountValue} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
        <div className="bodyConfirm">
            <Button className="left" cssType="danger" onClick={this.submitSendCoin} >{messages.wallet.action.transfer.button.confirm}</Button>
            <Button className="right" cssType="secondary" onClick={() => { this.modalConfirmTranferRef.close(); }}>Cancel</Button>
        </div>
        </ModalDialog>

        {/* QR code dialog */}
        <Modal onClose={() => this.oncloseQrCode()} title={messages.wallet.action.transfer.label.scan_qrcode} onRef={modal => this.modalScanQrCodeRef = modal}>
          {this.state.qrCodeOpen || this.state.legacyMode ?
            <QrReader
              ref="qrReader1"
              delay={this.state.delay}
              onScan={(data) => { this.handleScan(data); }}
              onError={this.handleError}
              style={{ width: '100%', height: '100%' }}
              legacyMode={this.state.legacyMode}
              showViewFinder={false}
            />
            : ''}
        </Modal>

        <SendWalletForm className="sendwallet-wrapper" onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

        {/* Box: */}
        <div className="bgBox">
          <p className="labelText">{messages.wallet.action.transfer.label.to_address}</p>
          <div className="div-address-qr-code">
            <Field
              name="to_address"
              type="text"
              className="form-control input-address-qr-code"
              placeholder={messages.wallet.action.transfer.placeholder.to_address}
              component={fieldInput}
              value={this.state.inputAddressAmountValue}
              onChange={evt => this.updateSendAddressValue(evt)}
              validate={[required]}
            />
            <img onClick={() => { this.openQrcode() }} className="icon-qr-code-black" src={iconQRCodeWhite} />
          </div>
          <p className="labelText">{messages.wallet.action.transfer.label.amount}</p>
            <div className="div-amount">
              <div className="prepend">{ this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : ''}</div>
              <Field
                key="2"
                name="amountCoin"
                placeholder={"0.0"}
                type="text"
                className="form-control"
                component={fieldInput}
                value={this.state.inputSendAmountValue}
                onChange={evt => this.updateAddressAmountValue(evt)}
                validate={[required, amountValid]}
                autoComplete="off"
              />
            </div>
            { !showDivAmount ? "" :
              <div className="div-amount">
                <div className="prepend">{currency}</div>
                <Field
                  key="1"
                  name="amountMoney"
                  placeholder={"0.0"}
                  type="text"
                  className="form-control"
                  component={fieldInput}
                  value={this.state.inputSendMoneyValue}
                  onChange={evt => this.updateAddressMoneyValue(evt)}
                  autoComplete="off"
                />
              </div>
            }

            <div className ="dropdown-wallet-tranfer ">
              <p className="labelText">{messages.wallet.action.transfer.label.from_wallet}</p>
              {this.showWallet}

              <div className="wallets-wrapper">
                <Modal title="Select wallets" onRef={modal => this.modalListCoinRef = modal}>
                  {modalListCoin}
                </Modal>
              </div>


            </div>

            <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>{messages.wallet.action.transfer.button.transfer}</Button>
          </div>


        </SendWalletForm>
      </div>
    )
  }
}

Transfer.propTypes = {
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
  clearFields: bindActionCreators(clearFields, dispatch),
  getFiatCurrency: bindActionCreators(getFiatCurrency, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Transfer));
