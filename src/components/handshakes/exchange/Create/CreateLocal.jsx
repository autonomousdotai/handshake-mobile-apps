import React from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import Feed from "@/components/core/presentation/Feed";
import Button from "@/components/core/controls/Button";
import "./styles.scss";
import createForm from "@/components/core/form/createForm";
import {ExchangeHandshake, ExchangeShopHandshake} from '@/services/neuron';
import {formatAmountCurrency, formatMoney, getOfferPrice} from "@/services/offer-util";
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from "@/components/core/form/customField";
import {maxValue, minValue, required} from "@/components/core/form/validation";
import {minValueBTC, minValueETH} from "./validation";
import {change, Field, formValueSelector} from "redux-form";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
// import {MasterWallet} from '@/models/MasterWallet';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_LIST,
  CRYPTO_CURRENCY_NAME,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  MIN_AMOUNT,
  SELL_PRICE_TYPE_DEFAULT,
  URL
} from "@/constants";
import "../styles.scss";
import ModalDialog from "@/components/core/controls/ModalDialog/ModalDialog";
import {hideLoading, showAlert, showLoading} from "@/reducers/app/action";
import {MasterWallet} from "@/models/MasterWallet";
import COUNTRIES from "@/data/country-dial-codes.js";
import {feedBackgroundColors} from "@/components/handshakes/exchange/config";
import {addOfferItem, createOffer, createOfferStores, getOfferStores} from "@/reducers/exchange/action";

import {BigNumber} from "bignumber.js/bignumber";
import {authUpdate} from "@/reducers/auth/action";
import axios from "axios/index";
import {getErrorMessageFromCode} from "../utils";

const nameFormExchangeCreateLocal = "exchangeCreateLocal";
const FormExchangeCreateLocal = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreateLocal,
    initialValues: {
      type: EXCHANGE_ACTION_DEFAULT,
      currency: CRYPTO_CURRENCY_DEFAULT
    }
  }
});
const selectorFormExchangeCreateLocal = formValueSelector(nameFormExchangeCreateLocal);

