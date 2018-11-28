import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import qs from 'querystring';
import { URL } from '@/constants';
import { connect } from 'react-redux';
import Image from '@/components/core/presentation/Image';
import Loading from '@/components/Loading';
import AppBar from '@/guru/components/AppBar/AppBar';
import DefaultAvatar from '@/assets/images/icon/logo.svg';
import { loadUserReputation } from '@/guru/pages/Home/action';
import { userEventsSelector, userReputationSelector } from '@/guru/pages/Home/selector';
import { shortAddress } from '@/utils/string';
import InfiniteScroll from 'react-infinite-scroller';


import './Reputation.scss';
import EventItem from './EventItem';

class Reputation extends React.Component {
  static propTypes = {
    eventList: PropTypes.array,
    reputation: PropTypes.object,
  };

  static defaultProps = {
    eventList: [],
    reputation: {}
  };

  componentDidMount() {
    this.getData(this.props, 0);
  }
  getQueryString=() => {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    return querystringParsed;
  }
  getData = (props, page) => {
    const query = this.getQueryString();
    const userId = query.id;
    props.dispatch(loadUserReputation({ userId, page }));
  }

  backAction = () => {
    this.props.history.go(-1);
  }

  handleClickEvent = (event)=> {
    const url = `${URL.HANDSHAKE_PREDICTION}?match=${event.id}`;
    this.props.history.push(url);
  }

  formatAmount = (amount) => {
    return Math.floor(amount * 10000) / 10000;
  };

  renderProfile(props) {
    const query = this.getQueryString();

    let creatorAddress = query.address;
    if (creatorAddress && creatorAddress.length > 11) {
      creatorAddress = shortAddress(creatorAddress, '...');
    }
    return (
      <div className="wrapperProfile">
        <div className="wrapperAvatar">
          <Image src={DefaultAvatar} alt="Avatar" width="50" />
        </div>
        <div className="wrapperContent">
          <div className="mediumText boldText">{creatorAddress}</div>
        </div>
      </div>
    );
  }
  renderMarketNumber(reputation) {
    const { total_events: totalEvents = 0 } = reputation;
    return (
      <div className="wrapperGroupBlock">
        <div className="boldText">{totalEvents}</div>
        <div className="disableText mediumText">Debates</div>
      </div>
    );
  }
  renderETHNumber(reputation) {
    const { total_amount: totalAmount = 0 } = reputation;
    return (
      <div className="wrapperGroupBlock">
        <div className="boldText">{this.formatAmount(totalAmount)}</div>
        <div className="disableText mediumText">ETH</div>
      </div>
    );
  }
  renderDisputeNumber(reputation) {
    const { total_disputed_events: totalDisputedEvent = 0 } = reputation;
    return (
      <div className="wrapperGroupBlock">
        <div className="boldText">{totalDisputedEvent}</div>
        <div className="disableText mediumText">Disputes</div>
      </div>
    );
  }
  renderGroupNumber(props) {
    const { reputation } = props;
    return (
      <div className="wrapperGroupNumber">
        {this.renderMarketNumber(reputation)}
        {this.renderETHNumber(reputation)}
        {this.renderDisputeNumber(reputation)}
      </div>
    );
  }
  renderMarketList(props) {
    const { reputation } = props;
    const { loadMore, page } = reputation;
    return (
      <div className="wrapperMarketList">
        <div className="mediumText">Hosted Debates</div>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => this.getData(props, page)}
          hasMore={loadMore}
          loader={<div className="loaderRepu">Loading ...</div>}
        >
          {props.eventList.map((event) => {
            return (
              <EventItem
                key={event.id}
                event={event}
                onClickEvent={this.handleClickEvent}
              />
            );
          })}
        </InfiniteScroll>

      </div>
    );
  }
  renderAppBar = (props) => {
    return (
      <AppBar>
        <span className="IconLeft"
          onClick={() => {
          this.backAction();
          }}
        >
          <i className="far fa-angle-left" />
        </span>
        <span className="Title">Ninja Profile</span>
      </AppBar>
    );
  }
  render() {
    return (
      <div className="wrapperReputation">
        {this.renderAppBar(this.props)}
        <div className="wrapperContentReputation">
          <Loading isLoading={this.props.isLoading} />
          {this.renderProfile(this.props)}
          {this.renderGroupNumber(this.props)}
          {this.renderMarketList(this.props)}
        </div>
      </div>
    );
  }
}
export default injectIntl(connect(
  (state) => {
    return {
      eventList: userEventsSelector(state),
      reputation: userReputationSelector(state),
      isLoading: state.guru.ui.isLoading
    };
  },
)(Reputation));
