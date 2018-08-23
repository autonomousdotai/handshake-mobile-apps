import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { API_URL, CRYPTO_CURRENCY, EXCHANGE_ACTION, EXCHANGE_ACTION_NAME, HANDSHAKE_ID, URL } from '@/constants';
import { Marker, InfoWindow } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

import iconCustomMarker from '@/assets/images/icon/custom-marker.svg';
import './StationMarker.scss';
import { formatMoneyByLocale, getLatLongHash, getOfferPrice, shortenUser } from '@/services/offer-util';
import ShakeDetail, { nameFormShakeDetail } from '@/components/handshakes/exchange/components/ShakeDetail';
import { change, clearFields } from 'redux-form';
import { bindActionCreators } from 'redux';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { getUserLocation, showAlert } from '@/reducers/app/action';
import { shakeOfferItem, trackingLocation } from '@/reducers/exchange/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import PropTypes from 'prop-types';
import Offer from '@/models/Offer';
import AllStationDetails from './AllStationDetails';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';

const ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
};

class StationMarker extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { offer } = this.props;

    this.offer = offer;

    const cryptoCurrencyList = Object.values(CRYPTO_CURRENCY).map(item => ({
      value: item, text: item, icon: <img src={ICONS[item]} width={22} />, hide: false,
    }));

    this.state = {
      // showAllDetails: false,
      CRYPTO_CURRENCY_LIST: cryptoCurrencyList,
    };
  }

  // handleToggleShowAllDetails = () => {
  //   this.setState({ showAllDetails: !this.state.showAllDetails });
  // }

  getPrice = () => {
    const { listOfferPrice, actionActive, currencyActive } = this.props;
    const { fiatCurrency } = this.offer;
    const item = this.offer.items[currencyActive];
    const offerPrice = getOfferPrice(listOfferPrice, actionActive === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY, currencyActive, fiatCurrency);
    const price = offerPrice.price * (1 + (actionActive === EXCHANGE_ACTION.BUY ? item?.sellPercentage : item?.buyPercentage) / 100) || 0;

    return price;
  }

  getVolume = () => {
    const { actionActive, currencyActive } = this.props;
    const item = this.offer.items[currencyActive];

    return actionActive === EXCHANGE_ACTION.BUY ? item?.sellAmount || 0 : item?.buyAmount || 0;
  }

  isEmptyBalance = (item) => {
    const { buyAmount, sellAmount } = item;
    return !(buyAmount > 0 || sellAmount > 0);
  }

  handleOnShake = () => {
    const { offer } = this;
    const { onFeedClick, actionActive, currencyActive } = this.props;

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
        this.props.rfChange(nameFormShakeDetail, 'currency', currencyActive);
        this.props.rfChange(nameFormShakeDetail, 'type', actionActive);

        this.props.clearFields(nameFormShakeDetail, false, false, 'amount', 'amountFiat');
      }, 100);
    });
  }

  shakeOfferItem = async (values) => {
    console.log('shakeOfferItem', values);
    this.props.modalRef.close();

    const { authProfile } = this.props;
    const { offer } = this;

    this.showLoading();

    const shopType = values.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;

    const wallet = MasterWallet.getWalletDefault(values.currency);
    //
    // if (!this.checkMainNetDefaultWallet(wallet)) {
    //   this.hideLoading();
    //   return;
    // }

    // if (shopType === EXCHANGE_ACTION.BUY) { // shop buy
    //   const balance = await wallet.getBalance();
    //   const fee = await wallet.getFee(NB_BLOCKS, true);
    //   if (this.showNotEnoughCoinAlert(balance, values.amount, fee, values.currency)) {
    //     this.hideLoading();
    //     return;
    //   }
    // }

    const offerItem = {
      type: shopType,
      currency: values.currency,
      amount: values.amount.toString(),
      username: authProfile?.name || authProfile?.username,
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

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (type === EXCHANGE_ACTION.BUY) { // shop buy
    //     // const amount = totalAmount;
    //     try {
    //       const wallet = MasterWallet.getWalletDefault(currency);
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //       const result = await cashHandshake.initByCustomer(offer.items.ETH.userAddress, amount, offChainId);
    //
    //       console.log('handleShakeOfferSuccess', result);
    //
    //       this.trackingOnchain(offer.id, offerShake.id, result.hash, status, '', currency);
    //     } catch (e) {
    //       this.trackingOnchain(offer.id, offerShake.id, '', status, e.toString(), currency);
    //       console.log('handleShakeOfferSuccess', e.toString());
    //     }
    //   }
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(currency);
    //     wallet.transfer(systemAddress, amount, NB_BLOCKS).then((success) => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.trackingLocation(offer.id, offerShake.id, status);
    this.hideLoading();
    const message = <FormattedMessage id="shakeOfferItemSuccessMassage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.EXCHANGE}`);
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

  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
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

  getDisplayName = () => {
    const { username } = this.offer;
    if (username) {
      const walletE = new Ethereum();
      const walletB = new Bitcoin();
      if (walletE.checkAddressValid(username) === true) {
        walletE.address = username;
        return walletE.getShortAddress();
      } else if (walletB.checkAddressValid(username) === true) {
        walletB.address = username;
        return walletB.getShortAddress();
      }
      return shortenUser(username);
    }

    return '';
  }

  render() {
    const { messages } = this.props.intl;
    const {
      actionActive, currencyActive, location, initUserId, authProfile, showAllDetails, onChangeShowAllDetails, review,
    } = this.props;
    const { fiatCurrency } = this.offer;
    const username = this.getDisplayName();
    const locationArr = location.split(',');
    const coordinate = { lat: parseFloat(locationArr[0]), lng: parseFloat(locationArr[1]) };
    const price = this.getPrice();
    const maxVolume = this.getVolume();
    const boxStyle = showAllDetails ? {} : {
      width: '152px',
    };
    return (
      <Marker
        defaultIcon={{ url: iconCustomMarker, scaledSize: { width: 40, height: 40 } }}
        position={coordinate}
        onClick={() => onChangeShowAllDetails(!showAllDetails)}
      >
        <InfoBox
          onCloseClick={() => onChangeShowAllDetails(false)}
          options={{
            alignBottom: true,
            pane: 'floatPane',
            pixelOffset: showAllDetails ? new google.maps.Size(-86, -46) : new google.maps.Size(-73, -46),
            boxClass: 'stationInfoWrapper',
            boxStyle: {
              zIndex: showAllDetails ? 2 : 1,
              ...boxStyle,
            },
            closeBoxURL: '',
            enableEventPropagation: true,
            disableAutoPan: true,
          }}
        >
          <div className="stationInfo">
            {
              showAllDetails ? (
                <AllStationDetails
                  username={username}
                  review={review}
                  onChangeShowAllDetails={onChangeShowAllDetails}
                  actionActive={actionActive}
                  price={price}
                  fiatCurrency={fiatCurrency}
                  currencyActive={currencyActive}
                  maxVolume={maxVolume}
                  authProfile={authProfile}
                  initUserId={initUserId}
                  handleOnShake={this.handleOnShake}
                />
              ) : (
                <div className="s-value text-center" onClick={() => onChangeShowAllDetails(true)}>
                  <span className={`${actionActive === EXCHANGE_ACTION.BUY ? 'buy-price' : 'sell-price'}`}>{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}</span>
                  <span>{currencyActive}</span>
                </div>
              )
            }
          </div>
        </InfoBox>
      </Marker>
    );
  }
}

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
  authProfile: state.auth.profile,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  shakeOfferItem: bindActionCreators(shakeOfferItem, dispatch),
  trackingLocation: bindActionCreators(trackingLocation, dispatch),
  getUserLocation: bindActionCreators(getUserLocation, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(StationMarker));
