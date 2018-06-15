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

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    // console.log('offer',this.offer);

    this.state = {
      modalContent: '',
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)';
  }

  render() {
    const { offer } = this;

    const coins = [
      {
        name: 'BTC',
        priceBuy: 2134343,
        priceSell: 2323111,
        color: 'red'
      },
      {
        name: 'ETH',
        priceBuy: 223322,
        priceSell: 231211,
        color: 'blue'
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
    return (
      <div className="feed-exchange">
        <div>
          <div>
            {
              coins.map((coin, index) => {
                const { name, priceBuy, priceSell, color } = coin
                return (
                  <span key={index} className="coin-item" style={{ background: color }} onClick={() => console.log('click item')}>
                    <div>{name}</div>
                    <div>Buy {priceBuy}</div>
                    <div>Sell {priceSell}</div>
                  </span>
                )
              })
            }
          </div>
          <div>
            <div className="d-inline-block">Review</div>
            <div className="d-inline-block"><button className="btn btn-primary" onClick={() => console.log('chat')}>Chat</button></div>
          </div>
        </div>
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
