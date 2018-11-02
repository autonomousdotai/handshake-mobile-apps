import React from 'react';
import Image from '@/components/core/presentation/Image';
import Countdown from '@/components/Countdown/Countdown';
import DefaultLogo from '@/assets/images/icon/logo.svg';
import TimeSVG from '@/assets/images/pex/time.svg';
import NumberPlayersSVG from '@/assets/images/pex/number-players.svg';

import './EventItem.scss';

class EventItem extends React.Component {
  renderEventImage() {
    return (
      <div className="wrapperEventImage">
        <Image src={DefaultLogo} alt="DefaultLogo" width="100" />
      </div>
    );
  }
  renderEventTimeLeft(event) {
    return (
      <div className="EventTimeLeft">
        <span><Image src={TimeSVG} alt="TimeSVG" /></span>
        <span className="EventTimeLeftValue">
          <Countdown endTime={event.date} />
        </span>
      </div>
    );
  }
  renderNumberPlayers(event) {
    return (
      <div className="EventNumberOfPlayer">
        <span><Image src={NumberPlayersSVG} alt="NumberPlayersSVG" /></span>
        <span className="NumberOfPlayerTitle">12345</span>
      </div>
    );
  }

  renderEventContent() {
    return (
      <div className="wrapperEventContent">
        <div>Liverpool will win against Chelsea</div>
      </div>
    );
  }
  render() {
    return (
      <div className="wrapperEventItem">
        {this.renderEventImage()}
        {this.renderEventContent()}
      </div>
    );
  }
}
export default EventItem;
