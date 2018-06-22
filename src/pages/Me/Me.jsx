import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withFirebase } from 'react-redux-firebase';
// action, mock
import { fireBaseExchangeDataChange, loadMyHandshakeList, fireBaseBettingChange } from '@/reducers/me/action';
import { API_URL, APP, HANDSHAKE_ID, URL } from '@/constants';
// components
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import { getListOfferPrice, reviewOffer } from '@/reducers/exchange/action';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedMe';
import FeedSeed from '@/components/handshakes/seed/Feed';
import Image from '@/components/core/presentation/Image';

import ToggleSwitch from '@/components/core/presentation/ToggleSwitch';
// style
import AvatarSVG from '@/assets/images/icon/avatar.svg';
import ShopSVG from '@/assets/images/icon/icons8-shop_filled.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { setOfflineStatus } from '@/reducers/auth/action';
import local from '@/services/localStore';
import './Me.scss';
import Helper from "@/services/helper";
import Rate from "@/components/core/controls/Rate/Rate";

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

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

    console.log('me - contructor - init');

    let { s, sh } = Helper.getQueryStrings(window.location.search);

    let initUserId = s;
    let offerId = sh;

    this.state = {
      initUserId,
      offerId,
      exchange: this.props.exchange,
      auth: this.props.auth,
      firebaseUser: this.props.firebaseUser,
      numStars: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      nextProps.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
      return { exchange: nextProps.exchange };
    }
    if (nextProps.firebaseUser) {
      if (JSON.stringify(nextProps.firebaseUser) !== JSON.stringify(prevState.firebaseUser)) {
        const nextUser = nextProps.firebaseUser.users?.[nextProps.auth.profile.id];
        const prevUser = prevState.firebaseUser.users?.[prevState.auth.profile.id];

        if (nextUser && prevUser) {
          if (JSON.stringify(nextUser?.offers) !== JSON.stringify(prevUser?.offers)) {
            nextProps.fireBaseExchangeDataChange(nextUser?.offers);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/offers`);
          }
          if (JSON.stringify(nextUser?.betting) !== JSON.stringify(prevUser?.betting)) {
            nextProps.fireBaseBettingChange(nextUser?.betting);
            nextProps.firebase.remove(`/users/${nextProps.auth.profile.id}/betting`);
          }
        }

        return { firebaseUser: nextProps.firebaseUser };
      }
    }
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  componentDidMount() {
    const { initUserId, offerId } = this.state;
    if (initUserId && offerId) {
      this.rateRef.open();
    }
    this.loadMyHandshakeList();
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

  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  handleSetOfflineStatusSuccess = () => {
    const { offline } = this.props.auth;
    local.save(APP.OFFLINE_STATUS, offline ? 1 : 0);
  }

  handleSetOfflineStatusFailed = (e) => {
    console.log('handleSetOfflineStatusFailed', e);
  }

  //Review offer when receive notification after shop complete
  handleOnClickRating = (numStars) => {
    this.setState({numStars});
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

  render() {
    const { list } = this.props.me;
    const online = !this.props.auth.offline;

    return (
      <Grid className="me">
        <Row>
          <Col md={12}>
            <Link className="update-profile" to={URL.HANDSHAKE_ME_PROFILE} title="profile">
              <Image className="avatar" src={AvatarSVG} alt="avatar" />
              <div className="text">
                <strong>The face behind the mask</strong>
                <p>You, glorious you</p>
              </div>
              <div className="arrow">
                <Image src={ExpandArrowSVG} alt="arrow" />
              </div>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="update-profile pt-2">
              <Image className="avatar" src={ShopSVG} alt="shop" />
              <div className="text" style={{ width: '69%' }}>
                <strong>Your station</strong>
                <p>Open for business</p>
              </div>
              <div className="arrow">
                <ToggleSwitch defaultChecked={online} onChange={flag => this.setOfflineStatus(flag)} />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {
              list && list.length > 0 ? (
                list.map((handshake) => {
                  const FeedComponent = maps[handshake.type];
                  if (FeedComponent) {
                    return (
                      <Col key={handshake.id} className="feed-wrapper">
                        <FeedComponent
                          {...handshake}
                          history={this.props.history}
                          onFeedClick={() => {}}
                          mode="me"
                          refreshPage={this.loadMyHandshakeList}
                        />
                      </Col>
                    );
                  }
                  return null;
                })
              ) : (
                <NoData message="Start a mission." isShowArrowDown />
              )
            }
          </Col>
        </Row>
        <Rate onRef={e => this.rateRef = e} startNum={5} onSubmit={this.handleSubmitRating} ratingOnClick={this.handleOnClickRating}/>
      </Grid>
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
});

const mapDispatch = ({
  loadMyHandshakeList,
  getListOfferPrice,
  fireBaseExchangeDataChange,
  fireBaseBettingChange,
  setOfflineStatus,
  reviewOffer,
});

export default compose(withFirebase, connect(mapState, mapDispatch))(Me);
