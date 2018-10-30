import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import PricePanel from './PricePanel';
import Contact from './Contact';
import './styles.scss';

const scopedCss = (className) => `crypto-coin-desktop-${className}`;

class CoinDesktop extends Component {
  render() {
    return (
      <div className={scopedCss('container')}>
        <div className="container">
          <Header />
          <div className={scopedCss('body')}>
            <div className={scopedCss('left-container')}><PricePanel /></div>
            <div className={scopedCss('main-container')}>
              {this.props.children}
            </div>
            <div className={scopedCss('right-container')}>
              <Contact />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CoinDesktop.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CoinDesktop;
