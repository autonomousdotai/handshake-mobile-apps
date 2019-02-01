import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { URL } from '@/constants';
import { isJSON } from '@/utils/object';
import AppBar from '@/guru/components/AppBar/AppBar';
import { updateLoading } from '@/guru/stores/action';

import {
  loadMatches,
  loadRelatedMatches,
  getReportCount,
  checkRedeemCode
} from './action';
import {
  eventSelector,
  relatedMatchesSelector,
  matchParamSelector,
  referParamSelector,
  countReportSelector,
  isRedeemSelector,
  isSubscribeSelector,
  statusSubscribeSelector
} from './selector';
import View from './View';

import './styles.scss';

class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    eventList: PropTypes.array,
    isSharePage: PropTypes.any
  };

  static defaultProps = {
    eventList: [],
    isSharePage: false
  };

  componentDidMount() {
    this.receiverMessage(this.props);
    this.props.dispatch(getReportCount());
    this.props.dispatch(checkRedeemCode());
  }

  componentDidUpdate() {
    const { props, emailSubscribe } = this;
    if (emailSubscribe) {
      const { isRedeem, isSubscribe, statusSubscribe } = props;
      if ((isRedeem && !isSubscribe)) {
        if (!this.isShowSubscriber) {
          emailSubscribe.open();
          this.isShowSubscriber = true;
        }
      }
      if (statusSubscribe) {
        emailSubscribe.close();
        this.isShowSubscriber = false;
      }
    }
  }

  // @TODO: Extensions
  /* eslint no-useless-escape: 0 */
  receiverMessage = (props) => {
    props.dispatch(updateLoading(true));
    const windowInfo = (isJSON(window.name) && JSON.parse(window.name)) || null;
    if (windowInfo) {
      const { message } = windowInfo;
      if (window.self !== window.top && message) {
        const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/i;
        const { url } = message;
        const matches = url.match(urlPattern);
        const source = matches && matches[0];
        return props.dispatch(loadMatches({ source }));
      }
    }
    if (props.matchParam) {
      props.dispatch(loadRelatedMatches({ matchId: props.matchParam }));
    }
    return props.dispatch(loadMatches({ isDetail: props.matchParam }));
  }

  modalEmailSubscribe = (modal) => { this.emailSubscribe = modal; };

  renderAppBar = () => (
    <AppBar>
      <span className="Title">Prediction</span>
      <Link to={URL.HANDSHAKE_WALLET_INDEX} className="IconRight Wallet">
        <i className="fal fa-wallet" />
      </Link>
    </AppBar>
  )

  renderHome = (props) => (
    <React.Fragment>
      {this.renderAppBar(props)}
      <View {...props} modalEmailSubscribe={this.modalEmailSubscribe} />
    </React.Fragment>
  )

  render() {
    return this.renderHome(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      eventList: eventSelector(state),
      relatedMatches: relatedMatchesSelector(state),
      matchParam: matchParamSelector(state),
      referParam: referParamSelector(state),
      countReport: countReportSelector(state),
      isLoading: state.guru.ui.isLoading,
      isRedeem: isRedeemSelector(state),
      isSubscribe: isSubscribeSelector(state),
      statusSubscribe: statusSubscribeSelector(state)
    };
  },
)(Home));
