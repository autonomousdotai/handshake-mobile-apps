/* eslint react/require-default-props:0 */
/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service, constant
import { defaultOdds, defaultAmount } from '@/components/handshakes/betting/calculation';
import BettingShakeFree from '@/components/handshakes/betting/Feed/ShakeFree';
import { calcPercent } from '@/utils/number';
import OrderPlace from './../OrderPlace';
import Statistics from './../OrderPlace/Statistics';
import { updateSide } from './../OrderPlace/action';
import { updateSideSelector, statisticsSelector } from './../OrderPlace/selector';

// style
import './Filter.scss';

class BettingFilter extends React.Component {
  static propTypes = {
    freeAmount: PropTypes.number,
    setLoading: PropTypes.func,
    bettingShakeIsOpen: PropTypes.bool,
    selectedOutcome: PropTypes.object,
    selectedMatch: PropTypes.object,
    side: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    side: 'support',
    freeAmount: 0.005,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateSide('support'));
  }

  renderStatistics = (props) => {
    const { statistics } = props;
    if (!statistics) return null;
    const totalPredict = Object.keys(statistics).reduce((acc, cur) => (
      statistics[acc] + statistics[cur]
    ));
    const listItems = Object.keys(statistics).sort((a, b) => (b > a))
      .map(key => ({
        name: key,
        percent: (statistics[key] && `${calcPercent(statistics[key], totalPredict)}%`) || '0%',
      }));
    return (
      <Statistics listItems={listItems} />
    );
  }

  render() {
    const {
      selectedOutcome,
      selectedMatch,
      freeAmount,
      isFree,
      isOpen,
      support,
      against,
      onSubmitClick,
      onCancelClick,
      handleBetFail,
      dispatch,
    } = this.props;

    const outcomeProps = selectedOutcome ? {
      outcomeId: selectedOutcome.id,
      outcomeHid: selectedOutcome.hid,
      matchOutcome: selectedOutcome.value,
    } : {};

    const matchProps = selectedMatch ? {
      matchName: selectedMatch.value,
      matchMarketFee: selectedMatch.marketFee,
      closingDate: selectedMatch.date,
      reportTime: selectedMatch.reportTime,
    } : {};

    const bettingShake = {
      isOpen,
      amountSupport: defaultAmount(against),
      amountAgainst: defaultAmount(support),
      marketSupportOdds: defaultOdds(against),
      marketAgainstOdds: defaultOdds(support),
      onSubmitClick: (() => onSubmitClick(isFree)),
      onCancelClick,
      handleBetFail,
      ...outcomeProps,
      ...matchProps,
    };

    const orderBook = { support, against };

    return (
      <React.Fragment>
        {this.renderStatistics(this.props)}
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
      statistics: statisticsSelector(state),
    };
  },
)(BettingFilter);

