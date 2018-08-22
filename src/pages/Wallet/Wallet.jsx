import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

// service, constant
import { Grid, Row, Col } from 'react-bootstrap';

// components
import Button from '@/components/core/controls/Button';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import Input from '@/components/core/forms/Input/Input';
import { StringHelper } from '@/services/helper';

import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import Dropdown from '@/components/core/controls/Dropdown';
import createForm from '@/components/core/form/createForm';

import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import iconLoading from '@/assets/images/icon/loading.svg.raw';
import iconQRCodeBlack from '@/assets/images/icon/scan-qr-code.svg';
import bgAddImg from '@/assets/images/pages/wallet/add-wallet.svg';

import Header from './Header';
import HeaderMore from './HeaderMore';
import WalletItem from './WalletItem';
import WalletProtect from './WalletProtect';
import WalletHistory from './WalletHistory';
import TransferCoin from '@/components/Wallet/TransferCoin';
import ReceiveCoin from '@/components/Wallet/ReceiveCoin';
import ReactBottomsheet from 'react-bottomsheet';
import { setHeaderRight } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { Input as Input2, InputGroup, InputGroupAddon } from 'reactstrap';
import local from '@/services/localStore';
import {APP} from '@/constants';
import _ from 'lodash';
import qs from 'querystring';
import axios from 'axios';

import AddToken from '@/components/Wallet/AddToken/AddToken';
import AddCollectible from '@/components/Wallet/AddCollectible/AddCollectible';

// style
import './Wallet.scss';
import CoinTemp from '@/pages/Wallet/CoinTemp';
import BackupWallet from '@/components/Wallet/BackupWallet/BackupWallet';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import SettingWallet from '@/components/Wallet/SettingWallet/SettingWallet';
import FeedCreditCard from "@/components/handshakes/exchange/Feed/FeedCreditCard";
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';

const QRCode = require('qrcode.react');

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const nameFormSendWallet = 'sendWallet';
//const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

const nameFormCreditCard = 'creditCard';
const FormCreditCard = createForm({
  propsReduxForm: {
    form: nameFormCreditCard,
    initialValues: { currency: 'ETH' },
  },
});
const selectorFormCreditCard = formValueSelector(nameFormCreditCard);

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const defaultOffset = 500;

var topOfElement = function(element) {
    if (!element) {
        return 0;
    }
    return element.offsetTop + topOfElement(element.offsetParent);
};

