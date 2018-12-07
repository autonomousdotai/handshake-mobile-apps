import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AppBar from '@/guru/components/AppBar/AppBar';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Loading from '@/components/Loading';
import GA from '@/services/googleAnalytics';
import Icon from '@/guru/components/Icon/Icon';
import Subscriber from '@/guru/components/Subscriber';
import SubscribeSVG from '@/assets/images/modal/subscribe.svg';
import ReportPopup from '@/components/handshakes/betting/Feed/ReportPopup';
import { isJSON } from '@/utils/object';
import qs from 'querystring';

import { updateLoading } from '@/guru/stores/action';
import { injectIntl } from 'react-intl';
import { URL } from '@/constants';
import {
  eventSelector,
  isLoading,
  showedLuckyPoolSelector,
  isSharePage,
  countReportSelector,
  checkRedeemCodeSelector,
  checkExistSubcribeEmailSelector,
  totalBetsSelector,
  relevantEventSelector,
  referParamSelector
} from './selector';
import { loadMatches, getReportCount, removeExpiredEvent, checkRedeemCode, emailSubscriber } from './action';

import EventItem from './EventItem';
import Disclaimer from './Disclaimer';

import './Prediction.scss';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    eventList: PropTypes.array,
    relevantEvents:PropTypes.array,
    shareEvent: PropTypes.object,
    showedLuckyPool: PropTypes.bool,
    isSharePage: PropTypes.any,
    countReport: PropTypes.number,
    isRedeemAvailable: PropTypes.number,
    isExistEmail: PropTypes.any,
    totalBets: PropTypes.number,
    isSubscribe: PropTypes.number
  };

  static defaultProps = {
    eventList: [],
    relevantEvents: [],
    shareEvent: null,
    isExistEmail: 0,
    isSubscribe: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOutcome: null,
      isLuckyPool: true,
      modalFillContent: '',
      isOrderOpening: false,
      shouldShowFreePopup: true,
      failedResult: {},
    };
  }

  componentDidMount() {
    this.receiverMessage(this.props); // @TODO: Extensions
    this.props.dispatch(getReportCount());
    this.props.dispatch(checkRedeemCode());
    // this.props.dispatch(checkExistSubcribeEmail());
    window.addEventListener('scroll', this.handleScroll);
    // const eventId = this.getEventId(this.props);
    // if (eventId) {
    //   this.props.dispatch(loadRelevantEvents({eventId}));
    // }
  }

  componentDidUpdate() {
    const { props, modalEmaiSubscriber } = this;
    const { isRedeem, isSubscribe, statusSubscribe } = props;
    if ((isRedeem && !isSubscribe)) {
      if (!this.isShowSubscriber) {
        modalEmaiSubscriber.open();
        this.isShowSubscriber = true;
      }
    }
    if (statusSubscribe) {
      modalEmaiSubscriber.close();
      this.isShowSubscriber = false;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onCountdownComplete = (eventId) => {
    this.props.dispatch(removeExpiredEvent({ eventId }));
    // this.closeOrderPlace();
    this.props.dispatch(getReportCount());
  }
  getEventId = () => {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { match } = querystringParsed;
    return match || null;
  }

  // @TODO: Extensions
  /* eslint no-useless-escape: 0 */
  receiverMessage = (props) => {
    const windowInfo = isJSON(window.name) ? JSON.parse(window.name) : null;
    if (windowInfo) {
      const { message } = windowInfo;
      if (window.self !== window.top && message) {
        const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/i;
        const { url } = message;
        const matches = url.match(urlPattern);
        const source = matches && matches[0];
        props.dispatch(loadMatches({ source }));
      }
    } else {
      props.dispatch(loadMatches({ isDetail: props.isSharePage }));
    }
  }

  handleScroll = () => {
    this.showLuckyPool();
  };

  didPlaceOrder = (isFree) => {
    this.closeOrderPlace();
    if (!this.props.isExistEmail && isFree) {
      this.modalEmailPopupRef.open();
    }
    // else {
    //   isFree ? this.modalLuckyFree.open() : this.modalLuckyReal.open();
    // }
  }

  checkRedeemAvailabe = (props) => {
    const { isRedeemAvailable = 0 } = props;
    return isRedeemAvailable;
  }

  openOrderPlace = (selectedOutcome) => {
    this.openFilter(selectedOutcome);
    this.modalOrderPlace.open();
  }

  closeOrderPlace = () => {
    this.modalOrderPlace.close();
    this.setState({
      isOrderOpening: false,
    });
  }

  checkLuckyPool() {
    if (localStorage.getItem('showedLuckyPool') !== null) {
      return localStorage.getItem('showedLuckyPool');
    }
    return null;
  }

  showLuckyPool() {
    const showedLuckyPool = this.checkLuckyPool();
    if (showedLuckyPool) return;
    setTimeout(() => {
      // this.modalLuckyPoolRef.open();
      localStorage.setItem('showedLuckyPool', true);
    }, 2 * 1000);
  }

  handleClickCreator = (event) => {
    const userId = event.created_user_id || 0;
    const address = event.creator_wallet_address || '0x3D0...fEd';
    this.props.history.push(`${URL.HANDSHAKE_REPUTATION}?id=${userId}&address=${address}`);
  }

  handleClickEventItem = (itemProps, itemData) => {
    this.props.history.push(
      `${URL.GURU_PLACE_BET}?event_id=${itemProps.event.id}&outcome_id=${itemData.id}&side=${itemProps.side}`
    );
  };

  handleBetFail = (value) => {
    this.setState({
      failedResult: value,
    });
    this.modalOuttaMoney.open();
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  afterWalletFill = () => {
    GA.didFillUpMoney();
    this.modalFillRef.close();
  }

  handleEmailSubscriber = ({ values }) => {
    const { props } = this;
    const { dispatch, referParam } = props;
    dispatch(updateLoading(true));
    if (referParam) {
      return dispatch(emailSubscriber({ ...values, referral_code: referParam }));
    }
    return dispatch(emailSubscriber(values));
  }

  renderEventList = (props) => {
    if (props.isLoading) return null;
    if (!props.eventList || !props.eventList.length) {
      return (<p className="NoMsg">No event found</p>);
    }

    return (
      <div className="EventList">
        {props.eventList.map((event) => {
          return (
            <EventItem
              key={event.id}
              event={event}
              onClickCreator={this.handleClickCreator}
              onClickOutcome={this.handleClickEventItem}
              onCountdownComplete={() => this.onCountdownComplete(event.id)}
            />
          );
        })}

      </div>
    );
  };
  renderDislaimer = () => {
    return (<Disclaimer />);
  }

  renderRelevantEventList = (props) => {
    if (!props.isSharePage) return null;
    if (!props.relevantEvents || !props.relevantEvents.length) return null;
    return (
      <div className="RelevantEventList">
        <div className="relevantTitle">Events related to this event:</div>
        {props.relevantEvents.map((event) => {
          return (
            <EventItem
              key={event.id}
              event={event}
              onClickOutcome={this.handleClickEventItem}
              onCountdownComplete={() => this.onCountdownComplete(event.id)}
            />
          );
        })}
      </div>
    );
  };

  renderViewAllEvent = (props) => {
    if (!props.isSharePage) return null;
    return (
      <a href={URL.HANDSHAKE_PREDICTION} className="ViewAllEvent">
        View All Events
      </a>
    );
  }

  renderReport = (props) => {
    const { countReport } = props;
    if (!countReport) return null;
    return (<ReportPopup />);
  }

  renderAppBar = (props) => {
    return (
      <AppBar>
        {/* <span className="IconLeft Account">
          <i className="fal fa-user" />
        </span> */}
        <span className="Title">Prediction</span>
      </AppBar>
    );
  }

  renderPlusButton = () => {
    // TODO: chrome-ext
    if (window.self === window.top) return null;
    return (
      <Link to={URL.CREATE_EVENT} className="CreateEventButton">
        <i className="fal fa-plus" />
      </Link>
    );
  }

  renderEmailSubscriber = () => {
    const subscriberProps = {
      isSubmitting: this.props.isLoader,
      placeHolder: 'Your email',
      buttonText: 'I want FREE 0.03 ETH',
      buttonClasses: 'btn btn-primary',
      statusSubscribe: this.props.statusSubscribe,
      handleSubmit: this.handleEmailSubscriber
    };
    return (
      <ModalDialog className="EmailSubscriberModal" close onRef={(modal) => { this.modalEmaiSubscriber = modal; }}>
        <Icon path={SubscribeSVG} className="SubscriberImage" />
        <div className="SubscriberTitle">
          Claim your free bets
        </div>
        <div className="SubscriberDescription">
          To claim 2x <span className="highlight">FREE 0.03ETH</span> bets please enter your email address below:
        </div>
        <Subscriber {...subscriberProps} />
      </ModalDialog>
    );
  }

  renderComponent = (props, state) => {
    return (
      <div className={Prediction.displayName}>
        <Loading isLoading={props.isLoading} />
        {this.renderAppBar(props)}
        {this.renderReport(props)}
        {this.renderEventList(props)}
        {this.renderRelevantEventList(props)}
        {this.renderViewAllEvent(props, state)}
        {!props.isLoading && this.renderDislaimer()}
        {!props.isLoading && this.renderPlusButton()}
        {this.renderEmailSubscriber()}
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      countReport: countReportSelector(state),
      eventList: eventSelector(state),
      relevantEvents: relevantEventSelector(state),
      isSharePage: isSharePage(state),
      isLoader: state.guru.ui.isLoading,
      isLoading: isLoading(state),
      showedLuckyPool: showedLuckyPoolSelector(state),
      isRedeemAvailable: checkRedeemCodeSelector(state),
      isExistEmail: checkExistSubcribeEmailSelector(state),
      shareEvent: state.ui.shareEvent,
      totalBets: totalBetsSelector(state),
      referParam: referParamSelector(state),
      isSubscribe: (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.is_subscribe),
      isRedeem: (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.redeem),
      statusSubscribe: (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.status)
    };
  },
)(Prediction));
