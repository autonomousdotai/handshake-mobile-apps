import React from 'react';
import FeedMeCash from './FeedMeCash';
import {APP_USER_NAME, HANDSHAKE_EXCHANGE_CC_STATUS, HANDSHAKE_EXCHANGE_CC_STATUS_NAME,} from '@/constants';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {formatAmountCurrency, formatMoneyByLocale, getHandshakeUserType} from '@/services/offer-util';
import Offer from '@/models/Offer';

class FeedMeInstantContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initUserId, shakeUserIds, extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;
  }

  calculateFiatAmount = () => {
    const { offer } = this;

    return offer.fiatAmount;
  }

  getMessageContent = () => {
    const { initAt } = this.props;
    const { offer } = this;
    const {
      amount, currency, fiatCurrency, feePercentage,
    } = offer;

    let just = ' ';

    const hours = Math.abs(Date.now() - (initAt * 1000)) / 36e5;

    if (hours < 4) {
      just = ' just ';
    }

    const fiatAmount = this.calculateFiatAmount();

    const message = (<FormattedMessage
      id="instantOfferHandShakeContent"
      values={{
        just,
        offerType: 'bought',
        amount: formatAmountCurrency(amount),
        currency,
        currency_symbol: fiatCurrency,
        total: formatMoneyByLocale(fiatAmount, fiatCurrency),
      }}
    />);

    return message;
  }

  getActionButtons = () => {
    const actionButtons = null;

    return actionButtons;
  }

  getMessageMovingCoin = () => {
    const { status } = this.props;

    let idMessage = '';

    switch (status) {
      case HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING: {
        idMessage = 'movingCoinFromEscrow';
        break;
      }
      default: {
        // code
        break;
      }
    }

    let message = '';
    if (idMessage) {
      message = <FormattedMessage id={idMessage} values={{}} />;
    }

    return message;
  }

  render() {
    const { extraData, status, getDisplayName } = this.props;

    const offer = Offer.offer(JSON.parse(extraData));
    this.offer = offer;

    const from = <FormattedMessage id="ex.me.label.from" />;
    const email = APP_USER_NAME;
    const statusText = HANDSHAKE_EXCHANGE_CC_STATUS_NAME[status];
    const showChat = false;
    const chatUsername = '';
    const nameShop = getDisplayName();
    const message = this.getMessageContent();
    const actionButtons = this.getActionButtons();
    const messageMovingCoin = this.getMessageMovingCoin();

    const feedProps = {
      from,
      email,
      statusText,
      message,
      showChat,
      chatUsername,
      nameShop,
      messageMovingCoin,
      actionButtons,
    };

    return (
      <FeedMeCash {...this.props} {...feedProps} />
    );
  }
}

FeedMeInstantContainer.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(FeedMeInstantContainer);