class Wallet extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
      isLoading: false,
      error: null,
      listMainWalletBalance: [],
      listTokenWalletBalance: [],
      listCollectibleWalletBalance: [],
      listTestWalletBalance: [],
      listRewardWalletBalance: [],
      bottomSheet: false,
      listMenu: [],
      walletSelected: null,
      inputSendValue: '',
      isRestoreLoading: false,
      // tranfer:
      listCoinTempToCreate: [],
      countCheckCoinToCreate: 1,
      walletKeyDefaultToCreate: 1,
      input12PhraseValue: '',
      // Qrcode
      qrCodeOpen: false,
      delay: 300,
      walletsData: false,
      isNewCCOpen: false,
      stepProtected: 1,
      activeProtected: false,
      formAddTokenIsActive: false,
      formAddCollectibleIsActive: false,
      isHistory: false,
      pagenoTran: 1,
      pagenoIT: 1,
      transactions: [],
      internalTransactions: [],
      isLoadMore: false,
      activeReceive: false,
      activeSetting: false,
      alternateCurrency: 'USD',
      alternateCurrencyRate: 1,
      modalFillContent: ''
    };

    this.props.setHeaderRight(this.headerRight());
    this.listener = _.throttle(this.scrollListener, 200).bind(this);
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
  headerRight() {
    return (<HeaderMore onHeaderMoreClick={this.onIconRightHeaderClick} />);
  }

  splitWalletData(listWallet) {
    let listMainWallet = [];
    let listTestWallet = [];
    let listRewardWallet = [];
    let listTokenWallet = [];
    let listCollectibleWallet = [];

    listWallet.forEach((wallet) => {
      // is reward wallet:
      if (wallet.isReward) {
        // listRewardWallet.push(wallet);
      }
      // is Mainnet (coin, token, collectible)
      else if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        if (!process.env.isDojo)
        { // not show for Dojo
          if(wallet.isToken){
            wallet.default = false;
            if (wallet.isCollectibles){
              listCollectibleWallet.push(wallet);
            }
            else{
              listTokenWallet.push(wallet);
            }
          }
          else{
            listMainWallet.push(wallet);
          }
        }
      } else {
        // is Testnet
        listTestWallet.push(wallet);
      }
    });

    this.setState({
      isLoading: true, listMainWalletBalance: listMainWallet, listTokenWalletBalance: listTokenWallet, listCollectibleWalletBalance: listCollectibleWallet, listTestWalletBalance: listTestWallet, listRewardWalletBalance: listRewardWallet,
    });
  }

  async scrollListener () {
    let el = ReactDOM.findDOMNode(this),
      offset = this.props.offset || defaultOffset,
      scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    let {walletSelected, pagenoTran, isHistory, isLoadMore } = this.state;
    let calcTop = topOfElement(el) + el.offsetHeight - scrollTop - window.innerHeight ;

    if (isHistory && isLoadMore == false && pagenoTran > 0 && calcTop < offset) {
      pagenoTran++;

      this.setState({ isLoadMore: true});

      let list = this.state.transactions;
      let data = await walletSelected.getTransactionHistory(pagenoTran);

      if(data.length > 0){
        let final_list = list.concat(data);
        this.setState({ transactions: final_list, pagenoTran: data.length < 20 ? 0 : pagenoTran, isLoadMore: false});
      }
      else{
        this.setState({ pagenoTran: 0, isLoadMore: false});
      }
    }
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.listener);
    window.addEventListener('resize', this.listener);
    this.listener();
  }

  detachScrollListener() {
    window.removeEventListener('scroll', this.listener);
    window.removeEventListener('resize', this.listener);
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  async componentDidMount() {

    this.attachScrollListener();
    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false) {
      listWallet = await MasterWallet.createMasterWallets();
      // fill data:
      await this.splitWalletData(listWallet);
    } else {
      this.splitWalletData(listWallet);
      // console.log('update balance for lst wallet');
      await this.getListBalace(listWallet);
    }
    /* var btc = new Bitcoin();
     var tx = await btc.transfer("tprv8ccSMiuz5MfvmYHzdMbz3pjn5uW3G8zxM975sv4MxSGkvAutv54raKHiinLsxW5E4UjyfVhCz6adExCmkt7GjC41cYxbNxt5ZqyJBdJmqPA","mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M", 0.0001);

     console.log(tx) */
     this.getSetting();
  }

  async getSetting(){
    let setting = local.get(APP.SETTING), alternateCurrency = "USD";

    //alternate_currency
    if(setting && setting.wallet && setting.wallet.alternateCurrency) {
      alternateCurrency = setting.wallet.alternateCurrency;
    }

    if(alternateCurrency != "USD"){
      this.setState({alternateCurrency: alternateCurrency});

      //rate
      try{
        const response = await axios.get("https://bitpay.com/api/rates/btc");
        if (response.status == 200 && response.data) {
          let usd = 0, alt = 0;
          response.data.map(e => {
            if(e.code == "USD")
              usd = e.rate;
            else if(e.code == this.state.alternateCurrency)
              alt = e.rate;
          });

          if(usd > 0 && alt > 0){
            this.setState({alternateCurrencyRate: Number(alt/usd)});
          }
        }
      }
      catch (error) {
      }
    }
  }

  getAllWallet() {
    return this.state.listMainWalletBalance.concat(this.state.listTestWalletBalance).concat(this.state.listRewardWalletBalance).concat(this.state.listTokenWalletBalance).concat(this.state.listCollectibleWalletBalance);
  }

  async getListBalace(listWallet) {
    const pros = [];

    listWallet.forEach((wallet) => {
      pros.push(new Promise((resolve, reject) => {
        wallet.getBalance().then((balance) => {
          wallet.balance = balance;
          resolve(wallet);
        });
      }));
    });

    await Promise.all(pros);

    await this.splitWalletData(listWallet);

    await MasterWallet.UpdateLocalStore(listWallet);


    // var btcTestnet = new Bitcoin(Bitcoin.Network.Testnet);
    // var balance = await btcTestnet.getBalance("n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz");
    // console.log("btcTestnet", balance);

    // var ethRinkeby = new Ethereum (Ethereum.Network.Rinkeby);
    // balance = await ethRinkeby.getBalance("0xe70adf9aE4d5F68E80A8E2C5EA3B916Dd49C6D87");
    // console.log("ethRinkeby", balance);
  }

  toggleBottomSheet() {
    const obj = (this.state.bottomSheet) ? { bottomSheet: false } : { bottomSheet: true };
    this.setState(obj);
  }

  copyToClipboard =(text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  // create list menu of wallet item when click Show more ...
  creatSheetMenuItem(wallet){
    const { messages } = this.props.intl;
    let obj = [];

    if (!wallet.isCollectibles){
      obj.push({
        title: messages.wallet.action.transfer.title,
        handler: () => {
          this.toggleBottomSheet();
          this.setState({ walletSelected: wallet, activeTransfer: true }, ()=>{
            this.modalSendRef.open();
          });
        }
      })
    }
    obj.push({
      title: messages.wallet.action.receive.title,
      handler: () => {
        this.setState({walletSelected: wallet, activeReceive: true}, ()=>{
          this.toggleBottomSheet();
          this.modalShareAddressRef.open();
        });
      }
    })

    const allowedWallets = ['BTC', 'ETH', 'BCH'];
    // now hide buy coin:
    if (true && allowedWallets.includes(wallet.name)){
    // if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet && allowedWallets.includes(wallet.name)){
      obj.push({
        title: messages.create.cash.credit.title,
        handler: () => {
          this.setState({
            walletSelected: wallet,
            modalFillContent:
              (
                <FeedCreditCard
                  buttonTitle={messages.create.cash.credit.title}
                  currencyForced={wallet ? wallet.name : ''}
                  callbackSuccess={this.afterWalletFill}
                  addressForced={wallet ? wallet.address : ''}
                />
              ),
          }, () => {
            this.toggleBottomSheet();
            this.modalFillRef.open();

            gtag.event({
              category: taggingConfig.creditCard.category,
              action: taggingConfig.creditCard.action.showPopupWallet
            });
          });
        },
      });
    }

    if (!wallet.protected) {
      obj.push({
        title: messages.wallet.action.protect.title,
        handler: () => {
          this.setState({ walletSelected: wallet, stepProtected: 1, activeProtected: true });
          this.toggleBottomSheet();
          this.modalProtectRef.open();
        },
      });
    }

    if (wallet.name != "XRP" && !wallet.isToken)
      obj.push({
        title: messages.wallet.action.history.title,
        handler: async () => {
          let pagenoTran = 1, pagenoIT = 1;
          this.setState({ walletSelected: wallet, transactions: [], isHistory: true, pagenoTran: pagenoTran });
          this.toggleBottomSheet();
          this.modalHistoryRef.open();
          this.showLoading();

          wallet.balance = await wallet.getBalance();
          wallet.transaction_count = await wallet.getTransactionCount();

          let transactions = await wallet.getTransactionHistory(pagenoTran);

          if(Number(transactions.length) < 20) pagenoTran = 0;
          if(transactions.length > wallet.transaction_count) wallet.transaction_count = transactions.length;

          let internalTransactions = await wallet.listInternalTransactions(pagenoIT);
          if(Number(internalTransactions.length) < 20) pagenoIT = 0;
          if(internalTransactions.length > wallet.transaction_count) wallet.transaction_count = transactions.length;

          this.setState({ transactions: transactions, internalTransactions: internalTransactions, pagenoTran: pagenoTran, pagenoIT: pagenoIT, walletSelected: wallet });
          this.hideLoading();
        }
      });
    obj.push({
      title: messages.wallet.action.copy.title,
      handler: () => {
        Clipboard.copy(wallet.address);
        this.toggleBottomSheet();
        this.showToast(messages.wallet.action.copy.message);
      },
    });

    let canRemove = (wallet.isToken &&  wallet.customToken) || !wallet.isReward;
    let cansetDefault = !wallet.isToken && !wallet.isReward;

    if (cansetDefault && !wallet.default) {
        obj.push({
          title: StringHelper.format(messages.wallet.action.default.title, wallet.name) + (wallet.default ? "✓ " : ""),
          handler: () => {
            wallet.default = !wallet.default;
            this.toggleBottomSheet();
            // reset all wallet default:
            let lstWalletTemp = this.getAllWallet();
            if (wallet.default) lstWalletTemp.forEach(wal => {if (wal != wallet && wal.name == wallet.name){wal.default = false;}})
            // Update wallet master from local store:
            MasterWallet.UpdateLocalStore(lstWalletTemp);
          }
        })
      }
      if (canRemove) {
        obj.push({
          title: messages.wallet.action.remove.title,
          handler: () => {
            this.setState({walletSelected: wallet});
            this.modalBetRef.open();
            this.toggleBottomSheet();
          }
        })
    }
    obj.push({
      title: messages.wallet.action.cancel.title,
      handler: () => {
        this.toggleBottomSheet();
      },
    });

    return obj;
  }


  // Remove wallet function:
  removeWallet = () => {
    const lstWalletTemp = this.getAllWallet();
    let index = -1;
    const walletTmp = this.state.walletSelected;
    if (walletTmp != null) {
      // Find index for this item:
      lstWalletTemp.forEach((wal, i) => { if (wal === walletTmp) { index = i; } });
      // Remove item:
      if (index > -1) {
        lstWalletTemp.splice(index, 1);
        // Update wallet master from local store:
        MasterWallet.UpdateLocalStore(lstWalletTemp, true);
        this.splitWalletData(lstWalletTemp);
      }
    }
    this.modalBetRef.close();
  }

  sendCoin = () => {
    this.modalConfirmSendRef.open();
  }

  autoCheckBalance(fromAddress, toAddress){
      this.checkBalanceSend = 0;
      this.timeOutCheckBalance = setInterval(() => {
        this.checkBalanceSend += 1;
        let lstWalletTemp = this.getAllWallet();
        lstWalletTemp.forEach(wallet => {
          if (wallet.address == fromAddress){
            wallet.getBalance().then(result=>{
              if (wallet.balance != result){
                wallet.balance = result;
                clearInterval(this.timeOutCheckBalance);
              }
            });
          }
          if (wallet.address == toAddress){
            wallet.getBalance().then(result=>{
              if (wallet.balance != result){
                wallet.balance = result;
                clearInterval(this.timeOutCheckBalance);
              }
            });
          }
        })

        if (this.checkBalanceSend >= 5){
          clearInterval(this.timeOutCheckBalance);
        }
      }, 10000);

  }

  invalidateTransferCoins = (value) => {
    const { messages } = this.props.intl;
    let errors = {};

    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['to_address']);
      if (result !== true)
          errors.to_address = result;
      // check amount:
      if (parseFloat(this.state.walletSelected.balance) <= parseFloat(value['amount']))
        errors.amount = messages.wallet.action.transfer.error + ` ${this.state.walletSelected.balance} ${this.state.walletSelected.name}`
    }
    return errors
  }

  submitSendCoin=()=>{
    this.setState({isRestoreLoading: true});
    this.modalConfirmSendRef.close();
      this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {
          //console.log(success);
          this.setState({isRestoreLoading: false});
          if (success.hasOwnProperty('status')){
            if (success.status == 1){
              this.showSuccess(success.message);
              this.modalSendRef.close();
              // start cron get balance auto ...
              this.autoCheckBalance(this.state.walletSelected.address, this.state.inputAddressAmountValue);
            }
            else{
              this.showError(success.message);
            }
          }
      });
  }

  updateSendAmountValue = (evt) => {
    this.setState({
      inputSendAmountValue: evt.target.value,
    });
  }

  getPathPicture = (evt) => {
    alert(`evt.target.value${evt.target.value}`);
  }

  updateSendAddressValue = (evt) => {
    this.setState({
      inputAddressAmountValue: evt.target.value,
    });
  }

  // Menu for Right header bar
  showModalAddCoin = () =>{
    this.setState({ isRestoreLoading: false, countCheckCoinToCreate: 1, listCoinTempToCreate: MasterWallet.getListCoinTemp() });
    this.modalCreateWalletRef.open();
  }
  showModalAddToken = () =>{
      this.setState({formAddTokenIsActive: true}, () => {
        this.modalAddNewTokenRef.open();
    });
  }
  showModalAddCollectible = () =>{
    this.setState({formAddCollectibleIsActive: true}, () => {
      this.modalAddNewCollectibleRef.open();
    });
  }
  creatSheetMenuHeaderMore() {
    const { messages } = this.props.intl;
    const obj = [];

    // obj.push({
    //   title: messages.wallet.action.import.title,
    //   handler: () => {
    //     this.showModalAddCoin();
    //   },
    // });

    // obj.push({
    //   title: messages.wallet.action.add_token.title,
    //   handler: () => {
    //     this.showModalAddToken();
    //   },
    // });
    // obj.push({
    //   title: messages.wallet.action.add_collectible.title,
    //   handler: () => {
    //     this.showModalAddCollectible();
    //   },
    // });


    obj.push({
      title: messages.wallet.action.backup.title,
      handler: () => {
        this.setState({activeBackup: true, walletsData: {
          "auth_token": local.get(APP.AUTH_TOKEN),
          "chat_encryption_keypair": local.get(APP.CHAT_ENCRYPTION_KEYPAIR),
          "wallets": this.getAllWallet()}});
        this.toggleBottomSheet();
        this.modalBackupRef.open();
      },
    });
    obj.push({
      title: messages.wallet.action.restore.title,
      handler: () => {
        this.toggleBottomSheet();
        this.modalRestoreRef.open();
      },
    });
    obj.push({
      title: messages.wallet.action.setting.title,
      handler: () => {
        this.setState({activeSetting:true}, ()=> {
          this.toggleBottomSheet();
          this.modalSettingRef.open();
        });
      },
    });
    obj.push({
      title: messages.wallet.action.cancel.title,
      handler: () => {
        this.toggleBottomSheet();
      },
    });
    return obj;
  }

  // add custom token:
  addedCustomToken = () =>{
    let masterWallet = MasterWallet.getMasterWallet();
    this.getListBalace(masterWallet);

    this.splitWalletData(masterWallet);
    this.modalAddNewTokenRef.close();
    this.setState({formAddTokenIsActive: false});
  }

  //add Collectible
  addedCollectible = () =>{
    let masterWallet = MasterWallet.getMasterWallet();
    this.getListBalace(masterWallet);

    this.splitWalletData(masterWallet);
    this.modalAddNewCollectibleRef.close();
    this.setState({formAddCollectibleIsActive: false});
  }

  // on select type of wallet to create:
  onSelectCoinClick = (wallet) => {
    const listCoinTemp = this.state.listCoinTempToCreate;

    wallet.default = !wallet.default;
    let countCheckCoinToCreate = 0;
    listCoinTemp.forEach((wal) => { if (wal.default) countCheckCoinToCreate += 1; });

    this.setState({ erroValueBackup: false, listCoinTempToCreate: listCoinTemp, countCheckCoinToCreate });
  }

  createNewWallets = () => {
    const { messages } = this.props.intl;
    this.setState({ isRestoreLoading: true, erroValueBackup: false });
    const listCoinTemp = this.state.listCoinTempToCreate;

    const phrase = this.state.input12PhraseValue.trim();

    const masterWallet = MasterWallet.createNewsallets(listCoinTemp, phrase);
    if (masterWallet == false) {
      this.setState({ isRestoreLoading: false, erroValueBackup: true });

      if (phrase != '') {
        this.showError(messages.wallet.action.create.error.recovery_words_invalid)
      }
      else{
        this.showError(messages.wallet.action.create.error.random);
      }
    } else {
      if (phrase != '') {// need get balance
        this.getListBalace(masterWallet);
      }

      this.setState({ input12PhraseValue: "" });
      this.splitWalletData(masterWallet);
      this.modalCreateWalletRef.close();
    }
  }
  update12PhraseValue = (evt) => {
    this.setState({
      input12PhraseValue: evt.target.value,
    });
  }
  updateWalletKeyDefaultValue = (evt) => {
    this.setState({
      walletKeyDefaultToCreate: evt.target.value,
    });
  }

  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen });
  }

  onIconRightHeaderClick = () => {
    this.setState({ listMenu: this.creatSheetMenuHeaderMore() });
    this.toggleBottomSheet();
  }

  onMoreClick = (wallet) => {
    this.setState({ listMenu: this.creatSheetMenuItem(wallet) });
    this.toggleBottomSheet();
  }

  onWarningClick = (wallet) => {
    if (!wallet.protected) {
      this.setState({ walletSelected: wallet, stepProtected: 1, activeProtected: true });
      this.modalProtectRef.open();
    } else {

    }
  }

  onAddressClick = (wallet) => {
    this.setState({walletSelected: wallet, activeReceive: true}, ()=>{
      this.modalShareAddressRef.open();
    });
  }

  handleFocus = (e) => {
    e.currentTarget.select();
  }

  handleClick = (e) => {
    this.refs.input.focus();
  }

  get listMainWalletBalance() {
    let setting = local.get(APP.SETTING);
    setting = setting ? setting.wallet : false;
    return this.state.listMainWalletBalance.map(wallet => <WalletItem key={Math.random()} settingWallet={setting} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }

  get listTokenWalletBalance() {
    return this.state.listTokenWalletBalance.map(wallet => <WalletItem key={Math.random()} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }
  get listCollectibleWalletBalance() {
    return this.state.listCollectibleWalletBalance.map(wallet => <WalletItem key={Math.random()} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }

  get listTestWalletBalance() {
    let setting = local.get(APP.SETTING);
    setting = setting ? setting.wallet : false;
    return this.state.listTestWalletBalance.map(wallet => <WalletItem key={Math.random()} settingWallet={setting} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }

  get listRewardWalletBalance() {
    return this.state.listRewardWalletBalance.map(wallet => <WalletItem key={Math.random()} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }

  get getListCoinTempForCreate() {
    return this.state.listCoinTempToCreate.map(walletTemp => <CoinTemp key={Math.random()} wallet={walletTemp} onClick={() => this.onSelectCoinClick(walletTemp)} />);
  }

  afterWalletFill = () => {
    this.modalFillRef.close();
  }

  closeProtected = () => {
    this.setState({ activeProtected: false });
  }

  closeTransfer = () => {
    this.setState({ activeTransfer: false });
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  closeCreate = () => {
    this.setState({input12PhraseValue: "", walletKeyDefaultToCreate: 1});
  }

  closeHistory = () => {
    this.setState({activeSetting: false});
    this.setState({ transactions: [], isHistory: false });
  }

  successTransfer = () => {
    this.modalSendRef.close();
    this.autoCheckBalance(this.state.walletSelected.address, this.state.inputAddressAmountValue);
  }

  closeQrCode=() => {
    this.setState({ qrCodeOpen: false });
  }

  closeSetting = ()  => {
    this.setState({activeSetting: false});
    this.getSetting();
  }

  successReceive = () => {
    this.modalShareAddressRef.close();
    this.autoCheckBalance(this.state.walletSelected.address, this.state.inputAddressAmountValue);
  }

  onCopyProtected = () => {
    const { messages } = this.props.intl;
    Clipboard.copy(this.state.walletSelected.mnemonic);
    this.showToast(messages.wallet.action.copy.success);
  }

  successWalletProtect = (wallet) => {
    const { messages } = this.props.intl;
    const lstWalletTemp = this.getAllWallet();
    lstWalletTemp.forEach((wal) => { if (wallet.mnemonic == wal.mnemonic) { wal.protected = true; } });
    // Update wallet master from local store:
    MasterWallet.UpdateLocalStore(lstWalletTemp);
    this.modalProtectRef.close();
    this.splitWalletData(lstWalletTemp);
    this.showSuccess(messages.wallet.action.protect.success);
  }

  getETHFree() {
    window.open('https://www.rinkeby.io/#faucet', '_blank');
  }

  // For Qrcode:
  handleScan=(data) =>{

    if(data){
      let value = data.split(',');
      this.setState({
        inputAddressAmountValue: value[0],
      });
      this.props.change(nameFormSendWallet, 'to_address', value[0]);

      if (value.length == 2){
        this.setState({
          inputSendAmountValue: value[1],
        });
        this.props.change(nameFormSendWallet, 'amount', value[1]);
      }
      this.modalScanQrCodeRef.close();
    }
  }
  handleError(err) {
    console.log('error wc', err);
  }

  openQrcode = () => {
    this.setState({ qrCodeOpen: true });
    this.modalScanQrCodeRef.open();
  }

  renderScanQRCode = () => {
    const { messages } = this.props.intl;
    <Modal onClose={() => this.closeQrCode()} title={messages.wallet.action.scan_qrcode.header} onRef={modal => this.modalScanQrCodeRef = modal}>
      {this.state.qrCodeOpen ?
        <QrReader
          delay={this.state.delay}
          onScan={(data) => { this.handleScan(data); }}
          onError={this.handleError}
          style={{ width: '100%', height: '100%' }}
        />
        : ''}
    </Modal>
  }

  render = () => {
    const { messages } = this.props.intl;
    const { formAddTokenIsActive, formAddCollectibleIsActive, modalFillContent,
      activeTransfer, walletSelected, alternateCurrency, alternateCurrencyRate,
      walletsData, activeSetting, activeReceive} = this.state;

    return (
      <div className="wallet-page">

        <Modal onClose={() => this.setState({formAddTokenIsActive: false})} title="Add Custom Token" onRef={modal => this.modalAddNewTokenRef = modal}>
            <AddToken formAddTokenIsActive={formAddTokenIsActive} onFinish={() => {this.addedCustomToken()}}/>
        </Modal>

        <Modal onClose={() => this.setState({formAddCollectibleIsActive: false})} title="Add Collectible" onRef={modal => this.modalAddNewCollectibleRef = modal}>
            <AddCollectible formAddCollectibleIsActive={formAddCollectibleIsActive} onFinish={() => {this.addedCollectible()}}/>
        </Modal>

        <Grid>

          {/* Tooltim menu Bottom */ }
          <ReactBottomsheet
            visible={this.state.bottomSheet}
            appendCancelBtn={false}
            onClose={this.toggleBottomSheet.bind(this)}
            list={this.state.listMenu}
          />

          {/* ModalDialog for confirm remove wallet */}
          <ModalDialog title={messages.wallet.action.remove.header} onRef={modal => this.modalBetRef = modal}>
            <div className="bodyConfirm"><span>{messages.wallet.action.remove.message}</span></div>
            <div className="bodyConfirm">
              <Button className="left" cssType="danger" onClick={this.removeWallet} >{messages.wallet.action.remove.button_yes}</Button>
              <Button className="right" cssType="secondary" onClick={() => { this.modalBetRef.close(); }}>{messages.wallet.action.remove.button_cancel}</Button>
            </div>
          </ModalDialog>

          {/* ModalDialog for transfer coin */}


          <Modal title={messages.wallet.action.transfer.header} onRef={modal => this.modalSendRef = modal}  onClose={this.closeTransfer}>
            <TransferCoin
              active={activeTransfer}
              wallet={walletSelected}
              onFinish={() => { this.successTransfer() }}
              currency={alternateCurrency}
              rate={alternateCurrencyRate}
            />
          </Modal>

          <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
            {modalFillContent}
          </Modal>

          <Modal title={messages.wallet.action.protect.header} onClose={this.closeProtected} onRef={modal => this.modalProtectRef = modal}>
            <WalletProtect onCopy={this.onCopyProtected} step={this.state.stepProtected} active={this.state.activeProtected} wallet={this.state.walletSelected} callbackSuccess={() => { this.successWalletProtect(this.state.walletSelected); }} />
          </Modal>

          <Modal title={messages.wallet.action.history.header} onRef={modal => this.modalHistoryRef = modal} onClose={this.closeHistory}>
            <WalletHistory wallet={this.state.walletSelected} transactions={this.state.transactions} internalTransactions={this.state.internalTransactions} />
          </Modal>


          {/* Modal for Backup wallets : */}
          <Modal title={messages.wallet.action.backup.header} onRef={modal => this.modalBackupRef = modal}>
            <BackupWallet walletData={walletsData} />
          </Modal>

          {/* Modal for Restore wallets : */}
          <Modal title={messages.wallet.action.restore.header} onRef={modal => this.modalRestoreRef = modal}>
            <RestoreWallet />
          </Modal>

          {/* Modal for Setting wallets : */}
          <Modal title={messages.wallet.action.setting.header} onRef={modal => this.modalSettingRef = modal} onClose={this.closeSetting}>
            <SettingWallet active={activeSetting}  />
          </Modal>

          {/* Modal for Copy address : */}
          <Modal title={messages.wallet.action.receive.title} onRef={modal => this.modalShareAddressRef = modal} onClose={()=> {this.setState({activeReceive: false})}}>
            <ReceiveCoin active={activeReceive}
              wallet={walletSelected}
              currency={alternateCurrency}
              rate={alternateCurrencyRate}
              onFinish={() => { this.successReceive() }}
            />
          </Modal>

          {/* Modal for Create/Import wallet : */}
          <Modal title={messages.wallet.action.create.header} onRef={modal => this.modalCreateWalletRef = modal} onClose={this.closeCreate}>
            <Row className="list">
              <Header title={messages.wallet.action.create.label.select_coins} hasLink={false} />
            </Row>
            <Row className="list">
              {this.getListCoinTempForCreate}
            </Row>
            <Row className="list">
              <Header title={messages.wallet.action.create.label.wallet_key} />
            </Row>
            <div className="wallet-create-footer">
              <Dropdown
                className="dropdown-wallet"
                placeholder={messages.wallet.action.create.placeholder.wallet_key}
                defaultId={this.state.walletKeySelected}
                source={[{ id: 1, value: messages.wallet.action.create.text.random }, { id: 2, value: messages.wallet.action.create.text.specify_phrase }]}
                onItemSelected={(item) => {
                    this.setState({
                      walletKeyDefaultToCreate: item.id,
                      erroValueBackup: false,
                      input12PhraseValue: ""
                    });
                  }
                }
              />

              { this.state.walletKeyDefaultToCreate == 2 ?
                <Input
                  name="phrase"
                  placeholder={messages.wallet.action.create.placeholder.phrase}
                  required
                  value={this.state.input12PhraseValue}
                  className={this.state.erroValueBackup ? 'input12Phrase error' : 'input12Phrase'}
                  onChange={evt => this.update12PhraseValue(evt)}
                />
              : ''
            }
            </div>


            <Button block isLoading={this.state.isRestoreLoading} disabled={this.state.countCheckCoinToCreate == 0 || (this.state.walletKeyDefaultToCreate == 2 && this.state.input12PhraseValue.trim().split(/\s+/g).length != 12)} className="button button-wallet" cssType="primary" onClick={() => { this.createNewWallets(); }} >
              {messages.wallet.action.create.button.create}
            </Button>
            <Header />
          </Modal>

          {/* QR code dialog */}
          {/* {this.renderScanQRCode()} */}
          <Modal onClose={() => this.closeQrCode()} title={messages.wallet.action.scan_qrcode.header} onRef={modal => this.modalScanQrCodeRef = modal}>
            {this.state.qrCodeOpen ?
              <QrReader
                delay={this.state.delay}
                onScan={(data) => { this.handleScan(data); }}
                onError={this.handleError}
                style={{ width: '100%', height: '100%' }}
              />
            : ''}
          </Modal>

          {/* Render list wallet: */}
          {/* Coin*/}
          {!process.env.isDojo ?
            <Row className="list">
              <Header title={messages.wallet.action.create.label.header_coins}hasLink={true} linkTitle={messages.wallet.action.create.button.add_new} onLinkClick={this.showModalAddCoin} />
            </Row>
          :""}
          <Row className="list">
            {this.listMainWalletBalance}
          </Row>

          {/* Tokens */}
          {!process.env.isDojo ?
          <Row className="list">
            <Header title={messages.wallet.action.create.label.header_tokens}hasLink={true} linkTitle={messages.wallet.action.create.button.add_new} onLinkClick={this.showModalAddToken} />
          </Row>
          : ""}
          <Row className="list">
            {this.listTokenWalletBalance}
          </Row>

          {/* Collectible */}
          {!process.env.isDojo ?
          <Row className="list">
            <Header title={messages.wallet.action.create.label.header_collectibles}hasLink={true} linkTitle={messages.wallet.action.create.button.add_new} onLinkClick={this.showModalAddCollectible} />
          </Row>
          :""}
          <Row className="list">
            {this.listCollectibleWalletBalance}
          </Row>

          {!process.env.isLive ?
          <Row className="list">
            {!process.env.isDojo ?
            <Header title={messages.wallet.action.create.label.test_net} hasLink linkTitle={messages.wallet.action.create.button.request_free_eth} onLinkClick={this.getETHFree} />
            :
            <Header title=""/>
            }
          </Row>
          : ''}
          {!process.env.isLive ?
          <Row className="list">
            {this.listTestWalletBalance}
          </Row>
          : ''}

          {/* <Row className="list">
            <Header title="Reward wallets" hasLink={false} />
          </Row>
          <Row className="list">
            {this.listRewardWalletBalance}
          </Row> */}

        </Grid>
      </div>
    );
  }
}

const mapState = (state) => ({
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits,
});

const mapDispatch = ({
  setHeaderRight,
  showAlert,
  showLoading,
  hideLoading,
  change,
  clearFields,
});


export default injectIntl(connect(mapState, mapDispatch)(Wallet));
