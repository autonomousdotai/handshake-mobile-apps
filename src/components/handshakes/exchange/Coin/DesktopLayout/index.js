import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import PricePanel from './PricePanel';
import Contact from './Contact';
import Review from '@/components/handshakes/exchange/Coin/ReviewList';
import './styles.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { API_URL } from '@/constants';
import { getReviewBuyCoin } from '@/reducers/exchange/action';

const scopedCss = (className) => `crypto-coin-desktop-${className}`;

class CoinDesktop extends Component {
  componentDidMount() {
    this.getReviewCoin();
  }

  getReviewCoin = () => {
    const qs = {};
    // this.props.getReviewBuyCoin({
    //   PATH_URL: `${API_URL.INTERNAL.REVIEW_COIN_ORDER}`,
    //   qs,
    //   METHOD: 'GET',
    //   // errorFn: this.handleReviewOfferFailed,
    // });
  }

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
  getReviewBuyCoin: bindActionCreators(getReviewBuyCoin, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoinDesktop);
