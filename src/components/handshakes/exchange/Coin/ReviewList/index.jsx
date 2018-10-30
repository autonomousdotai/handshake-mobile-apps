/* eslint react/sort-comp:0 */
/* eslint camelcase: 0 */

import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import {API_URL} from '@/constants';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import './ReviewList.scss';
import {getReviewBuyCoin} from '@/reducers/exchange/action';
import {Grid, Row} from 'react-bootstrap';
import Image from "@/components/core/presentation/Image/Image";
import loadingSVG from '@/assets/images/icon/user_icon.svg';


class ReviewList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  componentDidMount() {
    this.getReviewCoin();
  }

  componentWillUnmount() {
  }

  getReviewCoin = () => {
    this.props.getReviewBuyCoin({
      PATH_URL: `${API_URL.INTERNAL.REVIEW_COIN_ORDER}`,
      METHOD: 'GET',
      // successFn: this.handleReviewOfferSuccess,
      // errorFn: this.handleReviewOfferFailed,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  render() {
    console.log('render ReviewList', this.props.reviewList);
    const {reviewList} = this.props;
    return (
      <React.Fragment>
        <Grid className="review-list">
          {
            reviewList && reviewList.map(item => {
              return (
                <Row className="review">
                  <div><Image src={loadingSVG} alt="loading" width="30"/></div>
                  <div className="review-content">
                    <div className="name">{item.name}</div>
                    <div className="content">{item.review}</div>
                  </div>
                </Row>);
            })
          }

        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  reviewList: state.exchange.reviewList,
});

const mapDispatchToProps = (dispatch) => ({
  getReviewBuyCoin: bindActionCreators(getReviewBuyCoin, dispatch),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReviewList)));
