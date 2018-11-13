import React from 'react';
import PropTypes from 'prop-types';

import Image from '@/components/core/presentation/Image';
import Countdown from '@/components/Countdown/Countdown';
import DefaultLogo from '@/assets/images/pex/create/default-event.svg';
import TimeSVG from '@/assets/images/pex/time.svg';
import NumberPlayersSVG from '@/assets/images/pex/number-players.svg';
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
    };
  }
  componentDidMount() {
    const { event } = this.props;
    this.setState({
      isExpired: isExpiredDate(event.date)
    });
  }
  renderEventImage() {
    return (
      <div className="wrapperEventImage">
        <Image className="eventLogo" src={DefaultLogo} alt="DefaultLogo" />
      </div>
    );
  }
  renderEventTimeLeft(event) {
    const { isExpired } = this.state;
    return (
      <div className="eventDetailBlock">
        <span><Image src={TimeSVG} alt="TimeSVG" /></span>
        <span className="eventDetailText normalText disableText">
          {isExpired ? 'Expired' : <Countdown endTime={event.date} />}
        </span>
      </div>
    );
  }
  renderNumberPlayers(event) {
    const { total_users: totalUsers = 0, image_url: imageUrl } = event;
    const src = imageUrl || NumberPlayersSVG;
    return (
      <div className="eventDetailBlock">
        <span><Image src={src} alt="NumberPlayersSVG" /></span>
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
