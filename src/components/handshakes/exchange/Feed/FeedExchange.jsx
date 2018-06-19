import React from 'react';
import PropTypes from 'prop-types';
// style
import '../styles.scss';
import './FeedExchange.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import Button from '@/components/core/controls/Button/Button';
import {
  API_URL,
  APP_USER_NAME,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
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
  HANDSHAKE_ID,
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
import {Ethereum} from '@/models/Ethereum.js';
import {Bitcoin} from '@/models/Bitcoin';
import Offer from '@/models/Offer';
import {MasterWallet} from '@/models/MasterWallet';
import {formatAmountCurrency, formatMoneyByLocale, getHandshakeUserType, getOfferPrice} from '@/services/offer-util';
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import {getDistanceFromLatLonInKm, getErrorMessageFromCode} from "../utils";
import {ExchangeHandshake, ExchangeShopHandshake} from '@/services/neuron';
import {feedBackgroundColors} from '@/components/handshakes/exchange/config';
import {updateOfferStatus} from '@/reducers/discover/action';
import OfferShop from '@/models/OfferShop';
import {getLocalizedDistance} from "@/services/util";
import {BigNumber} from "bignumber.js";
import StarsRating from "@/components/core/presentation/StarsRating";
import Rate from '@/components/core/controls/Rate';

import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';

import {nameFormShakeDetail} from '@/components/handshakes/exchange/components/ShakeDetail';
import {change} from "redux-form";
import {bindActionCreators} from "redux";

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    console.log('offer',this.offer);

    this.state = {
      modalContent: '',
      CRYPTO_CURRENCY_LIST: [
        { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], icon: <img src={iconEthereum} width={22} />, hide: false},
        { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], icon: <img src={iconBitcoin} width={22} />, hide: false},
      ]
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
    const { offer } = this;
    this.modalRef.open();
    this.setState({CRYPTO_CURRENCY_LIST: [
      { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], icon: <img src={iconEthereum} width={22} />, hide: !offer.itemFlags.ETH},
      { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], icon: <img src={iconBitcoin} width={22} />, hide: !offer.itemFlags.BTC},
    ]}, () => {
      for (let crypto of this.state.CRYPTO_CURRENCY_LIST) {
        if (!crypto.hide) {
          this.props.rfChange(nameFormShakeDetail, 'currency', crypto.value);
          break;
        }
      }
    });
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
    let result = true;

    if (process.env.isProduction && !process.env.isStaging) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = <FormattedMessage id="requireDefaultWalletOnMainNet"/>;
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
      this.props.showAlert({
        message: <div className="text-center">
          <FormattedMessage id="notEnoughCoinInWallet"
                            values={ {
                              amount: formatAmountCurrency(balance),
                              fee: formatAmountCurrency(fee),
                              currency: currency,
                            } } />
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
      const fee = await wallet.getFee(10, true);

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

    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { currency, type, amount, totalAmount, systemAddress, offChainId } = offerShake;
    const { offer } = this;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { // shop buy
        // const amount = totalAmount;

        const wallet = MasterWallet.getWalletDefault(currency);
        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);
        const result = await exchangeHandshake.initByCustomer(offer.items.ETH.userAddress, amount, offChainId);

        console.log('handleShakeOfferSuccess', result);
      }
    } else if (currency === CRYPTO_CURRENCY.BTC) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);
        wallet.transfer(systemAddress, totalAmount, 10).then((success) => {
          console.log('transfer', success);
        });
      }
    }

    this.hideLoading();
    const message = <FormattedMessage id="shakeOfferItemSuccessMassage" />;

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
    const { ipInfo: { latitude, longitude, country }, location } = this.props;
    const { offer } = this;
    // let distanceKm = 0;
    // let distanceMiles = 0;

    let distanceKm = 0;
    if (location) {
      const latLng = location.split(',');
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1]);
    }

    return <FormattedMessage id="offerDistanceContent"
                                      values={ {
                                        distance: getLocalizedDistance(distanceKm, country)
                                      } } />;
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
    const { username, itemFlags, items } = this.offer;
    if (username) { return username; }
    if (itemFlags.ETH) {
      const wallet = new Ethereum();
      wallet.address = items.ETH.userAddress;
      return wallet.getShortAddress();
    }
    if (itemFlags.BTC) {
      const wallet = new Bitcoin();
      wallet.address = items.BTC.userAddress;
      return wallet.getShortAddress();
    }
    return '';
  }

  handleChat = (e) => {
    e.stopPropagation();
    const { id, chatUsername } = this.offer;
    this.props.history.push(`${URL.HANDSHAKE_CHAT}/${id}`);
  }

  handleCreateExchange = () => {
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }


  render() {
    const { offer } = this;
    const { review, reviewCount } = this.props;
    const currency = offer.fiatCurrency;

    let coins = [];

    const {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    } = this.getPrices();

    if (offer.itemFlags.BTC) {
      let coin = {};

      coin.name = CRYPTO_CURRENCY.BTC;
      coin.color = '#FF880E';
      coin.icon = iconBtc;
      coin.priceBuy = offer.items.BTC.buyBalance ? formatMoneyByLocale(priceBuyBTC,currency) : '-';
      coin.priceSell = offer.items.BTC.sellBalance ? formatMoneyByLocale(priceSellBTC,currency) : '-';

      coins.push(coin);
    }

    if (offer.itemFlags.ETH) {
      let coin = {};

      coin.name = CRYPTO_CURRENCY.ETH;
      coin.color = 'linear-gradient(-135deg, #CB75ED 0%, #9E53E1 100%)';
      coin.icon = iconEth;
      coin.priceBuy = offer.items.ETH.buyBalance ? formatMoneyByLocale(priceBuyETH,currency) : '-';
      coin.priceSell = offer.items.ETH.sellBalance ? formatMoneyByLocale(priceSellETH,currency) : '-';

      coins.push(coin);
    }

    const address = this.getNameShopDisplayed();
    const distance = this.getOfferDistance();

    return (
      <div>
        <div className="feed-exchange" onClick={this.handleOnShake}>
          <div>
            <div className="coins-wrapper">
              {
                coins.map((coin, index) => {
                  const { name, priceBuy, priceSell, color, icon } = coin
                  return (
                    <span key={index} className="coin-item" style={{ background: color }} onClick={() => console.log('click item')}>
                      {/*<div className="icon-coin"><img src={icon}/></div>*/}
                      <div className="name mb-1">{name}</div>
                      <div className="price-wrapper"><label><FormattedMessage id="ex.discover.label.priceBuy" /></label>&nbsp;<span className="price">{priceBuy} {currency}</span></div>
                      <div className="price-wrapper"><label><FormattedMessage id="ex.discover.label.priceSell" /></label>&nbsp;<span className="price">{priceSell} {currency}</span></div>
                    </span>
                  )
                })
              }
            </div>
            <div className="info-ex">
              <div>
                <div className="address">{address}</div>
                <div className="review"><StarsRating className="d-inline-block" starPoint={review} startNum={5} /> <FormattedMessage id="ex.discover.label.reviews" values={{ reviewCount }} /></div>
                <div className="distance">{distance}</div>
              </div>
              <div className="btn-chat">
                <button className="btn" onClick={this.handleChat}>
                  <img src={iconChat} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/*<Button block className="mt-2" onClick={this.handleOnShake}><FormattedMessage id="btn.shake"/></Button>*/}

        <div className="ex-sticky-note">
          <div className="mb-2"><FormattedMessage id="ex.discover.banner.text"/></div>
          <div><button className="btn btn-become" onClick={this.handleCreateExchange}><FormattedMessage id="ex.discover.banner.btnText"/></button></div>
        </div>
        <ModalDialog onRef={modal => this.modalRef = modal} className="dialog-shake-detail">
          <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} CRYPTO_CURRENCY_LIST={this.state.CRYPTO_CURRENCY_LIST} />
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

const mapDispatch = (dispatch) => ({
  shakeOfferItem: bindActionCreators(shakeOfferItem, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
