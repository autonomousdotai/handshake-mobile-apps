import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import {
  API_URL,
  DISCOVER_GET_HANDSHAKE_RADIUS,
  EXCHANGE_COOKIE_READ_INSTRUCTION,
  HANDSHAKE_ID,
  URL,
} from '@/constants';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Helper from '@/services/helper';
// components
import { Col, Grid, Row } from 'react-bootstrap';
import FAQBetting from '@/components/core/presentation/FAQBetting';
// import SearchBar from '@/components/core/controls/SearchBar';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Category from '@/components/core/controls/Category';

import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedExchangeLocal from '@/components/handshakes/exchange/Feed/FeedExchangeLocal';
import FeedSeed from '@/components/handshakes/seed/Feed';
import BlockCountry from '@/components/core/presentation/BlockCountry';
import Maintain from '@/components/core/presentation/Maintain';
import MultiLanguage from '@/components/core/controls/MultiLanguage';
// import Tabs from '@/components/handshakes/exchange/components/Tabs';
import NoData from '@/components/core/presentation/NoData';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import { getFreeStartInfo, getListOfferPrice, setFreeStart } from '@/reducers/exchange/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ninjaLogoSVG from '@/assets/images/logo.png';
// style
import '@/components/handshakes/exchange/Feed/FeedExchange.scss';
import './Discover.scss';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from "react-intl";
// import icon2KuNinja from '@/assets/images/icon/2_ku_ninja.svg';

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: FeedExchangeLocal,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class DiscoverPage extends React.Component {
  static propTypes = {
    discover: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadDiscoverList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    exchange: PropTypes.object.isRequired,
    ipInfo: PropTypes.any.isRequired,
    isBannedCash: PropTypes.bool.isRequired,
    isBannedPrediction: PropTypes.bool.isRequired,
    setFreeStart: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    console.log('discover - contructor - init');
    const handshakeDefault = this.getDefaultHandShakeId();
    const utm = this.getUtm();

    this.state = {
      handshakeIdActive: handshakeDefault,
      // tabIndexActive: '',
      query: '',
      isLoading: true,
      exchange: this.props.exchange,
      modalContent: <div />, // type is node
      propsModal: {
        // className: "discover-popup",
        // isDismiss: false
      },
      lat: 0,
      lng: 0,
      isBannedCash: this.props.isBannedCash,
      isBannedPrediction: this.props.isBannedPrediction,
      utm,
    };

    if (this.state.isBannedPrediction) {
      this.state.isLoading = false;
      this.state.handshakeIdActive = HANDSHAKE_ID.EXCHANGE;
      this.loadDiscoverList();
    }

    if (handshakeDefault === HANDSHAKE_ID.EXCHANGE) {
      this.loadDiscoverList();
    }

    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.clickTabItem = this.clickTabItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.getUtm = this.getUtm.bind(this);
    this.onFreeStartClick = this.onFreeStartClick.bind(this);
  }

  componentDidMount() {
    const { ipInfo, } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location;
      this.setAddressFromLatLng(latitude, longitude); // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback
    });

    if (this.state.utm === 'early_bird') {
      this.props.getFreeStartInfo({
        PATH_URL: `exchange/info/offer-store-free-start/ETH`,
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
                    <FormattedHTMLMessage id="ex.earlyBird.label.2"  values={{ freeETH: data.reward }}/>
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
        errorFn: () => {  },
      });
    }
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng });
  }

  getDefaultHandShakeId() {
    let seletedId = HANDSHAKE_ID.BETTING;
    let { id } = Helper.getQueryStrings(window.location.search);
    id = parseInt(id, 10);
    if (id && Object.values(HANDSHAKE_ID).indexOf(id) !== -1) {
      seletedId = id;
    }
    return seletedId;
  }

  getUtm() {
    let { utm } = Helper.getQueryStrings(window.location.search);

    return utm;
  }

  onFreeStartClick() {
    this.modalRef.close();
    this.props.setFreeStart({ data: true });
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      if (prevState.handshakeIdActive !== 3) {
        //
        const {
          handshakeIdActive,
          query,
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
            qs.custom_query = ` fiat_currency_s:${ipInfo?.currency} AND -offline_i:1 `;
          }
        }

        if (query) {
          qs.query = query;
        }

        // nextProps.loadDiscoverList({
        //   PATH_URL: API_URL.DISCOVER.INDEX,
        //   qs,
        // });
      }
      return { exchange: nextProps.exchange };
    }

    if (nextProps.firebaseApp.config?.maintainChild?.betting && prevState.handshakeIdActive === HANDSHAKE_ID.BETTING) {
      return {
        isLoading: false,
      };
    }
    return null;
  }

  getHandshakeList() {
    const { messages } = this.props.intl;
    const { list } = this.props.discover;
    const { handshakeIdActive, lat, lng } = this.state;

    if (list && list.length > 0) {
      return list.map((handshake) => {
        const FeedComponent = maps[handshake.type];
        if (FeedComponent) {
          return (
            <Col key={handshake.id} className="col-12 feed-wrapper px-0">
              <FeedComponent
                {...handshake}
                history={this.props.history}
                onFeedClick={() => this.clickFeedDetail(handshake.id)}
                refreshPage={this.loadDiscoverList}
                latitude={lat}
                longitude={lng}
              />
            </Col>
          );
        }
        return null;
      });
    }

    let message = '';
    switch (handshakeIdActive) {
      case HANDSHAKE_ID.EXCHANGE:
        message = messages.discover.noDataMessageCash;
        break;
      case HANDSHAKE_ID.EXCHANGE_LOCAL:
        message = messages.discover.noDataMessageSwap;
        break;

      default:
      // is promise
    }

    return <NoData style={{ height: '50vh' }} message={message}/>;
  }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  searchChange(query) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      this.setState({ query }, () => {
        this.loadDiscoverList();
      });
    }, 500);
  }

  clickFeedDetail(id) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  handleCloseExchangePopupIntro = () => {
    Cookies.set(EXCHANGE_COOKIE_READ_INSTRUCTION.name, true, EXCHANGE_COOKIE_READ_INSTRUCTION.option);
    this.modalRef.close();
  }

  showWelcomePopup = () => {
    if (Cookies.get(EXCHANGE_COOKIE_READ_INSTRUCTION.name) !== 'true') {
      setTimeout(() => {
        this.setState({
          modalContent: (
            <div>
              <div className="text-right pr-2 pt-1">
                <a className="d-inline-block" onClick={this.handleCloseExchangePopupIntro}>&times;</a>
              </div>
              <div className="exchange-popup-intro">
                <div className="logo"><img className="w-100" src={ninjaLogoSVG} alt="" /></div>
                <p className="headline">Ninja, welcomes you to the Dojo!</p>
                <p>We are the first to offer a completely decentralized platform to buy and sell Bitcoin and Ethereum.</p>
                <p>We support credit, debit card and cash.</p>
                <div className="my-3">
                  <div className="highlight-text">How to use:</div>
                  <div className="usage">
                    - (
                    <Link className="link" to={{ pathname: URL.HANDSHAKE_CREATE_INDEX, search: '?id=2' }}>
                      Become a shop
                    </Link>
                    ) to buy and sell BTC/ETH
                  </div>
                  <div className="highlight-text">Or</div>
                  <div className="usage">- Swipe through all the shops to find <a className="link" onClick={this.handleCloseExchangePopupIntro}>the most suitable price.</a></div>
                </div>
                <p>Chat and meet up at the store to fulfill your exchange.</p>
                <p><strong>Have fun trading!</strong></p>
                <button className="btn btn-primary btn-block" onClick={this.handleCloseExchangePopupIntro}>Got it!</button>
              </div>
            </div>
          ),
        }, () => {
          this.modalRef.open();
        });
      }, 1500);
    }
  }

  clickCategoryItem(category) {
    const { id } = category;
    if (this.state.handshakeIdActive !== id) {
      this.setLoading(true);
    }
    // let tabIndexActive = '';
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // do something
        break;
      case HANDSHAKE_ID.SEED:
        // do something
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // do something
        // tabIndexActive = 1;
        // this.showWelcomePopup();
        break;
      default:
        // is promise
    }
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
      // tabIndexActive,
    }, () => {
      if (category.id !== 3) {
        this.loadDiscoverList();
      }
    });
    if (category.id === 2 && this.state.isBannedCash) {
      this.setLoading(false);
    }
    if (category.id === 3 && this.state.isBannedPrediction) {
      this.setLoading(false);
    }
  }

  clickTabItem() {
    // index
    this.setState({
      // tabIndexActive: index
    }, () => {
      // if (category.id !== 3) {
      //   this.loadDiscoverList();
      // }
    });
  }

  handleCreateExchange = () => {
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }

  loadDiscoverList = () => {
    const { ipInfo } = this.props;
    const {
      handshakeIdActive,
      query,
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
        qs.custom_query = ` fiat_currency_s:${ipInfo?.currency} AND -offline_i:1 `;
      }
    }

    if (query) {
      qs.query = query;
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

  render() {
    const {
      handshakeIdActive,
      // tabIndexActive,
      propsModal,
      modalContent,
    } = this.state;
    const { messages } = this.props.intl;

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="discover">
          {/* <Row className="search-bar-wrapper">
            <Col md={12} xs={12}>
              <SearchBar onSuggestionSelected={() => {}} onInputSearchChange={this.searchChange} />
            </Col>
          </Row> */}
          <Row
            className="category-wrapper"
            // style={{ marginBottom: handshakeIdActive === HANDSHAKE_ID.EXCHANGE ? '0px' : '' }}
          >
            <Col className="col-9">
              <Category
                idActive={handshakeIdActive}
                onRef={(category) => { this.categoryRef = category; return null; }}
                onItemClick={this.clickCategoryItem}
              />
            </Col>
            <Col className="col-3 multilanguage-block">
              <MultiLanguage />
            </Col>
          </Row>

          {
            handshakeIdActive === HANDSHAKE_ID.EXCHANGE && (
              <React.Fragment>
                {/*
                <Row>
                  <Col md={12} className="exchange-intro">
                    <span className="icon-shop">
                      <img src={icon2KuNinja} alt="" />
                    </span>
                    <span className="text-intro">
                      <div>Sell coin for cash, buy coin with cash. Set your own rates.</div>
                      <div><span className="money">1 ETH welcome bonus.</span></div>
                      <div className="my-3">
                        <Link className="btn btn-sm btn-join-now" to={{ pathname: URL.HANDSHAKE_CREATE_INDEX, search: '?id=2' }}>
                          <span>Open your station</span>
                        </Link>
                      </div>
                    </span>
                  </Col>
                </Row>
                */}
                {/*
                  !this.state.isBannedCash && (
                    <Row>
                      <Col md={12} className="feed-wrapper">
                        <FeedCreditCard history={this.props.history} />
                      </Col>
                    </Row>
                  )
                */}
                <div>
                  <div className="ex-sticky-note">
                    <div className="mb-2"><FormattedMessage id="ex.discover.banner.text"/></div>
                    <div><button className="btn btn-become" onClick={this.handleCreateExchange}><FormattedMessage id="ex.discover.banner.btnText"/></button></div>
                  </div>
                </div>
              </React.Fragment>
            )
          }
          {
              handshakeIdActive === HANDSHAKE_ID.BETTING && this.state.isBannedPrediction
              ? (
                <BlockCountry />
              )
              : handshakeIdActive === HANDSHAKE_ID.BETTING && this.props.firebaseApp.config?.maintainChild?.betting ? <Maintain /> : null
            }
          {
            handshakeIdActive === HANDSHAKE_ID.BETTING && !this.state.isBannedPrediction && !this.props.firebaseApp.config?.maintainChild?.betting && (
              <React.Fragment>
                <BettingFilter setLoading={this.setLoading} />
                <Row>
                  <Col md={12} className="faq-block">
                    <FAQBetting />
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
          <Row>
            {[HANDSHAKE_ID.EXCHANGE, HANDSHAKE_ID.EXCHANGE_LOCAL].indexOf(handshakeIdActive) >= 0 && !this.state.isBannedCash && !this.props.firebaseApp.config?.maintainChild?.exchange && this.getHandshakeList()}
            {
              [HANDSHAKE_ID.EXCHANGE, HANDSHAKE_ID.EXCHANGE_LOCAL].indexOf(handshakeIdActive) >= 0 && this.state.isBannedCash
              ? (
                <BlockCountry />
              )
              : [HANDSHAKE_ID.EXCHANGE, HANDSHAKE_ID.EXCHANGE_LOCAL].indexOf(handshakeIdActive) >= 0 && this.props.firebaseApp.config?.maintainChild?.exchange ? <Maintain /> : null
            }
          </Row>
          <Row className="info">
            {messages.product_info}
          </Row>
        </Grid>
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} {...propsModal}>
          {modalContent}
        </ModalDialog>
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  discover: state.discover,
  app: state.app,
  ipInfo: state.app.ipInfo,
  exchange: state.exchange,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  firebaseApp: state.firebase.data,
  freeETH: state.exchange.freeETH || 0,
});

const mapDispatch = ({
  loadDiscoverList,
  getListOfferPrice,
  setFreeStart,
  getFreeStartInfo,
});

export default injectIntl(connect(mapState, mapDispatch)(DiscoverPage));
