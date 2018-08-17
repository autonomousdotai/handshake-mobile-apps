import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
// service, constant
// import { loadDiscoverList } from '@/reducers/discover/action';
import {
  API_URL,
  CRYPTO_CURRENCY,
  DISCOVER_GET_HANDSHAKE_RADIUS,
  EXCHANGE_ACTION,
  HANDSHAKE_ID,
  SORT_ORDER,
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
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { change } from 'redux-form';
import Map from './Components/Map';
import NavBar from './Components/NavBar';
import { getFreeStartInfo, getListOfferPrice, setFreeStart } from '@/reducers/exchange/action';
import { loadDiscoverList } from '@/reducers/discover/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import { Grid, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BlockCountry from '@/components/core/presentation/BlockCountry/BlockCountry';
import Maintain from '@/components/Router/Maintain';
import './Discover.scss';


const defaultZoomLevel = 13;

class DiscoverPage extends React.Component {
  constructor(props) {
    super(props);
    const handshakeDefault = HANDSHAKE_ID.EXCHANGE;
    const utm = this.getUtm();
    const program = this.getProgram();

    this.state = {
      handshakeIdActive: handshakeDefault,
      isLoading: true,
      exchange: this.props.exchange,
      modalContent: <div />, // type is node
      propsModal: {
        // className: "discover-popup",
        // isDismiss: false
      },
      curLocation: { lat: 0, lng: 0 },
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
    };
  }

  componentDidMount() {
    const { ipInfo, rfChange } = this.props;

    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback
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
  }

  handleGoToCurrentLocation = () => {
    const { ipInfo } = this.props;
    this.setState({
      curLocation: { lat: ipInfo?.latitude, lng: ipInfo?.longitude },
      lat: ipInfo?.latitude,
      lng: ipInfo?.longitude,
      zoomLevel: defaultZoomLevel,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      if (prevState.handshakeIdActive !== 3) {
        //
        const {
          handshakeIdActive,
          actionActive,
          currencyActive,
        } = prevState;
        const { ipInfo } = nextProps;
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

  isEmptyBalance = (item) => {
    const { actionActive } = this.state;
    const { buyBalance, sellBalance } = item;
    if (actionActive.includes('buy')) {
      return buyBalance <= 0;
    }
    return sellBalance <= 0;
  }

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
        qs.custom_query = ` -offline_i:1 `;

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
      this.setLoading(true);
      this.setState({ actionActive: newValue }, () => {
        this.loadDiscoverList();
      });
    }
  }

  onCurrencyChange = (e, item) => {
    console.log('onCurrencyChange', item);
    const { currencyActive } = this.state;

    if (currencyActive !== item.id) {
      this.setLoading(true);
      this.setState({ currencyActive: item.id }, () => {
        this.loadDiscoverList();
      });
    }
  }

  getStationsList = () => {
    const { list } = this.props.discover;

    if (list && list.length > 0) {
      return list;
    }
    return null;
  }

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

  getMap = () => {
    const {
      lat,
      lng,
      zoomLevel,
      actionActive,
      currencyActive,
      curLocation
    } = this.state;
    const stations = this.getStationsList();
    const map = (
      <div>
        <NavBar onActionChange={this.onActionChange} onCurrencyChange={this.onCurrencyChange} />
        <Map
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div className="map-container" style={{ height: `calc(100vh - 48px - 120px)`, marginTop: '48px' }} />}
          mapElement={<div style={{ height: `100%` }} />}
          // center={{ lat: 35.929673, lng: -78.948237 }}
          stations={stations}
          zoomLevel={zoomLevel}
          curLocation={curLocation}
          lat={lat}
          lng={lng}
          actionActive={actionActive}
          currencyActive={currencyActive}
          onFeedClick={(station, extraData) => this.clickFeedDetail(station, extraData)}
          modalRef={this.modalRef}
          setLoading={this.setLoading}
          onGoToCurrentLocation={this.handleGoToCurrentLocation}
          onMapMounted={e => (this.mapRef = e)}
          onZoomChanged={() => { this.setState({ zoomLevel: this.mapRef.getZoom() }) }}
          onCenterChanged={() => { const center = this.mapRef.getCenter(); this.setState({ lat: center.lat() || 0, lng: center.lng() || 0 }) }}
        />
      </div>
    );

    return map;
  }

  render() {
    const {
      propsModal,
      modalContent,
    } = this.state;
    const { messages } = this.props.intl;

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        {!this.state.isBannedCash && !this.props.firebaseApp.config?.maintainChild?.exchange && this.getMap()}
        {
          this.state.isBannedCash
            ? (
              <BlockCountry />
            )
            : this.props.firebaseApp.config?.maintainChild?.exchange ? <Maintain /> : null
        }
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} {...propsModal}>
          {modalContent}
        </ModalDialog>
        {/* <Footer /> */}
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  discover: state.discover,
  ipInfo: state.app.ipInfo,
  exchange: state.exchange,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  firebaseApp: state.firebase.data,
  freeStartInfo: state.exchange.freeStartInfo,
  authProfile: state.auth.profile,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  loadDiscoverList: bindActionCreators(loadDiscoverList, dispatch),
  getListOfferPrice: bindActionCreators(getListOfferPrice, dispatch),
  setFreeStart: bindActionCreators(setFreeStart, dispatch),
  getFreeStartInfo: bindActionCreators(getFreeStartInfo, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(DiscoverPage));
