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
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import {TokenERC20} from "@/services/Wallets/Tokens/TokenERC20";
import { bindActionCreators } from "redux";
import { showLoading, hideLoading, showAlert } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { ICON } from '@/styles/images';
import PropTypes from 'prop-types';
import './AddToken.scss';
import Dropdown from '@/components/core/controls/Dropdown';
import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';

const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const nameFormAddToken = 'addToken';
const AddNewTokenForm = createForm({ propsReduxForm: { form: nameFormAddToken, enableReinitialize: true, clearSubmitErrors: true}});

// suggesion:
import listToken from '@/data/ethToken.json';

class AddToken extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletSelected: false,
      inputContractAddressValue: '',
      inputTokenDecimalsValue: 0,
      inputTokenNameValue: '',
      inputTokenSymbolValue: '',
      formAddTokenIsActive: false,
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,
      tokenType: false,

      // Autosuggest
      listToken: [],
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
    this.showAlert(mst, 'success', 4000, ICON.SuccessChecked() );
  }

  componentDidMount() {
    // clear form:
    this.resetForm();
    this.getWalletDefault();
    this.listTokenType();
  }

  resetForm(){
    this.props.clearFields(nameFormAddToken, false, false, "contractAddress", "tokenName", "tokenSymbol", "tokenDecimals");
  }

  componentWillReceiveProps() {
    if (!this.props.formAddTokenIsActive && this.state.formAddTokenIsActive != this.props.formAddTokenIsActive){
      this.props.clearFields(nameFormAddToken, false, false, "contractAddress", "tokenName", "tokenSymbol", "tokenDecimals");
      this.setState({formAddTokenIsActive: this.props.formAddTokenIsActive});
    }
    if (this.props.formAddTokenIsActive && this.state.formAddTokenIsActive != this.props.formAddTokenIsActive){
      this.getWalletDefault();
      this.setState({formAddTokenIsActive: this.props.formAddTokenIsActive});
    }
  }

  onFinish = () => {
    const { onFinish } = this.props;

    if (onFinish) {
      onFinish({"data": this.state.tokenType});
    } else {
    }
  }

  getWalletDefault = () =>{
    let coinDefault = 'ETH';

    let wallets = MasterWallet.getMasterWallet();

    let listWalletETH = [];
    let walletDefault = false;

    // set name + text for list:
    if (wallets.length > 0){
      wallets.forEach((wallet) => {
        if (!wallet.isToken && wallet.name === coinDefault){
          wallet.text = wallet.getShortAddress() + " (" + wallet.name + "-" + wallet.getNetworkName() + ")";
          if (process.env.isLive){
            wallet.text = wallet.getShortAddress() + " (" + wallet.className + " " + wallet.name + ")";
          }
          wallet.id = wallet.address + "-" + wallet.getNetworkName()+ wallet.name;

          if (walletDefault === false &&  wallet.default){
              walletDefault = wallet;
          }
          listWalletETH.push(wallet);
        }
      });
    }

    if (walletDefault === false && listWalletETH.length > 0)
      walletDefault = listWalletETH[0];

    this.setState({wallets: listWalletETH, walletSelected: walletDefault});
    this.props.rfChange(nameFormAddToken, 'walletSelected', walletDefault);

  }

  loadTokenInfo = (contractAddress) =>{

    if (this.state.walletSelected && this.state.walletSelected.checkAddressValid(contractAddress) !== true){
      return false;
    }

    this.setState({isRestoreLoading: true});

    this.props.clearFields(nameFormAddToken, false, false, "tokenName", "tokenSymbol", "tokenDecimals");

    let tokenType = new TokenERC20();
    tokenType.createFromWallet(this.state.walletSelected);
    tokenType.getContractInfo(contractAddress).then(result =>{
      if (result){
        this.setState({
          inputTokenNameValue: tokenType.title,
          inputTokenSymbolValue: tokenType.name,
          inputTokenDecimalsValue: tokenType.decimals,
        });
        const { rfChange } = this.props
        rfChange(nameFormAddToken, 'tokenName', tokenType.title);
        rfChange(nameFormAddToken, 'tokenSymbol', tokenType.name);
        rfChange(nameFormAddToken, 'tokenDecimals', tokenType.decimals);
        this.setState({isRestoreLoading: false, tokenType: tokenType});
      }
      else this.setState({isRestoreLoading: false, tokenType: false});
    });
  }

  invalidateAddNewToken = (value) => {
    if (!this.state.walletSelected) return {};
    let errors = {};
    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['contractAddress']);
      if (result !== true){
          errors.contractAddress = 'Please enter a valid contract address';
          this.props.clearFields(nameFormAddToken, false, false, "tokenName", "tokenSymbol", "tokenDecimals");
      }
    }
    return errors
  }

  updateTokenNameValue = (evt) => {
    this.setState({
      inputTokenNameValue: evt.target.value,
    });
  }

  updateAddressValue = (evt) => {
    let contractAddress = evt.target.value;
    this.setState({
      inputContractAddressValue: contractAddress,
    });
    this.loadTokenInfo(contractAddress);
  }

  updateTokenSymbolValue = (evt) => {
    this.setState({
      inputTokenSymbolValue: evt.target.value,
    });
  }
  updateTokenDecimalsValue = (evt) => {
    this.setState({
      inputTokenDecimalsValue: evt.target.value,
    });
  }

