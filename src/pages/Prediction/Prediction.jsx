import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import BetMode from '@/components/handshakes/betting/Feed/OrderPlace/BetMode';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Loading from '@/components/Loading';
import LuckyReal from '@/components/handshakes/betting/LuckyPool/LuckyReal/LuckyReal';
import LuckyLanding from '@/pages/LuckyLanding/LuckyLanding';
import GA from '@/services/googleAnalytics';
import LuckyFree from '@/components/handshakes/betting/LuckyPool/LuckyFree/LuckyFree';
import FreeBetLose from '@/components/handshakes/betting/LuckyPool/FreeBetLose';
import FreeBetWin from '@/components/handshakes/betting/LuckyPool/FreeBetWin';
import EmailPopup from '@/components/handshakes/betting/Feed/EmailPopup';
import OuttaMoney from '@/assets/images/modal/outtamoney.png';
import Modal from '@/components/core/controls/Modal';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import ReportPopup from '@/components/handshakes/betting/Feed/ReportPopup';
import { predictionStatistics } from '@/components/handshakes/betting/Feed/OrderPlace/action';
import { isJSON } from '@/utils/object';
import qs from 'querystring';

import { injectIntl } from 'react-intl';
import { URL } from '@/constants';
import { eventSelector, isLoading, showedLuckyPoolSelector, isSharePage, countReportSelector, checkFreeBetSelector, checkExistSubcribeEmailSelector, totalBetsSelector, relevantEventSelector } from './selector';
import { loadMatches, getReportCount, removeExpiredEvent, checkFreeBet, checkExistSubcribeEmail, loadRelevantEvents } from './action';
import { removeShareEvent } from '../CreateMarket/action';
import { shareEventSelector } from '../CreateMarket/selector';

