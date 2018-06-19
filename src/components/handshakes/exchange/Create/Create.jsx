import React from "react";
import {injectIntl} from "react-intl";
import Feed from "@/components/core/presentation/Feed";
import Button from "@/components/core/controls/Button";
import './styles.scss'
import createForm from "@/components/core/form/createForm";
import {getOfferPrice} from "@/services/offer-util";
import axios from 'axios';
import {FormattedMessage} from 'react-intl';
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from "@/components/core/form/customField";
import {maxValue, minValue, required} from "@/components/core/form/validation";
import {change, Field, formValueSelector, clearFields} from "redux-form";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  MIN_AMOUNT,
  SELL_PRICE_TYPE_DEFAULT,
  CRYPTO_CURRENCY_NAME,
} from "@/constants";

import { validate } from './validation';
import "../styles.scss";
import ModalDialog from "@/components/core/controls/ModalDialog/ModalDialog";
// import {MasterWallet} from '@/models/MasterWallet';
import {URL} from "@/constants";
import {hideLoading, showAlert, showLoading} from "@/reducers/app/action";
import {MasterWallet} from "@/models/MasterWallet";
import {ExchangeShopHandshake} from "@/services/neuron";
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import COUNTRIES from "@/data/country-dial-codes.js";
import {feedBackgroundColors} from "@/components/handshakes/exchange/config";
import {formatAmountCurrency, formatMoney} from "@/services/offer-util";
import {createOfferStores,} from "@/reducers/exchange/action";
import {BigNumber} from "bignumber.js/bignumber";
import { authUpdate } from '@/reducers/auth/action';
import OfferShop from "@/models/OfferShop";
import CoinOffer from "@/models/CoinOffer";
import { addOfferItem, } from "@/reducers/exchange/action";
import {getOfferStores} from "@/reducers/exchange/action";
import { getErrorMessageFromCode } from "../utils";


import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';

const nameFormExchangeCreate = "exchangeCreate";
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      currency: CRYPTO_CURRENCY_DEFAULT,
      customizePriceBuy: -0.25,
      customizePriceSell: 0.25,
    }
    // initialValues: {
    //   currency: CRYPTO_CURRENCY_DEFAULT,
    //   customizePriceBuy: 0.25,
    //   customizePriceSell: -0.25,
    //   amountBuy: 0.1,
    //   amountSell: 0.2,
    //   nameShop: 'Apple store',
    //   phone: '1234567',
    //   address: '139 Hong Ha',
    // }
  }
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = "#000000";
const btnBg = "rgba(29,29,38,0.30)";
const validateFee = [
  minValue(-50),
  maxValue(50)
];

class Component extends React.Component {
  CRYPTO_CURRENCY_LIST = [
    { value: CRYPTO_CURRENCY.ETH, text: <div className="currency-selector"><img src={iconEth}/> <span>{CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH]}</span></div>, hide: false },
    { value: CRYPTO_CURRENCY.BTC, text: <div className="currency-selector"><img src={iconBtc}/> <span>{CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span></div>, hide: false },
  ];

