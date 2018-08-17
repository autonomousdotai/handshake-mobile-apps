import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { EXCHANGE_ACTION, EXCHANGE_ACTION_NAME } from '@/constants';
import { formatMoneyByLocale } from '@/services/offer-util';
import StarsRating from '@/components/core/presentation/StarsRating';

class AllStationDetails extends React.Component {

  flag = null;

  componentDidMount() {
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchend', this.handleTouchEnd);
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart = () => {
    this.flag = 0;
  }
  handleTouchMove = () => {
    this.flag = 1;
  }
  handleTouchEnd = (event) => {
    if (this.flag === 0) {
      const { onChangeShowAllDetails } = this.props;
      if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
        onChangeShowAllDetails(false);
      }
    }
  }

  render() {
    const { messages } = this.props.intl;
    const {
      username, review, onChangeShowAllDetails,
      actionActive, price, fiatCurrency, currencyActive, maxVolume,
      authProfile, initUserId, handleOnShake
    } = this.props;

    return (
      <div ref={(e) => (this.wrapperRef = e)}>
        <div>
          <div className="info-div">
            <div className="s-name">{username}</div>
            <div><StarsRating className="d-inline-block" starPoint={review} startNum={5} /></div>
          </div>
          <div>
            <button
              className="btn btn-sm bg-transparent btn-close"
              onClick={() => onChangeShowAllDetails(false)}
            >&times;
            </button>
          </div>
        </div>
        <hr />
        <div>
          <div className="s-label">{messages.discover.feed.cash.marker.label.price}</div>
          <div className="s-value">
            <span
              className={`${actionActive === EXCHANGE_ACTION.BUY ? 'buy-price' : 'sell-price'}`}
            >{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}
            </span>
            <span>{currencyActive}</span>
          </div>

          <div className="s-label mt-1">{messages.discover.feed.cash.marker.label.maxVolume}</div>
          <div className="s-value">
            <span>{`${maxVolume} ${currencyActive}`}</span>
          </div>
        </div>
        {initUserId !== authProfile?.id && (
          <div className="mt-2">
            <button
              className="btn btn-primary btn-block btn-sm"
              onClick={handleOnShake}
            >{EXCHANGE_ACTION_NAME[actionActive]}{` ${messages.discover.feed.cash.marker.label.tradeNow}`}
            </button>
          </div>
        )}
      </div>
    );
  }
}

const mapState = state => ({});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(AllStationDetails));
