import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

// service, constant
import { APP, API_URL } from '@/constants';
import { loadMatches, loadHandshakes, checkFreeAvailable } from '@/reducers/betting/action';
import { BetHandshakeHandler, SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import GA from '@/services/googleAnalytics';
// components
import Dropdown from '@/components/core/controls/Dropdown';
import ShareSocial from '@/components/core/presentation/ShareSocial';
// import FeedComponent from '@/components/Comment/FeedComment';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import GroupBook from './../GroupBook';
import TopInfo from './../TopInfo';
import BettingShake from './../Shake';
import BettingShakeFree from './../ShakeFree';
import local from '@/services/localStore';

// style
import './Filter.scss';

const betHandshakeHandler = new BetHandshakeHandler();
const CRYPTOSIGN_MINIMUM_MONEY = 0.00002;
const freeAmount = 0.001;
const ROUND_ODD = 10;
const TAG = 'BETTING_FILTER';
const SELECTING_DEFAULT = {
  id: '',
  value: '',
};
class BettingFilter extends React.Component {
  static propTypes = {
    loadHandshakes: PropTypes.func.isRequired,
    loadMatches: PropTypes.func.isRequired,
    checkFreeAvailable: PropTypes.func.isRequired,
    matchId: PropTypes.number,
    outComeId: PropTypes.number,
    setLoading: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    const { odd } = props;
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
      /* Test */
      /*
    let value = 1.389999999;
    const roundValue = 100;
    console.log(`Value, ceil:`, value, Math.ceil(value * roundValue)/roundValue);
    console.log(`Value, floor:`, value, Math.floor(value * roundValue)/roundValue);
    console.log(`Value, round:`, value, Math.round(value * roundValue)/roundValue);

    value = 1.33333333333;
    console.log(`Value, ceil:`, value, Math.ceil(value * roundValue)/roundValue);
    console.log(`Value, floor:`, value, Math.floor(value * roundValue)/ roundValue);
    console.log(`Value, round:`, value, Math.round(value * roundValue)/ roundValue);

    value = 1.667777777;
    console.log(`Value, ceil:`, value, Math.ceil(value * roundValue)/roundValue);
    console.log(`Value, floor:`, value, Math.floor(value * roundValue)/ roundValue);
    console.log(`Value, round:`, value, Math.round(value * roundValue)/ roundValue);

    */

    this.props.loadMatches({
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
      successFn: (res) => {
        const { data } = res;
        console.log('loadMatches success', data);
        if (data.length === 0) {
          this.setState({ errorMessage: `Matches are empty`, isError: true });
          this.props.setLoading(false);
        }
      },
      errorFn: (e) => {
        console.log('loadMatches failed', e);
        this.props.setLoading(false);
        this.setState({ errorMessage: `Can't load matches`, isError: true });
      },
    });
    this.checkShowFreeBanner();
  }

  componentWillReceiveProps(nextProps) {
    const { matches, support, against } = nextProps;
    console.log(`${TAG} Matches:`, matches);
    // const selectedMatch = this.defaultMatch;
    // const selectedOutcome = this.defaultOutcome;
    this.setState({
      matches,
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
      const guessAmout = element.amount * (element.odds - 1);
      return guessAmout;
    }
    return 0;
  }

  get defaultAgainstAmount() {
    const { support } = this.state;
    if (support && support.length > 0) {
      console.log('Sorted Support:', support);
      const element = support[support.length - 1];
      const guessAmout = element.amount * (element.odds - 1);
      return guessAmout;
    }
    return 0;
  }

  get defaultSupportOdds() {
    const { against } = this.state;
    if (against && against.length > 0) {
      console.log('Sorted Against:', against);
      const element = against[against.length - 1];
      const againstOdds = element.odds / (element.odds - 1);
      return againstOdds;
    }
    return 0;
  }

  get defaultAgainstOdds() {
    const { support } = this.state;
    if (support && support.length > 0) {
      console.log('Sorted Support:', support);
      const element = support[support.length - 1];
      const supportOdds = element.odds / (element.odds - 1);
      return supportOdds;
    }
    return 0;
  }

  get defaultMatch() {
    const { matchNames } = this;
    const { matchId } = this.props;
    if (matchNames && matchNames.length > 0) {
      const itemDefault = matchNames.find(item => item.id === matchId);
      return itemDefault || matchNames[0];
      // if (itemDefault) {
      //     return itemDefault;
      // } else {
      //     return matchNames[0];
      // }
    }
    return null;
  }

  get defaultOutcome() {
    const { matchOutcomes } = this;
    // console.log('defaultOutcome matchOutcomes: ', matchOutcomes);
    const { outComeId } = this.props;
    const sortedMatch = matchOutcomes.sort((a, b) => b.id > a.id);
    if (matchOutcomes && matchOutcomes.length > 0) {
      const itemDefault = matchOutcomes.find(item => item.id === outComeId);
      return itemDefault || matchOutcomes[0];
    }
    return null;
    // return matchOutcomes && matchOutcomes.length > 0 ? matchOutcomes[0] : null;
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
      const mathNamesList = matches.map(item => ({ id: item.id,
                                                value: `Event: ${item.name} (${this.getStringDate(item.date)})`,
                                                    marketFee: item.market_fee , date: item.date}));
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
    const { selectedMatch, matches } = this.state;
    // console.log('matchOutcomes selectedMatch:', selectedMatch);
    if (selectedMatch) {
      const { foundMatch } = this;
      if (foundMatch) {
        const { outcomes } = foundMatch;
        console.log(foundMatch);
        if (outcomes) {
          console.log('outcomes.length', outcomes.length);
          if (outcomes.length === 0) {
            // this.setState({ errorMessage: `Outcomes are empty`, isError: true });
            this.props.setLoading(false);
          }
          return outcomes.map(item => ({
            id: item.id, value: `Outcome: ${item.name}`, hid: item.hid, marketOdds: item.market_odds,
          }));
        }
      }
    }

    return [];
  }

  get bookListSupport() {
    const { support } = this.state;
    /*
      const foundOutcome = this.foundOutcome;
      console.log('Found Outcome:', foundOutcome);
      if(foundOutcome){
          const {handshakes} = this.foundOutcome;
          console.log('support Handshakes:', handshakes);
          if(handshakes){
              return handshakes.filter(item=>(item.side === SIDE.SUPPORT && item.status === 0));
          }
      }
      return [];
      */
    return support;
  }

  get bookListAgainst() {
    const { against } = this.state;
    /*
      const foundOutcome = this.foundOutcome;
      if(foundOutcome){
          const {handshakes} = this.foundOutcome;
          console.log('against Handshakes:', handshakes);
          if(handshakes){
              return handshakes.filter(item=>(item.side === SIDE.AGAINST));
          }
      }
      return [];
      */
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
    let ref = profile ? "&ref=" + profile.username : ''
    return {
      title: `I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is.`,
      shareUrl: `${window.location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}${ref}`,
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

  callGetHandshakes(item) {
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


  callCheckFirstFree() {
    console.log('Call API check first free');
    this.props.checkFreeAvailable({
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_FREE_AVAILABLE,
      METHOD: 'GET',
      successFn: this.getCheckFirstFreeSuccess,
      errorFn: this.getCheckFirstFreeFailed,
    });
  }

  closeShakePopup() {
    const { selectedOutcome } = this.state;
    this.callGetHandshakes(selectedOutcome);
    this.modalBetRef.close();
  }

  closeShakeFreePopup() {
    this.setState({
      isFirstFree: false,
    });
    this.modalBetFreeRef.close();
  }

  async checkShowFreeBanner() {

    const balance = await betHandshakeHandler.getBalance();
    console.log('checkShowFreeBanner Balance:', balance);
    if (balance == 0) {
      // Call API check if show free
      this.callCheckFirstFree();
    }
  }

  render() {
    const { isFirstFree } = this.state;
    const { tradedVolum } = this.props;
    const selectedOutcome = this.outcomeDropDown ? this.outcomeDropDown.itemSelecting : SELECTING_DEFAULT;
    const selectedMatch = this.outcomeDropDown ? this.matchDropDown.itemSelecting : SELECTING_DEFAULT;
    console.log('Selected Outcome:', selectedOutcome);
    console.log('Selected Match:', selectedMatch);


    const outcomeId = (selectedOutcome && selectedOutcome.id >= 0) ? selectedOutcome.id : null;
    const outcomeHid = (selectedOutcome && selectedOutcome.hid >= 0) ? selectedOutcome.hid : null;
    const matchName = (selectedMatch && selectedMatch.value) ? selectedMatch.value : null;
    const matchOutcome = (selectedOutcome && selectedOutcome.value) ? selectedOutcome.value : null;

    console.log('Outcome Hid:', outcomeHid);
    console.log('Outcome id', outcomeId);
    const defaultMatchId = this.defaultMatch ? this.defaultMatch.id : null;
    // console.log("Default Match:", defaultMatchId);
    // console.log('Default Outcome:', defaultOutcome);
    const defaultOutcomeId = this.defaultOutcome ? this.defaultOutcome.id : null;
    const shareInfo = this.getInfoShare(selectedMatch, selectedOutcome);
    const marketFee = (selectedMatch && selectedMatch.marketFee >= 0) ? selectedMatch.marketFee : null;
    const closingDate = (selectedMatch && selectedMatch.date) ? selectedMatch.date : null;
    console.log('defaultOutcomeId:', defaultOutcomeId);
    console.log('Market Fee:', marketFee);
    return (
      <div className="wrapperBettingFilter">
        <div className="share-block">
          <p className="text">Share. Get 20 coins.</p>
          <ShareSocial
            className="share"
            title={shareInfo.title}
            shareUrl={shareInfo.shareUrl}
          />
        </div>
        {
          this.state.isError
          ? (
            <div className="text-center" style={{ marginBottom: '10px' }}>
              <p>{this.state.errorMessage}</p>
              <Button onClick={() => window.location.reload()}>Try again</Button>
            </div>
          ) : ''
        }
        <div className={`${this.state.isError ? 'betting-disabled' : ''}`}>
          <div className="dropDown">
            <Dropdown
              placeholder="Select an event"
              onRef={(match) => { this.matchDropDown = match; return null; }}
              defaultId={defaultMatchId}
              source={this.matchNames}
              afterSetDefault={item => this.setState({ selectedMatch: item })}
              onItemSelected={item => {
                this.setState({ selectedMatch: item });
                // send event tracking
                try {
                  GA.clickChooseAnEvent(item.value);
                } catch (err) {}
              }}
              hasSearch
            />
          </div>
          <div className="dropDown">
            <Dropdown
              placeholder="Select an outcome"
              onRef={(match) => { this.outcomeDropDown = match; return null; }}
              defaultId={defaultOutcomeId}
              source={this.matchOutcomes}
              afterSetDefault={item => this.setState({
              selectedOutcome: item,
            }, () => this.callGetHandshakes(item))}
              onItemSelected={(item) => {
              /* this.callGetHandshakes(item) */
              this.setState({
                selectedOutcome: item,
              }, () => this.callGetHandshakes(item));
              try {
                // send event tracking
                GA.clickChooseAnOutcome(item.value);
              } catch (err) {}
            }
            }
            />
          </div>
          {
          isFirstFree
          ? (

              <div className="freeBox" onClick={() => {
                this.modalBetFreeRef.open();
            }}>
                <div className="contentFree">Unlock your <span>FREE ETH</span> to play</div>
                <Button
                className="buttonBet"

                >Bet now
                </Button>
              </div>

             /*
             <Button className="freeBox" onClick={() => {
                this.modalBetFreeRef.open();
            }}>
                <div className="contentFree">Unlock your <span>FREE ETH</span> to play</div>
                <div
                className="buttonBet"

                >Bet now
                </div>
              </Button>
              */

          )
          : ''
        }

          <TopInfo
            marketTotal={parseFloat(tradedVolum)}
            percentFee={marketFee}
            objectId={outcomeId}
          />
          <div className="wrapperContainer">
            <div className="item">
              <div className="titleBox opacity65">
                <div>Pool (ETH)</div>
                <div>Support (ODDS)</div>
              </div>
              {/* <GroupBook amountColor="#FA6B49" bookList={this.bookListSupport}/> */}
              {<GroupBook amountColor="#0BDD91" bookList={this.bookListSupport} />}
              {/* <div className="spreadBox"> */}
              {/* <div>ODDS SPREAD</div> */}
              {/* <div>{this.oddSpread}</div> */}
              {/* </div> */}
              {/* <GroupBook amountColor="#8BF275" bookList={this.bookListAgainst}/> */}
              {/* <GroupBook amountColor="#FA6B49" bookList={this.bookListAgainst}/> */}
              <div className="marketBox">
                <div>Market</div>
                <div>{Math.floor(this.defaultSupportOdds * ROUND_ODD) / ROUND_ODD}</div>
              </div>
              <Button
                className="buttonSupport"
                block
                onClick={() => {
                  this.setState({
                    side: SIDE.SUPPORT,
                  }, () => this.modalBetRef.open());
                  // send event tracking
                  GA.clickChooseASide('Support');
                }}
              >
                SUPPORT
              </Button>
            </div>
            <div className="item">
              <div className="titleBox opacity65">
                <div>Pool (ETH)</div>
                <div>Oppose (ODDS)</div>
              </div>
              {/* <BettingShake
                  matchName={matchName}
                  matchOutcome={matchOutcome}
                  outcomeId={parseInt(outcomeId)}
                  outcomeHid={parseInt(outcomeHid)}
                  marketSupportOdds={parseFloat(this.defaultSupportOdds)}
                marketAgainstOdds={parseFloat(this.defaultAgainstOdds)}/> */}
              {<GroupBook amountColor="#FA6B49" bookList={this.bookListAgainst} />}
              <div className="titleBox">
                <div>Market</div>
                <div>{Math.floor(this.defaultAgainstOdds * ROUND_ODD) / ROUND_ODD}</div>
              </div>
              <Button
                className="buttonAgainst"
                block
                onClick={() => {
                  console.log('click oppose');
                  this.setState({
                    side: SIDE.AGAINST,
                  }, () => this.modalBetRef.open());
                  // send event tracking
                  GA.clickChooseASide('Oppose');
                }}
              >
                OPPOSE
              </Button>
            </div>
          </div>
        </div>
        <ModalDialog className="modal" onRef={(modal) => { this.modalBetRef = modal; return null; }}>
          <BettingShake
            side={this.state.side}
            amountSupport={this.defaultSupportAmount}
            amountAgainst={this.defaultAgainstAmount}
            matchName={matchName}
            matchOutcome={matchOutcome}
            outcomeId={parseInt(outcomeId, 10)}
            outcomeHid={parseInt(outcomeHid, 10)}
            marketSupportOdds={parseFloat(this.defaultSupportOdds)}
            marketAgainstOdds={parseFloat(this.defaultAgainstOdds)}
            closingDate = {closingDate}
            onSubmitClick={() => this.closeShakePopup()}
          />
        </ModalDialog>
        <ModalDialog className="modal" onRef={(modal) => { this.modalBetFreeRef = modal; return null; }}>
          <BettingShakeFree
            amount={freeAmount}
            matchName={matchName}
            matchOutcome={matchOutcome}
            outcomeId={parseInt(outcomeId, 10)}
            outcomeHid={parseInt(outcomeHid, 10)}
            marketSupportOdds={parseFloat(this.defaultSupportOdds)}
            marketAgainstOdds={parseFloat(this.defaultAgainstOdds)}
            closingDate = {closingDate}
            onSubmitClick={() => this.closeShakeFreePopup()}
          />
        </ModalDialog>
      </div>
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

export default connect(mapState, mapDispatch)(BettingFilter);
