import React from 'react';
import FeedMeStation from './FeedMeStation';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  EXCHANGE_ACTION,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SUB_STATUS,
} from '@/constants';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import OfferShop from '@/models/OfferShop';
import { ExchangeCashHandshake } from '@/services/neuron';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showAlert } from '@/reducers/app/action';
import { responseExchangeDataChange } from '@/reducers/me/action';
import { formatAmountCurrency, formatMoneyByLocale, getHandshakeUserType, getOfferPrice } from '@/services/offer-util';
import { deleteOfferItem } from '@/reducers/exchange/action';

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

  getPrices = (currency) => {
    const { offer } = this;
    const { listOfferPrice, fiatCurrency } = this.props;
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

  isEmptyBalance = (item) => {
    const {
      buyBalance, sellBalance, buyAmount, sellAmount, status,
    } = item;
    // const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
    // if (statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED) {
    //   return !(buyAmount > 0 || sellAmount > 0);
    // }
    return !(buyAmount > 0 || sellAmount > 0);
  }

  getCoinList = () => {
    const { offer } = this;
    const { fiatCurrency } = this.props;
    const coins = [];

    Object.values(CRYPTO_CURRENCY).map(currency => {
      const item = offer.items[currency];
      if (offer.itemFlags[currency] && !this.isEmptyBalance(item)) {
        const {
          buyBalance, sellBalance, buyAmount, sellAmount, status, subStatus,
        } = item;
        const { priceBuy: priceBuyValue, priceSell: priceSellValue } = this.getPrices(currency);
        const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[status];
        // const amountBuy = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? buyAmount : buyBalance;
        // const amountSell = statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED ? sellAmount : sellBalance;
        const amountBuy = buyAmount;
        const amountSell = sellAmount;

        const coin = {};

        coin.name = currency;
        coin.color = CRYPTO_CURRENCY_COLORS[currency].color;
        coin.icon = CRYPTO_CURRENCY_COLORS[currency].icon;
        const priceBuy = amountBuy > 0 ? formatMoneyByLocale(priceBuyValue, fiatCurrency) : '-';
        const priceSell = amountSell > 0 ? formatMoneyByLocale(priceSellValue, fiatCurrency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? fiatCurrency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(amountBuy)} ${currency}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? fiatCurrency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(amountSell)} ${currency}` : ''}`;

        if (statusValue === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE && subStatus !== HANDSHAKE_EXCHANGE_SHOP_OFFER_SUB_STATUS.refilling) {
          coin.onClose = this.onHandleDeleteOfferItem;
        }

        coins.push(coin);
      }

      return null;
    });

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
    const { currency, sellBalance, freeStart } = this.deleteItem;

    this.props.showLoading();

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (sellBalance > 0 && freeStart === '') {
    //     const wallet = MasterWallet.getWalletDefault(currency);
    //     const balance = await wallet.getBalance();
    //     const fee = await wallet.getFee(NB_BLOCKS, true);
    //
    //     if (!this.checkMainNetDefaultWallet(wallet)) {
    //       this.props.hideLoading();
    //       return;
    //     }
    //
    //     if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
    //       this.props.hideLoading();
    //       return;
    //     }
    //   }
    // }

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
    const { currency, sellBalance, freeStart } = this.deleteItem;

    console.log('handleDeleteOfferItemSuccess', responseData);

    const offerStore = OfferShop.offerShop(data);

    // Update status to redux
    this.responseExchangeDataChange(offerStore);

    // for (const item of Object.values(offerStore.items)) {
    //   if (currency === item.currency) {
    //     if (currency === CRYPTO_CURRENCY.ETH) {
    //       if (sellBalance > 0 && freeStart === '' && item.status !== 'closed') {
    //         try {
    //           const wallet = MasterWallet.getWalletDefault(currency);
    //
    //           const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //
    //           let result = null;
    //
    //           result = await cashHandshake.closeByStationOwner(data.hid, data.id);
    //
    //           console.log('handleDeleteOfferItemSuccess', result);
    //
    //           this.trackingOnchain(offer.id, '', result.hash, item.status, '', currency);
    //         } catch (e) {
    //           this.trackingOnchain(offer.id, '', '', item.status, e.toString(), currency);
    //           console.log('handleDeleteOfferItemSuccess', e.toString());
    //         }
    //       }
    //     }
    //
    //     break;
    //   }
    // }

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
    const { extraData, getDisplayName } = this.props;
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
    const nameShop = getDisplayName(true);
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
  deleteOfferItem,

  responseExchangeDataChange,
});

export default connect(mapState, mapDispatch)(FeedMeOfferStoreContainer);
