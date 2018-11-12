import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import qs from 'querystring';
import AppBar from '@/guru/components/AppBar/AppBar';
import { getMatchDetail } from './action';
import { queryStringSelector, matchDetailSelector } from './selector';

class PlaceBet extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    queryStringURL: PropTypes.string,
    matchDetail: PropTypes.object
  }

  static defaultProps = {
    queryStringURL: undefined,
    matchDetail: {}
  }

  componentDidMount() {
    const { queryStringURL } = this.props;
    const params = qs.parse(queryStringURL.slice(1));
    this.props.dispatch(getMatchDetail({ eventId: params.event_id }));
  }

  backAction = () => {
    this.props.history.go(-1);
  }

  renderAppBar = (props) => {
    return (
      <AppBar>
        <span className="BackAction" onClick={this.backAction} >
          <i className="fal fa-angle-left" />
        </span>
        <span className="Title">Place a bet</span>
      </AppBar>
    );
  }

  renderComponent = (props) => {
    return (
      <div className="PlaceBetContainer">
        {this.renderAppBar(props)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      matchDetail: matchDetailSelector(state),
      queryStringURL: queryStringSelector(state)
    };
  }
)(PlaceBet));
