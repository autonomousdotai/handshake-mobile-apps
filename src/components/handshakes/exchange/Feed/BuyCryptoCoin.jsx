/* eslint react/sort-comp:0 */
/* eslint camelcase: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { change, Field, formValueSelector, touch } from 'redux-form';
import { connect } from 'react-redux';
import {
  API_URL, CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME, FIAT_CURRENCY, FIAT_CURRENCY_NAME, HANDSHAKE_ID,
  URL, COUNTRY_LIST,
} from '@/constants';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import {
  buyCryptoGetBankInfo,
  buyCryptoGetCoinInfo,
  buyCryptoOrder,
  buyCryptoSaveRecipt,
  buyCryptoGetPackage,
} from '@/reducers/buyCoin/action';
import { bindActionCreators } from 'redux';
import debounce from '@/utils/debounce';
import { hideAlert, showAlert } from '@/reducers/app/action';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import Modal from '@/components/core/controls/Modal/Modal';
import { formatMoney } from '@/services/offer-util';
import { Link } from 'react-router-dom';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import IdVerifyBtn from '@/components/handshakes/exchange/Feed/components/IdVerifyBtn';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import walletSelectorField from './reduxFormFields/walletSelector';
import coinMoneyExchangeField from './reduxFormFields/coinMoneyExchangeField';
import fieldCheckBoxList from './reduxFormFields/paymentMethodCheckbox';
import coinMoneyExchangeValidator from './reduxFormFields/coinMoneyExchangeField/validator';
import walletSelectorValidator from './reduxFormFields/walletSelector/validator';

import '../styles.scss';
import './BuyCryptoCoin.scss';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const listPackages = {
  [COUNTRY_LIST.VN]: [
    { name: 'basic', intlKeyName: 'basic_package_name', fiatAmount: 20000000, fiatCurrency: FIAT_CURRENCY.VND, show: true },
    { name: 'pro', intlKeyName: 'pro_package_name', fiatAmount: 60000000, fiatCurrency: FIAT_CURRENCY.VND, show: true },
  ],
  [COUNTRY_LIST.HK]: [
    { name: 'basic', intlKeyName: 'basic_package_name', fiatAmount: 5000, fiatCurrency: FIAT_CURRENCY.HKD, show: true },
    { name: 'pro', intlKeyName: 'pro_package_name', fiatAmount: 10000, fiatCurrency: FIAT_CURRENCY.HKD, show: true },
  ],
  default: [
    { name: 'basic', intlKeyName: 'basic_package_name', fiatAmount: 600, fiatCurrency: FIAT_CURRENCY.USD, show: true },
    { name: 'pro', intlKeyName: 'pro_package_name', fiatAmount: 1000, fiatCurrency: FIAT_CURRENCY.USD, show: true },
  ],
};

const defaultCurrency = {
  id: CRYPTO_CURRENCY.BTC,
  text: <span><img alt="" src={iconBitcoin} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span>,
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank',
  COD: 'cod',
};

const nameBuyCryptoForm = 'buyCryptoForm';
const FormBuyCrypto = createForm({
  propsReduxForm: {
    form: nameBuyCryptoForm,
    initialValues: {
      currency: defaultCurrency,
      fiatCurrency: {
        id: FIAT_CURRENCY.USD,
        text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
      },
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
    },
  },
});
const selectorFormSpecificAmount = formValueSelector(nameBuyCryptoForm);

const scopedCss = (className) => `buy-crypto-coin-${className}`;

class BuyCryptoCoin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currency: CRYPTO_CURRENCY.BTC,
      isLoading: false,
      forcePaymentMethod: null,
      modalContent: null,
      modalTitle: null,
      isValidToSubmit: false,
      walletAddress: null,
      packages: [],
    };

    this.modalRef = null;
    this.walletRef = React.createRef();

    this.getCoinInfoNoBounce = ::this.getCoinInfoNoBounce;
    this.getCoinInfo = debounce(::this.getCoinInfoNoBounce, 1000);
    // this.getBasePrice = :: this.getBasePrice;
    this.getBankDataByCountry = :: this.getBankDataByCountry;
    this.renderBankInfo = :: this.renderBankInfo;
    this.getPackage = :: this.getPackage;
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  componentDidMount() {
    const { country, intl: { messages } } = this.props;
    // this.getBasePrice(this.props.wallet?.currency);
    this.updatePhoneNumber(this.props.authProfile?.phone);

    // need to get bank info in user country, global bank also
    this.getBankInfoFromCountry(country);

    this.updateTimeAndNote(messages.create.cod_form.default_time);

    // get package data
    this.getPackageData();

    // this.checkUserVerified();
    setTimeout(() => {
      /*eslint-disable */
      $zopim.livechat.window.onShow(() => {
        this.isShow = true;
        console.log('onShow', this.isShow);
      });
      $zopim.livechat.window.onHide(() => {
        this.isShow = false;
        console.log('onHide', this.isShow);
      });
      this.scrollListener();
      /* eslint-enable */
    }, 6000);
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.props.hideAlert();

    this.detachScrollListener();
  }

  scrollListener = async () => {
    /*eslint-disable */
    if (!this.isShow) {
      $zopim(() => {
        $zopim.livechat.button.hide();
        $zopim.livechat.button.setOffsetVerticalMobile(70);
        $zopim.livechat.button.setOffsetHorizontalMobile(10);
        $zopim.livechat.button.show();
      });
    }
    /* eslint-enable */
  }

  attachScrollListener() {
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.scrollListener);
    this.scrollListener();
  }

  detachScrollListener() {
    this.isShow = true;
    /*eslint-disable */
    $zopim.livechat.button.hide();
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.scrollListener);
    /* eslint-enable */
  }

  getPackageData = () => {
    const { country } = this.props;
    const packages = COUNTRY_LIST[country] in listPackages ? listPackages[COUNTRY_LIST[country]] : listPackages.default;
    this.setState({ packages });
    packages.forEach(item => item.show && this.getPackage(item));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { country, authProfile, wallet, fiatAmountOverLimit } = nextProps;

    // update phone number from props
    if (authProfile?.phone !== this.props.authProfile?.phone) {
      this.updatePhoneNumber(authProfile?.phone);
    }

    if (wallet?.currency !== this.props.wallet?.currency) {
      // this.getBasePrice(wallet?.currency);
      this.setState({ currency: wallet?.currency }, this.getPackageData);
    }

    if (fiatAmountOverLimit !== this.props.fiatAmountOverLimit) {
      if (fiatAmountOverLimit) {
        this.setState({ forcePaymentMethod: PAYMENT_METHODS.BANK_TRANSFER }, () => {
          this.updatePaymentMethod(this.state.forcePaymentMethod);
        });
      } else {
        this.setState({ forcePaymentMethod: null });
      }
    }

    // get bank info if country change
    if (country !== this.props.country) {
      this.getBankInfoFromCountry(country);
    }

    if (wallet?.walletAddress !== this.props.wallet?.walletAddress) {
      this.setState({ walletAddress: wallet?.walletAddress });
    }
  }

  getPackage(packageData = {}) {
    const { fiatAmount, fiatCurrency, name } = packageData;
    const { currency } = this.state;
    gtag.event({
      category: taggingConfig.coin.category,
      action: taggingConfig.coin.action.getReverseCoinInfo,
    });
    const { idVerificationLevel } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    this.props.buyCryptoGetPackage({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_QUOTE_REVERSE}?fiat_amount=${fiatAmount}&currency=${currency}&fiat_currency=${fiatCurrency}&type=${PAYMENT_METHODS.BANK_TRANSFER}&level=${level}`,
      more: { name },
    });
  }

  onCountryChange = (country) => {
    this.getBankInfoFromCountry(country);
  }

  getBankInfoFromCountry = (country) => {
    this.props.buyCryptoGetBankInfo({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_BANK_INFO}/${country}`,
    });
  }

  updatePhoneNumber = (phone) => {
    phone && this.props.rfChange(nameBuyCryptoForm, 'phone', phone);
  }

  updateTimeAndNote = (noteAndTime = '') => {
    this.props.rfChange(nameBuyCryptoForm, 'noteAndTime', noteAndTime);
  }

  updatePaymentMethod = (method) => {
    if (Object.values(PAYMENT_METHODS).indexOf(method) === -1) {
      return;
    }
    this.props.rfChange(nameBuyCryptoForm, 'paymentMethod', method);
  }

  isOverLimit = (amountInUsd, limit) => {
    const { coinInfo } = this.props;
    let amount = Number.parseFloat(amountInUsd);
    let limitAmount = Number.parseFloat(limit);
    amount = !Number.isNaN(amount) ? amount : coinInfo.fiatAmount;
    limitAmount = !Number.isNaN(limitAmount) ? limitAmount : coinInfo.limit;
    return amount > limitAmount;
  }

  showLoading = () => {
    this.setLoading(true);
  };

  hideLoading = () => {
    this.setLoading(false);
  };

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  saveReceiptHandle = ({ data, successFn, errorFn }) => {
    const { order } = this.props;
    this.props.buyCryptoSaveRecipt({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_SAVE_RECEIPT}/${order?.id}`,
      METHOD: 'PUT',
      data,
      successFn,
      errorFn,
    });
  }

  onGetCoinInfoError = (e) => {
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  // getBasePrice(currentIdFromInput, amountFromInput) {
  //   const { wallet } = this.props;
  //   const _currencyId = currentIdFromInput || wallet.currency;
  //   this.getCoinInfoNoBounce({
  //     isGetBasePrice: true,
  //     currencyId: _currencyId,
  //     amount: amountFromInput || 1,
  //   });
  // }

  getCoinInfoNoBounce(data = {}) {
    const { amount, currencyId, isGetBasePrice } = data;
    const { wallet, currencyByLocal, idVerificationLevel } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    const fiatCurrencyId = isGetBasePrice ? FIAT_CURRENCY.USD : currencyByLocal;
    const _currencyId = currencyId || wallet.currency;
    const parsedAmount = Number.parseFloat(amount || this.props.amount) || null;
    if (parsedAmount && _currencyId && fiatCurrencyId) {
      gtag.event({
        category: taggingConfig.coin.category,
        action: taggingConfig.coin.action.getCoinInfo,
      });
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${_currencyId}&fiat_currency=${fiatCurrencyId}${isGetBasePrice ? '&check=1' : ''}&level=${level}`,
        more: isGetBasePrice && { isGetBasePrice, amount: parsedAmount, currencyId: _currencyId, fiatCurrencyId },
        errorFn: this.onGetCoinInfoError,
      });
    }
  }

  makeOrder = (info = {}) => {
    const { country } = this.props;
    const { paymentMethod, address, noteAndTime, phone, coinMoneyExchange, idVerificationLevel } = this.props;
    const { walletAddress, currency } = this.state;
    const fiatAmount = info.fiatAmount || coinMoneyExchange.fiatAmount;
    const data = {
      type: info.paymentMethod || paymentMethod,
      amount: String(info.amount || coinMoneyExchange.amount),
      currency: info.currencyId || currency,
      fiat_amount: String(info.fiatAmountInUsd || coinMoneyExchange.fiatAmountInUsd),
      fiat_currency: FIAT_CURRENCY.USD,
      fiat_local_amount: String(fiatAmount),
      fiat_local_currency: info.fiatCurrencyId || coinMoneyExchange.fiatCurrency,
      address: info.address || walletAddress,
      level: String(idVerificationLevel),
    };

    if (data.type === PAYMENT_METHODS.BANK_TRANSFER) {
      data.center = country;
    } else {
      data.user_info = info.userInfo || {
        address,
        noteAndTime,
        phone,
      };
    }

    this.props.buyCryptoOrder({
      PATH_URL: API_URL.EXCHANGE.BUY_CRYPTO_ORDER,
      METHOD: 'POST',
      data,
      successFn: this.onMakeOrderSuccess,
      errorFn: this.onMakeOrderFailed,
    });
  }

  onMakeOrderFailed = (e) => {
    this.props.showAlert({
      message: getErrorMessageFromCode(e),
      timeOut: 3000,
      type: 'danger',
    });
  }

  onMakeOrderSuccess = () => {
    const { messages } = this.props.intl;
    const { order } = this.props;
    if (order.type === PAYMENT_METHODS.COD) {
      this.props.showAlert({
        message: <div className="text-center">{messages.buy_coin.label.success}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
          this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.NINJA_COIN}`);
        },
      });
      return;
    }

    // if payment is bank transfer => show BANK INFO
    this.handleBuyViaTransfer(order);
  }

  onSubmit = () => {
    this.makeOrder();
  }

  checkUserVerified = (info = {}) => {
    const { authProfile: { idVerified }, intl: { messages }, idVerificationLevel, fiatAmountOverLimit, fiatLimit, coinMoneyExchange } = this.props;
    const _fiatAmountOverLimit = info.fiatAmountOverLimit || fiatAmountOverLimit;
    const _fiatLimit = info.fiatLimit || fiatLimit;
    const _fiatCurrency = info.fiatCurrency || coinMoneyExchange.fiatCurrency;
    let result = false;
    const verifiedStatus = idVerificationLevel; // 1: id verify, 2: selfie verify
    let message = '';
    switch (idVerified) {
      case 0: { // Not yet
        message = messages.buy_coin.label.verify.notYet.title;
        break;
      }
      case -1: { // Rejected
        message = messages.buy_coin.label.verify.rejected.title;
        break;
      }
      case 1: { // Verified
        if (verifiedStatus === 1 && _fiatAmountOverLimit) {
          message = (
            <div id="PexCreateBtn" >
              <div className="Idea">
                <FormattedMessage
                  id="buy_coin.verify.need_selfie_verifiy"
                  values={{
                    fiatAmount: _fiatLimit,
                    fiatCurrency: _fiatCurrency,
                  }}
                />
                &nbsp;
                <Link
                  className="verify-link"
                  to={{ pathname: URL.HANDSHAKE_ME_PROFILE }}
                >
                  <FormattedMessage id="buy_coin.verify.need_selfie_verifiy_action" />
                </Link>
              </div>
            </div>
          );
        } else {
          result = true;
        }
        break;
      }
      case 2: { // Process
        message = messages.buy_coin.label.verify.processing.title;
        break;
      }
      default: {
        break;
      }
    }

    if (!result) {
      this.props.showAlert({
        message: (
          <div className="text-center">
            {message}
          </div>),
        timeOut: 5000,
        type: 'danger',
        callBack: () => {
        },
      });
    }

    return result;
  }

  renderOrderInfo = () => {
    const { modalContent, modalTitle } = this.state;
    return (
      <Modal title={modalTitle} onRef={modal => { this.modalRef = modal; }} onClose={() => {}}>
        {modalContent || ''}
      </Modal>
    );
  }

  handleBuyViaTransfer = (order = {}) => {
    const { country } = this.props;
    let bankData = {};
    const receipt = {
      createdAt: order.createdAt,
      amount: order.fiatAmount || 0,
      fiatCurrency: order.fiatCurrency,
      referenceCode: order.refCode,
      status: order.status,
      id: order.id,
    };

    bankData = this.getBankDataByCountry(country);
    receipt.amount = order.fiatLocalAmount;
    receipt.fiatCurrency = order.fiatLocalCurrency;
    this.setState({
      modalContent: (
        <AtmCashTransferInfo
          receipt={receipt}
          bankInfo={bankData}
          saveReceiptHandle={this.saveReceiptHandle}
          onDone={this.onReceiptSaved}
        />
      ),
      modalTitle: 'Bank Transfer',
    }, () => {
      this.modalRef.open();
    });
  }

  onReceiptSaved = () => {
    this.modalRef.close();
    this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.NINJA_COIN}`);
  }

  getBankDataByCountry(country) {
    const { bankInfo } = this.props;
    if (country in bankInfo) {
      return bankInfo[country];
    }
    return null;
  }

  handleBuyPackage = (item = {}) => {
    const { walletAddress } = this.state;
    const data = {
      paymentMethod: item.type,
      amount: item.amount,
      currencyId: item.currency,
      fiatAmountInUsd: String(item.fiatAmount),
      fiatCurrencyId: item.fiatCurrency,
      fiatLocalAmount: String(item.fiatAmount),
      fiatLocalCurrencyId: FIAT_CURRENCY.USD,
      address: walletAddress,
    };
    this.makeOrder(data);
  }

  validateForm = (values) => {
    const { coinMoneyExchange, paymentMethod, wallet, address, noteAndTime, phone } = values;
    const { amount, fiatAmount, fiatCurrency } = coinMoneyExchange || {};
    const { currency, walletAddress, hasError } = wallet || {};

    if (paymentMethod && amount && fiatAmount && fiatCurrency && currency && walletAddress && !hasError) {
      if (paymentMethod === PAYMENT_METHODS.COD && (!address || !noteAndTime || !phone)) {
        this.setState({ isValidToSubmit: false });
        return;
      }
      this.setState({ isValidToSubmit: true });
    } else {
      this.setState({ isValidToSubmit: false });
    }
  }

  noticeBuyPackageWithoutWalletAddress = () => {
    const { intl: { messages } } = this.props;
    const { walletAddress } = this.state;
    if (!walletAddress) {
      this.props.showAlert({
        message: (
          <div className="text-center">
            {messages.buy_coin.buy_package_without_wallet_address_notice}
          </div>),
        timeOut: 3000,
        type: 'danger',
      });
      this.walletRef?.current?.getRenderedComponent()?.focus();
    }
  }

  renderCoD = () => {
    const { intl: { messages }, paymentMethod } = this.props;
    return (
      <div className="cod-form-container">
        <Field
          type="text"
          className="form-control input-field cod-field"
          name="address"
          placeholder={messages.create.cod_form.your_address}
          component={fieldInput}
          validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
        />
        <Field
          type="text"
          className="form-control input-field cod-field"
          name="phone"
          placeholder={messages.create.cod_form.your_phone}
          component={fieldInput}
          validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
        />
        <Field
          type="text"
          className="form-control input-field cod-field"
          placeholder={messages.create.cod_form.time}
          name="noteAndTime"
          component={fieldInput}
          validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
        />
      </div>
    );
  }

  renderBankInfo() {
    const { country, intl: { messages } } = this.props;
    const bankData = this.getBankDataByCountry(country);

    if (!bankData) return null;
    return (
      <React.Fragment>
        <ul className="bank-info-container">
          <li>
            <div className="title"><span>{messages.bank_info.transfer_detail_text}</span></div>
          </li>
          {bankData && Object.entries(bankData).map(([key, value]) => {
            return (
              <li key={key}>
                <div><span>{messages.bank_info[key]}</span></div>
                <div><span>{value}</span></div>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }

  renderPaymentMethodInfo() {
    const { paymentMethod } = this.props;
    return (
      <div className={`choose-coin-payment-method-container ${paymentMethod === PAYMENT_METHODS.COD ? 'cod' : ''}`}>
        {this.renderCoD()}
      </div>
    );
  }

  renderPackages = () => {
    const { packages, intl: { messages } } = this.props;
    const { currency } = this.state;
    return (
      <div className="package-container">
        {
          this.state.packages?.map((item) => {
            const {
              name, show, intlKeyName,
            } = item;
            const packageGroup = packages[name];
            const packageData = packageGroup && packageGroup[currency];

            if (!packageData) return null;

            return show && packageData && (
              <div key={name} className={`package-item ${name}`}>
                <span className="name">{messages.buy_coin.label[intlKeyName]}</span>
                <div className="price-amount-group">
                  <span className={`fiat-amount ${packageData.show?.fiatCurrency === FIAT_CURRENCY.USD ? 'usd' : ''}`}>{formatMoney(packageData.show?.fiatAmount)} {packageData.show?.fiatCurrency}</span>
                  <span className="amount">{packageData?.amount || '---'} {packageData?.currency}</span>
                </div>
                <ConfirmButton
                  validate={
                    () => this.checkUserVerified({
                      fiatAmountOverLimit: packageData.fiatAmountOverLimit,
                      fiatLimit: packageData.limit,
                      fiatCurrency: packageData.fiatLocalCurrency,
                    })
                  }
                  disabled={!this.state.walletAddress}
                  label={<FormattedMessage id="cc.btn.buyNow" />}
                  confirmText={<FormattedMessage id="buy_coin_confirm_popup.confirm_text" />}
                  cancelText={<FormattedMessage id="buy_coin_confirm_popup.cancel_text" />}
                  buttonClassName="btn package-buy-now"
                  containerClassName="buy-btn-container"
                  message={
                    <FormattedMessage
                      id="buy_coin_confirm_popup.msg"
                      values={{
                        amount: packageData?.amount,
                        currency: packageData?.currency,
                        fiatAmount: formatMoney(packageData.show.fiatAmount),
                        fiatCurrency: packageData.show.fiatCurrency,
                      }}
                    />
                  }
                  onConfirm={() => this.handleBuyPackage(packageData)}
                  onFirstClick={this.noticeBuyPackageWithoutWalletAddress}
                />
              </div>
            );
          })
        }
      </div>
    );
  }

  onFirstClickBuy = () => {
    gtag.event({
      category: taggingConfig.coin.category,
      action: taggingConfig.coin.action.click_buy,
    });
  }

  render() {
    console.log('STATE', this.state);
    const { authProfile: { idVerified } } = this.props;
    const { messages } = this.props.intl;
    const { coinMoneyExchange, paymentMethod } = this.props;
    const { currency, forcePaymentMethod, isValidToSubmit } = this.state;

    const showState = [-1, 0, 2, 1];

    return (
      <div>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className={scopedCss('container')}>
          {
            showState.indexOf(idVerified) > 0 && <IdVerifyBtn dispatch={this.props.dispatch} idVerified={idVerified} />
          }
          <div className={scopedCss('specific-amount')}>
            <FormBuyCrypto onSubmit={this.onSubmit} validate={this.validateForm}>
              <div className="label-1">
                <span>{messages.buy_coin.label.header.buy_crypto}</span>
                <span>{messages.buy_coin.label.header.with_ninja_coin}</span>
              </div>
              <div className="input-group mt-4">
                <Field
                  withRef
                  ref={this.walletRef}
                  name="wallet"
                  className="form-control form-control-lg border-0 rounded-right form-control-cc"
                  type="text"
                  component={walletSelectorField}
                  validate={[walletSelectorValidator]}
                />
              </div>
              <div className="input-group mt-4">
                <Field
                  name="coinMoneyExchange"
                  className="form-control form-control-lg border-0 rounded-right form-control-cc"
                  type="text"
                  component={coinMoneyExchangeField}
                  currency={currency}
                  paymentMethod={paymentMethod}
                  validate={[coinMoneyExchangeValidator]}
                />
              </div>
              <div className="input-group item-info mt-2">
                <Field
                  component={fieldCheckBoxList}
                  titles={messages.buy_coin.label.payment_methods}
                  name="paymentMethod"
                  items={PAYMENT_METHODS}
                  disabled={forcePaymentMethod}
                  extraInfo={{
                    [PAYMENT_METHODS.COD]: messages.buy_coin.label.payment_methods.cod_info,
                  }}
                />
              </div>
              {this.renderPaymentMethodInfo()}
              <div className="input-group mt-2">
                <ConfirmButton
                  validate={this.checkUserVerified}
                  disabled={!isValidToSubmit}
                  label={`${messages.create.cod_form.buy_btn} ${coinMoneyExchange?.amount} ${CRYPTO_CURRENCY_NAME[currency] || ''}`}
                  confirmText={<FormattedMessage id="buy_coin_confirm_popup.confirm_text" />}
                  cancelText={<FormattedMessage id="buy_coin_confirm_popup.cancel_text" />}
                  buttonClassName="buy-btn"
                  containerClassName="buy-btn-container"
                  message={
                    <FormattedMessage
                      id="buy_coin_confirm_popup.msg"
                      values={{
                        amount: coinMoneyExchange.amount,
                        currency,
                        fiatAmount: coinMoneyExchange.fiatCurrency === FIAT_CURRENCY.VND ? formatMoney(coinMoneyExchange.fiatAmount) : coinMoneyExchange.fiatAmount,
                        fiatCurrency: coinMoneyExchange.fiatCurrency,
                      }}
                    />
                  }
                  onConfirm={this.onFirstClickBuy}
                  onCancel={this.onFirstClickBuy}
                />
              </div>
            </FormBuyCrypto>
          </div>

          {this.renderPackages()}
          {this.renderOrderInfo()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currencyByLocal: state.app.ipInfo.currency || 'VND',
  country: state.app.ipInfo.country || 'VN',
  authProfile: state.auth.profile,
  phone: selectorFormSpecificAmount(state, 'phone'),
  paymentMethod: selectorFormSpecificAmount(state, 'paymentMethod'),
  address: selectorFormSpecificAmount(state, 'address'),
  noteAndTime: selectorFormSpecificAmount(state, 'noteAndTime'),
  wallet: selectorFormSpecificAmount(state, 'wallet'),
  coinMoneyExchange: selectorFormSpecificAmount(state, 'coinMoneyExchange'),
  fiatAmountOverLimit: state.buyCoin?.fiatAmountOverLimit,
  coinInfo: state.buyCoin?.coinInfo || {},
  bankInfo: state.buyCoin?.bankInfo,
  order: state.buyCoin?.order || {},
  packages: state.buyCoin?.packages || {},
  idVerificationLevel: state.auth.profile.idVerificationLevel || 0,
  fiatLimit: state.buyCoin?.fiatLimit,
});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  rfTouch: bindActionCreators(touch, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  hideAlert: bindActionCreators(hideAlert, dispatch),
  buyCryptoOrder: bindActionCreators(buyCryptoOrder, dispatch),
  buyCryptoGetCoinInfo: bindActionCreators(buyCryptoGetCoinInfo, dispatch),
  buyCryptoGetBankInfo: bindActionCreators(buyCryptoGetBankInfo, dispatch),
  buyCryptoSaveRecipt: bindActionCreators(buyCryptoSaveRecipt, dispatch),
  buyCryptoGetPackage: bindActionCreators(buyCryptoGetPackage, dispatch),
});

BuyCryptoCoin.defaultProps = {
  amount: 0,
  paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  bankInfo: {},
  address: '',
  noteAndTime: '',
  order: {},
  phone: '',
  wallet: {},
  coinMoneyExchange: {},
  coinInfo: {},
  packages: {},
};

BuyCryptoCoin.propTypes = {
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
  authProfile: PropTypes.object.isRequired,
  coinMoneyExchange: PropTypes.object,
  paymentMethod: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string.isRequired,
  rfChange: PropTypes.func.isRequired,
  order: PropTypes.object,
  coinInfo: PropTypes.object,
  bankInfo: PropTypes.object,
  packages: PropTypes.object,
  buyCryptoGetBankInfo: PropTypes.func.isRequired,
  address: PropTypes.string,
  noteAndTime: PropTypes.string,
  buyCryptoOrder: PropTypes.func.isRequired,
  buyCryptoSaveRecipt: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  hideAlert: PropTypes.func.isRequired,
  phone: PropTypes.string,
  wallet: PropTypes.object,
  fiatAmountOverLimit: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  buyCryptoGetPackage: PropTypes.func.isRequired,
  idVerificationLevel: PropTypes.number.isRequired,
  fiatLimit: PropTypes.number.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyCryptoCoin));
