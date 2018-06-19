import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import axios from 'axios';

import createForm from '@/components/core/form/createForm';
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField';
import {maxValue, minValue, required} from '@/components/core/form/validation';
import {change, Field, formValueSelector} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createOffer, getOfferPrice} from '@/reducers/exchange/action';
import {
  API_URL,
  CRYPTO_CURRENCY_LIST,
  CRYPTO_CURRENCY_DEFAULT,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  SELL_PRICE_TYPE_DEFAULT,
} from '@/constants';
import '../styles.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
// import {MasterWallet} from '@/models/MasterWallet';
import getSymbolFromCurrency from 'currency-symbol-map';
import {URL} from '@/config';
import {showAlert} from '@/reducers/app/action';
import {MasterWallet} from "@/models/MasterWallet";
import {ExchangeHandshake} from '@/services/neuron';
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import COUNTRIES from '@/data/country-dial-codes.js';

import {CRYPTO_CURRENCY, MIN_AMOUNT} from "@/constants";
import _sample from 'lodash/sample'
import { feedBackgroundColors } from "@/components/handshakes/exchange/config";
import {formatAmountCurrency, formatMoney} from "@/services/offer-util";
import {BigNumber} from "bignumber.js";
import { showLoading, hideLoading } from '@/reducers/app/action';
const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: { type: EXCHANGE_ACTION_DEFAULT, currency: CRYPTO_CURRENCY_DEFAULT, sellPriceType: SELL_PRICE_TYPE_DEFAULT, customizePrice: 0 },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

import iconLock from '@/assets/images/icon/lock.png';
import iconUnlock from '@/assets/images/icon/unlock.png';

const textColor = '#ffffff'
const btnBg = 'rgba(29,29,38,0.30)'
const validateFee = [
  minValue(-50),
  maxValue(50),
]
const minValue01 = minValue(0.1)
const minValue001 = minValue(0.01)

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      type: 'buy',
      lat: 0,
      lng: 0
    };
    // this.mainColor = _sample(feedBackgroundColors)
    this.mainColor = '#1F2B34'
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({lat: lat, lng: lng});
    const { rfChange } = this.props;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });
  }

