import React from 'react';
import {injectIntl} from 'react-intl';
import {Field, formValueSelector, clearFields} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/models/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';
import { StringHelper } from '@/services/helper';

import './ReceiveCoin.scss';
import Dropdown from '@/components/core/controls/Dropdown';

import iconQRCodeBlack from '@/assets/images/icon/scan-qr-code.svg';

const QRCode = require('qrcode.react');

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

class ReceiveCoin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletDefault: false,
      walletSelected: false,
      inputSendAmountValue: '',
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
      let result = {"fromWallet": this.state.walletSelected, "amount": this.state.inputSendAmountValue}
      onFinish(result);
    } else {

    }
  }

  getWalletDefault = () =>{

    const { coinName, listWallet } = this.props;

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
    if (wallets.length > 0){
      wallets.forEach((wallet) => {
        wallet.value = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
        if (process.env.isLive){
          wallet.value = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
        }
        wallet.id = wallet.address + "-" + wallet.getNetworkName();

      });
    }

    // set name for walletDefault:
    MasterWallet.log(walletDefault, "walletDefault");
    if (walletDefault){
      walletDefault.value = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";
      if (process.env.isLive){
        walletDefault.value = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
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

  updateSendAmountValue = (evt) => {
    this.setState({
      inputSendAmountValue: evt.target.value,
    });
  }

onItemSelectedWallet = (item) =>{

  // I don't know why the item is not object class ?????
  let wallet = MasterWallet.convertObject(item);

  this.setState({walletSelected: wallet});

}


  render() {

    const {formAddress, toAddress, amount, coinName } = this.props;

    return (
      <div className="receive-coins">
        {/* Modal for Copy address : */}

          <div className="bodyTitle"><span>Share your public wallet address to receive { this.state.walletSelected ? this.state.walletSelected.name : ''} </span></div>
          <div className={['bodyBackup bodySahreAddress']}>

            <QRCode value={this.state.walletSelected ? this.state.walletSelected.address : ''} />
            <div className="addressDivPopup">{ this.state.walletSelected ? this.state.walletSelected.address : ''}</div>

            <Dropdown
                className="dropdown-receive"
                placeholder="Choose a wallet ..."
                defaultId={this.state.walletSelected.id}
                source={this.state.wallets}
                onItemSelected={(item) => {
                    this.setState({
                      walletSelected: item,
                    });
                  }
                }
              />

            <div className="link-request-custom-amount" onClick={() => { this.modalCustomAmountRef.open(); this.setState({ inputSendAmountValue: '' }); }}>Request Specific amount ➔</div>

            <Button className="button" cssType="primary" onClick={() => { Clipboard.copy(this.state.walletSelected.address); this.showToast('Wallet address copied to clipboard.'); this.onFinish() }} >
            Copy to share
            </Button>
          </div>


          {/* Modal for Custom amount : */}
          <Modal title="Custom Amount" onRef={modal => this.modalCustomAmountRef = modal}>
            <div className={['bodyBackup bodySahreAddress']}>

              <QRCode value={(this.state.walletSelected ? this.state.walletSelected.address : '') + (this.state.inputSendAmountValue != '' ? `,${this.state.inputSendAmountValue}` : '')} />
              <div className="addressDivPopup">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Address</InputGroupAddon>
                  <Input2
                    disabled
                    value={this.state.walletSelected ? this.state.walletSelected.address : ''}
                  />
                </InputGroup>

                <br />

                <InputGroup>
                  <InputGroupAddon addonType="prepend">Amount</InputGroupAddon>
                  <Input2
                  placeholder="Specify amount ..."
                  type="text"
                  value={this.state.inputSendAmountValue} onChange={evt => this.updateSendAmountValue(evt)}/>
                  <InputGroupAddon addonType="append">{ this.state.walletSelected ? StringHelper.format("{0}", this.state.walletSelected.name) : ""}</InputGroupAddon>
                </InputGroup>


              </div>
              <Button className="button" cssType="primary" onClick={() => { this.modalCustomAmountRef.close(); this.onFinish() }} >
              Done
              </Button>
            </div>
          </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReceiveCoin));
