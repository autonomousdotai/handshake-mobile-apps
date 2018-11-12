import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import qs from 'querystring';
import { formatAmount } from '@/utils/number';
import AppBar from '@/guru/components/AppBar/AppBar';
import BetInput from './BetInput';
import BetParams from './BetParams';
import { getMatchDetail, getGasPrice } from './action';
import { queryStringSelector, matchDetailSelector, gasPriceSelector } from './selector';

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
    const { queryStringURL } = this.props;
    const params = qs.parse(queryStringURL.slice(1));
    this.props.dispatch(getMatchDetail({ eventId: params.event_id }));
    this.props.dispatch(getGasPrice());
  }

  backAction = () => {
    this.props.history.go(-1);
  }

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

  renderBetInput = () => {
    return (
      <BetInput />
    );
  }

  renderBetParams = (props) => {
    const { matchDetail, gasPrice } = props;
    if (!matchDetail) return null;
    const classNameProp = classNames('BetParamsComponent');
    const paramProps = {
      possibleWinning: 0.006,
      gasPrice: `${formatAmount(gasPrice)} ETH`,
      marketFee: `${matchDetail.market_fee}%`,
      className: classNameProp
    };
    return (
      <BetParams {...paramProps} />
    );
  }

  renderComponent = (props) => {
    return (
      <div className="PlaceBetContainer">
        {this.renderAppBar(props)}
        {this.renderBetInput(props)}
        {this.renderBetParams(props)}
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
