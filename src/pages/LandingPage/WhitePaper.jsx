/**
 * Trade component.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service
import axios from 'axios';
import qs from 'qs';
import { showAlert } from '@/reducers/app/action';
import { injectIntl } from 'react-intl';

import Alert from '@/components/core/presentation/Alert';

// style
import './WhitePaper.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/trading-ninja.svg';
import tradeCoinExchange from '@/assets/images/icon/landingpage/trade-coin-exchange.svg';
import tradeCoinExchangeRussia from '@/assets/images/icon/landingpage/trade-coin-exchange-russia.svg';
import tradeThirdContainer from '@/assets/images/icon/landingpage/trade-third-container.svg';
import paymentMethodIcon from '@/assets/images/icon/landingpage/trade-payment-method.svg';
import safeIcon from '@/assets/images/icon/landingpage/trade-safe.svg';
import fastAnOnIcon from '@/assets/images/icon/landingpage/trade-fast-and-on.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-white.svg';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';

class Handshake extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="whitePaper">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1></h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Handshake.propTypes = {
};


export default injectIntl(Handshake);
