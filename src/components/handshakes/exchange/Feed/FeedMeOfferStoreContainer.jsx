import React from "react";
import FeedMeStation from './FeedMeStation';
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  NB_BLOCKS,
} from "@/constants";
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import OfferShop from "@/models/OfferShop";
import {ExchangeCashHandshake} from "@/services/neuron";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import Button from '@/components/core/controls/Button/Button';
import {responseExchangeDataChange} from "@/reducers/me/action";
import {Ethereum} from '@/services/Wallets/Ethereum.js';
import {Bitcoin} from '@/services/Wallets/Bitcoin';
import {formatMoneyByLocale, getHandshakeUserType, getOfferPrice} from "@/services/offer-util";
import Offer from "@/models/Offer";
import {deleteOfferItem} from "@/reducers/exchange/action";

class FeedMeOfferStoreContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initUserId, shakeUserIds, extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
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

  calculateFiatAmount = (amount, type, percentage) => {
    const { offer } = this;
    const { listOfferPrice } = this.props;
    const { currency, fiatCurrency, } = offer;
    let fiatAmount = 0;

    if (listOfferPrice) {
      const offerPrice = getOfferPrice(listOfferPrice, type, currency, fiatCurrency);
      if (offerPrice) {
        fiatAmount = amount * offerPrice.price || 0;
        fiatAmount += fiatAmount * percentage / 100;
      } else {
        // console.log('aaaa', offer.type, offer.currency);
      }
    }

    return fiatAmount;
  }

  getEmail = () => {
    const {
      email, contactPhone, currency, userAddress,
    } = this.offer;

    if (email) { return email; }
    if (contactPhone) { return contactPhone; }
    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = new Ethereum();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    if (currency === CRYPTO_CURRENCY.BTC) {
      const wallet = new Bitcoin();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    return '';
  }

  getMessageContent = () => {
    const { status } = this.props;
    const { offer } = this;
    const {
      buyAmount, sellAmount, currency, buyPercentage, sellPercentage,
    } = offer;
    let message = '';
    const fiatAmountBuy = this.calculateFiatAmount(buyAmount, EXCHANGE_ACTION.BUY, buyPercentage);
    const fiatAmountSell = this.calculateFiatAmount(sellAmount, EXCHANGE_ACTION.SELL, sellPercentage);
    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
        message = (
          <span>
            {offer.buyAmount > 0 && (
              <FormattedMessage
                id="offerStoreHandShakeContentBuy"
                values={{
                  offerTypeBuy: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
                  amountBuy: offer.buyAmount,
                  currency: offer.currency,
                  fiatAmountCurrency: offer.fiatCurrency,
                  fiatAmountBuy: formatMoneyByLocale(fiatAmountBuy, offer.fiatCurrency),
                }}
              />
            )}
            {offer.sellAmount > 0 && (
              <FormattedMessage
                id="offerStoreHandShakeContentSell"
                values={{
                  offerTypeSell: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL],
                  amountSell: offer.sellAmount,
                  currency: offer.currency,
                  fiatAmountCurrency: offer.fiatCurrency,
                  fiatAmountSell: formatMoneyByLocale(fiatAmountSell, offer.fiatCurrency),
                }}
              />
            )}
          </span>
        );
        break;
      }
    }

    return message;
  }

  getActionButtons = () => {
    const { confirmOfferAction } = this.props;
    const { offer } = this;

    const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
    let actionButtons = null;

    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE: {
        const message = <FormattedMessage id="closeOfferConfirm" values={{ }} />;
        actionButtons = (
          <div>
            <Button
              block
              className="mt-2 btn btn-secondary"
              onClick={() => confirmOfferAction(message, this.deleteOfferItem)}
            ><FormattedMessage id="btn.delete" />
            </Button>
          </div>
        );
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
        break;
      }
      default: {
        // code
        break;
      }
    }

    return actionButtons;
  }

  deleteOfferItem = async () => {
    const { offer } = this;
    const { currency, sellAmount, freeStart } = offer;
    console.log('deleteOfferItem', offer);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (sellAmount > 0 && freeStart === '') {
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee(NB_BLOCKS, true);

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
      qs: { currency: offer.currency },
      successFn: this.handleDeleteOfferItemSuccess,
      errorFn: this.handleDeleteOfferItemFailed,
    });
  }

  handleDeleteOfferItemSuccess = async (responseData) => {
    const { offer } = this;
    const { data } = responseData;
    const { currency, sellAmount, freeStart } = offer;

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
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleDeleteOfferItemFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  responseExchangeDataChange = (offerStore) => {
    const { id } = offerStore;
    const { currency } = this.offer;
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

    const offer = Offer.offer(JSON.parse(extraData));
    this.offer = offer;

    const from = <FormattedMessage id="ex.me.label.from" />;
    const email = this.getEmail();
    const statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
    const statusText = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME[statusValue];
    const showChat = false;
    const chatUsername = '';
    const nameShop = getDisplayName();
    const message = this.getMessageContent();
    const actionButtons = this.getActionButtons();
    const messageMovingCoin = this.getMessageMovingCoin();

    const feedProps = {
      from, email, statusText, message,
      showChat, chatUsername,
      nameShop,
      messageMovingCoin,
      actionButtons,
    };

    return (
      <FeedMeStation {...this.props} {...feedProps} />
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
