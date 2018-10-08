import React from 'react';
import PropTypes from 'prop-types';

import { SIDE } from '@/components/handshakes/betting/constants.js';
import { getKeyByValue } from '@/utils/object';
import Button from '@/components/core/controls/Button';
import GA from '@/services/googleAnalytics';
import EstimateGas from '@/modules/EstimateGas';

import BettingShake from './../Shake';
import OrderBook from './OrderBook';

class AdvancedOrderMode extends React.Component {
  static propTypes = {
    bettingShake: PropTypes.object,
    orderBook: PropTypes.object,
    theme: PropTypes.string,
  }

  static defaultProps = {
    bettingShake: null,
    orderBook: null,
    theme: null,
  }

  state = {
    disable: false,
  }

  componentWillReceiveProps(nextProps) {
    const { bettingShake } = nextProps;
    const { isOpen } = bettingShake;
    this.setState({
      disable: !isOpen,
    });
  }

  handleClick = () => {
    const { bettingShake } = this.props;
    const { matchName, matchOutcome, side } = bettingShake;

    this.setState({
      disable: true,
    });
    this.onButtonSubmit();
    // send event tracking
    try {
      GA.clickGoButtonAdvanced(matchName, matchOutcome, side);
    } catch (err) {}
  }

  renderMarketFee = (props) => {
    const { matchMarketFee } = props.bettingShake;
    return (
      <div className="matchMarketFee">
        <span>Market Fee</span>
        <span className="feeValue">{matchMarketFee || 0}%</span>
      </div>
    );
  }

  render() {
    const { bettingShake, orderBook, theme } = this.props;
    const { side, onCancelClick, handleBetFail } = bettingShake;
    const { disable } = this.state;
    const buttonClass = theme;
    // const sideText = getKeyByValue(SIDE, side);
    // const buttonText = disable ? 'Loading...' : `Place ${sideText} order`;
    const buttonText = disable ? 'Loading...' : `Bet now`;

    return (
      <React.Fragment>
        <BettingShake
          {...bettingShake}
          dispatch={this.props.dispatch}
          onClickSubmit={(click) => { this.onButtonSubmit = click }}
          handleBetFail={ (value) => { handleBetFail(value); }}
          onCancelClick={() => { onCancelClick();}}
        />
        <Button block isLoading={disable} disabled={disable} className={buttonClass} onClick={this.handleClick}>{buttonText}</Button>
        <EstimateGas />
        {this.renderMarketFee(this.props)}
        <OrderBook {...orderBook} />
      </React.Fragment>
    );
  }
}

export default AdvancedOrderMode;
