import React, { Component } from 'react';
import PropTypes from 'prop-types';
import btcIcon from '@/assets/images/icon/coin/btc.svg';
import bchIcon from '@/assets/images/icon/coin/bch.svg';
import ethIcon from '@/assets/images/icon/coin/eth.svg';
import { injectIntl } from 'react-intl';
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
];

const scopedCss = (className) => `crypto-coin-price-panel-${className}`;

class PricePanel extends Component {
  getLocalStr = () => {
    const { intl: { messages } } = this.props;
    return messages?.coin_crypto?.price_panel || {};
  }

  renderList = () => {
    return CRYPTOS.map(crypto => <CryptoPrice key={crypto?.id} crypto={crypto} />);
  }

  render() {
    return (
      <div className={scopedCss('container')}>
        <span className={scopedCss('label')}>{this.getLocalStr().price}</span>
        {this.renderList()}
      </div>
    );
  }
}

PricePanel.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(PricePanel);
