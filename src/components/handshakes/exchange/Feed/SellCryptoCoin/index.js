import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellCryptoGetCoinInfo, sellCryptoOrder } from '@/reducers/sellCoin/action';
import { API_URL, CRYPTO_CURRENCY } from '@/constants';
import debounce from '@/utils/debounce';
import { showAlert } from '@/reducers/app/action';
import { Field, formValueSelector, change } from 'redux-form';
import { required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import arrowIcon from '@/assets/images/icon/right-arrow-white.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import OrderInfo from './components/OrderInfo';
import currencyInputField, { currencyValidator } from './reduxFormFields/currencyField';
import './SellCryptoCoin.scss';

const sellCoinFormName = 'SellCoinForm';
const FormSellCoin = createForm({
  propsReduxForm: {
    form: sellCoinFormName,
  },
});
const formSellCoinSelector = formValueSelector(sellCoinFormName);

const scopedCss = (className) => `sell-crypto-coin-${className}`;

class SellCryptoCoin extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: {},
    };

    this.getCoinInfo = debounce(::this.getCoinInfo, 1000);
  }

  componentDidMount() {
    this.getCoinInfo();
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
    this.updateCurrency({ amount: 0 });
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  onMakeOrderSuccess = (res) => {
  }

  onMakeOrderFailed = (e) => {}

  onSubmit = (values) => {
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
  }


  getCoinInfo(amount = this.props.currency?.amount, currency = this.props.currency?.currency) {
    const { idVerificationLevel, fiatCurrencyByCountry } = this.props;
    const level = idVerificationLevel === 0 ? 1 : idVerificationLevel;
    if (amount >= 0 && currency && fiatCurrencyByCountry) {
      this.props.sellCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?direction=sell&amount=${Number.parseFloat(amount) || 0}&currency=${currency}&fiat_currency=${fiatCurrencyByCountry}&level=${level}`,
        errorFn: this.onGetCoinInfoError,
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
        placeholder: 'Bank Owner',
      },
      bankName: {
        placeholder: 'Bank Name',
      },
      bankNumber: {
        placeholder: 'Bank Number',
      },
      phoneNumber: {
        placeholder: 'Phone number',
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
    const { orderInfo, coinInfo, fiatCurrencyByCountry } = this.props;
    if (orderInfo && orderInfo.id) {
      return <OrderInfo />;
    }

    return (
      <FormSellCoin onSubmit={this.onSubmit} className={scopedCss('container')}>
        <div className="currency-group">
          <span className="label">Amount</span>
          <Field
            name="currency"
            component={currencyInputField}
            validate={currencyValidator}
          />
          <input
            placeholder="Price_"
            value={`${formatMoneyByLocale(coinInfo?.fiatLocalAmount || '0.0')} ${coinInfo?.fiatLocalCurrency || fiatCurrencyByCountry}`}
            disabled
          />
        </div>
        <div className="user-input-group">
          {this.renderUserInfoInput()}
        </div>
        <ConfirmButton
          label={<span>Next <img alt="" src={arrowIcon} width={12} /></span>}
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
});

const mapDispatchToProps = {
  sellCryptoGetCoinInfo,
  showAlert,
  sellCryptoOrder,
  change,
};

SellCryptoCoin.propTypes = {
  sellCryptoGetCoinInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SellCryptoCoin);
