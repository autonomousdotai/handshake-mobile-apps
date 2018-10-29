import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellCryptoGetCoinInfo, sellCryptoOrder } from '@/reducers/sellCoin/action';
import { API_URL } from '@/constants';
import debounce from '@/utils/debounce';
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import { Field, formValueSelector, change } from 'redux-form';
import { required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import arrowIcon from '@/assets/images/icon/right-arrow-white.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import { injectIntl, FormattedMessage } from 'react-intl';
import OrderInfo from './components/OrderInfo';
import currencyInputField, { currencyValidator } from './reduxFormFields/currencyField';
import './SellCryptoCoin.scss';

const sellCoinFormName = 'SellCoinForm';
const FormSellCoin = createForm({
  propsReduxForm: {
    form: sellCoinFormName,
    initialValues: {
      currency: {
        amount: 0,
      },
    },
  },
});
const formSellCoinSelector = formValueSelector(sellCoinFormName);

const scopedCss = (className) => `sell-crypto-coin-${className}`;

class SellCryptoCoin extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
      isGettingCoinInfo: false,
    };

    this.getCoinInfo = debounce(::this.getCoinInfo, 1000);
  }

  shouldComponentUpdate(nextProps) {
    // get coin info if currency or amount changes
    if (nextProps?.currency?.amount !== this.props?.currency?.amount || nextProps.currency?.currency !== this.props?.currency?.currency) {
      this.getCoinInfo(nextProps?.currency?.amount, nextProps?.currency?.currency);
    }
    return true;
  }

  onAddUserInfo = (e) => {
    const type = e?.target?.dataset?.id;
    this.setState({
      userInfo: {
        ...this.state.userInfo,
        [type]: e?.target?.value || '',
      },
    });
  }

  onGetCoinInfoError = (e) => {
    this.setState({ isGettingCoinInfo: false });
    this.updateCurrency({ amount: 0 });
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  onGetCoinInfoSuccess = () => {
    this.setState({ isGettingCoinInfo: false });
  }

  onMakeOrderSuccess = () => {
    this.props.hideLoading();
  }

  onMakeOrderFailed = (e) => {
    console.warn(e);
    this.props.hideLoading();
  }

  onSubmit = () => {
    const { idVerificationLevel, coinInfo, userInfo, currency } = this.props;
    const data = {
      type: 'bank',
      amount: String(currency?.amount),
      currency: currency?.currency,
      fiat_amount: String(coinInfo?.fiatAmount),
      fiat_currency: coinInfo?.fiatCurrency,
      fiat_local_amount: String(coinInfo?.fiatLocalAmount),
      fiat_local_currency: coinInfo?.fiatLocalCurrency,
      level: String(idVerificationLevel),
      user_info: userInfo,
    };
    this.props.sellCryptoOrder({
      PATH_URL: API_URL.EXCHANGE.SELL_COIN_ORDER,
      METHOD: 'POST',
      data,
      successFn: this.onMakeOrderSuccess,
      errorFn: this.onMakeOrderFailed,
    });
    this.props.showLoading();
  }

  getLocalStr = () => {
    const { intl: { messages } } = this.props;
    return messages?.sell_coin || {};
  };

  getCoinInfo(amount = this.props.currency?.amount, currency = this.props.currency?.currency) {
    const { idVerificationLevel, fiatCurrencyByCountry } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    if (amount >= 0 && currency && fiatCurrencyByCountry) {
      this.setState({ isGettingCoinInfo: true });
      this.props.sellCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?direction=sell&amount=${Number.parseFloat(amount) || 0}&currency=${currency}&fiat_currency=${fiatCurrencyByCountry}&level=${level}`,
        errorFn: this.onGetCoinInfoError,
        successFn: this.onGetCoinInfoSuccess,
      });
    }
  }

  updateCurrency = (currencyData) => {
    this.props.change(sellCoinFormName, 'currency', {
      ...this.props.currency,
      ...currencyData,
    });
  }

  renderUserInfoInput = () => {
    const fields = {
      bankOwner: {
        placeholder: this.getLocalStr().order?.inputs?.bank_owner,
      },
      bankName: {
        placeholder: this.getLocalStr().order?.inputs?.bank_name,
      },
      bankNumber: {
        placeholder: this.getLocalStr().order?.inputs?.bank_number,
      },
      phoneNumber: {
        placeholder: this.getLocalStr().order?.inputs?.phone,
      },
    };
    return Object.entries(fields).map(([fieldName, data]) => (
      <Field
        placeholder={data.placeholder}
        key={fieldName}
        name={fieldName}
        component={fieldInput}
        validate={required}
      />
    ));
  }

  render() {
    const { orderInfo, coinInfo, fiatCurrencyByCountry, currency, className, formError } = this.props;
    const { isGettingCoinInfo } = this.state;
    const fiatCurrency = coinInfo?.fiatLocalCurrency || fiatCurrencyByCountry;
    const fiatAmount = currency?.amount ?
      `${formatMoneyByLocale(coinInfo?.fiatLocalAmount || '0.0')} ${fiatCurrency}` :
      `0 ${fiatCurrency}`;
    if (orderInfo && orderInfo.id) {
      return <OrderInfo />;
    }

    return (
      <FormSellCoin onSubmit={this.onSubmit} className={`${scopedCss('container')} ${className}`}>
        <div className="currency-group">
          <Field
            name="currency"
            component={currencyInputField}
            validate={currencyValidator}
            placeholder={this.getLocalStr().order?.inputs?.currency?.amount}
          />
          <div className="fiat-amount-container">
            <input
              value={fiatAmount}
              disabled
            />
            <div className={isGettingCoinInfo ? 'loading' : ''} />
          </div>
        </div>
        <div className="user-input-group">
          {this.renderUserInfoInput()}
        </div>
        <ConfirmButton
          disabled={!!formError}
          message={
            <FormattedMessage
              id="sell_coin_confirm_popup.msg"
              values={{
                fiatAmount: fiatAmount || 0,
                amount: currency?.amount || 0,
                currency: currency?.currency || '',
              }}
            />
          }
          confirmText={<FormattedMessage id="sell_coin_confirm_popup.confirm_text" />}
          cancelText={<FormattedMessage id="sell_coin_confirm_popup.cancel_text" />}
          label={<span>{this.getLocalStr().order?.btn?.submit_order} <img alt="" src={arrowIcon} width={12} /></span>}
          buttonClassName="next-btn"
        />
      </FormSellCoin>
    );
  }
}

const mapStateToProps = (state) => ({
  coinInfo: state.sellCoin.coinInfo,
  orderInfo: state.sellCoin.orderInfo,
  fiatCurrencyByCountry: state.app.inInfo?.currency || 'VND',
  idVerificationLevel: state.auth.profile.idVerificationLevel || 0,
  userInfo: formSellCoinSelector(state, 'bankOwner', 'bankName', 'bankNumber', 'phoneNumber'),
  currency: formSellCoinSelector(state, 'currency'),
  formError: !!state.form[sellCoinFormName]?.syncErrors,
});

const mapDispatchToProps = {
  sellCryptoGetCoinInfo,
  showAlert,
  sellCryptoOrder,
  change,
  showLoading,
  hideLoading,
};

SellCryptoCoin.defaultProps = {
  className: '',
  currency: null,
};

SellCryptoCoin.propTypes = {
  sellCryptoGetCoinInfo: PropTypes.func.isRequired,
  orderInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  fiatCurrencyByCountry: PropTypes.string.isRequired,
  currency: PropTypes.object,
  idVerificationLevel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  coinInfo: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  className: PropTypes.string,
  change: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  sellCryptoOrder: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  showLoading: PropTypes.func.isRequired,
  formError: PropTypes.bool.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SellCryptoCoin));