async componentDidMount() {
  const { ipInfo, rfChange, authProfile } = this.props;
  navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location
      this.setAddressFromLatLng(latitude, longitude) // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo.latitude, ipInfo.longitude) // fallback
    });

    // auto fill phone number from user profile
    let detectedCountryCode = ''
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo.country.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || `${detectedCountryCode}-`)

    this.getCryptoPriceByAmount(0);
    this.intervalCountdown = setInterval(() => {
      const { amount } = this.props;
      this.getCryptoPriceByAmount(amount);
    }, 5 * 60000);

    // const ipInfo = await axios.get(`https://ipfind.co/me`, {
    //   params: {
    //     auth: 'a59f33e5-0879-411a-908b-792359a0d6cc',
    //   },
    // });

    // this.setState({ ipInfo: ipInfo.data });
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  getCryptoPriceByAmount = (amount) => {
    const { type, currency } = this.state;
    const {ipInfo: {currency: fiat_currency}} = this.props;

    let data = {
      amount,
      currency: currency,
      type,
      fiat_currency,
    };

    this.props.getOfferPrice({
      PATH_URL: API_URL.EXCHANGE.GET_OFFER_PRICE,
      qs: data,
    });
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    console.log('onAmountChange', amount);
    // this.getCryptoPriceByAmount(amount);
    // this.setState({amount: amount}, () => {
    //   this.getCryptoPriceByAmountThrottled(amount);
    // });
  }

  onTypeChange = (e, newValue) => {
    const { amount } = this.props;

    this.setState({ type: newValue }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  onSellPriceTypeChange = (e, newValue) => {
    const { amount } = this.props;
    // this.setState({currency: newValue}, () => {
    this.getCryptoPriceByAmount(amount);
    // });
  }

  onCurrencyChange = (e, newValue) => {
    // console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    const { amount } = this.props;
    this.setState({ currency: newValue }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  handleSubmit = async (values) => {
    const { intl, totalAmount, price } = this.props;
    // const fiat_currency = this.state.ipInfo.currency;
    const {ipInfo: {currency: fiat_currency}, authProfile} = this.props;
    // console.log('valuessss', values);

    const wallet = MasterWallet.getWalletDefault(values.currency);
    const balance = new BigNumber(await wallet.getBalance());
    const fee = new BigNumber(await wallet.getFee(10, true));
    let amount = new BigNumber(values.amount);

    if (values.currency === CRYPTO_CURRENCY.ETH && values.type === EXCHANGE_ACTION.BUY) {
      amount = new BigNumber(0);
    }

    let condition = balance.isLessThan(amount.plus(fee));

    if ((values.currency === CRYPTO_CURRENCY.ETH || (values.type === EXCHANGE_ACTION.SELL && values.currency === CRYPTO_CURRENCY.BTC))
      && condition) {
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: values.currency,
          })}
          </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });

      return;
    }

    const address = wallet.address;

    const rewardWallet = MasterWallet.getRewardWalletDefault(values.currency);
    const reward_address = rewardWallet.address;

    let phones = values.phone.trim().split('-');

    let phone = '';
    if (phones.length > 1) {
      phone = phones[1].length > 0 ? values.phone : '';
    }

    const offer = {
      amount: values.amount,
      price: price,
      percentage: values.customizePrice.toString(),
      currency: values.currency,
      type: values.type,
      contact_info: values.address,
      contact_phone: phone,
      fiat_currency: fiat_currency,
      latitude: this.state.lat,
      longitude: this.state.lng,
      email: authProfile.email || '',
      username: authProfile.username || '',
    };

    if (values.type === EXCHANGE_ACTION.BUY) {
      offer.user_address = address;
    } else {
      offer.refund_address = address;
    }

    offer.reward_address = reward_address;

    console.log('handleSubmit', offer);
    const message = intl.formatMessage({ id: 'createOfferConfirm' }, {
      type: EXCHANGE_ACTION_NAME[values.type],
      amount: formatAmountCurrency(values.amount),
      currency: values.currency,
      currency_symbol: fiat_currency,
      total: formatMoney(totalAmount),
    });

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.createOffer(offer)}>Confirm</Button>
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}>Not now</Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);
    const { currency } = this.props;

    // if (currency === 'BTC') {
    this.showLoading();
      this.props.createOffer({
        PATH_URL: API_URL.EXCHANGE.OFFERS,
        data: offer,
        METHOD: 'POST',
        successFn: this.handleCreateOfferSuccess,
        errorFn: this.handleCreateOfferFailed,
      });
    // } else {
    //
    // }
  }

  handleCreateOfferSuccess = async (responseData) => {
    // const { currency } = this.props;
    const data = responseData.data;

    const currency = data.currency;

    // this.props.history.push(URL.HANDSHAKE_ME);
    console.log('handleCreateOfferSuccess', data);

    const wallet = MasterWallet.getWalletDefault(currency);
    const rewardWallet = MasterWallet.getRewardWalletDefault(currency);

    console.log('data', data);
    console.log('wallet', wallet);

    if (currency === CRYPTO_CURRENCY.BTC) {
      wallet.transfer(data.system_address, data.amount, 10).then(success => {
        console.log('transfer', success);
      });
    } else if (currency === CRYPTO_CURRENCY.ETH) {
      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = null;
      if (data.type === EXCHANGE_ACTION.BUY) {
        result = await exchangeHandshake.initByCashOwner(wallet.address, rewardWallet.address, data.amount, data.id);
      } else {
        result = await exchangeHandshake.initByCoinOwner(wallet.address, rewardWallet.address, data.amount, data.id);
      }

      console.log('handleCreateOfferSuccess', result);
    }
    // this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {
    //   alert(success);
    //   this.modalSendRef.close();
    // });

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="createOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(URL.HANDSHAKE_ME);
      }
    });

    // this.timeoutClosePopup = setTimeout(() => {
    //   this.handleBuySuccess();
    // }, 3000);
    //
    // console.log('handleCreateCCOrderSuccess', data);
    // this.setState({
    //   modalContent:
    //   (
    //     <div className="py-2">
    //       <Feed className="feed p-2" background="#259B24">
    //         <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
    //           <div>Create offer success</div>
    //         </div>
    //       </Feed>
    //       <Button block className="btn btn-secondary mt-2" onClick={this.handleBuySuccess}>Dismiss</Button>
    //     </div>
    //   ),
    // }, () => {
    //   this.modalRef.open();
    // });
  }

  // handleBuySuccess = () => {
  //   if (this.timeoutClosePopup) {
  //     clearTimeout(this.timeoutClosePopup);
  //   }
  //   this.modalRef.close();
  //   this.props.history.push(URL.HANDSHAKE_ME);
  // }

  handleCreateOfferFailed = (e) => {
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{e.response?.data?.message}</div>,
      timeOut: 3000,
      type: 'danger',
    });
    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    // this.setState({
    //   modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
    //             <div>Create offer failed</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleBuyFailed}>Dismiss</Button>
    //       </div>
    //     ),
    // }, () => {
    //   this.modalRef.open();
    // });
  }

  // handleBuyFailed = () => {
  //   this.modalRef.close();
  // }

  render() {
    const { totalAmount, type, sellPriceType, offerPrice, currency, ipInfo } = this.props;
    const modalContent = this.state.modalContent;

    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed my-2 p-0" background={this.mainColor}>
            <div style={{ color: 'white', padding: '20px' }}>
              <div className="d-flex mb-4">
                <label className="col-form-label mr-auto" style={{ width: '190px', fontWeight: 'bold'  }}>I want to</label>
                <div className='input-group'>
                  <Field
                    name="type"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    list={EXCHANGE_ACTION_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onTypeChange}
                  />
                </div>
              </div>
              <div className="d-flex">
                <label className="col-form-label mr-auto label-create" style={{ width: '190px' }}>Coin</label>
                <div className='input-group'>
                  <Field
                    name="currency"
                    component={fieldRadioButton}
                    list={CRYPTO_CURRENCY_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onCurrencyChange}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Amount*</label>
                <div className="w-100">
                  <Field
                    name="amount"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Price/{currency}</label>
                <span className="w-100 col-form-label">{ formatMoney(offerPrice ? offerPrice.price : 0) } {ipInfo.currency}</span>
              </div>

              <div className="d-flex mt-2">
                {/*<label className="col-form-label mr-auto" style={{ width: '220px' }} />*/}
                <div className='input-group justify-content-start'>
                  <Field
                    name="sellPriceType"
                    component={fieldRadioButton}
                    list={[
                      { value: 'fix', text: 'Lock this price', icon: <img src={iconLock} width={20} /> },
                      { value: 'flexible', text: `${EXCHANGE_ACTION_NAME[type]} at market price`, icon: <img src={iconUnlock} width={20} /> },
                    ]}
                    styleButton={{
                      fontSize: '12px'
                    }}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onSellPriceTypeChange}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Your percentage</label>
                <div className='input-group align-items-center'>
                  <Field
                    name="customizePrice"
                    // className='form-control-custom form-control-custom-ex w-100'
                    component={fieldNumericInput}
                    btnBg={btnBg}
                    suffix={'%'}
                    color={textColor}
                    validate={validateFee}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Total</label>
                <span className="w-100 col-form-label">{ formatMoney(totalAmount) } {ipInfo.currency}</span>
              </div>
              <hr className="hrLine" />
              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Phone</label>
                <div className="input-group w-100">
                  <Field
                    name="phone"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldPhoneInput}
                    type="tel"
                    placeholder="4995926433"
                    // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create" style={{ width: '220px' }}>Address*</label>
                <div className="w-100">
                  <Field
                    name="address"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    validate={[required]}
                    placeholder="81 E. Augusta Ave. Salinas"
                  />
                </div>
              </div>
            </div>
          </Feed>
          <Button block type="submit">Initiate</Button>
        </FormExchangeCreate>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const type = selectorFormExchangeCreate(state, 'type');
  const currency = selectorFormExchangeCreate(state, 'currency');
  const sellPriceType = selectorFormExchangeCreate(state, 'sellPriceType');
  const amount = selectorFormExchangeCreate(state, 'amount') || 0;
  const customizePrice = selectorFormExchangeCreate(state, 'customizePrice') || 0;

  const offerPrice = state.exchange.offerPrice;
  let totalAmount =  amount * (offerPrice && offerPrice.price || 0) || 0;
  totalAmount += totalAmount * customizePrice / 100;

  const price = offerPrice && offerPrice.price || 0;

  return { amount, currency, totalAmount, type, sellPriceType, price,
    offerPrice: offerPrice,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile
  };
};

// this.props.showAlert({
//   message: <p className="text-center">aaaaaaaa</p>,
//   timeOut: 10000000,
//   type: 'danger',
// });

const mapDispatchToProps = (dispatch) => ({
  createOffer: bindActionCreators(createOffer, dispatch),
  getOfferPrice: bindActionCreators(getOfferPrice, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