submitAddToken=()=>{
  // todo handle submit form ....

  if (this.state.tokenType != false){
    this.setState({isRestoreLoading: true});
    let tokenType  = this.state.tokenType;

    tokenType.decimals = this.state.inputTokenDecimalsValue;
    tokenType.name = this.state.inputTokenSymbolValue;
    tokenType.title = this.state.inputTokenNameValue;

    this.setState({tokenType: tokenType});

    let result = MasterWallet.AddToken(tokenType);

    this.showSuccess("Successfully added custom token");

    this.onFinish();

    this.setState({isRestoreLoading: false, tokenType: false});
  }
  else{
    this.showError("Unable to add custom token");
  }
}

onItemSelectedWallet = (item) =>{

  // I don't know why the item is not object ?????
  let wallet = MasterWallet.convertObject(item);
  this.setState({walletSelected: wallet}, () => {
      this.loadTokenInfo(this.state.inputContractAddressValue);
  });
}

onItemSelectedTokenType = (item) =>{

  // to check token type first:
  let tokenType = new TokenERC20();
  tokenType.createFromWallet(this.state.walletSelected);
  tokenType.contractAddress = item.address;
  tokenType.name = item.symbol;
  tokenType.title = item.name;
  tokenType.decimals = item.decimal;

  this.setState({
    inputTokenNameValue: item.name,
    inputTokenSymbolValue: item.symbol,
    inputTokenDecimalsValue: item.decimal,
    inputContractAddressValue: item.address,
    tokenType: tokenType,
  });
  const { rfChange } = this.props
  rfChange(nameFormAddToken, 'tokenName', item.name);
  rfChange(nameFormAddToken, 'tokenSymbol', item.symbol);
  rfChange(nameFormAddToken, 'tokenDecimals', item.decimal);
  rfChange(nameFormAddToken, 'contractAddress', item.address);

}

// For Qrcode:
handleScan=(data) =>{
  const { rfChange } = this.props
  if(data){
    rfChange(nameFormAddToken, 'contractAddress', data);
    this.loadTokenInfo(data);
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

 listTokenType(){

   let objectTokenList = this.state.listToken;
   if (objectTokenList.length == 0){
    objectTokenList = [];
    // objectTokenList.push({"id": "Empty", "value": "Select a contract...", "address": "", "name": "", "symbol": "", "decimals": "0"});
    listToken.forEach(token => {
      let tokenTmp = token;
      tokenTmp.id = token.address;
      tokenTmp.value = token.name + ` (${token.symbol})`;
      objectTokenList.push(tokenTmp);
      this.setState({listToken: objectTokenList});
    });
   }
 }

  render() {

    return (
      <div>
          {/* QR code dialog */}
          {this.renderScanQRCode()}
          <AddNewTokenForm className="addtoken-wrapper" onSubmit={this.submitAddToken} validate={this.invalidateAddNewToken}>

          {/* Box: */}
          <div className="bgBox">
          {/* <p className="labelText">Select Existing Contract</p> */}
          <Dropdown
                  placeholder="Select Existing Token"
                  defaultId={this.state.tokenType != false ? this.state.listToken[0].id : '' }
                  source={this.state.listToken}
                  onItemSelected={this.onItemSelectedTokenType}
                  hasSearch
                />

            <p className="labelText">Contract address</p>
            <div className="div-address-qr-code">
              <Field
                    name="contractAddress"
                    type="text"
                    className="form-control input-address-qr-code"
                    placeholder=""
                    component={fieldInput}
                    value={this.state.inputContractAddressValue}
                    onChange={evt => this.updateAddressValue(evt)}
                    validate={[required]}
                  />
              {!isIOs ? <img onClick={() => { this.openQrcode() }} className="icon-qr-code-black" src={iconQRCodeWhite} /> : ""}
            </div>

            <p className="labelText">Name</p>
            <Field
                  name="tokenName"
                  type="text" className="form-control"
                  component={fieldInput}
                  value={this.state.inputTokenNameValue}
                  onChange={evt => this.updateTokenNameValue(evt)}
                  validate={[required]}
              />

              <p className="labelText">Symbol</p>
              <Field
                  name="tokenSymbol"
                  type="text"className="form-control"
                  component={fieldInput}
                  value={this.state.inputTokenSymbolValue}
                  onChange={evt => this.updateTokenSymbolValue(evt)}
                  validate={[required]}
              />

              <p className="labelText">Decimals</p>
              <Field
                  name="tokenDecimals"
                  type="text"className="form-control"
                  component={fieldInput}
                  value={this.state.inputTokenDecimalsValue}
                  onChange={evt => this.updateTokenDecimalsValue(evt)}
                  // validate={[required]}
              />

                <div className ="dropdown-wallet-tranfer">
                  <p className="labelText">For wallet</p>
                  <Field
                      name="walletSelected"
                      component={fieldDropdown}
                      placeholder="Select a wallet"
                      defaultText={this.state.walletSelected ? this.state.walletSelected.text : ''}
                      list={this.state.wallets}
                      onChange={(item) => {
                          this.onItemSelectedWallet(item);
                        }
                      }
                    />
                </div>

                <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>Add Token</Button>
              </div>
          </AddNewTokenForm>
        </div>
    )
  }
}

AddToken.propTypes = {
  formAddTokenIsActive: PropTypes.bool,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddToken));
