import React from 'react';
import {injectIntl} from 'react-intl';
import {Field, formValueSelector, clearFields} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import { change } from 'redux-form'
import {fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField'
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/models/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';

import './TransferCoin.scss';
import Dropdown from '@/components/core/controls/Dropdown';

import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';

import bgBox from '@/assets/images/pages/wallet/bg-box-wallet-coin.svg';



const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

class Transfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletDefault: false,
      walletSelected: false,
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,
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
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {    
    // clear form:
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "from_address", "amount");
    if (this.props.amount){
      this.setState({inputSendAmountValue: this.props.amount});
      this.props.rfChange(nameFormSendWallet, 'amount', this.props.amount);
    }
      
    if (this.props.toAddress)
      {
        this.setState({inputAddressAmountValue: this.props.toAddress});
        this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
      }
    
      this.getWalletDefault();
  }

  resetForm(){
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "from_address", "amount");
  }

  componentWillUnmount() {
    
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
      let result = {"toAddress": this.state.inputAddressAmountValue, "fromWallet": this.state.walletSelected, "amount": this.state.inputSendAmountValue}
      onFinish(result);
    } else {
      
    }
  }

  getWalletDefault = () =>{
    const { coinName, listWallet } = this.props;

    MasterWallet.log(coinName, "coinName");

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
    // set name + text for list:
    if (wallets.length > 0){
      wallets.forEach((wallet) => {
        wallet.text = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
        if (process.env.isLive){
          wallet.text = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
        }
        wallet.id = wallet.address + "-" + wallet.getNetworkName();        
        
      });
    }

    // set name for walletDefault:
    MasterWallet.log(walletDefault, "walletDefault");
    if (walletDefault){      
      walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";         
      if (process.env.isLive){
        walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
      }
      walletDefault.id = walletDefault.address + "-" + walletDefault.getNetworkName();   

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = result;
        this.setState({walletSelected: walletDefault});
        MasterWallet.UpdateBalanceItem(walletDefault);
      });

    }    

    this.setState({wallets: wallets, walletDefault: walletDefault, walletSelected: walletDefault});

  }

  sendCoin = () => {    
      this.modalConfirmTranferRef.open();    
  }

  invalidateTransferCoins = (value) => {    
    if (!this.state.walletSelected) return {};
    let errors = {};
    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['to_address']);
      if (result !== true)
          errors.to_address = result;
      // check amount:
      if (parseFloat(this.state.walletSelected.balance) <= parseFloat(value['amount']))
        errors.amount = `Insufficient balance: ${this.state.walletSelected.balance} ${this.state.walletSelected.name}`
    }
    return errors
  }

  updateSendAmountValue = (evt) => {
    this.setState({
      inputSendAmountValue: evt.target.value,
    });
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
            this.showSuccess(success.message);
            this.onFinish();
            // start cron get balance auto ...
            // todo hanlde it ...
          }
          else{
            this.showError(success.message);
          }
        }
    });
}

onItemSelectedWallet = (item) =>{
  
  // I don't know why the item is not object class ?????
  let wallet = MasterWallet.convertObject(item);

  this.setState({walletSelected: wallet});

  // this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amount");

  // this.props.rfChange(nameFormSendWallet, 'amount', this.state.inputSendAmountValue);
  // this.props.rfChange(nameFormSendWallet, 'to_address', this.state.inputAddressAmountValue);
  
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
      rfChange(nameFormSendWallet, 'amount', value[1]);
    }
    this.modalScanQrCodeRef.close();
  }
}
handleError(err) {
  console.log('error wc', err);
}

oncloseQrCode=() => {
  this.setState({ qrCodeOpen: false });
}

openQrcode = () => {
  this.setState({ qrCodeOpen: true });
  this.modalScanQrCodeRef.open();
}

renderScanQRCode = () => (
  <Modal onClose={() => this.oncloseQrCode()} title="Scan QR code" onRef={modal => this.modalScanQrCodeRef = modal}>
    {this.state.qrCodeOpen ?
      <QrReader
        delay={this.state.delay}
        onScan={(data) => { this.handleScan(data); }}
        onError={this.handleError}
        style={{ width: '100%', height: '100%' }}
      />
      : ''}
  </Modal>
)

  
  render() {

    const {formAddress, toAddress, amount, coinName } = this.props;  
    
    return ( 
      <div>                       
          {/* Dialog confirm transfer coin */}
          <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmTranferRef = modal}>
          <div className="bodyConfirm"><span>Are you sure you want to transfer out {this.state.inputSendAmountValue} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
          <div className="bodyConfirm">
              <Button className="left" cssType="danger" onClick={this.submitSendCoin} >Confirm</Button>
              <Button className="right" cssType="secondary" onClick={() => { this.modalConfirmTranferRef.close(); }}>Cancel</Button>
          </div>
          </ModalDialog>

          {/* QR code dialog */}
          {this.renderScanQRCode()}
          <SendWalletForm className="sendwallet-wrapper" onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

          {/* Box: */}
          <div className="bgBox">
            <p className="labelText">To wallet address</p>
            <div className="div-address-qr-code">

              <Field
                    name="to_address"
                    type="text"
                    className="form-control input-address-qr-code"
                    placeholder="Wallet address..."
                    component={fieldInput}
                    value={this.state.inputAddressAmountValue}
                    onChange={evt => this.updateSendAddressValue(evt)}
                    validate={[required]}
                  />          
              {!isIOs ? <img onClick={() => { this.openQrcode() }} className="icon-qr-code-black" src={iconQRCodeWhite} /> : ""}
            </div>
            <p className="labelText">Amount</p>          
            <div className="div-amount">
              <Field
                    name="amount"
                    type={isIOs ? "number" : "tel"}
                    className="form-control"
                    component={fieldInput}
                    value={this.state.inputSendAmountValue}
                    onChange={evt => this.updateSendAmountValue(evt)}
                    placeholder={"0.0"}
                    validate={[required, amountValid]}
                    // validate={[required, amountValid, balanceValid(this.state.walletSelected ? this.state.walletSelected.balance : "", this.state.walletSelected ? this.state.walletSelected.name : "")]}
                  />
                  <span className="coiname-append">{ this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : ''}</span>
              </div>


            { this.state.walletDefault ? 
              <div className ="dropdown-wallet-tranfer">
                <p className="labelText">From wallet</p>            
                <Field
                  name="walletSelected"
                  component={fieldDropdown}
                  // className="dropdown-wallet-tranfer"
                  placeholder="Sellect a wallet"
                  defaultText={this.state.walletDefault.text}
                  list={this.state.wallets}
                  onChange={(item) => {
                      this.onItemSelectedWallet(item);
                    }
                    }
                  />                  

                  <label className='label-balance'>Wallet balance: { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>
              </div>
              :""}

              </div>

            <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>Transfer</Button>
          </SendWalletForm>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({  
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Transfer));
