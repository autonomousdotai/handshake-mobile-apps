import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { coinGetSellPrice, coinGetBuyPrice } from '@/reducers/coin/action';
import { connect } from 'react-redux';
import { formatMoneyByLocale } from '@/services/offer-util';
import { injectIntl } from 'react-intl';
import {
  API_URL,
} from '@/constants';
import './styles.scss';

const scopedCss = (className) => `crypto-coin-price-item-${className}`;

class CryptoPrice extends Component {
  constructor() {
    super();
    this.state = {
      crypto: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const state = {};
    if (nextProps.crypto?.id !== prevState.crypto?.id) {
      state.crypto = nextProps.crypto;
    }
    return state;
  }

  componentDidMount() {
    this.getPrice();
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (prevState.crypto?.id !== this.state.crypto?.id) {
      this.getPrice();
    }
    return true;
  }

  getLocalStr = () => {
    const { intl: { messages } } = this.props;
    return messages?.coin_crypto?.price_panel || {};
  }

  getPrice = () => {
    const { crypto } = this.state;
    const { currencyByLocal } = this.props;
    if (!crypto?.id) return;
    this.props.coinGetBuyPrice({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=1&currency=${crypto?.id}&fiat_currency=${currencyByLocal}&type=bank&level=${1}&user_check=1&check=1`,
      more: { name: crypto?.id },
    });
    this.props.coinGetSellPrice({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?direction=sell&amount=1&currency=${crypto?.id}&fiat_currency=${currencyByLocal}&type=bank&level=${1}&user_check=1&check=1`,
      more: { name: crypto?.id },
    });
  }

  render() {
    const { sellPrice, buyPrice } = this.props;
    const sellPriceStr = `${formatMoneyByLocale(sellPrice?.fiatLocalAmount || 0)} ${sellPrice?.fiatLocalCurrency}`;
    const buyPriceStr = `${formatMoneyByLocale(buyPrice?.fiatLocalAmount || 0)} ${buyPrice?.fiatLocalCurrency}`;
    if (!sellPrice && !buyPrice) {
      return null;
    }

    return (
      <div className={scopedCss('container')}>
        <div className={scopedCss('label')}>
          <img src={this.state.crypto?.logo} alt="" />
          <span>{this.state.crypto?.name}</span>
        </div>
        {buyPrice && (
          <div className={scopedCss('buy')}>
            <span>{this.getLocalStr().buy}</span>
            <span>{buyPriceStr}</span>
          </div>
        )}
        {sellPrice && (
          <div className={scopedCss('sell')}>
            <span>{this.getLocalStr().sell}</span>
            <span>{sellPriceStr}</span>
          </div>
        )}
      </div>
    );
  }
}

const mapDispatch = {
  coinGetSellPrice,
  coinGetBuyPrice,
};

const mapState = (state, props) => {
  return {
    currencyByLocal: state.app.ipInfo.currency || 'HKD',
    country: state.app.ipInfo.country || 'HK',
    sellPrice: state.coin?.sellPrice[props?.crypto?.id],
    buyPrice: state.coin?.buyPrice[props?.crypto?.id],
  };
};

CryptoPrice.defaultProps = {
  sellPrice: null,
  buyPrice: null,
};

CryptoPrice.propTypes = {
  sellPrice: PropTypes.object,
  buyPrice: PropTypes.object,
  coinGetBuyPrice: PropTypes.func.isRequired,
  coinGetSellPrice: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(connect(mapState, mapDispatch)(CryptoPrice));
