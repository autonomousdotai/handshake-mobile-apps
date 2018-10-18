import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import { fieldInput } from '@/components/core/form/customField'
import { API_URL } from "@/constants";
import local from '@/services/localStore';
import {APP} from '@/constants';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {getFiatCurrency} from '@/reducers/exchange/action';
import { showLoading, hideLoading, showAlert } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import './TransferCoin.scss';
import { ICON } from '@/styles/images';
import BrowserDetect from '@/services/browser-detect';
import WalletSelected from '@/components/Wallet/WalletSelected';
import Slider from 'react-rangeslider'



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
      legacyMode: false,

      rate: 0,
      inputSendAmountValue: 0,
      inputSendMoneyValue: 0,
      legacyMode: false,
      walletNotFound: '',
      volume: 0,
      listFeeObject: false
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
    this.showAlert(mst, 'success', 5000, ICON.SuccessChecked());
  }
  componentWillReceiveProps() {
    const {currency} = this.props;
    this.setState({inputSendAmountValue: 0, inputSendMoneyValue: 0, currency: currency ? currency : 'USD'});
  }

  async componentDidMount() {
    this.props.showLoading();
    let legacyMode = (BrowserDetect.isChrome && BrowserDetect.isIphone); // show choose file or take photo
    this.setState({legacyMode: legacyMode});

    await this.getWalletDefault();
    this.props.hideLoading();

    await this.setRate();

    let amount = this.props.amount || "";
    if(amount){
      this.updateAddressAmountValue(null, amount);
    }

    let toAddress = this.props.toAddress || "";
    this.props.rfChange(nameFormSendWallet, 'to_address', toAddress);
    this.getBalanceWallets();
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
      catch(e){ }
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
      if (coinName){
        wallets = MasterWallet.getWallets(coinName);
      }
      else{
        wallets = MasterWallet.getMasterWallet();
      }
    }

    if (coinName){
      walletDefault = MasterWallet.getWalletDefault(coinName);
    }

    // set name + text for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      for(let wal of wallets){
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }

          wal.balance = wal.formatNumber(wal.balance);
          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;
          listWalletCoin.push(wal);
        }
      }
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
      walletDefault.balance = walletDefault.formatNumber(walletDefault.balance);
    }

    this.setState({wallets: listWalletCoin, walletDefault, walletSelected: walletDefault}, ()=>{
      this.props.rfChange(nameFormSendWallet, 'walletSelected', walletDefault);
      this.getFeeLevel(walletDefault);
    });
  }

  getBalanceWallets = async () => {
    let { wallets, walletSelected, walletDefault } = this.state;
    if(wallets && wallets.length){
      for(let i in wallets){
        wallets[i].balance = await wallets[i].getBalance(true);
        if(walletSelected.name == wallets[i].name && walletSelected.address == wallets[i].address && walletSelected.network == wallets[i].network){
          walletSelected.balance = wallets[i].balance;

          // get balance for first item + update to local store:
          walletDefault.balance = wallets[i].balance;
          MasterWallet.UpdateBalanceItem(walletDefault);
        }
      }

      this.setState({wallets, walletSelected, walletDefault});
    }
    else{
      const { coinName } = this.props;

      if(coinName){
        this.setState({walletNotFound:
          <div className="walletNotFound">
            {coinName} wallet is not found to transfer
          </div>
        }, ()=> {

        });
      }
    }
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
  let fee = this.state.listFeeObject ? this.state.listFeeObject.listFee[this.state.volume].value : 0;
  let option = {"fee": fee};
  this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue, option).then(success => {

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
    let qrCodeResult = MasterWallet.getQRCodeDetail(data);
    if (qrCodeResult){
      let dataType = qrCodeResult['type'];
      if (dataType == MasterWallet.QRCODE_TYPE.TRANSFER){
          this.setState({
            inputAddressAmountValue: qrCodeResult.data.address, inputSendAmountValue: qrCodeResult.data.amount
          });
          this.updateAddressAmountValue(null, qrCodeResult.data.amount);
          rfChange(nameFormSendWallet, 'to_address', qrCodeResult.data.address);
      }
      else if (dataType == MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS){
        rfChange(nameFormSendWallet, 'to_address', qrCodeResult.data.address);
      }
      else{
        this.showAlert("Address not found");
      }
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

selectWallet = async (walletSelected) => {

  this.setState({walletSelected});

  if(walletSelected.name != this.state.currency){
    await this.setRate(walletSelected.name);
    this.updateAddressAmountValue(null, this.state.inputSendAmountValue);
  }
  // show fee?
  this.getFeeLevel(walletSelected);
  
}

async getFeeLevel(walletSelected){
  let listFee = await walletSelected.getLevelFee();
  let listFeeObject = false;
  console.log(listFee);
  if(listFee){
    let labels = {};
    let min = 0;
    let max = listFee.length-1;
    for (var i = 0; i < listFee.length; i ++){
      labels[i.toString()] = listFee[i].title;
    }
    listFeeObject = {'listFee': listFee, 'labels': labels, 'min': min, "max": max};    
  }
  this.setState({listFeeObject: listFeeObject, volume: 1});
    
}

handleOnChange = (value) => {
  this.setState({
    volume: value
  })
}

render() {
  let { currency } = this.props;
  if(!currency) currency = "USD";
  const { messages } = this.props.intl;
  let showDivAmount = this.state.walletSelected && this.state.rate;
  const { walletNotFound, walletSelected, wallets } = this.state;

  let amount = this.state.inputSendAmountValue;
  try {amount= parseFloat(amount).toFixed(8)}catch (e){}  

  return (
    <div>        

        {/* Dialog confirm transfer coin */}
        <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmTranferRef = modal}>
        <div className="bodyConfirm"><span>{messages.wallet.action.transfer.text.confirm_transfer} {amount} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
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

        <SendWalletForm className={walletNotFound ? "d-none" : "sendwallet-wrapper"} onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

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
            <span onClick={() => { this.openQrcode() }} className="icon-qr-code-black">{ICON.QRCode()}</span>
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

            {this.state.listFeeObject && 
            <div>
              <p className="labelText">{messages.wallet.action.transfer.label.feel_level} {this.state.listFeeObject.listFee[this.state.volume].description}</p>
              <div className="fee-level-box">
                <Slider
                  min={this.state.listFeeObject.min}
                  max={this.state.listFeeObject.max}
                  tooltip={false}
                  labels={this.state.listFeeObject.labels}
                  value={this.state.volume}                
                  onChange={this.handleOnChange}
                />
              </div>
            </div>
            }

            <div>
              <p className="labelText">{messages.wallet.action.transfer.label.from_wallet}</p>
              { walletSelected && <WalletSelected wallets={wallets} walletSelected={walletSelected} onSelect={wallet => { this.selectWallet(wallet); }}></WalletSelected> }
            </div>            

            <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>{messages.wallet.action.transfer.button.transfer}</Button>
          </div>


        </SendWalletForm>

        {walletNotFound}
      </div>
    )
  }
}

Transfer.propTypes = {
  wallet: PropTypes.any,
  currency: PropTypes.string,
  toAddress: PropTypes.string,
  fromAddress: PropTypes.string,
  coinName: PropTypes.string,
  amount: PropTypes.any,
  onFinish: PropTypes.func,
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
