import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import {fieldDropdown, fieldInput} from '@/components/core/form/customField';
import { ICON } from '@/styles/images';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {getFiatCurrency} from '@/reducers/exchange/action';
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import './TransferToken.scss';
import '../TransferCoin/TransferCoin.scss';
import BrowserDetect from '@/services/browser-detect';
import ListCoin from '@/components/Wallet/ListCoin';

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);
const gasValid = value => (value && isNaN(value) ? 'Invalid gas limit' : undefined);
const defaultGasLimit = 210000;
const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

class TransferToken extends React.Component {
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

      isAdvanced: false,
      inputSendAmountValue: this.props.amount,
      modalListCoin: '',
      gasLimit: this.props.gasLimit || defaultGasLimit,
      data: this.props.data || "",
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
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }

  async componentDidMount() {
    this.props.showLoading();
    let legacyMode = (BrowserDetect.isChrome && BrowserDetect.isIphone); // show choose file or take photo
    this.setState({legacyMode: legacyMode});

    if (this.props.amount){
      this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
    }

    if (this.props.toAddress){
      this.setState({inputAddressAmountValue: this.props.toAddress});
      this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
    }

    this.props.rfChange(nameFormSendWallet, 'gasLimit', this.props.gasLimit ? this.props.gasLimit : defaultGasLimit);

    if (this.props.data){
      this.props.rfChange(nameFormSendWallet, 'data', this.props.data);
    }

    await this.getWalletDefault();
    this.props.hideLoading();
    this.getBalanceWallets();
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
    }

    this.setState({wallets: listWalletCoin, walletDefault: walletDefault, walletSelected: walletDefault}, ()=>{
      this.props.rfChange(nameFormSendWallet, 'walletSelected', walletDefault);
    });
  }

  getBalanceWallets = async () => {
    let { wallets, walletSelected, walletDefault } = this.state;

    if(wallets){
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
    let amount = evt ? evt.target.value : null;
    if(!amount) amount = val;

    this.setState({inputSendAmountValue: amount,}, ()=>{
      this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
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

  updateGasLimitValue = (evt) => {
    let value = evt.target.value;
    this.setState({gasLimit: value});
    this.props.rfChange(nameFormSendWallet, 'gasLimit', value);
  }

  updateSendAddressValue = (evt) => {
    this.setState({inputAddressAmountValue: evt.target.value});
  }

  submitSendCoin=()=>{
    const {inputAddressAmountValue, inputSendAmountValue, walletSelected, data, gasLimit} = this.state;
    this.setState({isRestoreLoading: true});
    this.modalConfirmTranferRef.close();
    walletSelected.transfer(inputAddressAmountValue, inputSendAmountValue, data || "", gasLimit || defaultGasLimit).then(success => {

      this.setState({isRestoreLoading: false});
      if (success.hasOwnProperty('status')){
        if (success.status == 1){
          this.onFinish(success.data);
          MasterWallet.NotifyUserTransfer(walletSelected.address, inputAddressAmountValue);
        }
        else{
          this.showError(this.getMessage(success.message));
        }
      }
    });
  }

  onFinish = async (data) => {
    const { onFinish } = this.props;
    const { inputAddressAmountValue, inputSendAmountValue, walletSelected, gasLimit, data:inputData} = this.state;

    if (onFinish) {
      let result = {"to": inputAddressAmountValue,
        'fromWallet': walletSelected,
        "amount": inputSendAmountValue,
        inputData,
        gasLimit,
        'hash': data ? data.hash : ""
      }

      onFinish(result);
    }
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
      this.modalListCoinRef.close();
    });
  }

  switchAdvanced = () => {
    this.setState({isAdvanced: !this.state.isAdvanced});
  }

  get showWallet(){
    const walletSelected = this.state.walletSelected;
    let icon = '';
    try{
      if(walletSelected)
        icon = require("@/assets/images/icon/wallet/coins/" + walletSelected.name.toLowerCase() + '.svg');
    } catch (ex){console.log(ex)};

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
            <div className="arrow">{ICON.ArrowDown()}</div>
          </div>
        </div>
      </div>);
  }

  get showBasicData(){
    const { messages } = this.props.intl;
    const { inputSendAmountValue, inputAddressAmountValue, gasLimit, data, walletSelected, isAdvanced } = this.state;

    return !isAdvanced && (<div>
      <div className="basicWallet">
        <div className="line">
          <div className="label">{messages.wallet.action.transfer.label.to_address2}</div>
          <div className="toAddress">{inputAddressAmountValue}</div>
        </div>
        <div className="line">
          <div className="label">{messages.wallet.action.transfer.label.amount}</div>
          <div className="value">{inputSendAmountValue} {walletSelected && walletSelected.name}</div>
        </div>
        { this.props.gasLimit && (<div className="line">
            <div className="label">{messages.wallet.action.transfer.label.gas_limit}</div>
            <div className="value">{gasLimit}</div>
          </div>)
        }

        { this.props.data && (<div className="line">
            <div className="label">{messages.wallet.action.transfer.label.data}</div>
            <div className="data"><textarea rows="2" defaultValue={data} readOnly /></div>
          </div>)
        }
      </div>
      <p className="advanced mt-2">
        <a className="text-primary" onClick={()=> this.switchAdvanced()}>
          Advanced <span style={{marginTop: '-5px'}}>{ICON.ArrowDown("#007bff")}</span>
        </a>
      </p>
    </div>);
  }

  get showAdvancedData(){
    const { messages } = this.props.intl;
    const { inputSendAmountValue, gasLimit, data, walletSelected, isAdvanced } = this.state;

    return isAdvanced && (<div>
      <p className="labelText">{messages.wallet.action.transfer.label.to_address2}</p>
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
          name="amountCoin"
          placeholder={"0.0"}
          type="text"
          className="form-control"
          component={fieldInput}
          value={inputSendAmountValue}
          onChange={evt => this.updateAddressAmountValue(evt)}
          validate={[required, amountValid]}
          autoComplete="off"
        />
      </div>
      <p className="labelText">{messages.wallet.action.transfer.label.gas_limit}</p>
      <div className="div-amount">
        <Field
          name="gasLimit"
          type="text"
          className="form-control"
          component={fieldInput}
          value={gasLimit}
          onChange={evt => this.updateGasLimitValue(evt)}
          validate={[required, gasValid]}
          autoComplete="off"
        />
      </div>
      { this.props.data && (<div>
        <p className="labelText">{messages.wallet.action.transfer.label.data}</p>
        <div className="div-amount">
          <textarea
            className="form-control"
            rows={2}
            value={data}
            readOnly
          />
        </div>
        </div>)
      }
      <p className="advanced">
        <a className="text-primary" onClick={()=> this.switchAdvanced()}>
          <span style={{marginBottom: '-5px'}}>{ICON.ArrowUp("#007bff")}</span> Basic
        </a>
      </p>
    </div>);
  }

  render() {
    let { currency } = this.props;
    if(!currency) currency = "USD";
    const { messages } = this.props.intl;
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
        {this.showBasicData}
        {this.showAdvancedData}

          <div className ="dropdown-wallet-tranfer">
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

TransferToken.propTypes = {
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TransferToken));
