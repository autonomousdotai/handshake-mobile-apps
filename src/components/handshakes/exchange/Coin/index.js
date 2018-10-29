import React, { Component } from 'react';
import { connect } from 'react-redux';
import BuyCryptoCoin from '@/components/handshakes/exchange/Coin/BuyCryptoCoin';
import SellCryptoCoin from '@/components/handshakes/exchange/Coin/SellCryptoCoin';
import { injectIntl, FormattedMessage } from 'react-intl';
import './styles.scss';

const TABS = {
  BUYCOIN: {
    name: 'coin_tabs.buy',
    component: <BuyCryptoCoin className="fadeIn" />,
  },
  SELLCOIN: {
    name: 'coin_tabs.sell',
    component: <SellCryptoCoin className="fadeIn" />,
  },
};

const scopedCss = (className) => `crypto-coin-${className}`;

class Coin extends Component {
  constructor() {
    super();
    this.state = {
      currentTabId: Object.keys(TABS)[0],
    };
  }

  onChangeTab = (tabId) => {
    if (TABS[tabId]) {
      this.setState({ currentTabId: tabId });
    }
  }

  renderTabs = () => {
    const { currentTabId } = this.state;

    return Object.entries(TABS).map(([key, data]) => (
      <div className={key === currentTabId ? 'selected' : ''} key={key} onClick={() => this.onChangeTab(key)}><FormattedMessage id={data?.name} /></div>
    ));
  }

  renderTabComponent = () => {
    const { currentTabId } = this.state;
    const tab = TABS[currentTabId];
    return tab?.component;
  }

  render() {
    return (
      <div className={scopedCss('container')}>
        <div className={scopedCss('tabs')}>
          {this.renderTabs()}
        </div>
        <div className={scopedCss('tab-body')}>
          {this.renderTabComponent()}
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(null, null)(Coin));
