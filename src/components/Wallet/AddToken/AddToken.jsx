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
import {TokenERC20} from "@/models/TokenERC20";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import PropTypes from 'prop-types';

import './AddToken.scss';
import Dropdown from '@/components/core/controls/Dropdown';

import iconQRCodeWhite from '@/assets/images/icon/scan-qr-code.svg';

import bgBox from '@/assets/images/pages/wallet/bg-box-wallet-coin.svg';



const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormAddToken = 'addToken';
const AddNewTokenForm = createForm({ propsReduxForm: { form: nameFormAddToken, enableReinitialize: true, clearSubmitErrors: true}});

class AddToken extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],      
      walletSelected: false,
      inputContractAddressValue: '',
      inputTokenDecimalsValue: '',
      inputTokenNameValue: '',
      inputTokenSymbolValue: '',
      tokenTypeSelected: false,
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,
      tokenType: false
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
    this.resetForm();  
    this.getWalletDefault();
  }

  resetForm(){
    this.props.clearFields(nameFormAddToken, false, false, "contractAddress", "tokenName", "tokenSymbol", "tokenDecimals");
  }

  componentWillUnmount() {
    
  }
  componentWillReceiveProps() {
    if (!this.props.formAddTokenIsActive){
      console.log("reset form ....");
      this.props.clearFields(nameFormAddToken, false, false, "contractAddress", "tokenName", "tokenSymbol", "tokenDecimals");
    }
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

          if (!walletDefault &&  wallet.default){
              walletDefault = wallet;                          
          }
          listWalletETH.push(wallet);
        }              
      });
    }
    
    if (!walletDefault && listWalletETH.length > 0)
      walletDefault = listWalletETH[0];
    
    this.setState({wallets: listWalletETH, walletSelected: walletDefault});

  }

  loadTokenInfo = (contractAddress) =>{

    if (contractAddress == ''){
      return;
    }

    this.setState({isRestoreLoading: true});
        
    this.props.clearFields(nameFormAddToken, false, false, "contractAddress", "tokenName", "tokenSymbol", "tokenDecimals");
    
    let tokenTypeSelected = this.state.tokenTypeSelected;
    if (tokenTypeSelected == false){
      tokenTypeSelected = this.listTokenType()[0];        
    }    

    let tokenType = new tokenTypeSelected.class();
    tokenType.init(contractAddress, this.state.walletSelected).then(result =>{
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
      if (result !== true)
          errors.contractAddress = 'Please enter a valid contract address';      
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
    let tokenType = this.state.tokenType;
    
    tokenType.decimals = this.state.inputTokenDecimalsValue;
    tokenType.name = this.state.inputTokenSymbolValue;
    tokenType.title = this.state.inputTokenNameValue;

    
    this.setState({tokenType: tokenType});
    
    let result = MasterWallet.AddToken(tokenType);
    
    this.showSuccess("Successfully added custom token");
    
    this.onFinish();

    this.setState({isRestoreLoading: false});  
  }
  else{
    this.showError("Unable to add custom token");
  }
}

onItemSelectedWallet = (item) =>{
  
  // I don't know why the item is not object ?????
  let wallet = MasterWallet.convertObject(item);
  this.setState({walletSelected: wallet});
  this.loadTokenInfo(this.state.inputContractAddressValue);
  
}

onItemSelectedTokenType = (item) =>{  
  this.setState({tokenTypeSelected: item});
  this.loadTokenInfo(this.state.inputContractAddressValue);
}

// For Qrcode:
handleScan=(data) =>{
  const { rfChange } = this.props
  if(data){
    rfChange(nameFormAddToken, 'contractAddress', data);    
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
   return [{"id": "ERC20", "text": "ERC20", "class": TokenERC20}, ]
 }

  
  render() {
        const listTokenTypes = this.listTokenType();
    return ( 
      <div>                                 
          {/* QR code dialog */}
          {this.renderScanQRCode()}
          <AddNewTokenForm className="addtoken-wrapper" onSubmit={this.submitAddToken} validate={this.invalidateAddNewToken}>

          {/* Box: */}
          <div className="bgBox">
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
                  validate={[required]}
              />

                <div className ="dropdown-wallet-tranfer">

                  <p className="labelText">Choose a token type</p>
                  <Field
                        name="walletSelected"
                        component={fieldDropdown}                  
                        placeholder="Choose a token type"
                        defaultText={listTokenTypes[0].text}
                        list={listTokenTypes}
                        onChange={(item) => {
                            this.onItemSelectedTokenType(item);
                          }
                        }
                      />  

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
