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
import {CryptoKitties} from "@/services/Wallets/Collectibles/CryptoKitties";
import {CryptoPunks} from "@/services/Wallets/Collectibles/CryptoPunks";
import { Axie } from '@/services/Wallets/Collectibles/Axie';
import { BlockchainCuties } from '@/services/Wallets/Collectibles/BlockchainCuties';
import { ChibiFighters } from '@/services/Wallets/Collectibles/ChibiFighters';
import { CryptoClown } from '@/services/Wallets/Collectibles/CryptoClown';
import { CryptoCrystal } from '@/services/Wallets/Collectibles/CryptoCrystal';
import { Cryptogs } from '@/services/Wallets/Collectibles/Cryptogs';
import { CryptoHorse } from '@/services/Wallets/Collectibles/CryptoHorse';
import { CryptoSoccr } from '@/services/Wallets/Collectibles/CryptoSoccr';
import { CryptoZodiacs } from '@/services/Wallets/Collectibles/CryptoZodiacs';
import { CSCPreSaleFactory } from '@/services/Wallets/Collectibles/CSCPreSaleFactory';
import { DopeRaider } from '@/services/Wallets/Collectibles/DopeRaider';
import { Etherbots } from '@/services/Wallets/Collectibles/Etherbots';
import { EtheremonAsset } from '@/services/Wallets/Collectibles/EtheremonAsset';
import { EtherLambos } from '@/services/Wallets/Collectibles/EtherLambos';
import { ExoPlanets } from '@/services/Wallets/Collectibles/ExoPlanets';
import { Giftomon } from '@/services/Wallets/Collectibles/Giftomon';
import { HelloDog } from '@/services/Wallets/Collectibles/HelloDog';
import { OxcertKYC } from '@/services/Wallets/Collectibles/OxcertKYC';
import { PandaEarth } from '@/services/Wallets/Collectibles/PandaEarth';
import { PirateKittyToken } from '@/services/Wallets/Collectibles/PirateKittyToken';
import { UnicornGO } from '@/services/Wallets/Collectibles/UnicornGO';
import { WarToken } from '@/services/Wallets/Collectibles/WarToken';
import { bindActionCreators } from "redux";
import { showLoading, hideLoading, showAlert } from '@/reducers/app/action';
import { ICON } from '@/styles/images';
import PropTypes from 'prop-types';

import './AddCollectible.scss';
import Dropdown from '@/components/core/controls/Dropdown';
import { CryptoStrikers } from '@/services/Wallets/Collectibles/CryptoStrikers';

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);
const nameFormAddCollectible = 'addCollectible';
const AddNewCollectibleForm = createForm({ propsReduxForm: { form: nameFormAddCollectible, enableReinitialize: true, clearSubmitErrors: true}});

const listToken721 = [CryptoKitties, CryptoPunks, CryptoStrikers, Axie, BlockchainCuties,
  ChibiFighters, CryptoClown, CryptoCrystal, Cryptogs, CryptoHorse,
  CryptoSoccr, CryptoZodiacs, CSCPreSaleFactory, DopeRaider, Etherbots,
  EtheremonAsset, EtherLambos, ExoPlanets,
  Giftomon, HelloDog, OxcertKYC, PandaEarth, PirateKittyToken, UnicornGO, WarToken];

class AddCollectible extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletSelected: false,
      inputContractAddressValue: '',
      inputCollectibleDecimalsValue: 0,
      inputCollectibleNameValue: '',
      inputCollectibleSymbolValue: '',
      formAddCollectibleIsActive: false,

      walletsData: false,
      collectibleType: false,

      // Autosuggest
      listCollectibleType: [],
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
    this.resetForm();
    this.getWalletDefault();
    this.listCollectibleType();
  }

  resetForm(){
    this.props.clearFields(nameFormAddCollectible, false, false, "contractAddress", "collectibleName", "collectibleSymbol", "collectibleDecimals");
  }

  componentWillUnmount() {

  }
  componentDidUpdate (){

  }
  componentWillReceiveProps() {
    if (!this.props.formAddCollectibleIsActive && this.state.formAddCollectibleIsActive != this.props.formAddCollectibleIsActive){
      this.props.clearFields(nameFormAddCollectible, false, false, "contractAddress", "collectibleName", "collectibleSymbol", "collectibleDecimals");
      this.setState({formAddCollectibleIsActive: this.props.formAddCollectibleIsActive});
    }
    if (this.props.formAddCollectibleIsActive && this.state.formAddCollectibleIsActive != this.props.formAddCollectibleIsActive){
      this.getWalletDefault();
      this.setState({formAddCollectibleIsActive: this.props.formAddCollectibleIsActive});
    }
  }

  onFinish = () => {

    const { onFinish } = this.props;

    if (onFinish) {
      onFinish({"data": this.state.CollectibleType});
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
    this.props.rfChange(nameFormAddCollectible, 'walletSelected', walletDefault);

  }

  invalidateAddNewCollectible = (value) => {
    if (!this.state.walletSelected) return {};
    let errors = {};
    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['contractAddress']);
      if (result !== true){
          errors.contractAddress = 'Please enter a valid contract address';
          this.props.clearFields(nameFormAddCollectible, false, false, "collectibleName", "collectibleSymbol", "collectibleDecimals");
      }
    }
    return errors
  }

  updateCollectibleNameValue = (evt) => {
    this.setState({
      inputCollectibleNameValue: evt.target.value,
    });
  }

  updateCollectibleSymbolValue = (evt) => {
    this.setState({
      inputCollectibleSymbolValue: evt.target.value,
    });
  }
  updateCollectibleDecimalsValue = (evt) => {
    this.setState({
      inputCollectibleDecimalsValue: evt.target.value,
    });
  }

