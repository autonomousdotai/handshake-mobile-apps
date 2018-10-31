import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BuyCryptoCoin from '@/components/handshakes/exchange/Coin/BuyCryptoCoin';
import SellCryptoCoin from '@/components/handshakes/exchange/Coin/SellCryptoCoin';
import { injectIntl, FormattedMessage } from 'react-intl';
import IdVerifyBtn from '@/components/handshakes/exchange/Feed/components/IdVerifyBtn';
import './styles.scss';

const TABS = {
  BUYCOIN: {
    name: 'coin_tabs.buy',
    component: BuyCryptoCoin,
  },
  SELLCOIN: {
    name: 'coin_tabs.sell',
    component: SellCryptoCoin,
  },
};

const scopedCss = (className) => `crypto-coin-main-layout-${className}`;

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
    return (
      <React.Fragment>
        {
          Object.entries(TABS).map(([key, data]) => {
            const Com = data?.component;
            return <Com key={key} className={key === currentTabId ? 'fadeIn' : 'hidden'} />;
          })
        }
      </React.Fragment>
    );
  }

  render() {
    const showState = [-1, 0, 2, 1];
    const { authProfile: { idVerified } } = this.props;
    return (
      <div className={scopedCss('container')}>
        <div className={scopedCss('tabs')}>
          {this.renderTabs()}
        </div>
        <div className={scopedCss('tab-body')}>
          {
            showState.indexOf(idVerified) >= 0 && <IdVerifyBtn dispatch={this.props.dispatch} idVerified={idVerified} />
          }
          {this.renderTabComponent()}
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  authProfile: state.auth.profile,
});

Coin.propTypes = {
  authProfile: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default injectIntl(connect(mapState, null)(Coin));
