import React from 'react';
import PropTypes from 'prop-types';

import Image from '@/components/core/presentation/Image';
import Countdown from '@/components/Countdown/Countdown';
import DefaultLogo from '@/assets/images/icon/logo.svg';
import TimeSVG from '@/assets/images/pex/time.svg';
import NumberPlayersSVG from '@/assets/images/pex/number-players.svg';

import './EventItem.scss';

class EventItem extends React.Component {
  static propTypes = {
    event: PropTypes.object,
  }
  static defaultProps = {
    event: {},
  }
  renderEventImage() {
    return (
      <div className="wrapperEventImage">
        <Image src={DefaultLogo} alt="DefaultLogo" width="100" />
      </div>
    );
  }
  renderEventTimeLeft(event) {
    return (
      <div className="eventDetailBlock">
        <span><Image src={TimeSVG} alt="TimeSVG" /></span>
        <span className="eventDetailText normalText disableText">
          <Countdown endTime={event.date} />
        </span>
      </div>
    );
  }
  renderNumberPlayers(event) {
    return (
      <div className="eventDetailBlock">
        <span><Image src={NumberPlayersSVG} alt="NumberPlayersSVG" /></span>
        <span className="eventDetailText normalText disableText">12345</span>
      </div>
    );
  }
  renderDetail(event) {
    return (
      <div className="wrapperEventDetail">
        {this.renderEventTimeLeft(event)}
        {this.renderNumberPlayers(event)}
      </div>
    );
  }

  renderEventContent(event) {
    const { name } = event;
    return (
      <div className="wrapperEventContent">
        <div>{name}</div>
        {this.renderDetail(event)}
      </div>
    );
  }
  render() {
    const { event } = this.props;
    return (
      <div className="wrapperEventItem">
        {this.renderEventContent(event)}
        {this.renderEventImage()}
      </div>
    );
  }
}
export default EventItem;
