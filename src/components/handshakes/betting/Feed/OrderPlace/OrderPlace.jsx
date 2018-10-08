import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SIDE } from '@/components/handshakes/betting/constants.js';
import GA from '@/services/googleAnalytics';
import { updateSide } from './action';

import Tabs from './../Tabs';
import OrderMode from './OrderMode';

import './OrderPlace.scss';

class OrderPlace extends React.Component {
  static propTypes = {
    render: PropTypes.bool,
    bettingShake: PropTypes.object,
    orderBook: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    render: false,
    bettingShake: null,
    orderBook: null,
    dispatch: undefined,
  };

  state = {
    side: SIDE.SUPPORT,
  };

  afterTabChanges = (tab) => {
    const tabType = tab.toUpperCase();
    this.setState({
      side: SIDE[`${tabType}`],
    });
    this.props.dispatch(updateSide(tab.toLowerCase()));
    // Event tracking
    //GA.clickChooseASide(SIDE[`${tabType}`]);
    const { bettingShake } = this.props;
    const { matchOutcome } = bettingShake;
    if (SIDE[`${tabType}`] === SIDE.SUPPORT) {
      GA.clickSupport(matchOutcome);
    } else {
      GA.clickOppose(matchOutcome);
    }
  }

  render() {
    const { bettingShake, orderBook, dispatch } = this.props;
    const orderMode = {
      bettingShake: {
        ...bettingShake,
        side: this.state.side,
      },
      orderBook,
      dispatch,
    };
    return (
      <React.Fragment>
        <Tabs htmlClassName="OrderPlace" afterClick={this.afterTabChanges}>
          <div className="OrderPlaceType Green" label="Support">
            <OrderMode {...orderMode} theme="Green" />
          </div>
          <div className="OrderPlaceType Orange" label="Oppose">
            <OrderMode {...orderMode} theme="Orange" />
          </div>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      side: updateSide(state),
    };
  },
)(OrderPlace);
