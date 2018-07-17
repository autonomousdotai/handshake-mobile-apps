import React from 'react';
import PropTypes from 'prop-types';
// style
import '../styles.scss';
import './FeedExchange.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
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
  NB_BLOCKS,

} from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog';
import { connect } from 'react-redux';
import ShakeDetail from '../components/ShakeDetail';
import {
  cancelShakedOffer,
  closeOffer,
  completeShakedOffer,
  shakeOffer,
  shakeOfferItem,
  trackingOnchain,
  withdrawShakedOffer,
} from '@/reducers/exchange/action';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import Offer from '@/models/Offer';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { formatAmountCurrency, formatMoneyByLocale, getHandshakeUserType, getOfferPrice } from '@/services/offer-util';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { getDistanceFromLatLonInKm, getErrorMessageFromCode } from '../utils';
import { ExchangeHandshake, ExchangeCashHandshake } from '@/services/neuron';
import { feedBackgroundColors } from '@/components/handshakes/exchange/config';
import { updateOfferStatus } from '@/reducers/discover/action';
import OfferShop from '@/models/OfferShop';
import { getLocalizedDistance } from '@/services/util';
import { BigNumber } from 'bignumber.js';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';

import { nameFormShakeDetail } from '@/components/handshakes/exchange/components/ShakeDetail';
import CoinCards from '@/components/handshakes/exchange/components/CoinCards';
import { change, clearFields } from 'redux-form';
import { bindActionCreators } from 'redux';

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    // console.log('offer', this.offer);

    this.state = {
      modalContent: '',
      CRYPTO_CURRENCY_LIST: [
        {
          value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], icon: <img src={iconEthereum} width={22} />, hide: false,
        },
        {
          value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], icon: <img src={iconBitcoin} width={22} />, hide: false,
        },
      ],
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)';
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  handleOnShake = (name) => {
    const { offer } = this;
    const { initUserId, authProfile, onFeedClick } = this.props;

    if (initUserId === authProfile?.id) {
      return;
    }

    this.setState({
      CRYPTO_CURRENCY_LIST: [
        {
          value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH], icon: <img src={iconEthereum} width={22} />, hide: !offer.itemFlags.ETH || this.isEmptyBalance(offer.items.ETH),
        },
        {
          value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC], icon: <img src={iconBitcoin} width={22} />, hide: !offer.itemFlags.BTC || this.isEmptyBalance(offer.items.BTC),
        },
      ],
    }, () => {
      onFeedClick({
        modalClassName: 'dialog-shake-detail',
        modalContent: (
          <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} CRYPTO_CURRENCY_LIST={this.state.CRYPTO_CURRENCY_LIST} />
        )
      })
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

        const eth = offer.items.ETH;
        const btc = offer.items.BTC;

        const buyBalance = newCurrency === CRYPTO_CURRENCY.BTC ? btc.buyBalance : eth.buyBalance;
        const sellBalance = newCurrency === CRYPTO_CURRENCY.BTC ? btc.sellBalance : eth.sellBalance;

        let newType = EXCHANGE_ACTION.BUY;

        if (newType === EXCHANGE_ACTION.BUY && sellBalance <= 0) {
          newType = EXCHANGE_ACTION.SELL;
        } else if (newType === EXCHANGE_ACTION.SELL && buyBalance <= 0) {
          newType = EXCHANGE_ACTION.BUY;
        }

        this.props.rfChange(nameFormShakeDetail, 'type', newType);

        this.props.clearFields(nameFormShakeDetail, false, false, 'amount', 'amountFiat');
      }, 100)

      // this.setState({
      //   modalContent: (
      //     <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} CRYPTO_CURRENCY_LIST={this.state.CRYPTO_CURRENCY_LIST} />
      //   ),
      // }, () => {
      //   this.modalRef.open();
      // });
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
    let result = true;

    if (process.env.isProduction && !process.env.isStaging) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = <FormattedMessage id="requireDefaultWalletOnMainNet" />;
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

    const shopType = values.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

    const wallet = MasterWallet.getWalletDefault(values.currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

    if (shopType === EXCHANGE_ACTION.BUY) { // shop buy
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee(NB_BLOCKS, true);
      if (this.showNotEnoughCoinAlert(balance, values.amount, fee, values.currency)) {
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

    this.hideLoading();
    const message = <FormattedMessage id="shakeOfferItemSuccessMassage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(`${URL.HANDSHAKE_ME}`);
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

  getPrices = () => {
    const { listOfferPrice, fiatCurrency } = this.props;
    // console.log('',this.getNameShopDisplayed());
    // console.log('coins - listOfferPrice', listOfferPrice, fiatCurrency);
    const { offer } = this;

    let priceBuyBTC;
    let priceSellBTC;
    let priceBuyETH;
    let priceSellETH;

    const eth = offer.items.ETH;
    const btc = offer.items.BTC;

    // console.log('eth', eth);
    // console.log('btc', btc);

    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.BTC, fiatCurrency);
      priceBuyBTC = offerPrice.price * (1 + btc?.buyPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.BTC, fiatCurrency);
      priceSellBTC = offerPrice.price * (1 + btc?.sellPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.ETH, fiatCurrency);
      priceBuyETH = offerPrice.price * (1 + eth?.buyPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.ETH, fiatCurrency);
      priceSellETH = offerPrice.price * (1 + eth?.sellPercentage / 100) || 0;
    }

    return {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    };
  }

  getNameShopDisplayed = () => {
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
    const { buyBalance, sellBalance } = item
    return !(buyBalance > 0 || sellBalance > 0)
  }

  render() {
    const { offer } = this;
    const { review, reviewCount } = this.props;
    const { modalContent } = this.state;
    const currency = offer.fiatCurrency;

    const coins = [];
    const {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    } = this.getPrices();

    if (offer.itemFlags.ETH) {
      if (!this.isEmptyBalance(offer.items.ETH)) {
        const coin = {};

        coin.name = CRYPTO_CURRENCY.ETH;
        coin.color = 'linear-gradient(-135deg, #D772FF 0%, #9B10F2 45%, #9E53E1 100%)';
        coin.icon = iconEth;
        const priceBuy = offer.items.ETH.buyBalance > 0 ? formatMoneyByLocale(priceBuyETH, currency) : '-';
        const priceSell = offer.items.ETH.sellBalance > 0 ? formatMoneyByLocale(priceSellETH, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''}`;

        coins.push(coin);
      }
    }

    if (offer.itemFlags.BTC) {
      if (!this.isEmptyBalance(offer.items.BTC)) {
        const coin = {};

        coin.name = CRYPTO_CURRENCY.BTC;
        coin.color = 'linear-gradient(45deg, #FF8006 0%, #FFA733 51%, #FFC349 100%)';
        coin.icon = iconBtc;
        const priceBuy = offer.items.BTC.buyBalance > 0 ? formatMoneyByLocale(priceBuyBTC, currency) : '-';
        const priceSell = offer.items.BTC.sellBalance > 0 ? formatMoneyByLocale(priceSellBTC, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''}`;

        coins.push(coin);
      }
    }
    if (coins.length === 0) return null;

    const address = this.getNameShopDisplayed();
    const distance = this.getOfferDistance();

    return (
      <div>
        <div className="feed-exchange" onClick={() => this.handleOnShake()}>
          <div>
            <CoinCards coins={coins} currency={currency} handleClickCoin={this.handleClickCoin} />
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
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  trackingOnchain: bindActionCreators(trackingOnchain, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
