import React from 'react';
import PropTypes from 'prop-types';

import Image from '@/components/core/presentation/Image';
import Countdown from '@/components/Countdown/Countdown';
import DefaultLogo from '@/assets/images/pex/create/default-event.svg';
import { isExpiredDate } from '@/components/handshakes/betting/validation';

import './EventItem.scss';

class EventItem extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    onClickEvent: PropTypes.func,
  }
  static defaultProps = {
    event: {},
  }
  constructor(props) {
    super(props);
    this.state = {
      isExpired: false,
      eventLogo: null
    };
  }
  componentDidMount() {
    const { event } = this.props;
    const { image_url: imageUrl } = event;

    this.setState({
      isExpired: isExpiredDate(event.date),
      eventLogo: imageUrl || DefaultLogo
    });
  }
  renderEventImage(event) {
    const { eventLogo } = this.state;
    return (
      <div className="wrapperEventImage">
        <Image className="eventLogo"
          src={eventLogo}
          alt="eventLogo"
          onError={() => this.setState({
            eventLogo: DefaultLogo
          })}
        />
      </div>
    );
  }
  renderEventTimeLeft(event) {
    const { isExpired } = this.state;
    return (
      <div className="eventDetailBlock">
        <span><i className="fal fa-clock" style={{ color: '#889db3', fontSize: '16px' }} /></span>
        <span className="eventDetailText normalText disableText">
          {isExpired ? 'Expired' : <Countdown endTime={event.date} />}
        </span>
      </div>
    );
  }
  renderNumberPlayers(event) {
    const { total_users: totalUsers = 0 } = event;
    return (
      <div className="eventDetailBlock">
        <span className="eventImagePlayers"><i className="fal fa-user-friends" style={{ color: '#889db3', fontSize: '16px' }} /></span>
        <span className="eventDetailText normalText disableText">{totalUsers}</span>
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
    const { isExpired } = this.state;
    let classEventName = 'mediumText boldText';
    classEventName = isExpired ? `${classEventName} disableText` : classEventName;
    return (
      <div className="wrapperEventContent">
        <div className={classEventName}>{name}</div>
        {this.renderDetail(event)}
      </div>
    );
  }
  render() {
    const { event } = this.props;
    const { isExpired } = this.state;

    return (
      <div className="wrapperEventItem"
        onClick={() => {
          if (!isExpired) {
            this.props.onClickEvent(event);
          }
        }}
      >
        {this.renderEventContent(event)}
        {this.renderEventImage()}
      </div>
    );
  }
}
export default EventItem;