const textColor = "#ffffff";
const btnBg = "rgba(29,29,38,0.30)";

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: "",
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
    };
    this.mainColor = "#1F2B34";
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat: lat, lng: lng });
    const { rfChange } = this.props;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      rfChange(nameFormExchangeCreateLocal, "address", address);
    });
  };

  componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location;
      this.setAddressFromLatLng(latitude, longitude); // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback
    });

    // auto fill phone number from user profile
    let detectedCountryCode = "";
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo?.country?.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(nameFormExchangeCreateLocal, "phone", authProfile.phone || `${detectedCountryCode}-`);
    rfChange(nameFormExchangeCreateLocal, "nameShop", authProfile.name || "");
    rfChange(nameFormExchangeCreateLocal, "address", authProfile.address || "");
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance);
    const bnAmount = new BigNumber(amount);
    const bnFee = new BigNumber(fee);
    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee));
    if (condition) {
      this.props.showAlert({
        message: (
          <div className="text-center">
            <FormattedMessage id="notEnoughCoinInWallet"
                              values={ {
                                amount: formatAmountCurrency(balance),
                                fee: formatAmountCurrency(fee),
                                currency: currency
                              } } />
          </div>
        ),
        timeOut: 3000,
        type: "danger",
        callBack: () => {}
      });
    }

    return condition;
  };

  showLoading = () => {
    this.props.showLoading({message: ''});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  handleCreateOfferSuccess = async (responseData) => {
    const data = responseData.data;

    const currency = data.currency;

    console.log('handleCreateOfferSuccess', data);

    const wallet = MasterWallet.getWalletDefault(currency);

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
        result = await exchangeHandshake.initByCashOwner(wallet.address, data.amount, data.id);
      } else {
        result = await exchangeHandshake.initByCoinOwner(wallet.address, data.amount, data.id);
      }

      console.log('handleCreateOfferSuccess', result);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="createOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
  }

  handleCreateOfferFailed = (e) => {
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);
    const { currency } = this.props;

    this.showLoading();
    this.props.createOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  checkMainNetDefaultWallet = (wallet) => {
    let result = true;

    if (process.env.isLive) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = <FormattedMessage id="requireDefaultWalletOnMainNet" />;
        this.showAlert(message);
        result = false;
      }
    }

    return result;
  }

  handleSubmit = async (values) => {
    const { totalAmount, price } = this.props;
    const {ipInfo: {currency: fiat_currency}, authProfile} = this.props;

    const wallet = MasterWallet.getWalletDefault(values.currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

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
          <FormattedMessage id="notEnoughCoinInWallet"
                            values={ {
                              amount: formatAmountCurrency(balance),
                              fee: formatAmountCurrency(fee),
                              currency: values.currency,
                            } } />
        </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });

      return;
    }

    const address = wallet.address;

    let phones = values.phone.trim().split('-');

    let phone = '';
    if (phones.length > 1) {
      phone = phones[1].length > 0 ? values.phone : '';
    }

    const offer = {
      amount: values.amount,
      price: '0',
      physical_item: values.physical_item,
      currency: values.currency,
      type: values.type,
      contact_info: values.address,
      contact_phone: phone,
      fiat_currency: fiat_currency,
      latitude: this.state.lat,
      longitude: this.state.lng,
      email: authProfile?.email || '',
      username: authProfile?.name || '',
      chat_username: authProfile?.username || '',
    };

    if (values.type === EXCHANGE_ACTION.BUY) {
      offer.user_address = address;
    } else {
      offer.refund_address = address;
    }

    console.log('handleSubmit', offer);
    const message = <FormattedMessage id="createOfferConfirm"
                      values={ {
                        type: EXCHANGE_ACTION_NAME[values.type],
                        amount: formatAmountCurrency(values.amount),
                        currency: values.currency,
                        currency_symbol: fiat_currency,
                        total: formatMoney(totalAmount),
                      } } />;

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

  render() {
    const { type, currency, listOfferPrice, ipInfo: { currency: fiatCurrency }, total, totalFormatted, intl } = this.props;
    const modalContent = this.state.modalContent;
    const allowInitiate = this.offer ? (!this.offer.itemFlags.ETH || !this.offer.itemFlags.BTC) : true;

    return (
      <div className="create-exchange-local">
        <FormExchangeCreateLocal onSubmit={this.handleSubmit}>
          <Feed className="feed my-2 p-0" background={this.mainColor}>
            <div style={{ color: "white", padding: "20px" }}>

              <div className="d-flex mb-4">
                <label className="col-form-label mr-auto label-create head-label"><span className="align-middle"><FormattedMessage id="ex.createLocal.label.iWantTo"/></span></label>
                <div className='input-group'>
                  <Field
                    name="type"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="tab"
                    list={EXCHANGE_ACTION_LIST}
                    color={textColor}
                    validate={[required]}
                    onChange={this.onCurrencyChange}
                  />
                </div>
              </div>

              <div className="d-flex mb-3">
                <label className="col-form-label mr-auto label-create"></label>
                <div className='input-group'>
                  <Field
                    name="physical_item"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={intl.formatMessage({ id: 'ex.createLocal.placeholder.anyItem' })}
                    // onChange={this.onAmountChange}
                    validate={[required]}
                  />
                  <hr className="hrLine w-100"/>
                </div>
              </div>

              <div className="d-flex mb-2">
                <label className="col-form-label mr-auto label-create" style={{ width: "190px" }}><span
                  className="align-middle"><FormattedMessage id="ex.createLocal.label.coin"/></span></label>
                <div className='input-group'>
                  <Field
                    name="currency"
                    // containerClass="radio-container-old"
                    component={fieldRadioButton}
                    type="radio-1"
                    list={CRYPTO_CURRENCY_LIST}
                    color={textColor}
                    validate={[required]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex">
                <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.createLocal.label.amount"/></span></label>
                <div className='input-group'>
                  <Field
                    name="amount"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={MIN_AMOUNT[currency]}
                    // onChange={this.onAmountChange}
                    validate={[required, currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH]}
                  />
                </div>
              </div>

              <hr className="hrLine"/>

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"><FormattedMessage id="ex.createLocal.label.phone"/></span></label>
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
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"><FormattedMessage id="ex.createLocal.label.address"/></span></label>
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
          <Button block type="submit" disabled={!allowInitiate}><FormattedMessage id="btn.initiate"/></Button>
        </FormExchangeCreateLocal>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const type = selectorFormExchangeCreateLocal(state, "type");
  const currency = selectorFormExchangeCreateLocal(state, "currency");

  const listOfferPrice = state.exchange.listOfferPrice;
  const { price } = getOfferPrice(listOfferPrice, type, currency);

  const amount = selectorFormExchangeCreateLocal(state, "amount");
  const total = price * amount;
  const totalFormatted = formatMoney(total);
  const phone = selectorFormExchangeCreateLocal(state, "phone");
  const address = selectorFormExchangeCreateLocal(state, "address");

  return {
    type, currency, amount, total, totalFormatted,
    phone, address,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOffer: bindActionCreators(createOffer, dispatch),
});
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
