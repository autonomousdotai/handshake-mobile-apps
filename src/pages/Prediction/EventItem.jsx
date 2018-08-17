import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Countdown from '@/components/Countdown/Countdown';
import Image from '@/components/core/presentation/Image';
import CopyLink from '@/assets/images/share/link.svg';
import commentIcon from '@/assets/images/icon/comment.svg';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import { URL } from '@/constants';
import { formatAmount } from '@/utils/number';
import OutcomeList from './OutcomeList';
import GA from '@/services/googleAnalytics';

function renderEventName(event) {
  return (
    <div className="EventName">
      {event.name}
    </div>
  );
}

function renderEventNumberOfPlayers(event) {
  const s = event.total_users > 1 ? 'ninjas are' : 'ninja is';
  return (
    <div className="EventNumberOfPlayer">
      {`${event.total_users} ${s} playing`}
    </div>
  );
}

function renderEvenTimeLeft(event, onCountdownComplete) {
  return (
    <div className="EventTimeLeft">
      <span className="EventTimeLeftText">Time left</span>
      <span className="EventTimeLeftValue">
        <Countdown endTime={event.date} onComplete={onCountdownComplete} />
      </span>
    </div>
  );
}

function renderEventTotalBets(event) {
  const totalBets = !event.total_bets ? 0 : formatAmount(event.total_bets);
  return (
    <div className="EventTotalBet">
      <span className="EventTotalBetText">Total bets</span>
      <span className="EventTotalBetValue">{`${totalBets} ETH`}</span>
    </div>
  );
}

function renderEventMessages(event) {
  const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectId=event_${event.id}`;
  return (
    <Link className="EventMessage" to={commentLink}
      onClick={() => {
        GA.clickComment(event.name);
      }}
    >
      <span className="EventMessageIcon"><Image src={commentIcon} /></span>
      <div className="EventMessageText">Comments</div>
    </Link>
  );
}

function renderOutcomeList(event, onClickOutcome) {
  return (
    <OutcomeList event={event} onClick={onClickOutcome} />
  );
}

function EventItem({ event, onClickOutcome, onCountdownComplete }) {
  const { id } = event;
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
  const shareURL = `${window.location.origin}${URL.HANDSHAKE_PEX}?match=${id}`;
  return (
    <div className="EventItem">
      {renderEventName(event)}
      {renderEventNumberOfPlayers(event)}
      {renderOutcomeList(event, onClickOutcome)}
      <div className="EventDetails">
        <div className="EvenFirstGroup">
          {renderEvenTimeLeft(event, onCountdownComplete)}
          {renderEventTotalBets(event)}
        </div>
        {/* {renderEventMessages(event)} */}
        <ShareSocial title="Ninja" shareUrl={shareURL} socialList={socialList} />
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
