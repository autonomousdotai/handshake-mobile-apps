import React from 'react';
import FeedMeStation from './FeedMeStation';
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
} from '@/constants';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import OfferShop from '@/models/OfferShop';
import { ExchangeCashHandshake } from '@/services/neuron';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { responseExchangeDataChange } from '@/reducers/me/action';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import { formatAmountCurrency, formatMoneyByLocale, getHandshakeUserType, getOfferPrice } from '@/services/offer-util';
import { deleteOfferItem } from '@/reducers/exchange/action';

import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';

class FeedMeOfferStoreContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;
    const offer = OfferShop.offerShop(JSON.parse(extraData));

    // this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;
  }

  trackingOnchain = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const { trackingOnchain } = this.props;

    if (trackingOnchain) {
      trackingOnchain(offerStoreId, offerStoreShakeId, txHash, action, reason, currency);
    }
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { checkMainNetDefaultWallet } = this.props;

    if (checkMainNetDefaultWallet) {
      return checkMainNetDefaultWallet(wallet);
    }

    return true;
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const { showNotEnoughCoinAlert } = this.props;

    if (showNotEnoughCoinAlert) {
      return showNotEnoughCoinAlert(balance, amount, fee, currency);
    }
  }

  // calculateFiatAmount = (amount, type, percentage) => {
  //   const { offer } = this;
  //   const { listOfferPrice } = this.props;
  //   const { currency, fiatCurrency, } = offer;
  //   let fiatAmount = 0;
  //
  //   if (listOfferPrice) {
  //     const offerPrice = getOfferPrice(listOfferPrice, type, currency, fiatCurrency);
  //     if (offerPrice) {
  //       fiatAmount = amount * offerPrice.price || 0;
  //       fiatAmount += fiatAmount * percentage / 100;
  //     } else {
  //       // console.log('aaaa', offer.type, offer.currency);
  //     }
  //   }
  //
  //   return fiatAmount;
  // }

  // getEmail = () => {
  //   const {
  //     email, contactPhone, currency, userAddress,
  //   } = this.offer;
  //
  //   if (email) { return email; }
  //   if (contactPhone) { return contactPhone; }
  //   if (currency === CRYPTO_CURRENCY.ETH) {
  //     const wallet = new Ethereum();
  //     wallet.address = userAddress;
  //     return wallet.getShortAddress();
  //   }
  //   if (currency === CRYPTO_CURRENCY.BTC) {
  //     const wallet = new Bitcoin();
  //     wallet.address = userAddress;
  //     return wallet.getShortAddress();
  //   }
  //   return '';
  // }

  // getMessageContent = () => {
  //   const { status } = this.props;
  //   const { offer } = this;
  //   const {
  //     buyAmount, sellAmount, currency, buyPercentage, sellPercentage,
  //   } = offer;
  //   let message = '';
  //   const fiatAmountBuy = this.calculateFiatAmount(buyAmount, EXCHANGE_ACTION.BUY, buyPercentage);
  //   const fiatAmountSell = this.calculateFiatAmount(sellAmount, EXCHANGE_ACTION.SELL, sellPercentage);
  //   switch (status) {
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE:
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
  //       message = (
  //         <span>
  //           {offer.buyAmount > 0 && (
  //             <FormattedMessage
  //               id="offerStoreHandShakeContentBuy"
  //               values={{
  //                 offerTypeBuy: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
  //                 amountBuy: offer.buyAmount,
  //                 currency: offer.currency,
  //                 fiatAmountCurrency: offer.fiatCurrency,
  //                 fiatAmountBuy: formatMoneyByLocale(fiatAmountBuy, offer.fiatCurrency),
  //               }}
  //             />
  //           )}
  //           {offer.sellAmount > 0 && (
  //             <FormattedMessage
  //               id="offerStoreHandShakeContentSell"
  //               values={{
  //                 offerTypeSell: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL],
  //                 amountSell: offer.sellAmount,
  //                 currency: offer.currency,
  //                 fiatAmountCurrency: offer.fiatCurrency,
  //                 fiatAmountSell: formatMoneyByLocale(fiatAmountSell, offer.fiatCurrency),
  //               }}
  //             />
  //           )}
  //         </span>
  //       );
  //       break;
  //     }
  //   }
  //
  //   return message;
  // }

  // getActionButtons = () => {
  //   const { confirmOfferAction } = this.props;
  //   const { offer } = this;
  //
  //   const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
  //   let actionButtons = null;
  //
  //   switch (status) {
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE: {
  //       const message = <FormattedMessage id="closeOfferConfirm" values={{ }} />;
  //       actionButtons = (
  //         <div>
  //           <Button
  //             block
  //             className="mt-2 btn btn-secondary"
  //             onClick={() => confirmOfferAction(message, this.deleteOfferItem)}
  //           ><FormattedMessage id="btn.delete" />
  //           </Button>
  //         </div>
  //       );
  //       break;
  //     }
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
  //     case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
  //       break;
  //     }
  //     default: {
  //       // code
  //       break;
  //     }
  //   }
  //
  //   return actionButtons;
  // }

  getPrices = () => {
    const { offer } = this;
    const { listOfferPrice, fiatCurrency } = this.props;

    let priceBuyBTC;
    let priceSellBTC;
    let priceBuyETH;
    let priceSellETH;

    const eth = offer.items.ETH;
    const btc = offer.items.BTC;

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

  isEmptyBalance = (item) => {
    const { buyBalance, sellBalance, buyAmount, sellAmount, status } = item;
    const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
    if (statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED) {
      return !(buyAmount > 0 || sellAmount > 0);
    }
    return !(buyBalance > 0 || sellBalance > 0);
  }

  getCoinList = () => {
    const { offer } = this;
    const { fiatCurrency: currency } = this.props;
    const coins = [];
    const {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    } = this.getPrices();

    if (offer.itemFlags.ETH) {
      const eth = offer.items.ETH;
      const { buyBalance, sellBalance, buyAmount, sellAmount, status } = eth;
      if (!this.isEmptyBalance(eth)) {
        const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
        const amountBuy = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? buyAmount : buyBalance;
        const amountSell = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? sellAmount : sellBalance;

        const coin = {};

        coin.name = CRYPTO_CURRENCY.ETH;
        coin.color = 'linear-gradient(-135deg, #D772FF 0%, #9B10F2 45%, #9E53E1 100%)';
        coin.icon = iconEth;
        const priceBuy = amountBuy > 0 ? formatMoneyByLocale(priceBuyETH, currency) : '-';
        const priceSell = amountSell > 0 ? formatMoneyByLocale(priceSellETH, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(amountBuy)} ${CRYPTO_CURRENCY.ETH}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(amountSell)} ${CRYPTO_CURRENCY.ETH}` : ''}`;

        if (statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE) {
          coin.onClose = this.onHandleDeleteOfferItem;
        }

        coins.push(coin);
      }
    }

    if (offer.itemFlags.BTC) {
      const btc = offer.items.BTC;
      const { buyBalance, sellBalance, buyAmount, sellAmount, status } = btc;
      if (!this.isEmptyBalance(btc)) {
        const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
        const amountBuy = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? buyAmount : buyBalance;
        const amountSell = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? sellAmount : sellBalance;

        const coin = {};

        coin.name = CRYPTO_CURRENCY.BTC;
        coin.color = 'linear-gradient(45deg, #FF8006 0%, #FFA733 51%, #FFC349 100%)';
        coin.icon = iconBtc;
        const priceBuy = amountBuy > 0 ? formatMoneyByLocale(priceBuyBTC, currency) : '-';
        const priceSell = amountSell > 0 ? formatMoneyByLocale(priceSellBTC, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(amountBuy)} ${CRYPTO_CURRENCY.BTC}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(amountSell)} ${CRYPTO_CURRENCY.BTC}` : ''}`;

        if (statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE) {
          coin.onClose = this.onHandleDeleteOfferItem;
        }

        coins.push(coin);
      }
    }

    return coins;
  }

  onHandleDeleteOfferItem = (currency) => {
    const { offer } = this;

    for (const item of Object.values(offer.items)) {
      if (item.currency === currency) {
        this.confirmDeleteOfferItem(item);
        break;
      }
    }
  }

  confirmDeleteOfferItem = (item) => {
    this.deleteItem = item;
    const { confirmOfferAction } = this.props;
    const message = <FormattedMessage id="closeOfferConfirm" values={{ }} />;
    if (confirmOfferAction) {
      confirmOfferAction(message, this.deleteOfferItem);
    }
  }

  deleteOfferItem = async () => {
    const { offer } = this;
    const { currency, sellAmount, freeStart } = this.deleteItem;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (sellAmount > 0 && freeStart === '') {
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          return;
        }
      }
    }

    this.props.showLoading({ message: '' });
    this.props.deleteOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      METHOD: 'DELETE',
      qs: { currency },
      successFn: this.handleDeleteOfferItemSuccess,
      errorFn: this.handleDeleteOfferItemFailed,
    });
  }

  handleDeleteOfferItemSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { offer } = this;
    const { data } = responseData;
    const { currency, sellAmount, freeStart } = this.deleteItem;

    console.log('handleDeleteOfferItemSuccess', responseData);

    const offerStore = OfferShop.offerShop(data);

    // Update status to redux
    this.responseExchangeDataChange(offerStore);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (sellAmount > 0 && freeStart === '' && offerStore.items.ETH.status !== 'closed') {
        try {
          const wallet = MasterWallet.getWalletDefault(currency);

          const cashHandshake = new ExchangeCashHandshake(wallet.chainId);

          let result = null;

          result = await cashHandshake.closeByStationOwner(data.hid, data.id);

          console.log('handleDeleteOfferItemSuccess', result);

          this.trackingOnchain(offer.id, '', result.hash, offerStore.items.ETH.status, '', currency);
        } catch (e) {
          this.trackingOnchain(offer.id, '', '', offerStore.items.ETH.status, e.toString(), currency);
          console.log('handleDeleteOfferItemSuccess', e.toString());
        }
      }
    } else if (currency === CRYPTO_CURRENCY.BTC) {

    }

    this.props.hideLoading();
    const message = <FormattedMessage id="deleteOfferItemSuccessMassage" values={{ }} />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        if (refreshPage) {
          refreshPage();
        }
      },
    });
  }

  handleDeleteOfferItemFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  responseExchangeDataChange = (offerStore) => {
    const { id } = offerStore;
    const { currency } = this.deleteItem;
    const data = {};
    const firebaseOffer = {};
    const status = offerStore.items[`${currency}`].status;

    firebaseOffer.id = id;
    firebaseOffer.status = `${currency.toLowerCase()}_${status}`;
    firebaseOffer.type = 'offer_store';


    data[`offer_store_${id}`] = firebaseOffer;

    console.log('responseExchangeDataChangeOfferStore', data);

    this.props.responseExchangeDataChange(data);
  }

  getMessageMovingCoin = () => {
    const { status } = this.props;

    let idMessage = '';

    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED: {
        idMessage = 'ex.shop.explanation.created';
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE: {
        idMessage = 'ex.shop.explanation.active';
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING: {
        idMessage = 'ex.shop.explanation.closing';
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
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
    const { extraData, getNameShopDisplayed } = this.props;
    console.log('extraData', JSON.parse(extraData));

    const offer = OfferShop.offerShop(JSON.parse(extraData));
    this.offer = offer;

    const coins = this.getCoinList();

    const from = <FormattedMessage id="ex.me.label.from" />;
    // const email = this.getEmail();
    const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
    const statusText = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME[statusValue];
    // const showChat = false;
    // const chatUsername = '';
    const nameShop = getNameShopDisplayed();
    // const message = this.getMessageContent();
    // const actionButtons = this.getActionButtons();
    const messageMovingCoin = this.getMessageMovingCoin();

    const feedProps = {
      from,
      // email,
      statusText,
      // showChat,
      // chatUsername,
      nameShop,
      messageMovingCoin,
      // actionButtons,
      coins,
    };

    return (
      <FeedMeStation {...this.props} {...feedProps} offer={offer} />
    );
  }
}

FeedMeOfferStoreContainer.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = ({
  showAlert,
  showLoading,
  hideLoading,
  deleteOfferItem,

  responseExchangeDataChange,
});

export default connect(mapState, mapDispatch)(FeedMeOfferStoreContainer);
