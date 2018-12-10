import React from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import { API_URL, APP, HANDSHAKE_ID, HANDSHAKE_ID_DEFAULT, URL } from '@/constants';
import { FormattedMessage, injectIntl } from 'react-intl';
// components
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import {
  fireBaseCreditsDataChange,
  getDashboardInfo,
  getListOfferPrice,
  getOfferStores,
  reviewOffer,
} from '@/reducers/exchange/action';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedMe';
import FeedSeed from '@/components/handshakes/seed/Feed';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Image from '@/components/core/presentation/Image';
// style
import meIcon from '@/assets/images/icon/extension_logo.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { setOfflineStatus } from '@/reducers/auth/action';
import local from '@/services/localStore';
import createForm from '@/components/core/form/createForm';

import Helper from '@/services/helper';
import Rate from '@/components/core/controls/Rate/Rate';

import './Me.scss';
import { change, Field } from 'redux-form';
import Modal from '@/components/core/controls/Modal/Modal';
import BackupWallet from '@/components/Wallet/BackupWallet/BackupWallet';
import RestoreWallet from '@/components/Wallet/RestoreWallet/RestoreWallet';
import loadingSVG from '@/assets/images/icon/loading.gif';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import ManageAssets from './Tabs/ManageAssets';
import Transaction from './Tabs/Transaction';

import NoDataImage from '@/assets/images/pages/Prediction/nodata.svg';

import { updateLoading } from '@/guru/stores/action';
import { referralCheck, referralJoin } from './action';
import { referralCheckSelector } from './selector';

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
    value: HANDSHAKE_ID.NINJA_COIN,
    text: 'Coin',
    priority: 0,
  },
  // {
  //   value: HANDSHAKE_ID.CREDIT,
  //   text: 'CC',
  //   priority: 0,
  // },
  // {
  //   value: HANDSHAKE_ID.EXCHANGE,
  //   text: 'ATM',
  //   priority: 1,
  // },
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
        const nextUser = nextProps.firebaseUser.users ?.[nextProps.auth.profile.id];
        const prevUser = prevState.firebaseUser.users ?.[prevState.auth.profile.id];
        console.log(TAG, ' getDerivedStateFromProps begin 02');
        if (nextUser) {
          console.log(TAG, ' getDerivedStateFromProps begin 03');
          if (JSON.stringify(nextUser ?.offers) !== JSON.stringify(prevUser ?.offers)) {
            nextProps.fireBaseExchangeDataChange(nextUser ?.offers);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/offers`);
          }
          console.log(TAG, ' getDerivedStateFromProps begin 04');
          if (JSON.stringify(nextUser ?.betting) !== JSON.stringify(prevUser ?.betting)) {
            console.log(TAG, ' getDerivedStateFromProps betting ', nextUser ?.betting);
            nextProps.fireBaseBettingChange(nextUser ?.betting);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/betting`);
          }
          if (JSON.stringify(nextUser ?.credits) !== JSON.stringify(prevUser ?.credits)) {
            console.log(TAG, ' getDerivedStateFromProps credits ', nextUser ?.credits);
            nextProps.fireBaseCreditsDataChange(nextUser ?.credits);
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
        && prevState.handshakeIdActive !== HANDSHAKE_ID.NINJA_COIN && prevState.firstTime) {
        rfChange(nameFormFilterFeeds, 'feedType', HANDSHAKE_ID.NINJA_COIN);
        rfChange(nameFormFilterFeeds, 'cash-show-type', CASH_TAB.DASHBOARD);
        Me.loadMyHandshakeListStatic(nextProps, HANDSHAKE_ID.NINJA_COIN);
        return { handshakeIdActive: HANDSHAKE_ID.NINJA_COIN, firstTime: false };
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

    // referral check
    this.props.dispatch(updateLoading(true));
    this.props.dispatch(referralCheck());
  }

  componentWillUnmount() {
    const handshakeDefault = this.getDefaultHandShakeId();
    this.setState({
      cashTab: CASH_TAB.TRANSACTION,
      handshakeIdActive: handshakeDefault,
      firstTime: true,
    });

    //remove loading
    this.props.dispatch(updateLoading(false));
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
    const qs = {};
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

  handleReferralProgram = () => {
    this.props.dispatch(updateLoading(true));
    this.props.dispatch(referralJoin());
  }

  renderReferralUser = (userData) => {
    return userData.map(ru => {
      if (!ru.email) return null;
      return (
        <div key={ru.email} className="ReferralUser">
          <span>{ru.email}</span>
          <span>{ru.redeem ? 'Used' : 'Pending'}</span>
        </div>
      );
    });
  }

  renderReferralUsers = (refer) => {
    const { referred_users } = refer;
    if (!referred_users || !referred_users.length) return null;
    return (
      <div className="ReferralUsers">
        <div className="ReferralUsersHead">
          <span>Referral</span>
          <span>Status</span>
        </div>
        <div className="ReferralUsersBody">
          {this.renderReferralUser(referred_users)}
        </div>
      </div>
    );
  }

  renderReferralLink = (refer) => {
    const { referral_link } = refer;
    return (
      <div className="ReferralLink">
        <strong>Share this link to refer a friend:</strong>
        <span className="Link"><a href={referral_link}>{referral_link}</a></span>
        <span>You will receive 1 free prediction for every new user you refer to Ninja. Get sharing!</span>
      </div>
    );
  }

  renderReferralProgram = (props) => (
    <button
      className="btn btn-primary btn-block btnReferral"
      onClick={this.handleReferralProgram}
    >
      {props.isLoading ? 'Joining...' : 'Join referral program'}
    </button>
  );

  renderReferral = (props) => {
    const { referralCheckInfo } = props;
    const { status } = referralCheckInfo || 0;
    if (!referralCheckInfo) return null;
    if (status) {
      return (
        <React.Fragment>
          {this.renderReferralLink(referralCheckInfo)}
          {this.renderReferralUsers(referralCheckInfo)}
        </React.Fragment>
      );
    }
    return this.renderReferralProgram(props);
  }

  renderNoData = () => {
    return (
      <NoData>
        <div className="NoDataContainer">
          <img src={NoDataImage} alt="Nothing here" />
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
    );
  }

  renderFaceBehind = (props) => {
    // @TODO: chrome-ext
    if (window.self !== window.top) return null;
    const { messages } = props.intl;
    return (
      <Row>
        <Col md={12}>
          <Link className="update-profile" to={URL.HANDSHAKE_ME_PROFILE} title="profile">
            <Image className="avatar" src={meIcon} alt="avatar" />
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
    );
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

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="me">
          { this.renderFaceBehind(this.props) }
          { this.renderReferral(this.props) }
          <Row>
            <Col md={12} className="me-main-container">
              {
                listFeed && listFeed.length > 0 ? (
                  listFeed.map((handshake) => {
                    const FeedComponent = maps[handshake.type];
                    if (FeedComponent) {
                      return (
                        <Col key={handshake.id} className="feed-wrapper" id={handshake.id}>
                          <FeedComponent
                            {...handshake}
                            history={this.props.history}
                            onFeedClick={() => { }}
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
                  </div>
                ) : this.renderNoData()
              }
              {
                listFeed && listFeed.length > 0 && this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE && this.state.cashTab === CASH_TAB.DASHBOARD && (
                  <div className="text-center">
                    <button className="btn btn-primary btn-block" onClick={this.showBackupWallet}>{messages.me.feed.cash.backupStation}</button>
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
  isLoading: state.guru.ui.isLoading,
  referralCheckInfo: referralCheckSelector(state)
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