submitAddCollectible=()=>{

  if (this.state.collectibleType != false){
    this.setState({isRestoreLoading: true});
    let collectibleType  = this.state.collectibleType;

    collectibleType.decimals = this.state.inputCollectibleDecimalsValue;
    collectibleType.name = this.state.inputCollectibleSymbolValue;
    collectibleType.title = this.state.inputCollectibleNameValue;

    // create from walet sellected:
    collectibleType.createFromWallet(this.state.walletSelected);

    this.setState({collectibleType: collectibleType});

    let result = MasterWallet.AddToken(collectibleType);

    this.showSuccess("Successfully added collectible");

    this.onFinish();

    this.setState({isRestoreLoading: false, collectibleType: false});
  }
  else{
    this.showError("Unable to add collectible");
  }
}

onItemSelectedWallet = (item) =>{

  // I don't know why the item is not object ?????
  let wallet = MasterWallet.convertObject(item);
  this.setState({walletSelected: wallet}, () => {});
}

onItemSelectedCollectibleType = (item) =>{

  let collectibleType = item.object;

  this.setState({
    inputCollectibleNameValue: collectibleType.title,
    inputCollectibleSymbolValue: collectibleType.name,
    inputCollectibleDecimalsValue: collectibleType.decimals,
    inputContractAddressValue: collectibleType.contractAddress,
    collectibleType: collectibleType,
  });
  const { rfChange } = this.props
  rfChange(nameFormAddCollectible, 'collectibleName', collectibleType.title);
  rfChange(nameFormAddCollectible, 'collectibleSymbol', collectibleType.name);
  rfChange(nameFormAddCollectible, 'collectibleDecimals', collectibleType.decimals);
  rfChange(nameFormAddCollectible, 'contractAddress', collectibleType.contractAddress);

}

 listCollectibleType(){

   let objectCollectibleList = this.state.listCollectibleType;
   if (objectCollectibleList.length == 0){
    let listCollectibleType = [];
    listToken721.forEach(tokenERC720 => {
      let token = new tokenERC720();
      let item = {"id": token.contractAddress, "value": `${token.title} (${token.name})`, "object": token}
      listCollectibleType.push(item);
    });
    this.setState({listCollectibleType: listCollectibleType});
   }
 }

  render() {

    return (
      <div>
          <AddNewCollectibleForm className="addtoken-wrapper" onSubmit={this.submitAddCollectible}>

          {/* Box: */}
          <div className="bgBox">
          {/* <p className="labelText">Select Existing Contract</p> */}
          <Dropdown
                  placeholder="Select a collectible"
                  defaultId={this.state.collectibleType != false ? this.state.listCollectibleType[0].id : '' }
                  source={this.state.listCollectibleType}
                  onItemSelected={this.onItemSelectedCollectibleType}
                  hasSearch
                />

            <p className="labelText">Contract address</p>
            <div className="div-address-qr-code">
              <Field
                    readOnly
                    name="contractAddress"
                    type="text"
                    className="form-control input-address-qr-code"
                    placeholder=""
                    component={fieldInput}
                    value={this.state.inputContractAddressValue}
                    onChange={evt => this.updateAddressValue(evt)}
                    validate={[required]}
                  />
            </div>

            <p className="labelText">Name</p>
            <Field
                  name="collectibleName"
                  type="text" className="form-control"
                  component={fieldInput}
                  value={this.state.inputCollectibleNameValue}
                  onChange={evt => this.updateCollectibleNameValue(evt)}
                  validate={[required]}
              />

              <p className="labelText">Symbol</p>
              <Field
                  name="collectibleSymbol"
                  type="text"className="form-control"
                  component={fieldInput}
                  value={this.state.inputCollectibleSymbolValue}
                  onChange={evt => this.updateCollectibleSymbolValue(evt)}
                  validate={[required]}
              />

              <p className="labelText">Decimals</p>
              <Field
                  name="collectibleDecimals"
                  type="text"className="form-control"
                  component={fieldInput}
                  value={this.state.inputCollectibleDecimalsValue}
                  onChange={evt => this.updateCollectibleDecimalsValue(evt)}
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
          </AddNewCollectibleForm>
        </div>
    )
  }
}

AddCollectible.propTypes = {
  formAddCollectibleIsActive: PropTypes.bool,
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddCollectible));
