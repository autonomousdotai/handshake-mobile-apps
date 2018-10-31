import React, { Component } from 'react';
import btcIcon from '@/assets/images/icon/coin/btc.svg';
import bchIcon from '@/assets/images/icon/coin/bch.svg';
import ethIcon from '@/assets/images/icon/coin/eth.svg';
import CryptoPrice from './CryptoPrice';
import './styles.scss';

const CRYPTOS = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    logo: btcIcon,
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    logo: ethIcon,
  },
  {
    id: 'BCH',
    name: 'Bitcoin Cash',
    logo: bchIcon,
  },
];

const scopedCss = (className) => `crypto-coin-price-panel-${className}`;

export default class PricePanel extends Component {
  renderList = () => {
    return CRYPTOS.map(crypto => <CryptoPrice key={crypto?.id} crypto={crypto} />);
  }

  render() {
    return (
      <div className={scopedCss('container')}>
        <span className={scopedCss('label')}>Price</span>
        {this.renderList()}
      </div>
    );
  }
}

