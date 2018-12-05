import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isJSON } from '@/utils/object';
import Loading from '@/components/Loading';
import { updateLoading } from '@/guru/stores/action';
import { loadMatches } from './action';
import { eventSelector, isSharePage } from './selector';
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
        props.dispatch(loadMatches({ source }));
      }
    } else {
      props.dispatch(loadMatches({ isDetail: props.isSharePage }));
    }
  }

  renderHome = (props) => {
    if (props.isLoading) {
      return (<Loading isLoading={props.isLoading} />);
    }
    return (<View {...props} />);
  }

  render() {
    return this.renderHome(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      eventList: eventSelector(state),
      isSharePage: isSharePage(state),
      isLoading: state.guru.ui.isLoading
    };
  },
)(Home));
