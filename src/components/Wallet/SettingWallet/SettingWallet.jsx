import axios from 'axios';
import React from 'react';
import {injectIntl} from 'react-intl';
import {Field, formValueSelector, clearFields} from "redux-form";
import {connect} from "react-redux";
import createForm from '@/components/core/form/createForm'
import { change } from 'redux-form'
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import PropTypes from 'prop-types';
import local from '@/services/localStore';
import { APP } from '@/constants';

import './SettingWallet.scss';
import Dropdown from '@/components/core/controls/Dropdown';

import bgBox from '@/assets/images/pages/wallet/bg-box-wallet-coin.svg';

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormAddToken = 'addToken';
const SettingForm = createForm({ propsReduxForm: { form: nameFormAddToken, enableReinitialize: true, clearSubmitErrors: true}});

// suggesion:
import listToken from '@/data/ethToken.json';

class SettingWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
      active: props.active,
      alternateCurrency: '',
      cryptoAddress: -1
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

  componentDidUpdate (){
    const active = this.props.active;
    if(active) {
      let setting = local.get(APP.SETTING);

      //alternateCurrency
      let currencies = this.state.currencies;
      if(!currencies || currencies.length < 1){
        this.listCurrencies().then(result => {
          this.setState({currencies: result});

          if(setting && setting.wallet && setting.wallet.alternateCurrency)
            this.setState({alternateCurrency: setting.wallet.alternateCurrency});
        });
      }

      //cryptoAddress
      if(this.state.cryptoAddress < 0){
        let cryptoAddress = !setting || !setting.wallet || !setting.wallet.cryptoAddress ? 1 : setting.wallet.cryptoAddress;
        this.setState({cryptoAddress: cryptoAddress});
      }
    }
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  async listCurrencies(){
    this.showLoading();
    try{
      const response = await axios.get("https://bitpay.com/api/rates/btc");
      if (response.status == 200 && response.data) {
        let currencies = [];
        response.data.map(e => {
          if(e.code != "BTC" && e.code != "BCH")
            currencies.push({id: e.code, value: `${e.name} (${e.code})`});
        });
        this.hideLoading();
        return currencies;
      }
    }
    catch (error) {
      return [];
    }
  }

  onFinish = () => {
    const { onFinish } = this.props;

    if (onFinish) {
      onFinish({"data": this.state.tokenType});
    } else {

    }
  }

  listCryptoAddress = () => {
    const { messages } = this.props.intl;

    return [
      { id: 1, value: messages.wallet.action.setting.label.short_address },
      { id: 2, value: messages.wallet.action.setting.label.shortest_address },
      { id: 3, value: messages.wallet.action.setting.label.hide_address }
    ];
  }

  onCurrenciesSelected = (item) =>{
    const { messages } = this.props.intl;

    let setting = local.get(APP.SETTING);
    if(!setting)
      setting = {};

    if(!setting.wallet)
      setting.wallet = {};

    setting.wallet.alternateCurrency = item.id;
    local.save(APP.SETTING, setting);
    this.showSuccess(messages.wallet.action.setting.success.save_alternative_currency);
  }

  onAddressSelected = (item) =>{
    const { messages } = this.props.intl;

    let setting = local.get(APP.SETTING);
    if(!setting)
      setting = {};

    if(!setting.wallet)
      setting.wallet = {};

    setting.wallet.cryptoAddress = item.id;
    local.save(APP.SETTING, setting);
    this.showSuccess(messages.wallet.action.setting.success.save_crypto_address);
  }

  render() {
    const { messages } = this.props.intl;

    return (
      <div>
        <SettingForm className="settingwallet-wrapper" onSubmit={this.saveSetting}>

          <div className="bgBox">

            <div className ="dropdown-wallet-tranfer">
              <p className="labelText">{messages.wallet.action.setting.label.alternative_currency}</p>
              <Dropdown
                placeholder={messages.wallet.action.setting.label.select_alternative_currency}
                defaultId={this.state.alternateCurrency}
                source={this.state.currencies}
                onItemSelected={this.onCurrenciesSelected}
                hasSearch
              />
            </div>

            <div className ="dropdown-setting">
              <p className="labelText">{messages.wallet.action.setting.label.crypto_address}</p>
              <Dropdown
                placeholder={messages.wallet.action.setting.label.select_crypto_address}
                defaultId={this.state.cryptoAddress}
                source={this.listCryptoAddress()}
                onItemSelected={this.onAddressSelected}
              />
            </div>
          </div>
        </SettingForm>
      </div>
    )
  }
}

SettingWallet.propTypes = {
  active: PropTypes.bool
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SettingWallet));
