import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {BigNumber} from 'bignumber.js';
import {AMOUNT_DECIMAL, PRICE_DECIMAL} from "@/constants";


class FeedExchange extends React.PureComponent {
  render() {
    const {type, amount, currency, fiat_amount, ...props } = this.props;
    return (
      <div>
        <Feed className="feed p-2 text-white" background="#FF2D55">
          <h5>
            <FormattedMessage id="offerHandShakeContent" values={{ offerType: type === 'buy' ? 'Buy': 'Sell',
            amount: new BigNumber(amount).toFormat(AMOUNT_DECIMAL), currency: currency, total: new BigNumber(fiat_amount).toFormat(PRICE_DECIMAL)
            }}/>
          </h5>
          <div className="media">
            <img className="mr-1" src={iconLocation} width={22} />
              <div className="media-body">
                <h6 className="mt-0">81 E.Augusta Ave. Salinas</h6>
                <div>
                  <small>
                    <FormattedMessage id="offerDistanceContent" values={{ offerType: type === 'buy' ? 'Buyer': 'Seller',
                      distance: 100}} />
                  </small>
                </div>
              </div>
          </div>
        </Feed>
        <Button block className="mt-2">Shake now</Button>
      </div>
    );
  }
}

FeedExchange.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

export default FeedExchange;
