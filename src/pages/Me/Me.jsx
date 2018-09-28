import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { injectIntl } from 'react-intl';
// components
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import {
  fireBaseCreditsDataChange, getDashboardInfo, getListOfferPrice, getOfferStores,
  reviewOffer
} from '@/reducers/exchange/action';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedMe';
import FeedSeed from '@/components/handshakes/seed/Feed';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Image from '@/components/core/presentation/Image';
import ToggleSwitch from '@/components/core/presentation/ToggleSwitch';
// style
import AvatarSVG from '@/assets/images/icon/avatar.svg';
import ShopSVG from '@/assets/images/icon/icons8-shop_filled.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { setOfflineStatus } from '@/reducers/auth/action';
import local from '@/services/localStore';
import { fieldRadioButton } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';

import Helper from '@/services/helper';
import Rate from '@/components/core/controls/Rate/Rate';

import './Me.scss';
import { change, Field } from 'redux-form';
import Modal from '@/components/core/controls/Modal/Modal';
import BackupWallet from '@/components/Wallet/BackupWallet/BackupWallet';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import { FormattedMessage } from 'react-intl';
import loadingSVG from '@/assets/images/icon/loading.gif';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import ManageAssets from "./Tabs/ManageAssets";
import Transaction from "./Tabs/Transaction";
import cx from "classnames";

import NoDataImage from '@/assets/images/pages/Prediction/nodata.svg';

const TAG = 'Me';
const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting, // @TODO: uncomment this line
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

const CASH_TAB = {
  DASHBOARD: 'DASHBOARD',
  TRANSACTION: 'TRANSACTION',
};

const CATEGORIES = [
  {
    value: HANDSHAKE_ID.CREDIT,
    text: 'CC',
    priority: 0,
  },
  {
    value: HANDSHAKE_ID.EXCHANGE,
    text: 'ATM',
    priority: 1,
  },
  {
    value: HANDSHAKE_ID.BETTING,
    text: 'Bet',
    priority: 2,
  },
];

const nameFormFilterFeeds = 'formFilterFeeds';
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds,
  },
});

const tabs = [
  {
    id: CASH_TAB.DASHBOARD,
    text: <FormattedMessage id="dashboard.label.overview" />,
    component: ManageAssets,
  },
  // {
  //   id: 'overview',
  //   text: <FormattedMessage id="dashboard.label.overview" />,
  //   component: Overview,
  // },
  {
    id: CASH_TAB.TRANSACTION,
    text: <FormattedMessage id="dashboard.label.transaction" />,
    component: Transaction,
  },
]

