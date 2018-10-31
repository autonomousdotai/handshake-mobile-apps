import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import PricePanel from './PricePanel';
import Contact from './Contact';
import Review from '@/components/handshakes/exchange/Coin/ReviewList';
import './styles.scss';
import { connect } from 'react-redux';

const scopedCss = (className) => `crypto-coin-desktop-${className}`;

class CoinDesktop extends Component {
  render() {
    const { numReview } = this.props;
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
              { numReview > 0 && <Review /> }
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

const mapStateToProps = (state) => ({
  numReview: state.exchange.numReview,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CoinDesktop);
