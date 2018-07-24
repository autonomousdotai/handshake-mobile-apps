import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import _sample from 'lodash/sample';
import {BigNumber} from 'bignumber.js';

import Feed from '@/components/core/presentation/Feed/Feed';
import Button from '@/components/core/controls/Button/Button';
import {EXCHANGE_FEED_TYPE, URL,} from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Offer from '@/models/Offer';
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {formatAmountCurrency, getHandshakeUserType} from '@/services/offer-util';
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';

import {feedBackgroundColors} from '@/components/handshakes/exchange/config';
import {Ethereum} from '@/services/Wallets/Ethereum.js';
import {Bitcoin} from '@/services/Wallets/Bitcoin';

import {getErrorMessageFromCode} from '../utils';
import './FeedExchange.scss';
import './FeedMe.scss';
import FeedMeOfferStoreContainer from "./FeedMeOfferStoreContainer";
import FeedMeOfferStoreShakeContainer from "./FeedMeOfferStoreShakeContainer";
import FeedMeSwapContainer from "./FeedMeSwapContainer";
import FeedMeInstantContainer from "./FeedMeInstantContainer";
import {trackingOnchain,} from "@/reducers/exchange/action";
import FeedMeDashboardContainer from "./FeedMeDashboardContainer";

class FeedMe extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initUserId, shakeUserIds, extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;

    this.state = {
      modalContent: '',
      numStars: 0,
    };
    this.mainColor = _sample(feedBackgroundColors);
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  confirmOfferAction = (message, actionConfirm) => {
    console.log('offer', this.offer);

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.handleConfirmAction(actionConfirm)}><FormattedMessage id="ex.btn.confirm" /></Button>
            <Button block className="btn btn-secondary" onClick={this.cancelAction}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  handleConfirmAction = (actionConfirm) => {
    this.modalRef.close();
    actionConfirm();
  }

  cancelAction = () => {
    this.modalRef.close();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: (
        <div className="text-center">
          {message}
        </div>
      ),
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  checkMainNetDefaultWallet = (wallet) => {
    let result = false;

    try {
      if (process.env.isLive) {
        if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
          result = true;
        } else {
          result = false;
        }
      }
    } catch (e) {
      result = false;
    }

    if (!result) {
      const message = <FormattedMessage id="requireDefaultWalletOnMainNet" />;
      this.showAlert(message);
    }

    return result;
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance);
    const bnAmount = new BigNumber(amount);
    const bnFee = new BigNumber(fee);

    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee));

    if (condition) {
      this.props.showAlert({
        message: (
          <div className="text-center">
            <FormattedMessage
              id="notEnoughCoinInWallet"
              values={{
              amount: formatAmountCurrency(balance),
              fee: formatAmountCurrency(fee),
              currency,
            }}
            />
          </div>
        ),
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }

    return condition;
  }

  getNameShopDisplayed = () => {
    const { offer } = this;
    const wallet = new Ethereum();

    if (wallet.checkAddressValid(offer.username) === true) {
      wallet.address = offer.username;
      return wallet.getShortAddress();
    }

    return offer.username;
  }

  handleActionFailed = (e) => {
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  trackingOnchain = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const data = { tx_hash: txHash, action, reason, currency };

    let url = '';
    if (offerStoreShakeId) {
      url = `exchange/offer-stores/${offerStoreId}/shakes/${offerStoreShakeId}/onchain-tracking`;
    } else {
      url = `exchange/offer-stores/${offerStoreId}/onchain-tracking`;
    }
    this.props.trackingOnchain({
      PATH_URL: url,
      data,
      METHOD: 'POST',
      successFn: () => {
      },
      errorFn: () => {

      },
    });
  }

  render() {
    const {
      initUserId, shakeUserIds, extraData, location, state, status, mode = 'discover', ipInfo: { latitude, longitude, country }, initAt, lastUpdateAt, review, reviewCount, ...props
    } = this.props;

    const offer = Offer.offer(JSON.parse(extraData));

    this.offer = offer;
    const modalContent = this.state.modalContent;

    const address = offer.contactInfo;

    const isCreditCard = offer.feedType === EXCHANGE_FEED_TYPE.INSTANT;

    const phone = offer.contactPhone;
    const phoneDisplayed = phone.replace(/-/g, '');


    const feedProps = {
      lastUpdateAt,
      isCreditCard,
      phone , phoneDisplayed,
      address,
      confirmOfferAction: this.confirmOfferAction,
      handleActionFailed: this.handleActionFailed,
      checkMainNetDefaultWallet: this.checkMainNetDefaultWallet,
      showNotEnoughCoinAlert: this.showNotEnoughCoinAlert,
      getNameShopDisplayed: this.getNameShopDisplayed,
      trackingOnchain: this.trackingOnchain,
    };

    let feed = null;

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.INSTANT: {
        feed = <FeedMeInstantContainer {...this.props} {...feedProps} />;

        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE: {
        feed = <FeedMeDashboardContainer {...this.props} {...feedProps} />;

        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE: {
        feed = <FeedMeOfferStoreShakeContainer {...this.props} {...feedProps} />;

        break;
      }
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        feed = <FeedMeSwapContainer {...this.props} {...feedProps} />;

        break;
      }
      default: {
        // code
        break;
      }
    }

    return (
      <div>
        { feed }
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

FeedMe.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  discover: state.discover,
  listOfferPrice: state.exchange.listOfferPrice,
  ipInfo: state.app.ipInfo,
  authProfile: state.auth.profile,
});

const mapDispatch = ({
  showAlert,
  showLoading,
  hideLoading,
  trackingOnchain,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMe));
