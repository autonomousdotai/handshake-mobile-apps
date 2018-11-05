import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import local from '@/services/localStore';
import Image from '@/components/core/presentation/Image';
import StarRatings from 'react-star-ratings';
import DefaultAvatar from '@/assets/images/icon/logo.svg';
import { loadUserEvents } from '@/guru/pages/Home/action';
import { userEventsSelector } from '@/guru/pages/Home/selector';
import { APP } from '@/constants';

import './Reputation.scss';
import EventItem from './EventItem';

class Reputation extends React.Component {
  static propTypes = {
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };
  componentDidMount() {
    this.getData(this.props);
  }
  getData = (props) => {
    const profile = local.get(APP.AUTH_PROFILE);
    const userId = profile.id;
    props.dispatch(loadUserEvents({ userId }));
  }
  renderStar() {
    return (
      <div className="wrapperStarRating">
        <StarRatings
          className="starRating"
          rating={4.5}
          isSelectable={false}
          starDimension="12px"
          starRatedColor="#2b8bff"
          starSpacing="3px"
          numberOfStars={5}
          name="rating"
        />
        <div className="starNumber">(10)</div>
      </div>
    );
  }
  renderProfile() {
    return (
      <div className="wrapperProfile">
        <div className="wrapperAvatar">
          <Image src={DefaultAvatar} alt="Avatar" width="50" />
        </div>
        <div className="wrapperContent">
          <div className="mediumText boldText">Grootsland</div>
          {this.renderStar()}
        </div>
      </div>
    );
  }
  renderMarketNumber() {
    return (
      <div className="wrapperGroupBlock">
        <div className="mediumText boldText">4</div>
        <div className="disableText normalText">Market</div>
      </div>
    );
  }
  renderETHNumber() {
    return (
      <div className="wrapperGroupBlock">
        <div className="mediumText boldText">12,301</div>
        <div className="disableText normalText">ETH played</div>
      </div>
    );
  }
  renderDisputeNumber() {
    return (
      <div className="wrapperGroupBlock">
        <div className="mediumText boldText">20</div>
        <div className="disableText normalText">Disputation</div>
      </div>
    );
  }
  renderGroupNumber() {
    return (
      <div className="wrapperGroupNumber">
        {this.renderMarketNumber()}
        {this.renderETHNumber()}
        {this.renderDisputeNumber()}
      </div>
    );
  }
  renderMarketList(props) {
    return (
      <div className="wrapperMarketList">
        <div className="mediumText boldText">Created Market</div>
        {props.eventList.map((event) => {
          return (
            <EventItem
              key={event.id}
              event={event}
            />
          );
        })}
      </div>
    );
  }
  render() {
    return (
      <div className="wrapperReputation">
        {this.renderProfile()}
        {this.renderGroupNumber()}
        {this.renderMarketList(this.props)}
      </div>
    );
  }
}
export default injectIntl(connect(
  (state) => {
    return {
      eventList: userEventsSelector(state),
    };
  },
)(Reputation));
