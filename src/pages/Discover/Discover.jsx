import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
// service, constant
// import { loadDiscoverList } from '@/reducers/discover/action';
import {
  API_URL,
  APP, ATM_TYPE,
  CRYPTO_CURRENCY,
  DISCOVER_GET_HANDSHAKE_RADIUS,
  EXCHANGE_ACTION,
  HANDSHAKE_ID,
  SORT_ORDER, TIME_FORMAT, TIME_FORMAT_AM_PM,
  URL,
} from '@/constants';
// import Cookies from 'js-cookie';
import Helper from '@/services/helper';
// components
// import SearchBar from '@/components/core/controls/SearchBar';
// import FeedPromise from '@/components/handshakes/promise/Feed';
// import FeedBetting from '@/components/handshakes/betting/Feed';
// import FeedExchangeLocal from '@/components/handshakes/exchange/Feed/FeedExchangeLocal';
// import FeedSeed from '@/components/handshakes/seed/Feed';
import { change } from 'redux-form';
import Map from './Components/Map';
import NavBar from './Components/NavBar';
import { getFreeStartInfo, getListOfferPrice, getStoreATM, setFreeStart } from '@/reducers/exchange/action';
import { loadDiscoverList } from '@/reducers/discover/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import './Discover.scss';
import { showPopupGetGPSPermission } from '@/reducers/app/action';
import local from '@/services/localStore';
import Modal from '@/components/core/controls/Modal/Modal';
import AtmCashTransfer from '@/components/handshakes/exchange/AtmCashTransfer';
import CreateStoreATM, { CASH_ATM_TAB } from '@/components/handshakes/exchange/Create/CreateStoreATM';
import moment from "moment/moment";

const defaultZoomLevel = 13;

class DiscoverPage extends React.Component {
  constructor(props) {
    super(props);
    const handshakeDefault = HANDSHAKE_ID.EXCHANGE;
    const utm = this.getUtm();
    const program = this.getProgram();
    // this.debounceOnCenterChange = _debounce(this.handleOnCenterChanged, 150);
    // this.debounceOnZoomChange = _debounce(this.handleOnZoomChanged, 150);

    this.state = {
      handshakeIdActive: handshakeDefault,
      isLoading: true,
      exchange: this.props.exchange,
      discover: this.props.discover,
      modalTitle: '',
      modalContent: <div />, // type is node
      propsModal: {
        // className: "discover-popup",
        // isDismiss: false
      },
      curLocation: { lat: 0, lng: 0 },
      mapCenterLat: 0,
      mapCenterLng: 0,
      lat: 0,
      lng: 0,
      isBannedCash: this.props.isBannedCash,
      isBannedPrediction: this.props.isBannedPrediction,
      utm,
      program,
      isMarkerShown: false,
      actionActive: EXCHANGE_ACTION.BUY,
      currencyActive: CRYPTO_CURRENCY.ETH,

      zoomLevel: defaultZoomLevel,
      browserHeight: window.innerHeight - 60,
      curStationIdShowAllDetails: null,
      curStation: null,
    };

    local.save(APP.EXCHANGE_ACTION, EXCHANGE_ACTION.BUY);
    local.save(APP.EXCHANGE_CURRENCY, CRYPTO_CURRENCY.ETH);
  }

  componentDidMount() {
    const { ipInfo, rfChange } = this.props;

    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback
    this.handleGoToCurrentLocation();
    // show popup to get GPS permission
    this.props.showPopupGetGPSPermission();

    let url = '';
    if (this.state.utm === 'earlybird') {
      url = `exchange/info/offer-store-free-start/${this.state.program}`;
    }

    if (this.state.utm === 'earlybird') {
      this.props.getFreeStartInfo({
        PATH_URL: url,
        successFn: (res) => {
          const { data } = res;
          if (data.reward) {
            this.setState({
              propsModal: {
                className: 'popup-intro-free-coin',
              },
              modalContent: (
                <div className="text-center">
                  <div className="intro-header">
                    <FormattedHTMLMessage id="ex.earlyBird.label.1" />
                  </div>
                  <div className="intro-text mt-2">
                    <FormattedHTMLMessage id="ex.earlyBird.label.2" values={{ freeETH: data?.reward }} />
                  </div>
                  <button className="btn btn-open-station" onClick={this.onFreeStartClick}>
                    <FormattedMessage id="ex.earlyBird.btn" />
                  </button>
                </div>
              ),
            }, () => {
              this.modalRef.open();
            });
          }
        },
        errorFn: () => { },
      });
    }

    // rfChange(nameFormFilterFeeds, 'sortType', CASH_SORTING_CRITERIA.DISTANCE);
    // this.setState({ sortIndexActive: CASH_SORTING_CRITERIA.DISTANCE });

    this.delayedShowMarker();
    this.getStoreATM();
  }

