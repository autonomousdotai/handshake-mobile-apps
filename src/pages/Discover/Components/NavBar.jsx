import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import './NavBar.scss';
import {
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_COLORS,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
} from '@/constants';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import { formatMoneyByLocale } from '@/services/offer-util';

const listAction = Object.values(EXCHANGE_ACTION).map((item) => {
  return { value: item, text: EXCHANGE_ACTION_NAME[item], bgColorActive: EXCHANGE_ACTION_COLORS[item].color };
});

const listCoin = Object.values(CRYPTO_CURRENCY).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_CURRENCY_COLORS[item].icon} width={25} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <img src={CRYPTO_ICONS[item]} width={24} /> };
});

class NavBar extends React.Component {
  render() {
    const { messages } = this.props.intl;
    const { listOfferPriceCashAtm } = this.props;

    return listOfferPriceCashAtm && listOfferPriceCashAtm.length > 0 ? (
      <div className="cash-nav-bar">
        {/* <button type="button" className="btn bg-transparent mr-2" onClick={() => console.log('clickmenu')}>☰</button> */}
        {/* <button className="ml-2">
          <img src={iconMyATM} width={24} />
          <span className="mx-2">My ATM</span>
        </button> */}
        <div className="d-inline-block">
          {
            listCurrency.map(coin => {
              const { id, text } = coin;
              const price = listOfferPriceCashAtm.find(item => item.currency === id);

              return price ? (
                <span key={id} className="d-inline-block mr-3">
                  {text}
                  {' '}
                  <span><strong>{formatMoneyByLocale(price.price, FIAT_CURRENCY.USD)}</strong> {FIAT_CURRENCY.USD} </span>
                </span>
              ) : null;
            })
          }
        </div>
      </div>
    ) : null;
  }
}

const mapState = state => ({
  listOfferPriceCashAtm: state.exchange.listOfferPriceCashAtm,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(NavBar));
