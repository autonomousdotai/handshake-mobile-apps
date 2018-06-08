import React from "react";
import {injectIntl} from "react-intl";
import Feed from "@/components/core/presentation/Feed";
import Button from "@/components/core/controls/Button";

import createForm from "@/components/core/form/createForm";
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from "@/components/core/form/customField";
import {maxValue, minValue, required} from "@/components/core/form/validation";
import {change, Field, formValueSelector} from "redux-form";
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

const nameFormExchangeCreate = "exchangeCreate";
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      currency: CRYPTO_CURRENCY_DEFAULT,
      customizePriceBuy: 0,
      customizePriceSell: 0,
    }
  }
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = "#ffffff";
const btnBg = "rgba(29,29,38,0.30)";
const validateFee = [
  minValue(-50),
  maxValue(50)
];
const minValue01 = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.ETH]);
const minValue001 = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.BTC]);

class Component extends React.Component {
  CRYPTO_CURRENCY_LIST = [
    { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], hide: false },
    { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], hide: false },
  ];

  constructor(props) {
    super(props);

    this.state = {
      modalContent: "",
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
      haveProfile: false,
      haveOfferETH: false,
      haveOfferBTC: false,
    };
    // this.mainColor = _sample(feedBackgroundColors)
    this.mainColor = "#1F2B34";
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({lat: lat, lng: lng});
    const { rfChange } = this.props;
    /*axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreate, 'address', address);
    });*/
  }

  componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location
      this.setAddressFromLatLng(latitude, longitude) // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo.latitude, ipInfo.longitude) // fallback
    });

    // auto fill phone number from user profile
    let detectedCountryCode = ''
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo.country_code.toUpperCase())
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode
    }
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || `${detectedCountryCode}-`);
    rfChange(nameFormExchangeCreate, 'nameShop', authProfile.name || '');
    rfChange(nameFormExchangeCreate, 'address', authProfile.address || '');
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
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
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

    return conditionBuy || conditionSell;
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
    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(4, true);

    const condition = this.showNotEnoughCoinAlert(balance, amountBuy, amountSell, fee, currency);

    if (condition) {
      return;
    }

    const rewardWallet = MasterWallet.getRewardWalletDefault(currency);

    const phones = phone.trim().split('-');
    const phoneNew = phones.length > 1 && phones[1].length > 0 ? phone : '';

    const data = {
      currency: currency,
      sell_amount: amountSell,
      sell_percentage: customizePriceSell.toString(),
      buy_amount: amountBuy,
      buy_percentage: customizePriceBuy.toString(),
      user_address: wallet.address,
      reward_address: rewardWallet.address,
    };
    const offer = {
      email: authProfile?.email || '',
      username: nameShop,
      contact_phone: phoneNew,
      contact_info: address,
      latitude: lat,
      longitude: lng,
      fiat_currency: ipInfo.currency,
    };

    const offerStore = {
      offer: offer,
      [currency.toLowerCase()]: data,
      btc: data,
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
            <Button className="mt-2" block onClick={() => this.createOffer(offerStore)}>Confirm</Button>
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

    this.showLoading();
    this.props.createOfferStores({
      PATH_URL: API_URL.EXCHANGE.OFFER_STORES,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  handleCreateOfferSuccess = async (responseData) => {
    console.log('handleCreateOfferSuccess', responseData);
    const { currency, amountSell } = this.props;
    const data = responseData.data;

    console.log('handleCreateOfferSuccess', data);

    const wallet = MasterWallet.getWalletDefault(currency);
    const rewardWallet = MasterWallet.getRewardWalletDefault(currency);

    console.log('wallet', wallet);
    console.log('rewardWallet', rewardWallet);

    if (currency === CRYPTO_CURRENCY.BTC) {
      wallet.transfer(data.system_address, amountSell).then(success => {
        console.log('transfer', success);
      });
    } else if (currency === CRYPTO_CURRENCY.ETH) {
      const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

      let result = null;
      result = await exchangeHandshake.initByCashOwner(wallet.address, rewardWallet.address, amountSell, data.id);
      console.log('handleCreateOfferSuccess', result);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="createOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.setState((prevStates, props) => ({
          haveOfferETH: currency === CRYPTO_CURRENCY.ETH ? true : prevStates.haveOfferETH,
          haveOfferBTC: currency === CRYPTO_CURRENCY.BTC ? true : prevStates.haveOfferBTC,
        }), () => {
          this.CRYPTO_CURRENCY_LIST = [
            { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], hide: this.state.haveOfferETH },
            { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], hide: this.state.haveOfferBTC },
          ];

          if (this.state.haveOfferETH && this.state.haveOfferBTC) {
            this.props.history.push(URL.HANDSHAKE_ME);
          }
        });
      }
    });

    if (!this.state.haveProfile) {
      this.updateUserProfile(OfferShop.offerShop(data.offer));
    }
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{e.response?.data?.message}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  updateUserProfile = (offerShop) => {
    const params = new URLSearchParams();
    params.append('name', offerShop.username);
    params.append('address', offerShop.contactInfo);
    this.props.authUpdate({
      PATH_URL: 'user/profile',
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      METHOD: 'POST',
      successFn: () => {
        this.setState({ haveProfile: true });
      },
      errorFn: () => {
        this.setState({ haveProfile: false });
      },
    });
  }

  render() {
    const { currency  } = this.props;
    const modalContent = this.state.modalContent;
    const hasFilled1Coin = true;
    return (
      <div>
        <FormExchangeCreate onSubmit={this.handleSubmit}>
          <Feed className="feed my-2 p-0" background={this.mainColor}>
            <div style={{ color: "white", padding: "20px" }}>
              <div className="d-flex mb-4">
                <div className='input-group'>
                  <Field
                    name="currency"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="tab"
                    list={this.CRYPTO_CURRENCY_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onCurrencyChange}
                  />
                </div>
              </div>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create">Amount buy</label>
                <div className='input-group'>
                  <Field
                    name="amountBuy"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    // onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create">Amount sell</label>
                <div className='input-group'>
                  <Field
                    name="amountSell"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    // onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">Customize price buy</label>
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
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">Customize price sell</label>
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
                </div>
              </div>

              {
                hasFilled1Coin && (
                  <div>
                    <hr className="hrLine"/>

                    <div className="d-flex">
                      <label className="col-form-label mr-auto label-create">Name shop</label>
                      <div className='input-group'>
                        <Field
                          name="nameShop"
                          className="form-control-custom form-control-custom-ex w-100 input-no-border"
                          component={fieldInput}
                          placeholder={'Apple store'}
                          // onChange={this.onAmountChange}
                          validate={[required]}
                        />
                      </div>
                    </div>

                    <hr className="hrLine"/>

                    <div className="d-flex mt-2">
                      <label className="col-form-label mr-auto label-create">Phone</label>
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
                    <hr className="hrLine"/>

                    <div className="d-flex mt-2">
                      <label className="col-form-label mr-auto label-create">Address*</label>
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
                )
              }

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
    // offerPrice: offerPrice,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
  };
};

// this.props.showAlert({
//   message: <p className="text-center">aaaaaaaa</p>,
//   timeOut: 10000000,
//   type: 'danger',
// });

const mapDispatchToProps = (dispatch) => ({
  // createOffer: bindActionCreators(createOffer, dispatch),
  // getOfferPrice: bindActionCreators(getOfferPrice, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOfferStores: bindActionCreators(createOfferStores, dispatch),
});
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
