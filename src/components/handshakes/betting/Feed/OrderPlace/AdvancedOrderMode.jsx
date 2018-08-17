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


  render() {
    const { bettingShake, orderBook, theme } = this.props;
    const { side } = bettingShake;
    const { disable } = this.state;
    const buttonClass = theme;
    const sideText = getKeyByValue(SIDE, side);
    const buttonText = disable ? 'Loading...' : `Place ${sideText} order`;

    return (
      <React.Fragment>
        <BettingShake
          {...bettingShake}
          onClickSubmit={(click) =>{ this.onButtonSubmit = click; }}
        />
        <OrderBook {...orderBook} />
        <Button block isLoading={disable} disabled={disable} className={buttonClass} onClick={this.handleClick}>{buttonText}</Button>
        <EstimateGas />
      </React.Fragment>
    );
  }
}

export default AdvancedOrderMode;
