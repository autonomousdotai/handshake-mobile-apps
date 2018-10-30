import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
// service, constant
import local from '@/services/localStore';
import { APP, API_URL } from '@/constants';
import { loadMatches, loadHandshakes, checkFreeAvailable } from '@/reducers/betting/action';
import { SIDE } from '@/components/handshakes/betting/constants.js';

import { getBalance, parseBigNumber } from '@/components/handshakes/betting/utils';
import GA from '@/services/googleAnalytics';
import BettingShakeFree from './../ShakeFree';
// style
import './Filter.scss';

// //


const CRYPTOSIGN_MINIMUM_MONEY = 0.00002;
const freeAmount = 0.001;
const ROUND_ODD = 10;
const TAG = 'BETTING_FILTER';

const SELECTING_DEFAULT = {
  id: '',
  value: '',
};

class BettingFilterFree extends React.Component {
  static propTypes = {
    loadHandshakes: PropTypes.func.isRequired,
    loadMatches: PropTypes.func.isRequired,
    checkFreeAvailable: PropTypes.func.isRequired,
    matchId: PropTypes.number,
    outComeId: PropTypes.number,
    isPrivate: PropTypes.any,
    setLoading: PropTypes.func.isRequired,
    bettingShakeIsOpen: PropTypes.bool,
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    const { odd, isPrivate } = props;
    this.state = {
      matches: [],
      selectedMatch: null,
      selectedOutcome: null,
      support: null,
      against: null,
      isFirstFree: false,
      side: SIDE.SUPPORT,
      isError: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.loadMatches();
    this.checkShowFreeBanner();
  }

  componentWillReceiveProps(nextProps) {
    const { matches, support, against } = nextProps;
    const { isPrivate, outComeId } = this.props;

    const filterMatches = [];
    if (isPrivate && outComeId) {
      matches.forEach((element) => {
        const { outcomes } = element;
        if (outcomes.length > 0) {
          const privateOutcomeArr = outcomes.filter(item => item.public == 0 && item.id == outComeId);
          if (privateOutcomeArr.length > 0) {
            filterMatches.push(element);
          }
        }
      });
    } else {
      matches.forEach((element) => {
        const { outcomes } = element;
        if (outcomes.length > 0) {
          const publicOutcomeArr = outcomes.filter(item => item.public == 1);
          if (publicOutcomeArr.length > 0) {
            filterMatches.push(element);
          }
        }
      });
    }
    this.setState({
      matches: filterMatches,
      // selectedMatch,
      // selectedOutcome,
      support,
      against,
    });
    this.checkShowFreeBanner();
  }

  get oddSpread() {
    const { support, against } = this.state;
    if (support && support.length > 0 && against && against.length > 0) {
      const minSupport = support[support.length - 1].odds;
      console.log('Min Support:', minSupport);
      const minAgainst = against[0].odds;
      console.log('Against Support:', minAgainst);
      const X = Math.abs(minSupport - minAgainst).toFixed(2);
      return X;
    }
    return 0;
  }

  get defaultSupportAmount() {
    const { against } = this.state;
    if (against && against.length > 0) {
      const element = against[against.length - 1];
      // const guessAmout = element.amount * (element.odds - 1);
      const amountBN = parseBigNumber(element.amount);
      const oddBN = parseBigNumber(element.odds);
      const oneBN = parseBigNumber(1);
      const guessAmout = amountBN.times(oddBN.minus(oneBN));
      console.log(TAG, ' defaultSupportAmount = ', guessAmout.toNumber());
      return guessAmout.toNumber() || 0;
    }
    return 0;
  }

  get defaultAgainstAmount() {
    const { support } = this.state;
    if (support && support.length > 0) {
      console.log('Sorted Support:', support);
      const element = support[support.length - 1];
      console.log(TAG, ' defaultAgainstAmount element= ', element);
      // const guessAmout = element.amount * (element.odds - 1);
      const amountBN = parseBigNumber(element.amount);
      console.log(TAG, ' defaultAgainstAmount amount= ', amountBN.toNumber());
      const oddBN = parseBigNumber(element.odds);
      console.log(TAG, ' defaultAgainstAmount odds= ', oddBN.toNumber());
      const oneBN = parseBigNumber(1);
      console.log(TAG, ' defaultAgainstAmount one= ', oneBN.toNumber());
      const guessAmout = amountBN.times(oddBN.minus(oneBN));
      console.log(TAG, ' defaultAgainstAmount = ', guessAmout.toNumber());
      return guessAmout.toNumber() || 0;
    }
    return 0;
  }

  get defaultSupportOdds() {
    const { against } = this.state;
    if (against && against.length > 0) {
      console.log('Sorted Against:', against);
      const element = against[against.length - 1];
      // const againstOdds = element.odds / (element.odds - 1);
      const odds = parseBigNumber(element.odds);
      const oneBN = parseBigNumber(1);
      const againstOdds = odds.div(odds.minus(oneBN));
      console.log(TAG, ' defaultSupportOdds = ', againstOdds.toNumber());
      return againstOdds?.toNumber() || 0;
    }
    return 0;
  }

  get defaultAgainstOdds() {
    const { support } = this.state;
    if (support && support.length > 0) {
      console.log('Sorted Support:', support);
      const element = support[support.length - 1];
      // const supportOdds = element.odds / (element.odds - 1);
      const odds = parseBigNumber(element.odds);
      const oneBN = parseBigNumber(1);
      const supportOdds = odds.div(odds.minus(oneBN));
      console.log(TAG, ' defaultAgainstOdds = ', supportOdds.toNumber());
      return supportOdds.toNumber() || 0;
    }
    return 0;
  }

  get defaultMatch() {
    const { matchNames } = this;
    const { matchId } = this.props;
    if (matchNames && matchNames.length > 0) {
      const itemDefault = matchNames.find(item => item.id === matchId);
      return itemDefault || matchNames[0];
    }
    return null;
  }

  get defaultOutcome() {
    const { matchOutcomes } = this;
    const { outComeId } = this.props;
    matchOutcomes.sort((a, b) => b.id > a.id);
    if (matchOutcomes && matchOutcomes.length > 0) {
      const itemDefault = matchOutcomes.find(item => item.id === outComeId);
      return itemDefault || matchOutcomes[0];
    }
    return null;
  }

  get foundMatch() {
    const { selectedMatch, matches } = this.state;
    if (selectedMatch) {
      return matches.find(element => element.id === selectedMatch.id);
    }
    return null;
  }

  get foundOutcome() {
    const { selectedOutcome } = this.state;
    const { foundMatch } = this;
    if (foundMatch && selectedOutcome) {
      const { outcomes } = foundMatch;
      return outcomes.find(element => element.id === selectedOutcome.id);
    }
    return null;
  }

  get matchNames() {
    const { matches } = this.state;
    if (matches) {
      const mathNamesList = matches.map(item => ({
        id: item.id,
        value: `Event: ${item.name} (${this.getStringDate(item.date)})`,
        marketFee: item.market_fee,
        date: item.date,
        reportTime: item.reportTime,
      }));
      return [
        ...mathNamesList,
        {
          id: -1,
          value: 'COMING SOON: Create your own event',
          className: 'disable',
          disableClick: true,
        },
      ];
    }
    return null;
  }

  get matchOutcomes() {
    const { selectedMatch } = this.state;
    const { outComeId, isPrivate } = this.props;

    if (selectedMatch) {
      const { foundMatch } = this;
      if (foundMatch) {
        const { outcomes } = foundMatch;
        let filterOutcome = outcomes.filter(item => item.public == 1);
        // let filterOutcome = outcomes;
        console.log('Is Private, outComeId: ', isPrivate, outComeId);
        if (isPrivate && outComeId) {
          filterOutcome = outcomes.filter(item => item.id === outComeId) || outcomes;
        }
        if (filterOutcome) {
          if (filterOutcome.length === 0) {
            // this.setState({ errorMessage: `Outcomes are empty`, isError: true });
            this.props.setLoading(false);
          }
          return filterOutcome.map(item => ({
            id: item.id, value: `Outcome: ${item.name}`, hid: item.hid, marketOdds: item.market_odds,
          }));
        }
      }
    }

    return [];
  }

  get bookListSupport() {
    const { support } = this.state;

    return support;
  }

  get bookListAgainst() {
    const { against } = this.state;

    return against;
  }

  getStringDate(date) {
    // console.log('Date:', date);
    const formattedDate = moment.unix(date).format('MMM DD');
    // console.log('Formated date:', formattedDate);
    return formattedDate;
  }

  getInfoShare(selectedMatch, selectedOutcome) {
    const profile = local.get(APP.AUTH_PROFILE);
    const ref = profile ? `&ref=${profile.username}` : '';
    return {
      title: `I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is.`,
      shareUrl: `${window.location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}${ref}?is_private=0`,
    };
  }

  getCheckFirstFreeSuccess = async (successData) => {
    console.log('getCheckFirstFreeSuccess', successData);
    const { status, data } = successData;
    if (status) {
      this.setState({
        isFirstFree: true,
      });
    }
  }

  getCheckFirstFreeFailed = async (successData) => {
    console.log('getCheckFirstFreeFailed', successData);
    const { status, data } = successData;
  }

  getHandshakeFailed = (error) => {
    this.props.setLoading(false);
    console.log('getHandshakeFailed', error);
  }

  getHandshakeSuccess = async (successData) => {
    this.props.setLoading(false);
    console.log('getHandshakeSuccess', successData);
    const { status, data } = successData;
    if (status && data) {
      const { support, against } = data;
      const filterSupport = support.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
      const filterAgainst = against.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
      this.setState({
        support: filterSupport,
        against: filterAgainst,
      });
    }
  }

  loadMatches() {
    this.props.loadMatches({
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
      successFn: (res) => {
        const { data } = res;
        if (data.length === 0) {
          this.setState({ errorMessage: `Events are empty`, isError: true });
          this.props.setLoading(false);
        }
      },
      errorFn: (e) => {
        console.log('loadMatches failed', e);
        this.setState({ errorMessage: `Can't load matches`, isError: true });
        this.props.setLoading(false);
      },
    });
  }

  callGetHandshakes(item) {
    console.log('Sa test callGetHandshakes:', item);
    if (item) {
      const params = {
        outcome_id: item.id,
      };
      this.props.loadHandshakes({
        PATH_URL: API_URL.CRYPTOSIGN.LOAD_HANDSHAKES,
        METHOD: 'POST',
        data: params,
        successFn: this.getHandshakeSuccess,
        errorFn: this.getHandshakeFailed,
      });
      if (typeof window !== 'undefined') {
        window.isGotDefaultOutCome = true;
      }
    }
  }


  callCheckFirstFree() {
    console.log('Call API check first free');
    this.props.checkFreeAvailable({
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_FREE_AVAILABLE,
      METHOD: 'GET',
      successFn: this.getCheckFirstFreeSuccess,
      errorFn: this.getCheckFirstFreeFailed,
    });
  }
  refreshHanshakeTable() {
    const { selectedOutcome } = this.state;
    this.callGetHandshakes(selectedOutcome);
  }

  closeShakePopup() {


    this.setState({
      bettingShakeIsOpen: false,
    });
    this.modalBetRef.close();
  }

  closeShakeFreePopup() {
    this.setState({
      isFirstFree: false,
      bettingShakeIsOpen: false,
    });
    this.modalBetFreeRef.close();
  }

  async checkShowFreeBanner() {
    const balance = await getBalance();
    console.log('checkShowFreeBanner', balance, typeof balance);
    if (balance === '0') {
      // Call API check if show free
      this.callCheckFirstFree();
    }
  }

  render() {
    const { isFirstFree } = this.state;
    const { tradedVolum } = this.props;
    const selectedOutcome = this.props.selectedOutcome ? this.props.selectedOutcome : SELECTING_DEFAULT;
    const selectedMatch = this.props.selectedMatch ? this.props.selectedMatch : SELECTING_DEFAULT;


    const outcomeId = (selectedOutcome && selectedOutcome.id >= 0) ? selectedOutcome.id : null;
    const outcomeHid = (selectedOutcome && selectedOutcome.hid >= 0) ? selectedOutcome.hid : null;
    const matchName = (selectedMatch && selectedMatch.value) ? selectedMatch.value : null;
    const matchOutcome = (selectedOutcome && selectedOutcome.value) ? selectedOutcome.value : null;

    const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
    const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
    const shareInfo = this.getInfoShare(selectedMatch, selectedOutcome);
    const marketFee = (selectedMatch && selectedMatch.marketFee >= 0) ? selectedMatch.marketFee : null;
    const closingDate = (selectedMatch && selectedMatch.date) ? selectedMatch.date : null;
    const reportTime = (selectedMatch && selectedMatch.reportTime) ? selectedMatch.reportTime : null;
    return (
      <BettingShakeFree
        amount={freeAmount}
        matchName={matchName}
        matchOutcome={matchOutcome}
        isOpen={this.state.bettingShakeIsOpen}
        outcomeId={parseInt(outcomeId, 10)}
        outcomeHid={parseInt(outcomeHid, 10)}
        marketSupportOdds={parseFloat(this.defaultSupportOdds)}
        marketAgainstOdds={parseFloat(this.defaultAgainstOdds)}
        closingDate={closingDate}
        reportTime={reportTime}
        onSubmitClick={() => {
          this.closeShakeFreePopup();
          this.modalLuckyFreeRef.open();
          }
        }
        onCancelClick={() => {
          this.closeShakePopup();
          }
        }
        onCreateBetSuccess={() => {
          this.refreshHanshakeTable();
        }}
      />
    );
  }
}

const mapState = state => ({
  matches: state.betting.matches,
  supports: state.betting.supports,
  against: state.betting.against,
  tradedVolum: state.betting.tradedVolum,
  isFirstFree: state.betting.isFirstFree,
});

const mapDispatch = ({
  loadMatches,
  loadHandshakes,
  checkFreeAvailable,
});

export default connect(mapState, mapDispatch)(BettingFilterFree);
