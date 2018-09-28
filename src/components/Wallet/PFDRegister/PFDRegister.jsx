import axios from 'axios';
import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import PropTypes from 'prop-types';
import local from '@/services/localStore';
import { APP } from '@/constants';

import { setLanguage } from '@/reducers/app/action';
import Button from '@/components/core/controls/Button';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';

import Switch from '@/components/core/controls/Switch';
import Input from '../Input';
import { newPasscode, requestWalletPasscode, updatePasscode } from '@/reducers/app/action';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import ListCoin from '@/components/Wallet/ListCoin';
import valid from '@/services/validate';

import ConfirmPopup from '@/components/ConfirmPopup';
import './PFDRegister.scss';
import '../WalletPreferences/WalletPreferences.scss';
import iconRemove from '@/assets/images/icon/comment/delete-icon.svg';

const supportWallets = ['BTC', 'ETH', 'BCH', 'XRP', 'EOS'];

class PFDRegister extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
      alternateCurrency: '',
      switchContent: '',
      listCurrenciesContent: '',

      inputEmail: '',
      modalEmail: '',
      modalShopID: '',
      modalConfirmURL: '',
      modalListCoin: '',
      shop: false
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
  showSuccess(mst) {
    this.showAlert(mst, 'success', 2000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount(){
    this.loadShopData();
  }

  loadShopData = () => {
    let shop = {email: 'khoa.trinh@autonomous.nyc', shop_id: 'khoatrinh', confirm_url: 'http://www.autonomous.ai/confirm',
      wallets: [
        {name: 'ETH', address: ''},
        {name: 'BTC', address: ''},
        {name: 'XRP', address:''}]};

    let wallets = [];
    supportWallets.map(e => {
      let arr = shop.wallets.filter(w => {
        return w.name == e;
      });

      if(arr && arr.length){
        wallets.push(arr[0]);
      }
      else{
        wallets.push({name: e, address: ''});
      }
    });

    shop.wallets = wallets;
    this.setState({shop});
  }

  selectWallet=(w)=>{
    // this.setState({modalListCoin: <ConfirmPopup
    //   title={"hehe"}
    //   content={"haha"}
    //   cancelButtonTitle="Cancel"
    //   okButtonTitle="Dispute"
    //   cancelButtonClick={() => {

    //   }}
    //   okButtonClick= {() => {

    //   }}
    //   />});

    this.setState({modalListCoin:
      <ListCoin
        addressSelected={w.address}
        crypto={w.name}
        onSelect={wallet => { this.selectedWallet(wallet); }}
      />
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }

  selectedWallet=(w)=>{console.log('selectedWallet');
    let { wallets } = this.state.shop;
    if(wallets){
      console.log('deleteWallet', wallets);
      wallets.some((wallet) => {
        if (wallet.name == w.name){
          wallet.address = w.address;
          return true;
        }
      });

      //post API
      //...

      this.setState({ wallets, modalListCoin: ''}, ()=> {
        this.modalListCoinRef.close();
      });
    }
  }

  deleteWallet=(w)=>{
    let { wallets } = this.state.shop;

    if(wallets){
      console.log('deleteWallet', wallets);
      wallets.some((wallet) => {
        if (wallet.name == w.name && wallet.address == w.address){
          wallet.address = "";
          return true;
        }
      });

      // for(let i in wallets){
      //   console.log(wallets[i]);
      //   if(w.address == wallets[i].address && w.name == wallets[i].name){
      //     wallets[i] = {name: w.name, address: ''};
      //     break;
      //   }
      // }
      console.log('deleteWallet2', wallets);
      this.setState({wallets});
    }
  }

  openFormEmail=()=>{

    this.setState({modalEmail: (
        <div className="update-name">
          <label>Shop email to receive customer payment, new updates...</label>
          <Input required placeholder="Shop email" maxLength="40" value={this.state.shop.email} onChange={(value) => {this.changeEmail(value)}} />
          <Button type="button" onClick={()=> {this.updateEmail();}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalEmailRef.open();
    });
  }

  openFormShopID=()=>{

    this.setState({modalShopID: (
        <div className="update-name">
          <label>Shop ID</label>
          <Input required placeholder="Shop ID" maxLength="40" value={this.state.shop.shop_id} onChange={(value) => {this.changeShopID(value)}} />
          <Button type="button" onClick={()=> {this.updateShopID();}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalShopIDRef.open();
    });
  }

  openFormConfirmURL=()=>{

    this.setState({modalConfirmURL: (
        <div className="update-name">
          <label>Confirm URL</label>
          <Input required placeholder="" maxLength="40" value={this.state.shop.confirm_url} onChange={(value) => {this.changeConfirmURL(value)}} />
          <button type="button" onClick={()=> {this.updateConfirmURL();}} block={true} className="button-wallet-cpn">Save</button>
        </div>
      )
    }, ()=>{
      this.modalConfirmURLRef.open();
    });
  }

  updateConfirmURL = () => {
    const { messages } = this.props.intl;
    let {inputShopID, shop} = this.state;

    if (!shop){
      return;
    }

    shop.shop_id = inputShopID;
    this.setState({shop}, ()=>{
      this.modalShopIDRef.close();
    });
  }

  changeEmail=(value) => {
    this.setState({inputEmail: value});
  }

  updateEmail = () => {
    const { messages } = this.props.intl;
    let {inputEmail, shop} = this.state;

    if (!shop){
      return;
    }

    if (valid.email(inputEmail)) {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.client.email}</div>,
        timeOut: 3000,
        type: 'danger',
      });
      return;
    }

    shop.shop_id = inputEmail;
    this.setState({shop}, ()=>{
      this.modalEmailRef.close();
    });
  }

  changeShopID=(value) => {
    this.setState({inputShopID: value});
  }

  updateShopID = () => {
    let {inputShopID, shop} = this.state;

    if (!shop){
      return;
    }

    shop.shop_id = inputShopID;
    this.setState({shop}, ()=>{
      this.modalShopIDRef.close();
    });
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  get listCryptoCurrency() {
    const { messages } = this.props.intl;
    const { wallets } = this.state.shop;

    if(wallets){
      return (<div className="cryptoCurrency">
      <div className="item header">
        <label>{messages.wallet.action.payment.label.crypto_currency}</label>
      </div>

      { wallets.map(wallet => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + wallet.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

        let w;
        if(wallet.name == 'ETH')
          w = new Ethereum();
        else
          w = new Bitcoin();

        w.address = wallet.address;

          return <div key={wallet.name + wallet.address} className="item">
            <img className="icon" src={icon} onClick={() => this.selectWallet(wallet)} />
            <div className="name" onClick={() => this.selectWallet(wallet)}>
                <label>{w.address ? w.getShortAddress() : "<unset>"}</label>
            </div>
            {w.address && <div className="value" onClick={() => this.deleteWallet(wallet)}><img src={iconRemove} /></div>}
          </div>
        })}

      </div>
      );
    }
  }

  formatUrl = (url) => {
    let result = '';
    if(url){

      try{
        let i = url.indexOf('//'), str = '';
        result = url;
        if(i > 0){
          str = url.substr(i+2);
          i = str.indexOf('/');
          if(i > 0){
            str = str.substr(0, i);
          }

          if(str){
            result = url.replace(str, '***');
          }
        }
      }
      catch(e){
        result = url;
      }
    }

    return result;
  }

  render() {
    const { messages } = this.props.intl;
    const { settings, shop, modalEmail, modalShopID, modalConfirmURL, modalListCoin } = this.state;

    return (

        <div className="box-setting">

          <Modal title={messages.wallet.action.setting.label.select_alternative_currency} onRef={modal => this.modalSelectCurrencyRef = modal}>
            <div className="list-currency">
              {this.state.listCurrenciesContent}
            </div>
          </Modal>


          <Modal onClose={()=>{this.setState({modalEmail: ""})}} title="Email" onRef={modal => this.modalEmailRef = modal}>
            {modalEmail}
          </Modal>

          <Modal onClose={()=>{this.setState({modalShopID: ""})}} title="Shop ID" onRef={modal => this.modalShopIDRef = modal}>
            {modalShopID}
          </Modal>

          <Modal onClose={()=>{this.setState({modalConfirmURL: ""})}} title="Shop ID" onRef={modal => this.modalConfirmURLRef = modal}>
            {modalConfirmURL}
          </Modal>

          <div className="wallets-wrapper">
            <Modal title="Select wallets" onClose={()=>{this.setState({modalListCoin: ""})}}  onRef={modal => this.modalListCoinRef = modal}>
              {modalListCoin}
            </Modal>
          </div>

          <div className="item1" onClick={()=> {this.openFormEmail();}}>
            <div className="name">{messages.wallet.action.payment.label.email}</div>
            <div className="value">
            <span className="text">{shop && shop.email}</span>
            </div>
          </div>

          <div className="item1" onClick={()=> {this.openFormShopID();}}>
            <div className="name">{messages.wallet.action.payment.label.shop_id}</div>
            <div className="value">
              <span className="text">{shop && shop.shop_id}</span>
            </div>
          </div>

          <div className="item1" onClick={()=> {this.openFormConfirmURL();}}>
            <div className="name">{messages.wallet.action.payment.label.confirm_url}</div>
            <div className="value">
              <span className="text">{shop && this.formatUrl(shop.confirm_url)}</span>
            </div>
          </div>
          {this.listCryptoCurrency}
        </div>

    )
  }
}

PFDRegister.propTypes = {
  app: PropTypes.object.isRequired,
  setLanguage: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  app: state.app,
});

const mapDispatch = ({
  newPasscode, requestWalletPasscode, updatePasscode,
  setLanguage,
  showAlert,
  showLoading,
  hideLoading,
});


export default injectIntl(connect(mapStateToProps, mapDispatch)(PFDRegister));
