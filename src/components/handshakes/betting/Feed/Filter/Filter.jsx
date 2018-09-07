import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service, constant
import local from '@/services/localStore';
import { APP} from '@/constants';
import { defaultOdds, defaultAmount } from '@/components/handshakes/betting/calculation';
import { getKeyByValue } from '@/utils/object';
import GA from '@/services/googleAnalytics';
import BettingShakeFree from '@/components/handshakes/betting/Feed/ShakeFree';
import { SIDE } from '@/components/handshakes/betting/constants.js';
import OrderPlace from './../OrderPlace';
import { updateSide } from './../OrderPlace/action';
import { updateSideSelector } from './../OrderPlace/selector';

// style
import './Filter.scss';

// //


const freeAmount = 0.005;
const TAG = 'BETTING_FILTER';

const SELECTING_DEFAULT = {
  id: '',
  value: '',
};

class BettingFilter extends React.Component {
  static propTypes = {
    //loadHandshakes: PropTypes.func.isRequired,
    //checkFreeAvailable: PropTypes.func.isRequired,
    setLoading: PropTypes.func,
    bettingShakeIsOpen: PropTypes.bool,
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
    side: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    side: 'support',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateSide('support'));
  }

  getInfoShare(selectedMatch, selectedOutcome) {
    const profile = local.get(APP.AUTH_PROFILE);
    const ref = profile ? `&ref=${profile.username}` : '';
    return {
      title: `I put a bet on ${selectedMatch.value}. ${selectedOutcome.value}! Put your coin where your mouth is.`,
      shareUrl: `${window.location.origin}/discover/${encodeURI(selectedMatch.value)}?match=${selectedMatch.id}&out_come=${selectedOutcome.id}${ref}?is_private=0`,
    };
  }

  render() {
    const { support, against } = this.props;
    const { isFree, isOpen } = this.props;

    const selectedOutcome = this.props.selectedOutcome ? this.props.selectedOutcome : SELECTING_DEFAULT;
    const selectedMatch = this.props.selectedMatch ? this.props.selectedMatch : SELECTING_DEFAULT;

    const outcomeId = (selectedOutcome && selectedOutcome.id >= 0) ? selectedOutcome.id : null;
    const outcomeHid = (selectedOutcome && selectedOutcome.hid >= 0) ? selectedOutcome.hid : null;

    const matchName = (selectedMatch && selectedMatch.value) ? selectedMatch.value : null;
    const matchOutcome = (selectedOutcome && selectedOutcome.value) ? selectedOutcome.value : null;
    const matchMarketFee = (selectedMatch && selectedMatch.marketFee) ? selectedMatch.marketFee : null;

    const shareInfo = this.getInfoShare(selectedMatch, selectedOutcome);

    const closingDate = (selectedMatch && selectedMatch.date) ? selectedMatch.date : null;
    const reportTime = (selectedMatch && selectedMatch.reportTime) ? selectedMatch.reportTime : null;

    // new code
    const bettingShake = {
      amountSupport: defaultAmount(against),
      amountAgainst: defaultAmount(support),
      matchName,
      isOpen,
      matchOutcome,
      matchMarketFee,
      outcomeId,
      outcomeHid,
      marketSupportOdds: defaultOdds(against),
      marketAgainstOdds: defaultOdds(support),
      closingDate,
      reportTime,
      onSubmitClick: (()=>{
        this.props.onSubmitClick(isFree);
      }),
      onCancelClick: this.props.onCancelClick,
      handleBetFail: this.props.handleBetFail,
    };

    const orderBook = { support, against };
    const { side, dispatch } = this.props;
    return (
      <React.Fragment>
        <div className="matchOutCome">
          <span className="label">Outcome:</span>
          <span className={`name ${side}`}>{matchOutcome}</span>
        </div>
        {isFree ?
          <BettingShakeFree
            amount={freeAmount}
            {...bettingShake}
            dispatch={dispatch}
          /> :
          <OrderPlace
            bettingShake={bettingShake}
            orderBook={orderBook}
            changeMode={this.changeMode}
          />}
      </React.Fragment>

    );
  }
}

export default connect(
  (state) => {
    return {
      side: updateSideSelector(state),
    };
  },
)(BettingFilter);

