import React from 'react';
import PropTypes from 'prop-types';
import { Field, clearFields, change } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput } from '@/components/core/form/customField';
import { API_URL } from "@/constants";
import { getFiatCurrency } from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import { bindActionCreators } from 'redux';
import { MasterWallet } from "@/services/Wallets/MasterWallet";
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';

// style
import './ChooseCrypto.scss';

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

class ChooseCrypto extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      listCoin: {}
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

  async componentDidMount() {
    this.showLoading();
    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false) {
      listWallet = await MasterWallet.createMasterWallets();
      await this.splitWalletData(listWallet);
    } else {
      this.splitWalletData(listWallet);
    }
  }


  async splitWalletData(listWallet) {
    const {amount, fiatCurrency} = this.props;
    let listCoin = {};
    for(var wallet of listWallet){
      if(!wallet.isToken){
        listCoin[wallet.name] = {
          name: wallet.name,
          fullName: wallet.className,
          amount: await this.getCryptoAmount(amount, fiatCurrency, wallet.name)}
      }
    }
    this.setState({ listCoin: listCoin });
    this.hideLoading();


      // // is Mainnet (coin, token, collectible)
      // if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
      //   let coin = mainCoin[wallet.name];
      //   console.log(listWallet);

      //   if(!coin)
      //     mainCoin[wallet.name] = wallet;
      //   else{
      //     if(!coin.default && wallet.default){
      //       mainCoin[wallet.name] = wallet;
      //     }
      //   }
      // } else {
      //   let coin = testCoin[wallet.name];
      //   if(!coin)
      //     testCoin[wallet.name] = wallet;
      //   else{
      //     if(!coin.default && wallet.default){
      //       testCoin[wallet.name] = wallet;
      //     }
      //   }
      // }


    //console.log(mainCoin, testCoin);

  }

  isToCrypto = (walletName, toCrypto) => {
    if(!toCrypto)
      return true;

    for(let wallet of toCrypto){
      if(wallet && wallet.name == walletName)
        return true;
    }

    return false;
  }

  getCryptoAmount = async (amount, fiatCurrency, cryptoCurrency) => {
    let result = 0;
    let rate = await this.getRate(fiatCurrency, cryptoCurrency);
    result = Number(amount)/rate;
    if(result >= 1000){
      result = Math.round(result * 100) / 100; //roundup 2 decimal
    }
    else{
      result = Math.round(result * 10000000) / 10000000; //roundup 7 decimal
    }

    return result;
  }

  getRate(fiatCurrency, cryptoCurrency){
    return new Promise((resolve, reject) => {

      this.props.getFiatCurrency({
        PATH_URL: API_URL.EXCHANGE.GET_FIAT_CURRENCY,
        qs: {fiat_currency: fiatCurrency, currency: cryptoCurrency},
        successFn: (res) => {
          let data = res.data;
          let result = fiatCurrency == 'USD' ? data.price : data.fiat_amount;
          resolve(result);
        },
        errorFn: (err) => {
          console.error("Error", err);
          resolve(0);
        },
      });
    });
  }

  getMessage(str){
    const { messages } = this.props.intl;

    let result = "";
    try{
      result = eval(str);
    }
    catch(e){
      console.error(e);
    }

    return result;
  }

  get listCoin(){
    const coins = this.state.listCoin;
    const {toCrypto} = this.props;

    if(coins){
      let arr = [];
      for(var i in coins) {
        let item = coins[i];
        if(this.isToCrypto(item.name, toCrypto)){
          arr.push(item);
        }
      }

      return arr.map(crypto => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + crypto.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

          return <div className="coin" key={crypto.name} onClick={()=> {this.selectCoin(crypto.name)}} >
            <div className="icon"><img src={icon} /></div>
            <div className="name">{crypto.name}</div>
            <div className="fullName">{crypto.fullName}</div>
            <div className="balance">{crypto.amount}</div>
          </div>;
        }
      );
    }
  }

  selectCoin(crypto){
    const { callbackSuccess } = this.props;

    if (callbackSuccess) {
      callbackSuccess(crypto);
    }
  }

  render() {
    const { messages } = this.props.intl;
    return (
      <div className="chosen-list">
        {this.listCoin}
      </div>
    )
  }
}

const mapState = (state) => ({
});

const mapDispatch = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  getFiatCurrency: bindActionCreators(getFiatCurrency, dispatch),
});


export default injectIntl(connect(mapState, mapDispatch)(ChooseCrypto));
