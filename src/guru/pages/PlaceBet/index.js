import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import qs from 'querystring';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { formatAmount } from '@/utils/number';
import { possibleWinning } from '@/utils/calculate';
import View from './View';
import { getMatchDetail, getGasPrice, getMatchOdd } from './action';
import { queryStringSelector, matchDetailSelector, gasPriceSelector, matchOddsSelector } from './selector';

import './styles.scss';

class PlaceBet extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    queryStringURL: PropTypes.string,
    matchDetail: PropTypes.object,
    gasPrice: PropTypes.number,
    sideOdds: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    queryStringURL: undefined,
    matchDetail: {},
    gasPrice: 0,
    sideOdds: ['support', 'against']
  };

  state = {
    betAmount: 0
  };

  componentDidMount() {
    const { props, getParams } = this;
    const { dispatch } = props;
    dispatch(getMatchDetail({ eventId: getParams(props).event_id }));
    dispatch(getMatchOdd({ outcomeId: getParams(props).outcome_id }));
    dispatch(getGasPrice());
  }

  getParams = ({ queryStringURL }) => (qs.parse(queryStringURL.slice(1)))

  getSide = (props) => (parseInt(this.getParams(props).side, 10));

  getOdds = () => {
    const { props, getSide } = this;
    const { matchOdds, sideOdds } = props;
    return (matchOdds && matchOdds[sideOdds[`${getSide(props) - 1}`]][0].odds) || 0;
  }
 
  handleBet = ({ values }) => {
    console.log('handleBet', values);
  }

  handleChange = (value) => {
    this.setState({ betAmount: value });
  }

  calculatePosWinning = () => {
    const { state, getOdds } = this;
    const { betAmount } = state;
    const betOdds = getOdds();
    return formatAmount(possibleWinning(betAmount, betOdds));
  }

  betFormProps = (props) => {
    const { handleBet, handleChange, getSide } = this;
    return {
      handleBet,
      handleChange,
      amount: '',
      side: getSide(props),
      buttonClasses: classNames('btn btn-block', {
        'btn-primary': getSide(props) === 1,
        'btn-secondary': getSide(props) === 2
      })
    };
  }

  betParamsProps = ({ matchDetail, gasPrice }) => ({
    possibleWinning: `${this.calculatePosWinning()}`,
    gasPrice: `${formatAmount(gasPrice)} ETH`,
    marketFee: `${matchDetail.market_fee}%`,
    className: classNames('BetParamsComponent')
  });

  renderComponent = (props) => {
    return (
      <div className="PlaceBetContainer">
        <View
          history={props.history}
          betFormProps={this.betFormProps(props)}
          betParamsProps={this.betParamsProps(props)}
        />
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      matchDetail: matchDetailSelector(state),
      queryStringURL: queryStringSelector(state),
      gasPrice: gasPriceSelector(state),
      matchOdds: matchOddsSelector(state)
    };
  }
)(PlaceBet));
