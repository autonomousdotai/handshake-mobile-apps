import axios from 'axios';
import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import PropTypes from 'prop-types';
import Input from '../../Wallet/Input';
import { setLanguage } from '@/reducers/app/action';
import Button from '@/components/core/controls/Button';
import Modal from '@/components/core/controls/Modal';
import local from '@/services/localStore';
import {APP} from '@/constants';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import ListCoin from '@/components/Wallet/ListCoin';
import './PFDRegister.scss';
import '../../Wallet/WalletPreferences/WalletPreferences.scss';
import iconRemove from '@/assets/images/icon/comment/delete-icon.svg';
import { verifyPhone, submitPhone, verifyEmail, checkUsernameExist, authUpdate, submitEmail, verifyID } from '@/reducers/auth/action';
import { ICON } from '@/styles/images';
import valid from '@/services/validate';

const supportWallets = ['BTC', 'ETH', 'BCH', 'XRP', 'EOS'];

class PFDRegister extends React.Component {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
  }

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
      shop: false,
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

  componentDidMount(){
    this.props.showLoading();
    this.loadShopData();
    this.props.hideLoading();
  }

  loadShopData = () => {
    //sample data
    let shop = {email: 'khoa.trinh@autonomous.nyc', shop_id: 'khoatrinh', confirm_url: 'http://www.autonomous.ai/confirm',
      wallets: [{name: 'ETH', address: '0xx'}, {name: 'BTC', address: '1xxx'}]};

    const profile = local.get(APP.AUTH_PROFILE);
    if(profile){
      shop.shop_id = profile.username;
      shop.email = profile.email;
    }

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
    let { wallets } = this.state.shop;

    this.setState({modalListCoin:
      <ListCoin
        addressSelected={w.address}
        crypto={w.name}
        onSelect={w => {
          if(wallets){
            wallets.some((wallet) => {
              if (wallet.name == w.name){
                wallet.address = w.address;
                return true;
              }
            });

            this.setState({ wallets, modalListCoin: ''}, ()=> {
              this.modalListCoinRef.close();
            });
          }
         }}
      />
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }

  deleteWallet=(w)=>{
    let { wallets } = this.state.shop;

    if(wallets){
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
          <Button onClick={()=> {this.updateShopID();}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalShopIDRef.open();
    });
  }

  openFormConfirmURL=()=>{

    this.setState({modalConfirmURL: (
        <div className="update-name">
          <label>Link used for redirect after complete order</label>
          <Input required placeholder="Confirm URL" maxLength="40" value={this.state.shop.confirm_url} onChange={(value) => {this.changeEmail(value)}} />
          <Button onClick={(value)=> {this.updateConfirmURL(value);}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalConfirmURLRef.open();
    });
  }

  changeEmail=(value) => {
    this.setState({inputEmail: value});
  }

  changeShopID=(value) => {
    this.setState({inputShopID: value});
  }

  updateShopID() {
    const { messages } = this.props.intl;
    let {inputShopID, shop} = this.state;

    if (inputShopID) {console.log(1, inputShopID);
      this.props.checkUsernameExist({
        PATH_URL: 'user/username-exist',
        qs: { username: inputShopID },
        successFn: (res) => {console.log(2, inputShopID);
          if (!res.data) {console.log(3, inputShopID);
            const params = new URLSearchParams();
            params.append('username', inputShopID);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {console.log('showSuccess', inputShopID);
                this.showSuccess(messages.me.profile.username.success);
                shop.shop_id = inputShopID;
                this.setState({shop}, ()=>{
                  this.modalShopIDRef.close();
                });
              },
            });
          } else {console.log('showError', inputShopID);
            this.showError(messages.me.profile.username.exist);
          }
        },
      });
    } else {console.log('showToast', inputShopID);
      this.showToast(messages.me.profile.username.required);
    }
  }

  updateEmail2 = (value) => {
    const { messages } = this.props.intl;
    let {inputEmail, shop} = this.state;

    if (!shop){
      return;
    }

    shop.email = inputEmail;
    this.setState({shop}, ()=>{
      this.modalEmailRef.close();
    });
  }

  updateEmail() {
    const { messages } = this.props.intl;
    const inputEmail = this.state.inputEmail || this.localEmail;
    const { emailStart, code } = this.state;
console.log(inputEmail);
    if (inputEmail) {
      if (valid.email(inputEmail)) {
        this.showError(messages.me.profile.verify.alert.notValid.client.email);
        return;
      }

      if (emailStart !== inputEmail) {
        this.props.verifyEmail({
          PATH_URL: `user/verification/email/start?email=${inputEmail}`,
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: (data) => {
            if (data.status) {
              this.showSuccess(messages.me.profile.verify.alert.send.email);
              this.setState(() => ({ emailStart: inputEmail, isShowVerificationEmailCode: true }));
              local.save(APP.EMAIL_NEED_VERIFY, inputEmail);
            }
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.notValid.client.email);
          },
        });
      } else {
        if (!code) {
          this.showError(messages.me.profile.verify.alert.require.email);
          return;
        }

        this.props.submitEmail({
          PATH_URL: `user/verification/email/check`,
          qs: {
            inputEmail,
            code,
          },
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: () => {
            const params = new URLSearchParams();
            params.append('email', inputEmail);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {
                this.setState({ isShowVerificationEmailCode: false });
                this.showSuccess(messages.me.profile.verify.alert.success.email);
              },
              errorFn: () => {
                this.showError(messages.me.profile.verify.alert.require.email);
              },
            });
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.cannot.email);
          },
        });
      }
    } else {
      this.showError(messages.me.profile.verify.alert.notValid.client.email);
    }
  }

  updateConfirmURL = (value) => {
    const { messages } = this.props.intl;
    let {inputConfirmURL, shop} = this.state;

    if (!shop){
      return;
    }

    shop.confirm_url = inputConfirmURL;
    this.setState({shop}, ()=>{
      this.modalConfirmURLRef.close();
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
    const { wallets, email, shop_id } = this.state.shop;


    if(wallets){
      return (<div className="cryptoCurrency">
      <div className="item header">
        <label>{messages.wallet.action.payment.label.crypto_currency}</label>
      </div>

      {
        email && shop_id ?
          wallets.map(wallet => {
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
            })
          :
          <div className="verify-first">Please verify <strong>shop ID</strong> and <strong>email</strong> first.</div>
      }


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

          <Modal onClose={()=>{this.setState({modalConfirmURL: ""})}} title="Confirm URL" onRef={modal => this.modalConfirmURLRef = modal}>
            {modalConfirmURL}
          </Modal>

          <div className="wallets-wrapper">
            <Modal title="Select wallets" onClose={()=>{this.setState({modalListCoin: ""})}}  onRef={modal => this.modalListCoinRef = modal}>
              {modalListCoin}
            </Modal>
          </div>

          <div className="item1" onClick={()=> {this.openFormShopID();}}>
            <div className="name">{messages.wallet.action.payment.label.shop_id}</div>
            <div className="value">
              <span className="text">{shop && shop.shop_id}</span>
            </div>
          </div>

          <div className="item1" onClick={()=> {this.openFormEmail();}}>
            <div className="name">{messages.wallet.action.payment.label.email}</div>
            <div className="value">
            <span className="text">{shop && shop.email}</span>
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

const mapStateToProps = (state) => ({

});

const mapDispatch = ({
  setLanguage,
  showAlert,
  showLoading,
  hideLoading,
  authUpdate,
  checkUsernameExist,
});


export default injectIntl(connect(mapStateToProps, mapDispatch)(PFDRegister));