  constructor(props) {
    super(props);

    this.state = {
      modalContent: "",
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
    };
    // this.mainColor = _sample(feedBackgroundColors)
    this.mainColor = "#1F2B34";
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({lat: lat, lng: lng});
    const { rfChange } = this.props;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });
  }

  componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location
      this.setAddressFromLatLng(latitude, longitude) // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude) // fallback
    });

    // auto fill phone number from user profile
    let detectedCountryCode = '';
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo?.country.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || `${detectedCountryCode}-`);
    rfChange(nameFormExchangeCreate, 'nameShop', authProfile.name || '');
    rfChange(nameFormExchangeCreate, 'address', authProfile.address || '');

    this.props.getOfferStores({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${authProfile.id}`,

    });
  }

  componentWillReceiveProps(nextProps){
    const { intl, rfChange } = this.props;
    console.log('componentWillReceiveProps',nextProps);
    if (nextProps.offerStores && nextProps.offerStores !== this.props.offerStores) {
      console.log('componentWillReceiveProps inside', nextProps.offerStores);
      this.offer = nextProps.offerStores;

      let haveOfferETH = this.offer.itemFlags.ETH || false;
      let haveOfferBTC = this.offer.itemFlags.BTC || false;

      this.CRYPTO_CURRENCY_LIST = [
        { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], hide: haveOfferETH },
        { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], hide: haveOfferBTC },
      ];

      if (!haveOfferETH) {
        rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY.ETH);
      } else if (!haveOfferBTC) {
        rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY.BTC);
      }

      if (haveOfferETH && haveOfferBTC) {
        const message = intl.formatMessage({ id: 'offerStoresAlreadyCreated' }, {
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
                <Button block className="btn btn-secondary" onClick={this.handleOfferStoreAlreadyCreated}>OK</Button>
              </div>
            ),
        }, () => {
          this.modalRef.open();
        });
      }
    }
  }

  handleOfferStoreAlreadyCreated = () => {
    this.props.history.push(URL.HANDSHAKE_ME);
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      }
    });
  }

  onCurrencyChange = (e, newValue) => {
    console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    // const { amount } = this.props;
    // this.setState({ currency: newValue }, () => {
    //   this.getCryptoPriceByAmount(amount);
    // });
  }

  showNotEnoughCoinAlert = (balance, amountBuy, amountSell, fee, currency) => {
    console.log('showNotEnoughCoinAlert', balance, amountBuy, amountSell, fee, currency);
    const bnBalance = new BigNumber(balance);
    const bnAmountBuy = new BigNumber(0);
    const bnAmountSell = new BigNumber(amountSell);
    const bnFeeBuy = new BigNumber(0);
    const bnFeeSell = new BigNumber(fee);

    const conditionBuy = bnBalance.isLessThan(bnAmountBuy.plus(bnFeeBuy));
    const conditionSell = bnBalance.isLessThan(bnAmountSell.plus(bnFeeSell));

    if (conditionBuy || conditionSell) {
      const { intl } = this.props;
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWalletStores' }, {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: currency,
          })}
        </div>,
        timeOut: 5000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

    return conditionBuy || conditionSell;
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { intl } = this.props;
    let result = true;

    if (process.env.isLive) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = intl.formatMessage({id: 'requireDefaultWalletOnMainNet'}, {});
        this.showAlert(message);
        result = false;
      }
    }

    return result;
  }

  resetFormValue = () => {
    const { rfChange, clearFields } = this.props;
    rfChange(nameFormExchangeCreate, 'customizePriceBuy', -0.25);
    rfChange(nameFormExchangeCreate, 'customizePriceSell', 0.25);
    clearFields(nameFormExchangeCreate, false, false, 'amountBuy', 'amountSell');
  }

  handleSubmit = async (values) => {
    const { intl, authProfile, ipInfo } = this.props;
    const { lat, lng } = this.state;
    console.log('handleSubmit', values);
    const {
      currency, amountBuy, amountSell, customizePriceBuy,
      customizePriceSell, nameShop, phone, address,
    } = values;

    const wallet = MasterWallet.getWalletDefault(currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(10, true);

    const condition = this.showNotEnoughCoinAlert(balance, amountBuy, amountSell, fee, currency);

    if (condition) {
      return;
    }

    // const rewardWallet = MasterWallet.getRewardWalletDefault(currency);

    const phones = phone.trim().split('-');
    const phoneNew = phones.length > 1 && phones[1].length > 0 ? phone : '';

    const data = {
      currency: currency,
      sell_amount: amountSell && amountSell.toString() || "0",
      sell_percentage: customizePriceSell.toString(),
      buy_amount: amountBuy && amountBuy.toString() || "0",
      buy_percentage: customizePriceBuy.toString(),
      user_address: wallet.address,
      // reward_address: rewardWallet.address,
    };

    const offer = {
      email: authProfile?.email || '',
      username: authProfile?.username,
      contact_phone: phoneNew,
      contact_info: address,
      latitude: lat,
      longitude: lng,
      fiat_currency: ipInfo.currency,
      chat_username: authProfile?.username,
    };

    const offerStore = {
      offer: offer,
      item: data,
    }

    const message = intl.formatMessage({ id: 'createOfferStoreConfirm' }, {
      currency: currency,
      amountBuy: amountBuy,
      amountSell: amountSell,
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
            {
              this.offer ? (
                <Button className="mt-2" block onClick={() => this.addOfferItem(data)}>Confirm</Button>
              ) : (
                <Button className="mt-2" block onClick={() => this.createOffer(offerStore)}>Confirm</Button>
              )
            }
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

  ////////////////////////

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.showLoading();
    this.props.createOfferStores({
      PATH_URL: API_URL.EXCHANGE.OFFER_STORES,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  ////////////////////////

  addOfferItem = (offerItem) => {
    this.modalRef.close();
    console.log('addOfferItem', offerItem, this.offer);
    const { offer } = this;

    this.showLoading();
    this.props.addOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      METHOD: 'POST',
      data: offerItem,
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  ////////////////////////

  handleCreateOfferSuccess = async (responseData) => {
    console.log('handleCreateOfferSuccess', responseData);
    const { intl, rfChange, currency, amountSell } = this.props;
    const data = responseData.data;
    const offer = OfferShop.offerShop(data);
    this.offer = offer;

    // console.log('handleCreateOfferSuccess', data);

    const wallet = MasterWallet.getWalletDefault(currency);
    // const rewardWallet = MasterWallet.getRewardWalletDefault(currency);

    // console.log('wallet', wallet);
    // console.log('rewardWallet', rewardWallet);

    if (currency === CRYPTO_CURRENCY.BTC) {
      console.log('transfer BTC', offer.items.BTC.systemAddress, amountSell);
      if (amountSell > 0) {
        wallet.transfer(offer.items.BTC.systemAddress, amountSell, 10).then(success => {
          console.log('transfer', success);
        });
      }
    } else if (currency === CRYPTO_CURRENCY.ETH) {
      if (amountSell > 0) {
        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

        let result = null;
        result = await exchangeHandshake.initByShopOwner(amountSell, offer.id);
        console.log('handleCreateOfferSuccess', result);
      }
    }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'createOfferSuccessMessage' }, {
    });
    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {

      }
    });

    this.resetFormValue();

    let haveOfferETH = offer.itemFlags.ETH;
    let haveOfferBTC = offer.itemFlags.BTC;

    this.CRYPTO_CURRENCY_LIST = [
      { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], hide: haveOfferETH },
      { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], hide: haveOfferBTC },
    ];

    if (haveOfferETH && haveOfferBTC) {
      this.props.history.push(URL.HANDSHAKE_ME);
    }

    if (currency === CRYPTO_CURRENCY.ETH) {
      rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY.BTC);
    } else {
      rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY.ETH);
    }

    if (!haveOfferETH || !haveOfferBTC) {
      this.updateUserProfile(offer);
    }
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  ////////////////////////

  updateUserProfile = (offerShop) => {
    console.log('updateUserProfile offerShop',offerShop);
    const params = new URLSearchParams();
    params.append('name', offerShop.username);
    params.append('address', offerShop.contactInfo);
    this.props.authUpdate({
      PATH_URL: 'user/profile',
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      METHOD: 'POST',
      successFn: () => {
        // this.setState({ haveProfile: true });
      },
      errorFn: () => {
        // this.setState({ haveProfile: false });
      },
    });
  }

  ///////////////////////

  handleValidate = (values) => {
    return validate(values);
  }

  render() {
    const { currency, listOfferPrice, ipInfo: { currency: fiatCurrency }, customizePriceBuy, customizePriceSell, amountBuy, amountSell, intl } = this.props;
    const modalContent = this.state.modalContent;
    const haveProfile = this.offer ? true : false;
    const allowInitiate = this.offer ? (!this.offer.itemFlags.ETH || !this.offer.itemFlags.BTC) : true;

    const { price } = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, currency);
    const priceDisplayed = formatMoney(price)
    const estimatedPriceBuy = formatMoney(price * (1 + parseFloat(customizePriceBuy, 10)/100))
    const estimatedPriceSell = formatMoney(price * (1 + parseFloat(customizePriceSell, 10)/100))

    const wantToBuy = amountBuy && amountBuy > 0
    const wantToSell = amountSell && amountSell > 0

    return (
      <div className="create-exchange">
        <FormExchangeCreate onSubmit={this.handleSubmit} validate={this.handleValidate}>
          <div className="d-flex mt-3">
            <div className='input-group'>
              <Field
                name="currency"
                // containerClass="radio-container-old"
                component={fieldRadioButton}
                type="tab-3"
                list={this.CRYPTO_CURRENCY_LIST}
                validate={[required]}
                onChange={this.onCurrencyChange}
              />
            </div>
          </div>

          <div className="label"><FormattedMessage id="ex.create.label.exchangeRate"/></div>
          <div className="section">
            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.amountBuy"/></span></label>
              <div className='input-group'>
                <Field
                  name="amountBuy"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={MIN_AMOUNT[currency]}
                  // onChange={this.onAmountChange}
                  // validate={[requiredOneOfAmounts, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                />
              </div>
            </div>

            <hr className="hrLine"/>

            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.amountSell"/></span></label>
              <div className='input-group'>
                <Field
                  name="amountSell"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={MIN_AMOUNT[currency]}
                  // onChange={this.onAmountChange}
                  // validate={[requiredOneOfAmounts, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                />
              </div>
            </div>

            <hr className="hrLine"/>

            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.marketPrice"/></span></label>
              <div className='input-group'>
                <div><span className="form-text">{priceDisplayed} {fiatCurrency}</span></div>
              </div>
            </div>

            <hr className="hrLine"/>

            <div className="d-flex py-1">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.premiumBuy"/></span></label>
              <div className='input-group align-items-center'>
                <Field
                  name="customizePriceBuy"
                  // className='form-control-custom form-control-custom-ex w-100'
                  component={fieldNumericInput}
                  btnBg={btnBg}
                  suffix={"%"}
                  color={textColor}
                  validate={validateFee}
                />
                { wantToBuy && <span className="w-100 estimate-price buy">&asymp; {estimatedPriceBuy} {fiatCurrency}</span> }
              </div>
            </div>

            <hr className="hrLine"/>

            <div className="d-flex py-1">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.amountSell"/></span></label>
              <div className='input-group align-items-center'>
                <Field
                  name="customizePriceSell"
                  // className='form-control-custom form-control-custom-ex w-100'
                  component={fieldNumericInput}
                  btnBg={btnBg}
                  suffix={"%"}
                  color={textColor}
                  validate={validateFee}
                />
                { wantToSell && <span className="w-100 estimate-price sell">&asymp; {estimatedPriceSell} {fiatCurrency}</span> }
              </div>
            </div>

            {
              (wantToBuy || wantToSell) && (
                <div className="tooltip-price mt-2">
                  { wantToBuy && <span>Your buying price {estimatedPriceBuy} {fiatCurrency}. </span> }
                  { wantToSell && <span>Your selling price {estimatedPriceSell} {fiatCurrency}. </span> }
                  { (wantToBuy && wantToSell) ? 'These' : 'This'} may fluctuate according to the price of {currency}
                </div>
              )
            }
          </div>

          {
            !haveProfile && (
              <div>
                <div className="label">Station information</div>
                <div className="section">
                  {/*
                  <div className="d-flex">
                    <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.nameStation"/></span></label>
                    <div className='input-group'>
                      <Field
                        name="nameShop"
                        className="form-control-custom form-control-custom-ex w-100 input-no-border"
                        component={fieldInput}
                        placeholder={'Apple store'}
                        // onChange={this.onAmountChange}
                        // validate={[required]}
                      />
                    </div>
                  </div>
                  <hr className="hrLine"/>*/}

                  <div className="d-flex mt-2">
                    <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.phone"/></span></label>
                    <div className="input-group w-100">
                      <Field
                        name="phone"
                        className="form-control-custom form-control-custom-ex w-100 input-no-border"
                        component={fieldPhoneInput}
                        color={textColor}
                        type="tel"
                        placeholder="4995926433"
                        // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                      />
                    </div>
                  </div>
                  <hr className="hrLine"/>

                  <div className="d-flex mt-2">
                    <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.address"/></span></label>
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
              </div>
            )
          }
          <Button block type="submit" disabled={!allowInitiate} className="mt-3"><FormattedMessage id="btn.initiate"/></Button>
        </FormExchangeCreate>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currency = selectorFormExchangeCreate(state, "currency");

  const amountBuy = selectorFormExchangeCreate(state, "amountBuy");
  const amountSell = selectorFormExchangeCreate(state, "amountSell");

  const customizePriceBuy = selectorFormExchangeCreate(state, "customizePriceBuy") || 0;
  const customizePriceSell = selectorFormExchangeCreate(state, "customizePriceSell") || 0;

  const nameShop = selectorFormExchangeCreate(state, "nameShop");
  const phone = selectorFormExchangeCreate(state, "phone");
  const address = selectorFormExchangeCreate(state, "address");

  return {
    currency, amountBuy, amountSell,
    customizePriceBuy, customizePriceSell,
    nameShop, phone, address,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
    offerStores: state.exchange.offerStores,
    listOfferPrice: state.exchange.listOfferPrice
  };
};

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOfferStores: bindActionCreators(createOfferStores, dispatch),
  addOfferItem: bindActionCreators(addOfferItem, dispatch),
  getOfferStores: bindActionCreators(getOfferStores, dispatch),
});
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
