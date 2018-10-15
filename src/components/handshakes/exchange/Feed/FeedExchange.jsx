import React from 'react';
import PropTypes from 'prop-types';
// style
import '../styles.scss';
import './FeedExchange.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  EXCHANGE_ACTION,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_ID,
  NB_BLOCKS,
  URL,
} from '@/constants';
import { connect } from 'react-redux';
import ShakeDetail from '../components/ShakeDetail';
import { shakeOfferItem, trackingLocation, trackingOnchain } from '@/reducers/exchange/action';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import Offer from '@/models/Offer';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { formatAmountCurrency, formatMoneyByLocale, getLatLongHash, getOfferPrice } from '@/services/offer-util';
import { getUserLocation, showAlert } from '@/reducers/app/action';
import { getDistanceFromLatLonInKm, getErrorMessageFromCode } from '../utils';
import { ExchangeCashHandshake } from '@/services/neuron';
import { getLocalizedDistance } from '@/services/util';
import { BigNumber } from 'bignumber.js';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconStation from '@/assets/images/icon/own-key.svg';

import { nameFormShakeDetail } from '@/components/handshakes/exchange/components/ShakeDetail';
import CoinCards from '@/components/handshakes/exchange/components/CoinCards';
import { change, clearFields } from 'redux-form';
import { bindActionCreators } from 'redux';

const ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
};

class FeedExchange extends React.PureComponent {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { offer } = props;

    this.offer = offer;

    // console.log('offer', this.offer);

    const cryptoCurrencyList = Object.values(CRYPTO_CURRENCY).map(item => ({
      value: item, text: item, icon: <img src={ICONS[item]} width={22} />, hide: false,
    }));

