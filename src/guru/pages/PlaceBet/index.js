import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import qs from 'querystring';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { formatAmount } from '@/utils/number';
import { possibleWinning } from '@/utils/calculate';
import AppBar from '@/guru/components/AppBar/AppBar';
import View from './View';
import { getMatchDetail, getGasPrice, getMatchOdd } from './action';
import { queryStringSelector, matchDetailSelector, gasPriceSelector } from './selector';

import './styles.scss';

class PlaceBet extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    queryStringURL: PropTypes.string,
    matchDetail: PropTypes.object,
    gasPrice: PropTypes.number
  }

  static defaultProps = {
    queryStringURL: undefined,
    matchDetail: {},
    gasPrice: 0
  }

  componentDidMount() {
    const { props, getParams } = this;
    const { dispatch } = props;
    dispatch(getMatchDetail({ eventId: getParams(props).event_id }));
    dispatch(getMatchOdd({ outcomeId: getParams(props).outcome_id }));
    dispatch(getGasPrice());
  }

  getParams = ({ queryStringURL }) => (qs.parse(queryStringURL.slice(1)))

  backAction = () => {
    this.props.history.go(-1);
  }
  
  handleBet = (value) => {
    console.log('handleBet', value);
  }

  betInputProps = (props) => {
    const { handleBet, getParams } = this;
    return {
      handleBet,
      side: parseInt(getParams(props).side, 10)
    };
  }

  betParamsProps = ({ matchDetail, gasPrice }) => ({
    possibleWinning: 0.006, // `${formatAmount(possibleWinning(betAmount, betOdd))}`
    gasPrice: `${formatAmount(gasPrice)} ETH`,
    marketFee: `${matchDetail.market_fee}%`,
    className: classNames('BetParamsComponent')
  });

  renderAppBar = (props) => {
    return (
      <AppBar>
        <span className="IconLeft BackAction" onClick={this.backAction} >
          <i className="far fa-angle-left" />
        </span>
        <span className="Title">Place a bet</span>
      </AppBar>
    );
  }

  renderComponent = (props) => {
    return (
      <div className="PlaceBetContainer">
        {this.renderAppBar(props)}
        <View
          BetInputProps={this.betInputProps(props)}
          BetParamsProps={this.betParamsProps(props)}
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
      gasPrice: gasPriceSelector(state)
    };
  }
)(PlaceBet));