class Me extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    loadMyHandshakeList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    firebaseUser: PropTypes.any.isRequired,
    history: PropTypes.object.isRequired,
    fireBaseExchangeDataChange: PropTypes.func.isRequired,
    fireBaseBettingChange: PropTypes.func.isRequired,
    exchange: PropTypes.object.isRequired,
    setOfflineStatus: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      s, sh, tab, activeId,
    } = Helper.getQueryStrings(window.location.search);
    const handshakeDefault = this.getDefaultHandShakeId();

    const cashTabDefault = tab ? tab.toUpperCase() : CASH_TAB.DASHBOARD;

    const initUserId = s;
    const offerId = sh;

    this.state = {
      initUserId,
      offerId,
      activeId,
      exchange: this.props.exchange,
      auth: this.props.auth,
      firebaseUser: this.props.firebaseUser,
      numStars: 0,
      offerStores: this.props.offerStores,
      modalContent: <div />, // type is node
      propsModal: {
        // className: "discover-popup",
        // isDismiss: false
      },
      cashTab: cashTabDefault,
      handshakeIdActive: handshakeDefault,
      firstTime: true,
      me: this.props.me,
      isLoading: false,
      modalFillContent: '',
    };
  }

  getDefaultHandShakeId() {
    let seletedId = HANDSHAKE_ID_DEFAULT;
    let { id } = Helper.getQueryStrings(window.location.search);
    id = parseInt(id, 10);
    if (id && Object.values(HANDSHAKE_ID).indexOf(id) !== -1) {
      seletedId = id;
    }
    // @TODO: chrome-ext
    if (window.self !== window.top) {
      seletedId = HANDSHAKE_ID.BETTING;
    }
    return seletedId;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { rfChange } = nextProps;
    console.log(TAG, ' getDerivedStateFromProps begin ');
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      const {
        handshakeIdActive,
      } = prevState;
      Me.loadMyHandshakeListStatic(nextProps, handshakeIdActive);
      return { exchange: nextProps.exchange };
    }
    console.log(TAG, ' getDerivedStateFromProps begin firebaseUser = ', nextProps.firebaseUser);
    if (nextProps.firebaseUser) {
      console.log(TAG, ' getDerivedStateFromProps begin 01');
      if (JSON.stringify(nextProps.firebaseUser) !== JSON.stringify(prevState.firebaseUser)) {
        const nextUser = nextProps.firebaseUser.users?.[nextProps.auth.profile.id];
        const prevUser = prevState.firebaseUser.users?.[prevState.auth.profile.id];
        console.log(TAG, ' getDerivedStateFromProps begin 02');
        if (nextUser) {
          console.log(TAG, ' getDerivedStateFromProps begin 03');
          if (JSON.stringify(nextUser?.offers) !== JSON.stringify(prevUser?.offers)) {
            nextProps.fireBaseExchangeDataChange(nextUser?.offers);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/offers`);
          }
          console.log(TAG, ' getDerivedStateFromProps begin 04');
          if (JSON.stringify(nextUser?.betting) !== JSON.stringify(prevUser?.betting)) {
            console.log(TAG, ' getDerivedStateFromProps betting ', nextUser?.betting);
            nextProps.fireBaseBettingChange(nextUser?.betting);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/betting`);
          }
          if (JSON.stringify(nextUser?.credits) !== JSON.stringify(prevUser?.credits)) {
            console.log(TAG, ' getDerivedStateFromProps credits ', nextUser?.credits);
            nextProps.fireBaseCreditsDataChange(nextUser?.credits);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/credits`);
          }
        }

        return { firebaseUser: nextProps.firebaseUser };
      }
    }
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }

    if (nextProps.offerStores) {
      if (JSON.stringify(nextProps.offerStores) !== JSON.stringify(prevState.offerStores)) {
        return { offerStores: nextProps.offerStores };
      }
    }

    // @TODO: chrome-ext
    if (window.self === window.top) {
      if (nextProps.me.list.length === 0 && nextProps.me.list.updatedAt !== prevState.me.list.updatedAt
        && prevState.handshakeIdActive !== HANDSHAKE_ID.CREDIT && prevState.firstTime) {
        rfChange(nameFormFilterFeeds, 'feedType', HANDSHAKE_ID.CREDIT);
        rfChange(nameFormFilterFeeds, 'cash-show-type', CASH_TAB.DASHBOARD);
        Me.loadMyHandshakeListStatic(nextProps, HANDSHAKE_ID.CREDIT);
        return { handshakeIdActive: HANDSHAKE_ID.CREDIT, firstTime: false };
      }
     }

    return null;
  }

  static loadMyHandshakeListStatic(nextProps, handshakeIdActive) {
    const qs = {};

    if (handshakeIdActive) {
      qs.type = handshakeIdActive;
    }
    nextProps.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE, qs });
  }

  componentDidMount() {
    const {
      initUserId, offerId, handshakeIdActive, cashTab, activeId,
    } = this.state;
    const { rfChange } = this.props;
    if (initUserId && offerId) {
      this.rateRef.open();
    }

    if (activeId) {
      setTimeout(() => {
        const handshakeElement = document.querySelector(`[id$="${activeId}"]`);
        if (handshakeElement) {
          this.setState({ activeId: undefined });
          window.scrollTo(0, handshakeElement.offsetTop - 152);
        }
      }, 1500);
    }

    rfChange(nameFormFilterFeeds, 'feedType', handshakeIdActive);
    rfChange(nameFormFilterFeeds, 'cash-show-type', cashTab);

    this.loadMyHandshakeList();
    this.getOfferStore();
    // this.getDashboardInfo();
  }

  componentWillUnmount() {
    const handshakeDefault = this.getDefaultHandShakeId();
    this.setState({
      cashTab: CASH_TAB.TRANSACTION,
      handshakeIdActive: handshakeDefault,
      firstTime: true,
    });
  }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  setOfflineStatus = (online) => {
    const offlineValue = online ? 0 : 1;
    this.props.setOfflineStatus({
      PATH_URL: `${API_URL.ME.SET_OFFLINE_STATUS}/${offlineValue}`,
      METHOD: 'POST',
      successFn: this.handleSetOfflineStatusSuccess,
      errorFn: this.handleSetOfflineStatusFailed,
    });
  }

  getOfferStore = () => {
    const { authProfile } = this.props;
    this.props.getOfferStores({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${authProfile.id}`,
    });
  }

  getDashboardInfo = () => {
    this.props.getDashboardInfo({
      PATH_URL: `${API_URL.EXCHANGE.GET_DASHBOARD_INFO}`,
    });
  }

  handleCreateExchange = () => {
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }

  handleUpdateExchange = () => {
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}&update=true`);
  }

  loadMyHandshakeList = () => {
    const qs = { };
    const {
      handshakeIdActive,
    } = this.state;

    console.log('loadMyHandshakeList', this.state);

    if (handshakeIdActive) {
      qs.type = handshakeIdActive;
    }
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE, qs });
  }

  handleSetOfflineStatusSuccess = () => {
    const { offline } = this.props.auth;
    local.save(APP.OFFLINE_STATUS, offline ? 1 : 0);
  }

  handleSetOfflineStatusFailed = (e) => {
    console.log('handleSetOfflineStatusFailed', e);
  }

  // Review offer when receive notification after shop complete
  handleOnClickRating = (numStars) => {
    this.setState({ numStars });
  }

  handleSubmitRating = () => {
    this.rateRef.close();
    const { offerId, initUserId } = this.state;
    this.props.reviewOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.REVIEWS}/${offerId}`,
      METHOD: 'POST',
      qs: { score: this.state.numStars },
      successFn: this.handleReviewOfferSuccess,
      errorFn: this.handleReviewOfferFailed,
    });
  }

  handleReviewOfferSuccess = (responseData) => {
    console.log('handleReviewOfferSuccess', responseData);
    const data = responseData.data;
  }

  handleReviewOfferFailed = (e) => {
  }

  handleShowModalDialog = (modalProps) => {
    const { show, propsModal, modalContent = <div /> } = modalProps;
    this.setState({
      modalContent,
      propsModal,
    }, () => {
      if (show) {
        this.modalRef.open();
      } else {
        this.modalRef.close();
      }
    });
  }

  onCategoryChange = (e, newValue) => {
    const { rfChange } = this.props;
    console.log('onCategoryChange', newValue);
    this.setState({ handshakeIdActive: newValue }, () => {
      if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE ||
        this.state.handshakeIdActive === HANDSHAKE_ID.CREDIT) {
        this.setState({ cashTab: CASH_TAB.DASHBOARD }, () => {
          rfChange(nameFormFilterFeeds, 'cash-show-type', CASH_TAB.DASHBOARD);
          if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
            this.getOfferStore();
            this.getDashboardInfo();
          }
        });
      }
      this.loadMyHandshakeList();
    });
  }

  onCashTabChange = (e, newValue) => {
    console.log('onTypeChange', newValue);
    this.setState({ cashTab: newValue }, () => {
      this.loadMyHandshakeList();
      if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
        if (newValue === CASH_TAB.DASHBOARD) {
          this.getOfferStore();
          this.getDashboardInfo();
        }
      }
    });
  }

  showRestoreWallet = () => {
    this.modalRestoreRef.open();
  }

  showBackupWallet = () => {
    this.modalBackupRef.open();
  }

  buyCoinsUsingCreditCard = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalFillContent:
        (
          <FeedCreditCard
            buttonTitle={messages.create.cash.credit.title}
            callbackSuccess={this.afterWalletFill}
            isPopup
          />
        ),
    }, () => {
      this.modalFillRef.open();
    });
  }

  showPopupBuyByCreditCard = () => {
    this.buyCoinsUsingCreditCard();

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.showPopupDashboard,
    });
  }

  afterWalletFill = () => {
    this.modalFillRef.close();
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  render() {
    const { handshakeIdActive, cashTab, offerStores, propsModal, modalContent, modalFillContent } = this.state;
    const { list, listDashboard } = this.props.me;
    let listFeed = [];
    if (handshakeIdActive === HANDSHAKE_ID.EXCHANGE && cashTab === CASH_TAB.DASHBOARD) {
      listFeed = listDashboard;
    } else {
      listFeed = list;
    }
    const { messages } = this.props.intl;
    const online = !this.props.auth.offline;
    let haveOffer = false;

    if (offerStores) {
      for (const value of Object.values(offerStores.itemFlags)) {
        if (value) {
          haveOffer = true;
          break;
        }
      }
    }

    const { component: Component } = tabs.find(i => i.id === cashTab);

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="me">
          {
            // @TODO: chrome-ext
            (window.self === window.top) &&
            (
              <div>
                <Row>
                  <Col md={12}>
                    <Link className="update-profile" to={URL.HANDSHAKE_ME_PROFILE} title="profile">
                      <Image className="avatar" src={AvatarSVG} alt="avatar" />
                      <div className="text">
                        <strong>{messages.me.feed.profileTitle}</strong>
                        <p>{messages.me.feed.profileDescription}</p>
                      </div>
                      <div className="arrow">
                        <Image src={ExpandArrowSVG} alt="arrow" />
                      </div>
                    </Link>
                  </Col>
                </Row>
                {/*<Row onClick={!haveOffer ? this.handleCreateExchange : undefined}>*/}
                  {/*<Col md={12}>*/}
                    {/*<div className="update-profile pt-2">*/}
                      {/*<Image className="avatar" src={ShopSVG} alt="shop" />*/}
                      {/*<div className="text" style={{ width: '69%' }}>*/}
                        {/*<strong>{messages.me.feed.shopTitle}</strong>*/}
                        {/*{haveOffer ?*/}
                          {/*(<p>{messages.me.feed.shopDescription}</p>) :*/}
                          {/*(<p>{messages.me.feed.shopNoDataDescription}</p>)*/}
                        {/*}*/}
                      {/*</div>*/}
                      {/*{haveOffer && (<div className="arrow">*/}
                        {/*<ToggleSwitch defaultChecked={online} onChange={flag => this.setOfflineStatus(flag)} />*/}
                      {/*</div>)*/}
                      {/*}*/}
                    {/*</div>*/}
                  {/*</Col>*/}
                {/*</Row>*/}

                <div className="mt-2 mb-1">
                  <FormFilterFeeds>
                    <div className="d-table w-100">
                      {/*<div className="d-table-cell"><label className="label-filter-by">{messages.me.feed.filterBy}</label></div>*/}
                      <div className="d-table-cell">
                        <Field
                          name="feedType"
                          component={fieldRadioButton}
                          type="tab-5"
                          list={CATEGORIES}
                          // validate={[required]}
                          onChange={this.onCategoryChange}
                        />
                      </div>
                    </div>
                    { (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE || this.state.handshakeIdActive === HANDSHAKE_ID.CREDIT) && (
                      <div>
                        <hr style={{ margin: '10px 0 5px' }} />
                        <div>
                          <Field
                            name="cash-show-type"
                            component={fieldRadioButton}
                            type="tab-6"
                            list={[
                              { value: CASH_TAB.DASHBOARD, text: messages.me.feed.cash.dashboard, icon: <span className="icon-dashboard align-middle" /> },
                              { value: CASH_TAB.TRANSACTION, text: messages.me.feed.cash.transactions, icon: <span className="icon-transactions align-middle" /> },
                            ]}
                            // validate={[required]}
                            onChange={this.onCashTabChange}
                          />
                        </div>
                      </div>
                      )
                    }
                  </FormFilterFeeds>
                </div>
              </div>
            )
          }
          <Row>
            <Col md={12} className="me-main-container">
              {
                this.state.handshakeIdActive === HANDSHAKE_ID.CREDIT ? (
                  <div className="dashboard">
                    {/*<div className="bg-white">
                      <div className="wrapper">
                        <div className="tabs mt-3">
                          {
                            tabs.map(tab => {
                              const { id, text } = tab;
                              return (
                                <div
                                  key={id}
                                  onClick={() => this.setState({ activeTab: id })}
                                  className={cx('tab text-normal', { active: activeTab === id })}
                                >
                                  {text}
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>*/}
                    <div className="content">
                      {<Component history={this.props.history} setLoading={this.setLoading}></Component>}
                    </div>
                  </div>) : listFeed && listFeed.length > 0 ? (
                    listFeed.map((handshake) => {
                    const FeedComponent = maps[handshake.type];
                    if (FeedComponent) {
                      // if (handshake.offerFeedType === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE &&
                      //   handshake.status === HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING &&
                      //   handshake.initUserId === authProfile?.id
                      // ) {
                      //   return null;
                      // }
                      return (
                        <Col key={handshake.id} className="feed-wrapper" id={handshake.id}>
                          <FeedComponent
                            {...handshake}
                            history={this.props.history}
                            onFeedClick={() => {}}
                            onShowModalDialog={this.handleShowModalDialog}
                            mode="me"
                            refreshPage={this.loadMyHandshakeList}
                            setLoading={this.setLoading}
                            buyCoinsUsingCreditCard={this.buyCoinsUsingCreditCard}
                          />
                        </Col>
                      );
                    }
                    return null;
                  })
                ) : this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE && this.state.cashTab === CASH_TAB.DASHBOARD ? (
                  <div className="text-center">
                    <p>{messages.me.feed.cash.stationExplain}</p>
                    <p>{messages.me.feed.cash.stationCreateSuggest}</p>
                    <button className="btn btn-primary btn-block" onClick={this.showRestoreWallet}>{messages.me.feed.cash.restoreStation}</button>
                    <button className="btn btn-primary btn-block" onClick={this.showPopupBuyByCreditCard}>{messages.me.feed.cash.buyMoreCoin}</button>
                  </div>
                ) :
                (
                  <NoData>
                    <div className="NoDataContainer">
                      <div className="NoDataTitle">Nothing here</div>
                      <img src={NoDataImage} alt="Nothing herer" />
                      <div className="ShortDescription">
                        Oops! <br />
                        Looks like you’re a bit lost… <br />
                        Go back and win big ninja!
                      </div>
                      <div className="PlayNow">
                        <Link to="/prediction" className="btn btn-primary">Play now</Link>
                      </div>
                    </div>
                  </NoData>
                )
              }
              {
                listFeed && listFeed.length > 0 && this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE && this.state.cashTab === CASH_TAB.DASHBOARD && (
                  <div className="text-center">
                    <button className="btn btn-primary btn-block" onClick={this.showBackupWallet}>{messages.me.feed.cash.backupStation}</button>
                    <button className="btn btn-primary btn-block" onClick={this.showPopupBuyByCreditCard}>{messages.me.feed.cash.buyMoreCoin}</button>
                    {haveOffer && (<button className="btn btn-link text-underline" onClick={this.handleUpdateExchange}><FormattedMessage id="ex.shop.dashboard.button.updateInventory" /></button>)}
                  </div>
                )
              }
            </Col>
          </Row>
        </Grid>
        <Rate onRef={e => this.rateRef = e} startNum={5} onSubmit={this.handleSubmitRating} ratingOnClick={this.handleOnClickRating} />
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} {...propsModal}>
          {modalContent}
        </ModalDialog>
        {/* Modal for Backup wallets : */}
        <Modal title={messages.wallet.action.backup.header} onRef={modal => this.modalBackupRef = modal}>
          <BackupWallet onFinish={() => { this.modalBackupRef.close(); }} />
        </Modal>
        {/* Modal for Backup wallets : */}
        <Modal title={messages.wallet.action.restore.header} onRef={modal => this.modalRestoreRef = modal}>
          <RestoreWallet />
        </Modal>
        <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
          {modalFillContent}
        </Modal>
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  me: state.me,
  app: state.app,
  auth: state.auth,
  firebaseUser: state.firebase.data,
  firebaseApp: state.firebase,
  exchange: state.exchange,
  authProfile: state.auth.profile,
  offerStores: state.exchange.offerStores,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  loadMyHandshakeList: bindActionCreators(loadMyHandshakeList, dispatch),
  getListOfferPrice: bindActionCreators(getListOfferPrice, dispatch),
  fireBaseExchangeDataChange: bindActionCreators(fireBaseExchangeDataChange, dispatch),
  fireBaseBettingChange: bindActionCreators(fireBaseBettingChange, dispatch),
  setOfflineStatus: bindActionCreators(setOfflineStatus, dispatch),
  reviewOffer: bindActionCreators(reviewOffer, dispatch),
  getOfferStores: bindActionCreators(getOfferStores, dispatch),
  getDashboardInfo: bindActionCreators(getDashboardInfo, dispatch),
  fireBaseCreditsDataChange: bindActionCreators(fireBaseCreditsDataChange, dispatch),
});

export default injectIntl(compose(withFirebase, connect(mapState, mapDispatch))(Me));
