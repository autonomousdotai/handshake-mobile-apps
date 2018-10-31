import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import './ProjectList.scss';
import ProjectList from '@/pages/Invest/ProjectList';
import LinkWallet from '@/pages/Invest/LinkWallet';
import TraderList from '@/pages/Invest/TraderList';
import InvestingList from '@/pages/Invest/InvestingList';
import ExpandArrowSVG from './settings.svg';

class InvestBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'trader',
    };
  }

  static getDerivedStateFromProps(props) {
    const activeTab = sessionStorage.getItem('activeTab');
    return {
      activeTab,
    };
  }
  shouldComponentUpdate = (p, s) => s.activeTab !== this.state.activeTab

  switchTabs=() => {
    switch (this.state.activeTab) {
      case 'trader':
        return <TraderList {...this.props} />;
      case 'projects':
        return <ProjectList {...this.props} />;
      case 'investing': 
        return <InvestingList {...this.props} />
      case 'linkwallet':
        return <LinkWallet {...this.props} />;
      default:
        return <div />;
    }
  }
  navigateToSettings = () => {};
  render() {
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <div
          style={{
            backgroundColor: '#fff',
            height: '43px',
            padding: '13px 1em',
            marginBottom: '2px',
          }}
          className="clearfix"
        >
          {/* <button
            style={{
              float: 'right',
              width: '25px',
              position: 'relative',
              padding: 0,
              top: '-4px',
            }}
            className="btn-transparent"
            onClick={this.navigateToSettings}
          >
            <img src={ExpandArrowSVG} alt="arrow" />
          </button> */}
          <button
            style={{ paddingLeft: 0 }}
            onClick={() => {
              this.setState({
                activeTab: 'trader',
              });
              sessionStorage.setItem('activeTab', 'trader');
            }}
            className={
              this.state.activeTab === 'trader'
                ? 'active-tab btn-transparent'
                : 'inactive-tab btn-transparent'
            }
          >
            <h6
              style={{
                textAlign: 'left',
              }}
            >
              Trader
            </h6>
          </button>
          <button
            className={
              this.state.activeTab === 'projects' ? 'active-tab btn-transparent' : 'inactive-tab btn-transparent'
            }
            onClick={() => {
              this.setState({
                activeTab: 'projects',
              });
              sessionStorage.setItem('activeTab', 'projects');
            }}
          >
            <h6
              style={{
                textAlign: 'left',
              }}
            >
              Projects
            </h6>
          </button>
          <button
            className={
              this.state.activeTab === 'investing' ? 'active-tab btn-transparent' : 'inactive-tab btn-transparent'
            }
            onClick={() => {
              this.setState({
                activeTab: 'investing',
              });
              sessionStorage.setItem('activeTab', 'investing');
            }}
          >
            <h6
              style={{
                textAlign: 'left',
              }}
            >
              My Funds
            </h6>
          </button>
          <button
            style={{ paddingLeft: 0, marginLeft: 7 }}
            onClick={() => {
              this.setState({
                activeTab: 'linkwallet',
              });
              sessionStorage.setItem('activeTab', 'linkwallet');
            }}
            className={
              this.state.activeTab === 'linkwallet'
                ? 'active-tab btn-transparent'
                : 'inactive-tab btn-transparent'
            }
          >
            <h6
              style={{
                textAlign: 'left',
              }}
            >
              Sync Wallet
            </h6>
          </button>
        </div>
        <this.switchTabs />
      </div>
    );
  }
}

export default InvestBlock;
