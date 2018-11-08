import React, { Component } from 'react';
import MainLayout from './MainLayout';
import CoinDesktop from './DesktopLayout';
import './styles.scss';

const scopedCss = (className) => `crypto-coin-${className}`;

class Coin extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className={scopedCss('desktop')}>
          <CoinDesktop>
            <MainLayout />
          </CoinDesktop>
        </div>
        <div className={scopedCss('mobile')}>
          <MainLayout />
        </div>
      </React.Fragment>
    );
  }
}

export default Coin;
