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
import ModalDialog from '@/components/core/controls/ModalDialog';

import './SettingWallet.scss';
import Dropdown from '@/components/core/controls/Dropdown';

import '../WalletPreferences/WalletPreferences.scss';

import Switch from '@/components/core/controls/Switch';
import Input from '../Input';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { newPasscode, requestWalletPasscode, updatePasscode } from '@/reducers/app/action';

import iconLock from '@/assets/images/wallet/icons/icon-lock.svg';
import iconCurrentcy from '@/assets/images/wallet/icons/icon-currency.svg';
import iconNotifications from '@/assets/images/wallet/icons/icon-notifications.svg';
import iconTwitter from '@/assets/images/wallet/icons/icon-twitter.svg';
import iconFacebook from '@/assets/images/wallet/icons/icon-facebook.svg';
import iconVk from '@/assets/images/wallet/icons/icon-vk.svg';
import iconTelegram from '@/assets/images/wallet/icons/icon-telegram.svg';
import iconBackupWallet from '@/assets/images/wallet/icons/icon-backup.svg';
import iconRestoreWallet from '@/assets/images/wallet/icons/icon-restore.svg';

import Modal from '@/components/core/controls/Modal';



class SettingWallet extends React.Component {
  constructor(props) {
    super(props);

    this.defaultSettings = {"wallet":{"alternateCurrency": "USD", "passcode": {"enable": false, "value": ""}, "notification": true}};//todo: need move this to config.

    this.state = {
      currencies: [],
      alternateCurrency: '',
      settings: this.defaultSettings,
      switchContent: '',
      listCurrenciesContent: '',
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
    this.showAlert(mst, 'success', 2000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount(){

    let settings = local.get(APP.SETTING);

    let currencies = this.state.currencies;
    if(!currencies || currencies.length < 1){
      currencies = this.listCurrencies();
    }

    if(!(settings && settings.wallet)){
      settings = this.state.settings;
    }
    else{
      if (!settings.wallet.passcode){
        settings.wallet.passcode = this.state.settings.wallet.passcode;
      }
    }

    this.setState({settings: settings, currencies: currencies, switchContent: this.genSwitchContent(settings)});
  }

  genSwitchContent(settings){
    if (!settings)
      settings = this.state.settings;
    return <Switch isChecked={settings.wallet.passcode.enable} onChange={(isChecked)=> {this.onEnablePasscode(isChecked)}} />
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  listCurrencies(){
    let arr = [{"code":"BTC","name":"Bitcoin"},{"code":"BCH","name":"Bitcoin Cash"},{"code":"USD","name":"US Dollar"},{"code":"EUR","name":"Eurozone Euro"},{"code":"GBP","name":"Pound Sterling"},{"code":"JPY","name":"Japanese Yen"},{"code":"CAD","name":"Canadian Dollar"},{"code":"AUD","name":"Australian Dollar"},{"code":"CNY","name":"Chinese Yuan"},{"code":"CHF","name":"Swiss Franc"},{"code":"SEK","name":"Swedish Krona"},{"code":"NZD","name":"New Zealand Dollar"},{"code":"KRW","name":"South Korean Won"},{"code":"AED","name":"UAE Dirham"},{"code":"AFN","name":"Afghan Afghani"},{"code":"ALL","name":"Albanian Lek"},{"code":"AMD","name":"Armenian Dram"},{"code":"ANG","name":"Netherlands Antillean Guilder"},{"code":"AOA","name":"Angolan Kwanza"},{"code":"ARS","name":"Argentine Peso"},{"code":"AWG","name":"Aruban Florin"},{"code":"AZN","name":"Azerbaijani Manat"},{"code":"BAM","name":"Bosnia-Herzegovina Convertible Mark"},{"code":"BBD","name":"Barbadian Dollar"},{"code":"BDT","name":"Bangladeshi Taka"},{"code":"BGN","name":"Bulgarian Lev"},{"code":"BHD","name":"Bahraini Dinar"},{"code":"BIF","name":"Burundian Franc"},{"code":"BMD","name":"Bermudan Dollar"},{"code":"BND","name":"Brunei Dollar"},{"code":"BOB","name":"Bolivian Boliviano"},{"code":"BRL","name":"Brazilian Real"},{"code":"BSD","name":"Bahamian Dollar"},{"code":"BTN","name":"Bhutanese Ngultrum"},{"code":"BWP","name":"Botswanan Pula"},{"code":"BZD","name":"Belize Dollar"},{"code":"CDF","name":"Congolese Franc"},{"code":"CLF","name":"Chilean Unit of Account (UF)"},{"code":"CLP","name":"Chilean Peso"},{"code":"COP","name":"Colombian Peso"},{"code":"CRC","name":"Costa Rican Colón"},{"code":"CUP","name":"Cuban Peso"},{"code":"CVE","name":"Cape Verdean Escudo"},{"code":"CZK","name":"Czech Koruna"},{"code":"DJF","name":"Djiboutian Franc"},{"code":"DKK","name":"Danish Krone"},{"code":"DOP","name":"Dominican Peso"},{"code":"DZD","name":"Algerian Dinar"},{"code":"EGP","name":"Egyptian Pound"},{"code":"ETB","name":"Ethiopian Birr"},{"code":"FJD","name":"Fijian Dollar"},{"code":"FKP","name":"Falkland Islands Pound"},{"code":"GEL","name":"Georgian Lari"},{"code":"GHS","name":"Ghanaian Cedi"},{"code":"GIP","name":"Gibraltar Pound"},{"code":"GMD","name":"Gambian Dalasi"},{"code":"GNF","name":"Guinean Franc"},{"code":"GTQ","name":"Guatemalan Quetzal"},{"code":"GYD","name":"Guyanaese Dollar"},{"code":"HKD","name":"Hong Kong Dollar"},{"code":"HNL","name":"Honduran Lempira"},{"code":"HRK","name":"Croatian Kuna"},{"code":"HTG","name":"Haitian Gourde"},{"code":"HUF","name":"Hungarian Forint"},{"code":"IDR","name":"Indonesian Rupiah"},{"code":"ILS","name":"Israeli Shekel"},{"code":"INR","name":"Indian Rupee"},{"code":"IQD","name":"Iraqi Dinar"},{"code":"IRR","name":"Iranian Rial"},{"code":"ISK","name":"Icelandic Króna"},{"code":"JEP","name":"Jersey Pound"},{"code":"JMD","name":"Jamaican Dollar"},{"code":"JOD","name":"Jordanian Dinar"},{"code":"KES","name":"Kenyan Shilling"},{"code":"KGS","name":"Kyrgystani Som"},{"code":"KHR","name":"Cambodian Riel"},{"code":"KMF","name":"Comorian Franc"},{"code":"KPW","name":"North Korean Won"},{"code":"KWD","name":"Kuwaiti Dinar"},{"code":"KYD","name":"Cayman Islands Dollar"},{"code":"KZT","name":"Kazakhstani Tenge"},{"code":"LAK","name":"Laotian Kip"},{"code":"LBP","name":"Lebanese Pound"},{"code":"LKR","name":"Sri Lankan Rupee"},{"code":"LRD","name":"Liberian Dollar"},{"code":"LSL","name":"Lesotho Loti"},{"code":"LYD","name":"Libyan Dinar"},{"code":"MAD","name":"Moroccan Dirham"},{"code":"MDL","name":"Moldovan Leu"},{"code":"MGA","name":"Malagasy Ariary"},{"code":"MKD","name":"Macedonian Denar"},{"code":"MMK","name":"Myanma Kyat"},{"code":"MNT","name":"Mongolian Tugrik"},{"code":"MOP","name":"Macanese Pataca"},{"code":"MRU","name":"Mauritanian Ouguiya"},{"code":"MUR","name":"Mauritian Rupee"},{"code":"MVR","name":"Maldivian Rufiyaa"},{"code":"MWK","name":"Malawian Kwacha"},{"code":"MXN","name":"Mexican Peso"},{"code":"MYR","name":"Malaysian Ringgit"},{"code":"MZN","name":"Mozambican Metical"},{"code":"NAD","name":"Namibian Dollar"},{"code":"NGN","name":"Nigerian Naira"},{"code":"NIO","name":"Nicaraguan Córdoba"},{"code":"NOK","name":"Norwegian Krone"},{"code":"NPR","name":"Nepalese Rupee"},{"code":"OMR","name":"Omani Rial"},{"code":"PAB","name":"Panamanian Balboa"},{"code":"PEN","name":"Peruvian Nuevo Sol"},{"code":"PGK","name":"Papua New Guinean Kina"},{"code":"PHP","name":"Philippine Peso"},{"code":"PKR","name":"Pakistani Rupee"},{"code":"PLN","name":"Polish Zloty"},{"code":"PYG","name":"Paraguayan Guarani"},{"code":"QAR","name":"Qatari Rial"},{"code":"RON","name":"Romanian Leu"},{"code":"RSD","name":"Serbian Dinar"},{"code":"RUB","name":"Russian Ruble"},{"code":"RWF","name":"Rwandan Franc"},{"code":"SAR","name":"Saudi Riyal"},{"code":"SBD","name":"Solomon Islands Dollar"},{"code":"SCR","name":"Seychellois Rupee"},{"code":"SDG","name":"Sudanese Pound"},{"code":"SGD","name":"Singapore Dollar"},{"code":"SHP","name":"Saint Helena Pound"},{"code":"SLL","name":"Sierra Leonean Leone"},{"code":"SOS","name":"Somali Shilling"},{"code":"SRD","name":"Surinamese Dollar"},{"code":"STN","name":"São Tomé and Príncipe Dobra"},{"code":"SVC","name":"Salvadoran Colón"},{"code":"SYP","name":"Syrian Pound"},{"code":"SZL","name":"Swazi Lilangeni"},{"code":"THB","name":"Thai Baht"},{"code":"TJS","name":"Tajikistani Somoni"},{"code":"TMT","name":"Turkmenistani Manat"},{"code":"TND","name":"Tunisian Dinar"},{"code":"TOP","name":"Tongan Paʻanga"},{"code":"TRY","name":"Turkish Lira"},{"code":"TTD","name":"Trinidad and Tobago Dollar"},{"code":"TWD","name":"New Taiwan Dollar"},{"code":"TZS","name":"Tanzanian Shilling"},{"code":"UAH","name":"Ukrainian Hryvnia"},{"code":"UGX","name":"Ugandan Shilling"},{"code":"UYU","name":"Uruguayan Peso"},{"code":"UZS","name":"Uzbekistan Som"},{"code":"VEF","name":"Venezuelan Bolívar Fuerte"},{"code":"VND","name":"Vietnamese Dong"},{"code":"VUV","name":"Vanuatu Vatu"},{"code":"WST","name":"Samoan Tala"},{"code":"XAF","name":"CFA Franc BEAC"},{"code":"XCD","name":"East Caribbean Dollar"},{"code":"XOF","name":"CFA Franc BCEAO"},{"code":"XPF","name":"CFP Franc"},{"code":"YER","name":"Yemeni Rial"},{"code":"ZAR","name":"South African Rand"},{"code":"ZMW","name":"Zambian Kwacha"},{"code":"ZWL","name":"Zimbabwean Dollar"},{"code":"XAG","name":"Silver (troy ounce)"},{"code":"XAU","name":"Gold (troy ounce)"}];
    let currencies = []
    arr.map(e => {
      if(e.code != "BTC" && e.code != "BCH")
        currencies.push({id: e.code, value: `${e.name} (${e.code})`});
    });
    return currencies;
  }

  onCurrenciesSelected = (item) =>{
    const { messages } = this.props.intl;

    let settings = this.state.settings;

    settings.wallet.alternateCurrency = item.id;

    this.setState({settings: settings}, () => {
      this.updateSettings(settings);
    });

    this.setState({listCurrenciesContent: ''}, ()=> {
      this.modalSelectCurrencyRef.close();
    });
    // this.showSuccess(messages.wallet.action.setting.success.save_alternative_currency);
  }

  getCountryName(locale) {
    const hasSupportLanguage = LANGUAGES.find(language => language.code === locale);
    return hasSupportLanguage || LANGUAGES[0];
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode, false);
    this.modalLanguageRef.close();
  }

  onClickPasscode=()=>{
    // case update or set new:
    // if passcode is on enable, show update, else nothing.
    if (this.state.settings.wallet.passcode.enable){
      // ask old passcode first + set new passcode:
      this.props.updatePasscode({
        onSuccess: (md5Passcode) => {
          settings.wallet.passcode = {"enable": true, "value": md5Passcode};
          this.setState({settings: settings}, () => {
            this.updateSettings(settings);
          });
        },
        onCancel: () => {
          this.setState({switchContent: ""}, () => {
            this.setState({switchContent: this.genSwitchContent()});
          });
        }
      });
    }
  }

  updateSettings(settings){
    if(settings){
        local.save(APP.SETTING, settings);
        return true;
    }
    return false;
  }

  onEnablePasscode=(isChecked)=>{

    let settings = this.state.settings;

    // from off => on:
    if (isChecked){
      // if dont set pascode value yet, show new set passcode:
      // if(!this.state.settings.wallet.passcode.value)
      {
        this.props.newPasscode({
          onSuccess: (md5Passcode) => {
            settings.wallet.passcode = {"enable": true, "value": md5Passcode};
            this.setState({settings: settings}, () => {
              this.updateSettings(settings);
            });
          },
          onCancel: () => {
            this.setState({switchContent: ""}, () => {
              this.setState({switchContent: this.genSwitchContent()});
            });
          }

        });
      }
      // else{
      //   // update enable only
      //   settings.wallet.passcode.enable = true;
      //   this.setState({settings: settings}, () => {
      //     this.updateSettings(settings);
      //   });
      // }
    }
    else{
      // from on -> off:
      this.props.requestWalletPasscode({
        onSuccess: () => {
          settings.wallet.passcode.enable = false;
          this.setState({settings: settings}, () => {
            this.updateSettings(settings);
          });
        },
        onCancel: () => {
          this.setState({switchContent: ""}, () => {
            this.setState({switchContent: this.genSwitchContent()});
          });
        }
      });
    }

  }

  onClickCurrency=()=>{
    const { messages } = this.props.intl;
    let settings = this.state.settings;
    this.setState({
      listCurrenciesContent: (<Dropdown customResultCss={{"maxHeight": "none"}}
              placeholder={messages.wallet.action.setting.label.select_alternative_currency}
              defaultId={settings.wallet.alternateCurrency}
              source={this.state.currencies}
              onItemSelected={this.onCurrenciesSelected}
              hasSearch
              isShow={true}
            />)}, ()=>{
              this.modalSelectCurrencyRef.open();
            })
  }



  onClickNotification=(isChecked)=>{
    let settings = this.state.settings;
    settings.wallet.notification = isChecked;
    this.setState({settings: settings}, () => {
      this.updateSettings(settings);
    });
  }

  openVk=()=>{
    window.open('https://vk.com/ninjadotorg', '_blank');
  }
  openTelegram=()=>{
    window.open('https://t.me/ninja_org?ref=ninja-wallet', '_blank');
  }
  openFacebook=()=>{
    window.open('https://www.facebook.com/ninjadotorg/?ref=ninja-wallet', '_blank');
  }
  openTwitter=()=>{
    window.open('https://twitter.com/ninja_org?ref=ninja-wallet', '_blank');
  }

  render() {
    const { messages } = this.props.intl;

    let settings = this.state.settings;

    return (

        <div className="box-setting">

            <Modal title={messages.wallet.action.setting.label.select_alternative_currency} onRef={modal => this.modalSelectCurrencyRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle}>
              <div className="list-currency">
                  {this.state.listCurrenciesContent}
              </div>
            </Modal>


            <div className="item">
                <img className="icon" src={iconLock} />
                <div className="name" onClick={()=> {this.onClickPasscode();}}>
                    <label>{messages.wallet.action.setting.label.passcode}</label>
                </div>
                <div className="value">
                  {this.state.switchContent}
                </div>
            </div>

            <div className="item">
                <img className="icon" src={iconNotifications} />
                <div className="name">
                    <label>{messages.wallet.action.setting.label.push_notifications}</label>
                </div>
                <div className="value">
                  <Switch isChecked={settings.wallet.push_notification} onChange={(isChecked)=> {this.onClickNotification(isChecked)}} />
                </div>
            </div>

            <div className="item" onClick={()=> {this.onClickCurrency();}}>
                <img className="icon" src={iconCurrentcy} />
                <div className="name">
                    <label>{messages.wallet.action.setting.label.alternative_currency}</label>
                </div>
                <div className="value">
                  <span className="text">{settings.wallet.alternateCurrency}</span>
                </div>
            </div>

            <div className="item header">
              <label>{messages.wallet.action.setting.label.wallet_account}</label>
            </div>

            <div className="item" onClick={this.props.onBackupWalletAccountClick}>
                <img className="icon" src={iconBackupWallet} />
                <div className="name">
                    <label>{messages.wallet.action.backup.title}</label>
                </div>
                <div className="value">

                </div>
            </div>
            <div className="item" onClick={this.props.onRestoreWalletAccountClick}>
                <img className="icon" src={iconRestoreWallet} />
                <div className="name">
                    <label>{messages.wallet.action.restore.title}</label>
                </div>
                <div className="value">

                </div>
            </div>



            <div className="item header">
              <label>{messages.wallet.action.setting.label.community}</label>
            </div>

            <div className="item" onClick={()=> {this.openTwitter();}}>
                <img className="icon" src={iconTwitter} />
                <div className="name">
                    <label>Twitter</label>
                </div>
                <div className="value">

                </div>
            </div>
            <div className="item" onClick={()=> {this.openFacebook();}}>
                <img className="icon" src={iconFacebook} />
                <div className="name">
                    <label>Facebook</label>
                </div>
                <div className="value">

                </div>
            </div>
            <div className="item" onClick={()=> {this.openTelegram();}}>
                <img className="icon" src={iconTelegram} />
                <div className="name">
                    <label>Telegram Group</label>
                </div>
                <div className="value">

                </div>
            </div>
            <div className="item" onClick={()=> {this.openVk();}}>
                <img className="icon" src={iconVk} />
                <div className="name">
                    <label>Vkontakte</label>
                </div>
                <div className="value">

                </div>
            </div>


        </div>

    )
  }
}

SettingWallet.propTypes = {
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


export default injectIntl(connect(mapStateToProps, mapDispatch)(SettingWallet));
