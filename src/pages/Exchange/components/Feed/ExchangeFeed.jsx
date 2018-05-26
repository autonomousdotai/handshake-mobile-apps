import React from 'react';
import PropTypes from 'prop-types';
// style
import './ExchangeFeed.scss';
import {FormattedMessage} from 'react-intl';

class ExchangeFeed extends React.PureComponent {
  BACKGROUND_COLORS = ['#0064ff','#ff00a2','#ff9b00', '#00ce7d'];

  backgroundCss(background) {
    return background ? background : this.BACKGROUND_COLORS[Math.floor(Math.random() * this.BACKGROUND_COLORS.length)];
  }

  render() {
    const { className, background, children, handShake, ...props } = this.props;
    const styleCss = {
      background: this.backgroundCss(background)
    };
    console.log('handShake', handShake);
    return (
      <div className={`${className || ''}`} style={styleCss} {...props}>
        <p className="description"><FormattedMessage id="offerHandShakeContent" values={{ offerType: handShake.type === 'buy' ? 'Buy': 'Sell',
          amount: handShake.amount, currency: handShake.currency, total: handShake.fiat_amount
        }} /></p>
        <p className="email"></p>
        <p className="email"><FormattedMessage id="offerDistanceContent" values={{ offerType: handShake.type === 'buy' ? 'Buyer': 'Seller',
          distance: 100}} /></p>
      </div>
    );
  }
}

ExchangeFeed.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

export default ExchangeFeed;