import EventItem from './EventItem';
import PexCreateBtn from './PexCreateBtn';
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
    freeBet: PropTypes.object,
    isExistEmail: PropTypes.any,
    totalBets: PropTypes.number,
  };

  static defaultProps = {
    eventList: [],
    relevantEvents: [],
    shareEvent: null,
    isExistEmail: 0,
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
    this.props.dispatch(checkFreeBet());
    this.props.dispatch(checkExistSubcribeEmail());
    window.addEventListener('scroll', this.handleScroll);
    const eventId = this.getEventId(this.props);
    if (eventId) {
      this.props.dispatch(loadRelevantEvents({eventId}));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  onCountdownComplete = (eventId) => {
    this.props.dispatch(removeExpiredEvent({ eventId }));
    this.closeOrderPlace();
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
    } else {
      isFree ? this.modalLuckyFree.open() : this.modalLuckyReal.open();
    }
  }

  checkFreeAvailabe = (props) => {
    const { freeBet = {} } = props;
    const { free_bet_available: freeAvailable = 0, can_freebet: canFreeBet = false } = freeBet;
    let isFreeAvailable = false;

    if (canFreeBet && freeAvailable > 0) {
      isFreeAvailable = true;
    }
    return isFreeAvailable;
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
      this.modalLuckyPoolRef.open();
      localStorage.setItem('showedLuckyPool', true);
    }, 2 * 1000);
  }

  checkShowFreeBetPopup = (props) => {
    const isFreeAvailable = this.checkFreeAvailabe(props);
    const { freeBet } = props;
    const { free_bet_available: freeAvailable = 0 } = freeBet;

    const key = `showedFreebet${freeAvailable}`;
    const isShowed = localStorage.getItem(key);

    if (isFreeAvailable && !isShowed) {
      const { isOrderOpening, shouldShowFreePopup } = this.state;
      const { is_win: isWin } = freeBet;
      if (!isOrderOpening && shouldShowFreePopup) {
        if (isWin !== null) {
          if (!isWin && this.modalFreeBetLoseRef) {
            this.modalFreeBetLoseRef.open();
          } else if (isWin && this.modalFreeBetWinRef) {
            this.modalFreeBetWinRef.open();
          }
          localStorage.setItem(key, true);

          this.setState({
            shouldShowFreePopup: false,
          });
        }
      }
    }
  }

  handleClickEventItem = (itemProps, itemData) => {
    const { event } = itemProps;
    const { shareEvent } = this.props;
    if (itemData.id === URL.HANDSHAKE_PEX_CREATOR) {
      if (shareEvent) {
        this.props.dispatch(removeShareEvent(['shareEvent']));
      }
      const redirectURL = `${URL.HANDSHAKE_PEX_CREATOR}/${event.id}`;
      this.props.dispatch(push(redirectURL));
      this.props.history.push(redirectURL);
    } else {
      const selectedOutcome = {
        hid: itemData.hid,
        id: itemData.id,
        marketOdds: itemData.market_odds,
        value: itemData.name,
      };
      const selectedMatch = {
        date: event.date,
        id: event.id,
        marketFee: event.market_fee,
        reportTime: event.reportTime,
        value: event.name,
      };
      this.props.dispatch(checkFreeBet());
      this.openOrderPlace(selectedOutcome);
      this.modalOrderPlace.open();
      this.setState({
        selectedOutcome,
        selectedMatch,
        isOrderOpening: true,
      });

      if (selectedOutcome) {
        const outcomeId = { outcome_id: selectedOutcome.id };
        this.props.dispatch(predictionStatistics({ outcomeId }));
      }

      // send event tracking
      try {
        GA.clickChooseAnOutcome(event.name, itemData.name);
      } catch (err) {
        console.error(err);
      }
    }
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

  showPopupCreditCard = async () => {
    const { failedResult } = this.state;
    GA.clickTopupWallet(failedResult);
    this.modalOuttaMoney.close();
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

      gtag.event({
        category: taggingConfig.creditCard.category,
        action: taggingConfig.creditCard.action.showPopupPrediction,
      });
    });
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
              onClickOutcome={this.handleClickEventItem}
              onCountdownComplete={() => this.onCountdownComplete(event.id)}
            />
          );
        })}
        {this.renderRelevantEventList(props)}
        <Disclaimer />
      </div>
    );
  };

  renderRelevantEventList = (props) => {
    if (!props.isSharePage) return null;
    if (!props.relevantEvents || !props.relevantEvents.length) return null;
    return (
      <div className="RelevantEventList">
        <div className="relevantTitle">Related events</div>
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


  renderBetMode = (props, state) => {
    const isFreeAvailable = this.checkFreeAvailabe(props);
    return (
      <ModalDialog className="BetSlipContainer" close onRef={(modal) => { this.modalOrderPlace = modal; }}>
        <BetMode
          selectedOutcome={state.selectedOutcome}
          selectedMatch={state.selectedMatch}
          openPopup={(click) => { this.openOrderPlace = click; }}
          onCancelClick={this.closeOrderPlace}
          handleBetFail={this.handleBetFail}
          freeAvailable={isFreeAvailable}
          onSubmitClick={(isFree) => {
            this.didPlaceOrder(isFree);
          }}
        />
      </ModalDialog>
    );
  }

  renderViewAllEvent = (props) => {
    if (!props.isSharePage) return null;
    return (
      <a href={URL.HANDSHAKE_PREDICTION} className="ViewAllEvent">
        View All Events
      </a>
    );
  }

  renderLuckyReal = () => (
    <ModalDialog onRef={(modal) => { this.modalLuckyReal = modal; }}>
      <LuckyReal
        totalBets={this.props.totalBets}
        isExistEmail={this.props.isExistEmail}
        onButtonClick={() => {
          this.modalLuckyReal.close();
        }}
      />

    </ModalDialog>
  )

  renderLuckyFree = () => (
    <ModalDialog onRef={(modal) => { this.modalLuckyFree = modal; }}>
      <LuckyFree onButtonClick={() => {
        this.modalLuckyFree.close();
      }}
        totalBets={this.props.totalBets}

      />
    </ModalDialog>
  )

  renderLuckyLanding = () => (
    <ModalDialog className="modal" onRef={(modal) => { this.modalLuckyPoolRef = modal; return null; }}>
      <LuckyLanding onButtonClick={() => {
          this.modalLuckyPoolRef.close();
        }}
      />
    </ModalDialog>
  )

  renderFreeBetLose = () => (
    <ModalDialog className="modal" onRef={(modal) => { this.modalFreeBetLoseRef = modal; return null; }}>
      <FreeBetLose onButtonClick={() => {
          this.modalFreeBetLoseRef.close();
      }}
      />
    </ModalDialog>
  )

  renderFreeBetWin = () => (
    <ModalDialog className="modal" onRef={(modal) => { this.modalFreeBetWinRef = modal; return null; }}>
      <FreeBetWin onButtonClick={() => {
          this.modalFreeBetWinRef.close();
      }}
      />
    </ModalDialog>
  )
  renderEmailPopup = () => (
    <ModalDialog className="modal" onRef={(modal) => { this.modalEmailPopupRef = modal; return null; }}>
      <EmailPopup onButtonClick={() => {
          this.modalEmailPopupRef.close();
          this.props.dispatch(checkExistSubcribeEmail());
        }}
      />
    </ModalDialog>
  )

  renderOuttaMoney = () => {
    return (
      <ModalDialog className="outtaMoneyModal" close onRef={(modal) => { this.modalOuttaMoney = modal; }}>
        <div className="outtaMoneyContainer">
          <img src={OuttaMoney} alt="" />
          <div className="outtaMoneyTitle">You're outta… money!</div>
          <div className="outtaMoneyMsg">
            To keep forecasting, you’ll need to top-up your wallet.
          </div>
          {/*<button className="btn btn-block btn-primary" onClick={this.showPopupCreditCard}>Top up my wallet</button>*/}
        </div>
      </ModalDialog>
    );
  };

  renderCreditCard = () => {
    const { messages } = this.props.intl;
    const { modalFillContent } = this.state;
    return (
      <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
        {modalFillContent}
      </Modal>
    );
  }

  renderReport = (props) => {
    const { countReport } = props;
    if (!countReport) return null;
    return (<ReportPopup />);
  }

  renderComponent = (props, state) => {
    this.checkShowFreeBetPopup(props);
    return (
      <div className={Prediction.displayName}>
        <Loading isLoading={props.isLoading} />
        {/*<Banner />*/}
        <PexCreateBtn dispatch={props.dispatch} />
        {this.renderReport(props)}
        {this.renderEventList(props)}
        {this.renderBetMode(props, state)}
        {this.renderViewAllEvent(props, state)}
        {this.renderLuckyReal()}
        {this.renderLuckyFree()}
        {this.renderLuckyLanding()}
        {this.renderFreeBetLose()}
        {this.renderFreeBetWin()}
        {this.renderEmailPopup()}
        {this.renderOuttaMoney()}
        {this.renderCreditCard()}
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
      isLoading: isLoading(state),
      showedLuckyPool: showedLuckyPoolSelector(state),
      freeBet: checkFreeBetSelector(state),
      isExistEmail: checkExistSubcribeEmailSelector(state),
      shareEvent: shareEventSelector(state),
      totalBets: totalBetsSelector(state),
    };
  },
)(Prediction));
