import React from 'react';
import PropTypes from 'prop-types';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconLocation from '@/assets/images/icon/icons8-marker.svg';
import iconOk from '@/assets/images/icon/icons8-ok.svg';
import iconCancel from '@/assets/images/icon/icons8-cancel.svg';
// style
import './FeedExchange.scss';
import {injectIntl} from 'react-intl';
import Feed from '@/components/core/presentation/Feed/Feed';
import Button from '@/components/core/controls/Button/Button';
import {
  API_URL,
  APP_USER_NAME,
  CRYPTO_CURRENCY,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PERSON,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_FEED_TYPE,
  EXCHANGE_METHOD_PAYMENT,
  HANDSHAKE_EXCHANGE_CC_STATUS_NAME,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_STATUS_NAME,
  HANDSHAKE_USER,
  URL,
} from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog';
import {connect} from 'react-redux';
import ShakeDetail from '../components/ShakeDetail';
import {
  cancelShakedOffer,
  closeOffer,
  completeShakedOffer,
  shakeOffer,
  shakeOfferItem,
  withdrawShakedOffer,
} from '@/reducers/exchange/action';
import { Ethereum } from '@/models/Ethereum.js';
import { Bitcoin } from '@/models/Bitcoin';
import Offer from '@/models/Offer';
import {MasterWallet} from '@/models/MasterWallet';
import {formatAmountCurrency, formatMoney, getHandshakeUserType, getOfferPrice} from '@/services/offer-util';
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import { getDistanceFromLatLonInKm, getErrorMessageFromCode } from "../utils";
import {ExchangeHandshake, ExchangeShopHandshake} from '@/services/neuron';
import {feedBackgroundColors} from '@/components/handshakes/exchange/config';
import {updateOfferStatus} from '@/reducers/discover/action';
import OfferShop from '@/models/OfferShop';
import {getLocalizedDistance} from "@/services/util";
import {BigNumber} from "bignumber.js";

import Rate from '@/components/core/controls/Rate';

import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    console.log('offer',this.offer);

    this.state = {
      modalContent: '',
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)';
  }

  componentDidMount() {
    // this.rateRef.open();
  }

  render() {
    const { offer } = this;

    const { review, reviewCount } = this.props;

    console.log('review, reviewCount',review, reviewCount);

    const coins = [
      {
        name: 'BTC',
        priceBuy: 2134343,
        priceSell: 2323111,
        color: '#FF880E',
        icon: iconBtc
      },
      {
        name: 'ETH',
        priceBuy: 223322,
        priceSell: 231211,
        color: 'linear-gradient(-135deg, #CB75ED 0%, #9E53E1 100%)',
        icon: iconEth
      },
    ]

    // const nameShopDisplayed = this.getNameShopDisplayed();
    // const currency = offer.fiatCurrency;
    // const success = offer.transactionCount.success || 0;
    // const failed = offer.transactionCount.failed || 0;
    //
    // const distance = this.getOfferDistance();

    // const {
    //   priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    // } = this.getPrices();
    const address = '0x2134134'
    const distance = '12 km away'
    return (
      <div>
        <div className="feed-exchange">
          <div>
            <div>
              {
                coins.map((coin, index) => {
                  const { priceBuy, priceSell, color, icon } = coin
                  return (
                    <span key={index} className="coin-item" style={{ background: color }} onClick={() => console.log('click item')}>
                    <div className="icon-coin"><img src={icon}/></div>
                    <div className="price"><label>BUY</label><span>{priceBuy}</span></div>
                    <div className="price"><label>SELL</label><span>{priceSell}</span></div>
                  </span>
                  )
                })
              }
            </div>
            <div className="info-ex">
              <div>
                <div className="address">{address}</div>
                <div className="review">25 reviews</div>
                <div className="distance">{distance}</div>
              </div>
              <div className="btn-chat">
                <button className="btn" onClick={() => console.log('chat')}>
                  <img src={iconChat} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Button block className="mt-2" onClick={this.handleOnShake}>Shake</Button>

        <div className="ex-sticky-note">
          <div className="mb-2">Got coins? Turn them into a money-making machine.</div>
          <div><button className="btn btn-become">BECOME A LOCAL EXCHANGE</button></div>
        </div>
        <ModalDialog onRef={modal => this.modalRef = modal} className="dialog-shake-detail">
          <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} />
        </ModalDialog>
      </div>
    );
  }
}

FeedExchange.propTypes = {
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
  shakeOfferItem,
  showAlert,
  showLoading,
  hideLoading,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
