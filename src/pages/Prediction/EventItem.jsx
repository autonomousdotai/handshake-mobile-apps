import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';
import CopyLink from '@/assets/images/share/link.svg';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import { URL } from '@/constants';
import { randomArrayItem } from '@/utils/array';
import { formatAmount } from '@/utils/number';
import OutcomeList from './OutcomeList';
import { socialSharedMsg } from './constants';

function renderEventName({ event }) {
  return (
    <div className="EventName">
      {event.name}
    </div>
  );
}

function renderEventNumberOfPlayers({ event }) {
  let msg = '';
  switch (event.total_users) {
    case 0:
      msg = 'Be the first ninja to play';
      break;
    case 1:
      msg = `${event.total_users} ninja is playing`;
      break;
    default:
      msg = `${event.total_users} ninjas are playing`;
      break;
  }
  return (
    <div className="EventNumberOfPlayer">{msg}</div>
  );
}

function renderEvenTimeLeft({ event, onCountdownComplete }) {
  return (
    <div className="EventTimeLeft">
      <span className="EventTimeLeftText">Time left</span>
      <span className="EventTimeLeftValue">
        <Countdown endTime={event.date} onComplete={onCountdownComplete} />
      </span>
    </div>
  );
}

function renderEventTotalBets({ event }) {
  const totalBets = !event.total_bets ? 0 : formatAmount(event.total_bets);
  return (
    <div className="EventTotalBet">
      <span className="EventTotalBetText">Total bets</span>
      <span className="EventTotalBetValue">{`${totalBets} ETH`}</span>
    </div>
  );
}

function renderOutcomeList({ event, onClickOutcome }) {
  return (
    <OutcomeList event={event} onClick={onClickOutcome} />
  );
}

function renderShareSocial(props) {
  const { id } = props.event;
  const socialList = [
    {
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg',
      title: 'FACEBOOK',
    }, {
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg',
      title: 'TWITTER',
    },
    {
      img: CopyLink,
      title: 'COPY',
    },
  ];
  const title = randomArrayItem(socialSharedMsg);
  const shareURL = `${window.location.origin}${URL.HANDSHAKE_PEX}?match=${id}`;
  return (<ShareSocial title={title} shareUrl={shareURL} socialList={socialList} />);
}

function EventItem(props) {
  return (
    <div className="EventItem">
      {renderEventName(props)}
      {renderEventNumberOfPlayers(props)}
      {renderOutcomeList(props)}
      <div className="EventDetails">
        <div className="EvenFirstGroup">
          {renderEvenTimeLeft(props)}
          {renderEventTotalBets(props)}
        </div>
        {renderShareSocial(props)}
      </div>
    </div>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onClickOutcome: PropTypes.func,
  onCountdownComplete: PropTypes.func,
};

EventItem.defaultProps = {
  onClickOutcome: undefined,
  onCountdownComplete: undefined,
};

export default EventItem;
