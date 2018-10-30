import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { coinGetSellPrice, coinGetBuyPrice } from '@/reducers/coin/action';
import { connect } from 'react-redux';
import { formatMoneyByLocale } from '@/services/offer-util';
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

  getPrice = () => {
    const { crypto } = this.state;
    if (!crypto?.id) return;
    this.props.coinGetSellPrice({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=1&currency=${crypto?.id}&fiat_currency=${'VND'}&type=bank&level=${1}&user_check=1&check=1`,
      more: { name: crypto?.id },
    });
    this.props.coinGetBuyPrice({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?direction=sell&amount=1&currency=${crypto?.id}&fiat_currency=VND&type=bank&level=${1}&user_check=1&check=1`,
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
        {sellPrice && (
          <div className={scopedCss('sell')}>
            <span>Sell</span>
            <span>{sellPriceStr}</span>
          </div>
        )}
        {buyPrice && (
          <div className={scopedCss('buy')}>
            <span>Buy</span>
            <span>{buyPriceStr}</span>
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
    country: state.app.ipInfo.country,
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
};

export default connect(mapState, mapDispatch)(CryptoPrice);
