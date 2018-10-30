import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import { API_URL } from '@/constants';
import { loadHandshakes, checkFreeAvailable } from '@/reducers/betting/action';
import { CRYPTOSIGN_MINIMUM_MONEY } from '@/components/handshakes/betting/constants.js';
import { getBalance } from '@/components/handshakes/betting/utils';
import GA from '@/services/googleAnalytics';

import Tabs from './../Tabs';

const TAG = 'BET_MODE';
class BetMode extends React.Component {
  static propTypes = {
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
    freeAvailable: PropTypes.number,
  }

  static defaultProps = {
    selectedOutcome: {},
    selectedMatch: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      support: null,
      against: null,
      isFirstFree: props.freeAvailable,
      bettingShakeIsOpen: true,
    };
    this.openPopup = this.openPopup.bind(this);
  }

  componentDidMount() {
    this.props.openPopup(this.openPopup);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOutcome, support, against, freeAvailable } = nextProps;
    const filterSupport = support && support.length > 0 && support.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
    const filterAgainst = against && against.length > 0 && against.filter(item => item.amount >= CRYPTOSIGN_MINIMUM_MONEY);
    this.setState({
      support: filterSupport,
      against: filterAgainst,
      isFirstFree: freeAvailable,
    });
  }

  afterTabChanges = (tab) => {
    const tabType = tab.toLowerCase();
    console.log('BETMODE', tabType);
    const { selectedOutcome } = this.props;
    if (tabType === 'paid bet') {
      GA.clickPaid(selectedOutcome.value);
    } else {
      GA.clickFree(selectedOutcome.value);
    }
  }

  async openPopup(selectedOutcome) {
    this.setState({
      bettingShakeIsOpen: true,
    });
    this.callGetHandshakes(selectedOutcome);
  }

  callGetHandshakes(item) {
    if (item) {
      const params = {
        outcome_id: item.id,
      };
      this.props.loadHandshakes({
        PATH_URL: API_URL.CRYPTOSIGN.LOAD_HANDSHAKES,
        METHOD: 'POST',
        data: params,

      });
      if (typeof window !== 'undefined') {
        window.isGotDefaultOutCome = true;
      }
    }
  }
  callCheckFirstFree() {
    console.log(TAG, 'Call API check first free');
    this.props.checkFreeAvailable({
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_FREE_AVAILABLE,
      METHOD: 'GET',
    });
  }

  async checkShowFreeBanner() {
    this.callCheckFirstFree();
  }

  renderTab(props) {
    return (
      <Tabs htmlClassName="BetModeContainer" afterClick={this.afterTabChanges}>
        <div className="BetModeItem" label="Paid bet">
          <BettingFilter
            {...props}
            isFree={false}
          />
        </div>
        <div className="BetModeItem" label="Use a redeem code">
          <BettingFilter
            {...props}
            isFree
          />
        </div>
      </Tabs>
    );
  }

  renderSingleMode(props) {
    return (
      <BettingFilter
        {...props}
        isFree={false}
      />
    );
  }

  renderOutcome = (props) => {
    const { selectedOutcome } = props;
    return (
      <div className="matchOutCome">
        <span className="label">Outcome:</span>
        <span className="name">
          {selectedOutcome && selectedOutcome.value}
        </span>
      </div>
    );
  }

  render() {
    const { selectedOutcome, selectedMatch, handleBetFail } = this.props;
    const { support, against, isFirstFree, bettingShakeIsOpen } = this.state;
    const filterProps = {
      selectedOutcome,
      selectedMatch,
      support,
      against,
      isOpen: bettingShakeIsOpen,
      handleBetFail,
      onSubmitClick: ((isFree) => {
        this.setState({
          bettingShakeIsOpen: false,
        });
        this.props.onSubmitClick(isFree);
      }),
      onCancelClick: (() => {
        this.setState({
          bettingShakeIsOpen: false,
        });
        this.props.onCancelClick();
      }),
    };
    return (
      <React.Fragment>
        {this.renderOutcome(this.props)}
        { isFirstFree ? this.renderTab(filterProps) : this.renderSingleMode(filterProps)}
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  support: state.betting.support,
  against: state.betting.against,
  isFirstFree: state.betting.isFirstFree,
});

const mapDispatch = ({
  loadHandshakes,
  checkFreeAvailable,
});

export default connect(mapState, mapDispatch)(BetMode);