  handleGoToCurrentLocation = () => {
    const { ipInfo, cashStore } = this.props;
    let latitude = ipInfo?.latitude;
    let longitude = ipInfo?.longitude;

    if (cashStore) {
      latitude = cashStore.latitude;
      longitude = cashStore.longitude;
    }

    this.setState({
      curLocation: { lat: latitude, lng: longitude },
      // mapCenter: { lat: ipInfo?.latitude, lng: ipInfo?.longitude },
      lat: latitude,
      lng: longitude,
      mapCenterLat: latitude,
      mapCenterLng: longitude,
      zoomLevel: defaultZoomLevel,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { ipInfo } = nextProps;

    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      if (prevState.handshakeIdActive !== 3) {
        //
        const {
          handshakeIdActive,
          actionActive,
          currencyActive,
        } = prevState;
        const qs = { };

        // const pt = `${prevState.lat},${prevState.lng}`;
        //
        // qs.location_p = { pt, d: DISCOVER_GET_HANDSHAKE_RADIUS };

        qs.pt = `${prevState.lat},${prevState.lng}`;
        qs.d = DISCOVER_GET_HANDSHAKE_RADIUS;

        if (handshakeIdActive) {
          qs.type = handshakeIdActive;

          if (handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
            qs.custom_query = ` -offline_i:1 `;

            const sortPrice = `${actionActive.toLowerCase()}_${currencyActive.toLowerCase()}_d`;
            const sortOrder = actionActive.includes('buy') ? SORT_ORDER.ASC : SORT_ORDER.DESC;

            qs.c_sort = sortPrice;
            qs.t_sort = sortOrder;
          }
        }
      }
      return { exchange: nextProps.exchange };
    }

    if (nextProps.discover.list.updatedAt !== prevState.discover.list.updatedAt) {
      return { discover: nextProps.discover };
    }

    return null;
  }

  getUtm = () => {
    const { utm_campaign: utm } = Helper.getQueryStrings(window.location.search);

    return utm;
  }

  getProgram = () => {
    const { free: program } = Helper.getQueryStrings(window.location.search);

    return program;
  }

  onFreeStartClick = () => {
    this.modalRef.close();
    this.props.setFreeStart({ data: true });
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }

  getStoreATM = () => {
    this.props.getStoreATM({
      PATH_URL: `${API_URL.EXCHANGE.CASH_STORE_ATM}`,
    });
  }

  // isEmptyBalance = (item) => {
  //   const { actionActive } = this.state;
  //   const { buyBalance, sellBalance } = item;
  //   if (actionActive.includes('buy')) {
  //     return buyBalance <= 0;
  //   }
  //   return sellBalance <= 0;
  // }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng, curLocation: { lat, lng } }, () => {
      if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
        this.loadDiscoverList();
      }
    });
  }

  loadDiscoverList = () => {
    const {
      handshakeIdActive,
      actionActive,
      currencyActive,
    } = this.state;
    const qs = { };

    // const pt = `${this.state.lat},${this.state.lng}`;
    //
    // qs.location_p = { pt, d: DISCOVER_GET_HANDSHAKE_RADIUS };
    qs.pt = `${this.state.lat},${this.state.lng}`;
    qs.d = DISCOVER_GET_HANDSHAKE_RADIUS;

    if (handshakeIdActive) {
      qs.type = handshakeIdActive;

      if (handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
        qs.custom_query = ` -offline_i:1 offer_feed_type_s:cash_store`;

        const sortPrice = `${actionActive === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY}_${currencyActive.toLowerCase()}_d`;
        const sortOrder = actionActive.includes('buy') ? SORT_ORDER.ASC : SORT_ORDER.DESC;

        qs.c_sort = sortPrice;
        qs.t_sort = sortOrder;
      }
    }

    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.INDEX,
      qs,
      successFn: () => {
        this.setLoading(false);
      },
      errorFn: () => {
        this.setLoading(false);
      },
    });
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  }

  onActionChange = (e, newValue) => {
    console.log('onActionChange', newValue);
    const { actionActive } = this.state;

    if (actionActive !== newValue) {
      local.save(APP.EXCHANGE_ACTION, newValue);
      this.setLoading(true);
      this.setState({ actionActive: newValue }, () => {
        this.loadDiscoverList();
      });
    }
  }

  onCurrencyChange = (e, item) => {
    const { currencyActive } = this.state;

    if (currencyActive !== item.id) {
      local.save(APP.EXCHANGE_CURRENCY, item.id);
      this.setLoading(true);
      this.setState({ currencyActive: item.id }, () => {
        this.loadDiscoverList();
      });
    }
  }

  // getStationsList = () => {
  //   const { list, offers } = this.props.discover;
  //
  //   if (list && list.length > 0) {
  //     return { list, offers };
  //   }
  //   return null;
  // }

  clickFeedDetail(handshake, extraData) {
    const { type } = handshake;
    switch (type) {
      case HANDSHAKE_ID.EXCHANGE: {
        const { modalContent, modalClassName } = extraData;
        gtag.event({
          category: taggingConfig.cash.category,
          action: taggingConfig.cash.action.clickFeed,
          label: handshake.id,
        });
        if (modalContent) {
          this.setState({ modalContent, propsModal: { className: modalClassName } }, () => {
            this.modalRef.open();
          });
        }
        break;
      }
      default:
    }
  }

  handleOnCenterChanged = () => {
    const center = this.mapRef.getCenter();
    this.setState({ mapCenterLat: center.lat(), mapCenterLng: center.lng() });
  }

  handleOnZoomChanged = () => {
    this.setState({ zoomLevel: this.mapRef.getZoom() });
  }

  handleOnChangeShowAllDetails = (id, newValue) => {
    console.log('handleOnChangeShowAllDetails', id, newValue);
    let offer = null;
    if (newValue) {
      const { list: stations, offers } = this.props.discover;
      const index = stations.findIndex(station => station.id === id);
      offer = offers[index];
    }
    this.setState({ curStationIdShowAllDetails: newValue ? id : null, curStation: offer });
  }

  onReceiptSaved = () => {
    this.openAtmManagement({ defaultTab: CASH_ATM_TAB.TRANSACTION });
  }

  setModalTitle = (title) => {
    this.setState({
      modalTitle: title,
    });
  }

  openNewTransaction = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.atm_cash_transfer.title,
      modalContent:
        (
          <AtmCashTransfer
            setLoading={this.setLoading}
            history={this.props.history}
            onReceiptSaved={this.onReceiptSaved}
            setModalTitle={this.setModalTitle}
          />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  openAtmManagement = (opt = {}) => {
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.create.atm.title,
      modalContent:
        (
          <CreateStoreATM onAtmCreated={this.getStoreATM} onAtmUpdated={this.loadDiscoverList} closeModal={this.modalRef.close} options={opt} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  getWorkingHour(station) {
    const startTime = moment(station.information.open_hour, TIME_FORMAT).format(TIME_FORMAT_AM_PM);
    const endTime = moment(station.information.close_hour, TIME_FORMAT).format(TIME_FORMAT_AM_PM);
    return `${startTime.toUpperCase()} - ${endTime.toUpperCase()}`;
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  render() {
    const {
      propsModal,
      modalContent,
      browserHeight,
      curStation,
    } = this.state;
    const { messages } = this.props.intl;
    const {
      lat,
      lng,
      zoomLevel,
      actionActive,
      currencyActive,
      curLocation,
      mapCenterLat,
      mapCenterLng,
      modalTitle,
      curStationIdShowAllDetails,
    } = this.state;
    const { list: stations, offers } = this.props.discover;
    const { history, listOfferPriceCashAtm } = this.props;

    console.log('curStation',curStation);

    const marginTop = listOfferPriceCashAtm && listOfferPriceCashAtm.length > 0 ? 48 : 0;

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <NavBar onActionChange={this.onActionChange} onCurrencyChange={this.onCurrencyChange} />
        <Map
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div className="map-container" style={{ height: `${browserHeight - marginTop}px`, marginTop: `${marginTop}px`, position: 'relative' }} />}
          mapElement={<div style={{ height: `100%` }} />}
          // center={{ lat: 35.929673, lng: -78.948237 }}
          history={history}
          stations={stations}
          offers={offers}
          zoomLevel={zoomLevel}
          curLocation={curLocation}
          mapCenterLat={mapCenterLat}
          mapCenterLng={mapCenterLng}
          lat={lat}
          lng={lng}
          actionActive={actionActive}
          currencyActive={currencyActive}
          onFeedClick={(station, extraData) => this.clickFeedDetail(station, extraData)}
          modalRef={this.modalRef}
          setLoading={this.setLoading}
          onGoToCurrentLocation={this.handleGoToCurrentLocation}
          onMapMounted={(e) => (this.mapRef = e)}
          onZoomChanged={this.handleOnZoomChanged}
          onCenterChanged={this.handleOnCenterChanged}
          openNewTransaction={this.openNewTransaction}
          openAtmManagement={this.openAtmManagement}
          curStationIdShowAllDetails={curStationIdShowAllDetails}
          onChangeShowAllDetails={this.handleOnChangeShowAllDetails}
        />

        {/* {!this.state.isBannedCash && !this.props.firebaseApp.config?.maintainChild?.exchange && this.getMap()} */}
        {/* { */}
        {/* this.state.isBannedCash */}
        {/* ? ( */}
        {/* <BlockCountry /> */}
        {/* ) */}
        {/* : this.props.firebaseApp.config?.maintainChild?.exchange ? <Maintain /> : null */}
        {/* } */}
        {/* <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} {...propsModal}> */}
        {/* {modalContent} */}
        {/* </ModalDialog> */}
        <div className={`popup-all-station-details ${curStationIdShowAllDetails ? 'open' : 'close'}`}>
          { curStationIdShowAllDetails && (
            <div>
              <div className="text-center">
                <div className="line" onClick={() => this.handleOnChangeShowAllDetails(null, null)} />
              </div>
              <div className="mt-2">
                <div className="media">
                  {/*<img className="mr-3" src="https://www.gadgetguy.com.au/cms/wp-content/uploads/panasonic-lumix-lx7-sample-04-square.jpg" width={50} />*/}
                  <div className="media-body">
                    <div className="primary-text">{curStation?.name}</div>
                    {/*<div className="secondary-text">About 1.4 km away</div>*/}
                  </div>
                </div>
                <div className="mt-3">
                  {
                    curStation?.phone && (
                      <div>
                        <div className="d-inline-block w-25 pr-2 align-middle">
                          <div className="secondary-text">{messages.discover.feed.cash.marker.label.tel}</div>
                        </div>
                        <div className="d-inline-block w-75 pl-2 align-middle">
                          <div className="information-text">{curStation?.phone}</div>
                        </div>
                      </div>
                    )
                  }
                  {
                    curStation.businessType === ATM_TYPE.STORE && (
                      <div>
                        <div className="d-inline-block w-25 pr-2 align-middle">
                          <div className="secondary-text">{messages.discover.feed.cash.marker.label.workingHours}</div>
                        </div>
                        <div className="d-inline-block w-75 pl-2 align-middle">
                          <div className="information-text">{this.getWorkingHour(curStation)}</div>
                        </div>
                      </div>
                    )
                  }
                  {
                    curStation?.address && (
                      <div>
                        <div className="d-inline-block w-25 pr-2 align-middle">
                          <div className="secondary-text">{messages.discover.feed.cash.marker.label.address}</div>
                        </div>
                        <div className="d-inline-block w-75 pl-2 align-middle">
                          <div className="information-text">{curStation?.address}</div>
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>)
          }
        </div>

        <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
          {modalContent}
        </Modal>
        {/* <Footer /> */}
      </React.Fragment>
    );
  }
}

const mapState = state => {
  return {
    discover: state.discover,
    ipInfo: state.app.ipInfo,
    exchange: state.exchange,
    isBannedCash: state.app.isBannedCash,
    isBannedPrediction: state.app.isBannedPrediction,
    firebaseApp: state.firebase.data,
    freeStartInfo: state.exchange.freeStartInfo,
    authProfile: state.auth.profile,
    cashStore: state.exchange.cashStore,
    listOfferPriceCashAtm: state.exchange.listOfferPriceCashAtm,
  };
};

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  loadDiscoverList: bindActionCreators(loadDiscoverList, dispatch),
  getListOfferPrice: bindActionCreators(getListOfferPrice, dispatch),
  setFreeStart: bindActionCreators(setFreeStart, dispatch),
  getFreeStartInfo: bindActionCreators(getFreeStartInfo, dispatch),
  showPopupGetGPSPermission: bindActionCreators(showPopupGetGPSPermission, dispatch),
  getStoreATM: bindActionCreators(getStoreATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(DiscoverPage));
