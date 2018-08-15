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
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import {getCryptoPrice} from '@/reducers/exchange/action';
import CryptoPrice from "@/models/CryptoPrice";
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import './TransferCoin.scss';
import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';
import { BigNumber } from "bignumber.js";

const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

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
      active: this.props.active,
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,      
      rates: [],
      inputSendAmountValue: 0,
      inputSendMoneyValue: 0,      
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
    const {active} = this.props;
    if(!active && this.state.active){
      this.setState({active: active, inputSendAmountValue: 0, inputSendMoneyValue: 0});
      this.resetForm();
    }
  }

  componentDidMount() {
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");
    if (this.props.amount){
      this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
    }

    if (this.props.toAddress){
      this.setState({inputAddressAmountValue: this.props.toAddress});
      this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
    }

    this.getWalletDefault();
    // if(!this.state.walletSelected.isToken)
    {
      this.getRate("BTC");
      this.getRate("ETH");
      this.getRate("BCH");
    }
  }

  componentDidUpdate() {
    
    if (this.props.active && this.props.active != this.state.active){      
      
      this.setState({active: this.props.active});
      
      this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");
      if (this.props.amount){
        this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
      }

      if (this.props.toAddress){
        this.setState({inputAddressAmountValue: this.props.toAddress});
        this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
      }

      this.getWalletDefault();
      
    }
    else if (this.props.active != this.state.active){
      this.setState({active: this.props.active});
    }
  }

  resetForm(){
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }


  onFinish = () => {

    const { onFinish } = this.props;


    if (onFinish) {
      let result = {"toAddress": this.state.inputAddressAmountValue, "fromWallet": this.state.walletSelected, "amountCoin": this.state.inputSendAmountValue}
      onFinish(result);
    } else {

    }
  }

  getRate = (currency) => {
    var data = {amount: 1, currency: currency};
    let rates = this.state.rates;
    this.props.getCryptoPrice({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: (res) => {
        const cryptoPrice = CryptoPrice.cryptoPrice(res.data);
        const price = new BigNumber(cryptoPrice.fiatAmount).toNumber();

        rates.push({[currency]: price});
        this.setState({rates: rates});             
      },
      errorFn: (err) => {
        console.error("Error", err);
      },
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
      wallets.forEach((wal) => {
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }
          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;
          listWalletCoin.push(wal);
        }
        
      });
    }

    if (!walletDefault){
      if (listWalletCoin.length > 0){
        walletDefault = listWalletCoin[0];
      }
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
        walletDefault.balance = result;
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
    
    
    let rates = this.state.rates.filter(rate => rate.hasOwnProperty(this.state.walletSelected.name));

    if (rates.length > 0){
      rate = rates[0][this.state.walletSelected.name];
      if(!isNaN(amount)){
        money = amount * rate;              
      }      
    }    
    this.setState({
      inputSendAmountValue: amount,
      inputSendMoneyValue: money.toFixed(0)
    }, () => {
      this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
      this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
    })    
  }

  getMessage(str){
    const { messages } = this.props.intl;
    let result = str;
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
    let rates = this.state.rates.filter(rate => rate.hasOwnProperty(this.state.walletSelected.name));

    if (rates.length > 0){
      rate = rates[0][this.state.walletSelected.name]
      if(!isNaN(money)){
        amount = money/rate;
        this.setState({
          inputSendAmountValue: amount,
          inputSendMoneyValue: money
        });

        this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
        this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
      }
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
            this.onFinish();
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

onItemSelectedWallet = (item) =>{

  let wallet = MasterWallet.convertObject(item);
  this.setState({walletSelected: wallet});

  wallet.getBalance().then(result => {
    wallet.balance = result;
    this.setState({walletSelected: wallet});
    MasterWallet.UpdateBalanceItem(wallet);
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
  this.setState({ qrCodeOpen: true });
  this.modalScanQrCodeRef.open();
}

  render() {    
    const { messages } = this.props.intl;  
    let showDivAmount = (( this.state.walletSelected && ( !this.state.walletSelected.isToken && this.state.rates.filter(rate => rate.hasOwnProperty(this.state.walletSelected.name).length > 0) ) ) ) ? true : false;
    
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
            {this.state.qrCodeOpen ?
              <QrReader
                delay={this.state.delay}
                onScan={(data) => { this.handleScan(data); }}
                onError={this.handleError}
                style={{ width: '100%', height: '100%' }}
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
              {!isIOs ? <img onClick={() => { this.openQrcode() }} className="icon-qr-code-black" src={iconQRCodeWhite} /> : ""}
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
                  <div className="prepend">{messages.wallet.action.transfer.label.usd}</div>
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
            
              <div className ="dropdown-wallet-tranfer">
                <p className="labelText">{messages.wallet.action.transfer.label.from_wallet}</p>
                <Field
                  name="walletSelected"
                  component={fieldDropdown}
                  placeholder={messages.wallet.action.transfer.placeholder.select_wallet}
                  defaultText={this.state.walletSelected ? this.state.walletSelected.text : ""}
                  list={this.state.wallets}
                  onChange={(item) => {
                      this.onItemSelectedWallet(item);
                    }
                  }
                />
              </div>              

              <label className='label-balance'>{messages.wallet.action.transfer.label.wallet_balance} { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>
              </div>

            <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>{messages.wallet.action.transfer.button.transfer}</Button>
          </SendWalletForm>
        </div>
    )
  }
}

Transfer.propTypes = {
  wallet: PropTypes.any,
  active: PropTypes.bool,
};


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Transfer));