    this.state = {
      modalContent: '',
      CRYPTO_CURRENCY_LIST: cryptoCurrencyList,
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)';
  }

  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  handleOnShake = (name) => {
    const { offer } = this;
    const { initUserId, authProfile, onFeedClick, sortPriceIndexActive } = this.props;

    if (initUserId === authProfile?.id) {
      return;
    }

    const cryptoCurrencyList = Object.values(CRYPTO_CURRENCY).map(currency => ({
      value: currency, text: currency, icon: <img src={ICONS[currency]} width={22} />, hide: !offer.itemFlags[currency] || this.isEmptyBalance(offer.items[currency]),
    }));

    this.setState({
      CRYPTO_CURRENCY_LIST: cryptoCurrencyList,
    }, () => {
      onFeedClick({
        modalClassName: 'dialog-shake-detail',
        modalContent: (
          <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} CRYPTO_CURRENCY_LIST={this.state.CRYPTO_CURRENCY_LIST} />
        ),
      });
      setTimeout(() => {
        let newCurrency = '';
        if (name) {
          newCurrency = name;
          this.props.rfChange(nameFormShakeDetail, 'currency', name);
        } else {
          for (const crypto of this.state.CRYPTO_CURRENCY_LIST) {
            if (!crypto.hide) {
              newCurrency = crypto.value;
              this.props.rfChange(nameFormShakeDetail, 'currency', crypto.value);
              break;
            }
          }
        }

        for (const item of Object.values(offer.items)) {
          if (item.currency === newCurrency) {
            let newType = EXCHANGE_ACTION.BUY;
            if (sortPriceIndexActive.includes('buy')) {
              newType = EXCHANGE_ACTION.SELL;
            } else if (sortPriceIndexActive.includes('sell')) {
              newType = EXCHANGE_ACTION.BUY;
            } else {
              const { sellBalance } = item;

              if (sellBalance <= 0) {
                newType = EXCHANGE_ACTION.SELL;
              }
            }

            this.props.rfChange(nameFormShakeDetail, 'type', newType);
            break;
          }
        }

        this.props.clearFields(nameFormShakeDetail, false, false, 'amount', 'amountFiat');
      }, 100);
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

    if (process.env.isDojo) {
      result = true;
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
        message: <div className="text-center">
          <FormattedMessage
            id="notEnoughCoinInWallet"
            values={{
                              amount: formatAmountCurrency(balance),
                              fee: formatAmountCurrency(fee),
                              currency,
                            }}
          />
        </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }

    return condition;
  }


  // //////////////////////

  shakeOfferItem = async (values) => {
    console.log('shakeOfferItem', values);
    this.props.modalRef.close();

    const { authProfile } = this.props;
    const { offer } = this;

    this.showLoading();

    const shopType = values.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

    const wallet = MasterWallet.getWalletDefault(values.currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      this.hideLoading();
      return;
    }

    if (shopType === EXCHANGE_ACTION.BUY) { // shop buy
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee(NB_BLOCKS, true);
      if (this.showNotEnoughCoinAlert(balance, values.amount, fee, values.currency)) {
        this.hideLoading();
        return;
      }
    }

    const offerItem = {
      type: shopType,
      currency: values.currency,
      amount: values.amount.toString(),
      username: authProfile?.name,
      email: authProfile?.email,
      contact_phone: authProfile?.phone,
      contact_info: authProfile?.address,
      user_address: wallet.address,
      chat_username: authProfile?.username,
    };

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
    const {
      currency, type, amount, totalAmount, systemAddress, offChainId, status,
    } = offerShake;
    const { offer } = this;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { // shop buy
        // const amount = totalAmount;
        try {
          const wallet = MasterWallet.getWalletDefault(currency);
          const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
          const result = await cashHandshake.initByCustomer(offer.items.ETH.userAddress, amount, offChainId);

          console.log('handleShakeOfferSuccess', result);

          this.trackingOnchain(offer.id, offerShake.id, result.hash, status, '', currency);
        } catch (e) {
          this.trackingOnchain(offer.id, offerShake.id, '', status, e.toString(), currency);
          console.log('handleShakeOfferSuccess', e.toString());
        }
      }
    } else if (currency === CRYPTO_CURRENCY.BTC) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);
        wallet.transfer(systemAddress, amount, NB_BLOCKS).then((success) => {
          console.log('transfer', success);
        });
      }
    }

    this.trackingLocation(offer.id, offerShake.id, status);
    this.hideLoading();
    const message = <FormattedMessage id="shakeOfferItemSuccessMassage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.EXCHANGE}&tab=transaction`);
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

  trackingOnchain = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const data = {
      tx_hash: txHash, action, reason, currency,
    };

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

  trackingLocation = (offerStoreId, offerStoreShakeId, action) => {
    const { trackingLocation, getUserLocation } = this.props;
    getUserLocation({
      successFn: (ipInfo) => {
        const data = {
          data: getLatLongHash(ipInfo?.locationMethod, ipInfo.latitude, ipInfo.longitude),
          ip: ipInfo?.ip,
          action,
        };
        trackingLocation({
          PATH_URL: `exchange/offer-stores/${offerStoreId}/shakes/${offerStoreShakeId}/7tHCLp8XpajPJaVh`,
          METHOD: 'POST',
          data,
        });
      },
    });
  }

  getOfferDistance = () => {
    const {
      ipInfo: { country }, latitude, longitude, location,
    } = this.props;
    const { offer } = this;
    // let distanceKm = 0;
    // let distanceMiles = 0;

    let distanceKm = 0;
    if (location) {
      const latLng = location.split(',');
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1]);
    }

    return (<FormattedMessage
      id="offerDistanceContent"
      values={{
        distance: getLocalizedDistance(distanceKm, country),
      }}
    />);
  }

  getPrices = (currency) => {
    const { offer } = this;
    const { listOfferPrice } = this.props;
    const { fiatCurrency } = offer;
    let priceBuy = 0;
    let priceSell = 0;

    for (const item of Object.values(offer.items)) {
      if (item.currency === currency) {
        if (listOfferPrice) {
          let offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, currency, fiatCurrency);
          priceBuy = offerPrice.price * (1 + item.buyPercentage / 100) || 0;

          offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, currency, fiatCurrency);
          priceSell = offerPrice.price * (1 + item.sellPercentage / 100) || 0;
        }

        break;
      }
    }

    return { priceBuy, priceSell };
  }

  getCoinList = () => {
    const { offer } = this;
    const { fiatCurrency } = offer;
    const coins = [];

    Object.values(CRYPTO_CURRENCY).map(currency => {
      const item = offer.items[currency];
      if (offer.itemFlags[currency] && !this.isEmptyBalance(item)) {
        const {
          buyBalance, sellBalance, buyAmount, sellAmount, status,
        } = item;
        const { priceBuy: priceBuyValue, priceSell: priceSellValue } = this.getPrices(currency);
        const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
        const amountBuy = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? buyAmount : buyBalance;
        const amountSell = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? sellAmount : sellBalance;

        const coin = {};

        coin.name = currency;
        coin.color = CRYPTO_CURRENCY_COLORS[currency].color;
        coin.icon = CRYPTO_CURRENCY_COLORS[currency].icon;
        const priceBuy = amountBuy > 0 ? formatMoneyByLocale(priceBuyValue, fiatCurrency) : '-';
        const priceSell = amountSell > 0 ? formatMoneyByLocale(priceSellValue, fiatCurrency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? fiatCurrency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(amountBuy)} ${currency}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? fiatCurrency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(amountSell)} ${currency}` : ''}`;

        coins.push(coin);
      }

      return null;
    });

    return coins;
  }

  getDisplayName = () => {
    const { username, itemFlags, items } = this.offer;
    if (username) {
      const wallet = new Ethereum();
      if (wallet.checkAddressValid(username) === true) {
        wallet.address = username;
        return wallet.getShortAddress();
      }
      return username;
    }
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
  handleClickCoin = (e, name) => {
    e.stopPropagation();
    this.handleOnShake(name);
  }

  isEmptyBalance = (item) => {
    const { buyBalance, sellBalance } = item;
    return !(buyBalance > 0 || sellBalance > 0);
  }

  render() {
    const { offer } = this;
    const { review, reviewCount, ownerStation } = this.props;
    const { modalContent } = this.state;
    const currency = offer.fiatCurrency;

    const coins = this.getCoinList();

    if (coins.length === 0) return null;

    const address = this.getDisplayName();
    const distance = this.getOfferDistance();

    return (
      <div>
        <div className="feed-exchange" onClick={() => this.handleOnShake()}>
          <div>
            <CoinCards coins={coins} currency={currency} handleClickCoin={this.handleClickCoin} />
            <div className="info-ex">
              <div>
                <div className="address">{ownerStation && <img className="owner-station" src={iconStation} /> } {address}</div>
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
        {/* <Button block className="mt-2" onClick={this.handleOnShake}><FormattedMessage id="btn.shake"/></Button>
        <ModalDialog onRef={modal => this.modalRef = modal} className="dialog-shake-detail">
          {modalContent}
        </ModalDialog> */}
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

const mapDispatch = dispatch => ({
  shakeOfferItem: bindActionCreators(shakeOfferItem, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  trackingOnchain: bindActionCreators(trackingOnchain, dispatch),
  trackingLocation: bindActionCreators(trackingLocation, dispatch),
  getUserLocation: bindActionCreators(getUserLocation, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
