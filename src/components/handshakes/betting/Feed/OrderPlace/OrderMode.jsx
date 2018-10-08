import React from 'react';

import Tabs from './../Tabs';
import GA from '@/services/googleAnalytics';

import SimpleOrderMode from './SimpleOrderMode';
import AdvancedOrderMode from './AdvancedOrderMode';

class OrderMode extends React.PureComponent {
  afterTabChanges = (tab) => {
    const tabType = tab.toUpperCase();
    const { bettingShake } = this.props;
    const { matchOutcome } = bettingShake;
    if (tabType === 'SIMPLE') {
      GA.clickSimple(matchOutcome);
    } else {
      GA.clickAdvance(matchOutcome);
    }
  }

  render() {

    return (
      <React.Fragment>
        <Tabs htmlClassName="OrderMode" afterClick={this.afterTabChanges}>
          <div label="Simple" className="OrderModeType">
            <SimpleOrderMode {...this.props} />
          </div>
          <div label="Advanced" className="OrderModeType">
            <AdvancedOrderMode {...this.props} dispatch={this.props.dispatch}/>
          </div>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default OrderMode;
