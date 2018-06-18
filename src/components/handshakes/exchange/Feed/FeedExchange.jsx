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

  showLoading = () => {
    this.props.showLoading({ message: ''  });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  handleOnShake = () => {
    this.modalRef.open();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      }
    });
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { intl } = this.props;
    let result = true;

    if (process.env.isProduction) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = intl.formatMessage({id: 'requireDefaultWalletOnMainNet'}, {});
        this.showAlert(message);
        result = false;
      }
    }

    return result;
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance);
    const bnAmount = new BigNumber(amount);
    const bnFee = new BigNumber(fee);

    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee));

    if (condition) {
      const { intl } = this.props;
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: currency,
          })}
        </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

    return condition;
  }


  // //////////////////////

  shakeOfferItem = async (values) => {
    console.log('shakeOfferItem', values);
    this.modalRef.close();

    const { authProfile } = this.props;
    const { offer } = this;

    const shopType = values.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

    const wallet = MasterWallet.getWalletDefault(values.currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

    if (shopType === EXCHANGE_ACTION.BUY) { // shop buy
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee(4, true);

      if (this.showNotEnoughCoinAlert(balance, values.amount, fee, values.currency)) {
        return;
      }
    }

    const offerItem = {
      type: shopType,
      currency: values.currency,
      amount: values.amount,
      username: authProfile?.name,
      email: authProfile?.email,
      contact_phone: authProfile?.phone,
      contact_info: authProfile?.address,
      user_address: wallet.address,
      chat_username: authProfile?.username,
    };

    this.showLoading();
    this.props.shakeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/${API_URL.EXCHANGE.SHAKES}`,
      METHOD: 'POST',
      data: offerItem,
      successFn: this.handleShakeOfferItemSuccess,
      errorFn: this.handleShakeOfferItemFailed,
    });
  }

  handleShakeOfferItemSuccess = async (responseData) => {
    console.log('handleShakeOfferItemSuccess', responseData);

    const { intl } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { currency, type, totalAmount, systemAddress, offChainId } = offerShake;
    const { offer } = this;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { // shop buy
        const amount = totalAmount;

        const wallet = MasterWallet.getWalletDefault(currency);
        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);
        const result = await exchangeHandshake.initByCustomer(offer.items.ETH.userAddress, amount, offChainId);

        console.log('handleShakeOfferSuccess', result);
      }
    } else if (currency === CRYPTO_CURRENCY.BTC) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);
        wallet.transfer(systemAddress, totalAmount).then((success) => {
          console.log('transfer', success);
        });
      }
    }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'shakeOfferItemSuccessMassage' }, {
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleShakeOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  handleActionFailed = (e) => {
    this.hideLoading();
    // console.log('e', e);
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  getOfferDistance = () => {
    const { intl,  ipInfo: { latitude, longitude, country }, location } = this.props;
    const { offer } = this;
    // let distanceKm = 0;
    // let distanceMiles = 0;

    let distanceKm = 0;
    if (location) {
      const latLng = location.split(',');
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1]);
    }

    return intl.formatMessage({ id: 'offerDistanceContent' }, {
      distance: getLocalizedDistance(distanceKm, country)
      // distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
      // distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
    });
  }

  getPrices = () => {
    const { listOfferPrice } = this.props;

    let priceBuyBTC;
    let priceSellBTC;
    let priceBuyETH;
    let priceSellETH;

    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.BTC);
      priceBuyBTC = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.BTC);
      priceSellBTC = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.ETH);
      priceBuyETH = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.ETH);
      priceSellETH = offerPrice.price;
    }

    return {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    };
  }

  getNameShopDisplayed = () => {
    const { username, item_flags, items } = this.offer;
    if (username) { return username; }
    if (item_flags && item_flags.ETH) {
      const wallet = new Ethereum();
      wallet.address = items.ETH.user_address;
      return wallet.getShortAddress();
    }
    if (item_flags && item_flags.BTC) {
      const wallet = new Bitcoin();
      wallet.address = items.BTC.user_address;
      return wallet.getShortAddress();
    }
    return '';
  }

  render() {
    const { offer } = this;
    const nameShopDisplayed = this.getNameShopDisplayed();
    const currency = offer.fiatCurrency;
    const success = offer.transactionCount.success || 0;
    const failed = offer.transactionCount.failed || 0;

    const distance = this.getOfferDistance();

    const {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    } = this.getPrices();

    return (
      <div className="feed-exchange">
        <Feed
          className="feed"
          background={this.mainColor}
        >
          <div className="name-shop">{nameShopDisplayed}</div>
          <table className="table-ex mt-2">
            <thead>
              <tr>
                <th></th>
                <th className="header-text buy-color">Buy rate</th>
                <th className="header-text sell-color">Sell rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="image"><img src={iconBitcoin} /></div></td>
                <td>
                  <div className="buy-color price-number mt-1">{formatMoney(priceBuyBTC)}</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number mt-1">{formatMoney(priceSellBTC)}</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
              <tr>
                <td><div className="image"><img src={iconEthereum} /></div></td>
                <td>
                  <div className="buy-color price-number mt-1">{formatMoney(priceBuyETH)}</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number mt-1">{formatMoney(priceSellETH)}</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2">
            <div className="distance"><img src={iconLocation}/>{distance}</div>
            <div className="transaction-successful"><img src={iconOk}/> {success} successful</div>
            <div className="transaction-failed"><img src={iconCancel}/> {failed} failed</div>
          </div>
        </Feed>
        <Button block className="mt-2" onClick={this.handleOnShake}>Shake</Button>
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
