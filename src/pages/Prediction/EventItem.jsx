import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Countdown from '@/components/Countdown/Countdown';
import Image from '@/components/core/presentation/Image';
import commentIcon from '@/assets/images/icon/comment.svg';
import { URL } from '@/constants';
import { formatAmount } from '@/utils/number';
import OutcomeList from './OutcomeList';
import GA from '@/services/googleAnalytics';

function renderEventName({ event }) {
  return (
    <div className="EventName">
      {event.name}
    </div>
  );
}

function renderEventNumberOfPlayers({ event }) {
  const s = event.total_users > 1 ? 'ninjas are' : 'ninja is';
  return (
    <div className="EventNumberOfPlayer">
      {`${event.total_users} ${s} playing`}
    </div>
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

function renderEventMessages({ event }) {
  const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectId=event_${event.id}`;
  return (
    <Link
      className="EventMessage"
      to={commentLink}
      onClick={() => {
        GA.clickComment(event.name);
      }}
    >
      <span className="EventMessageIcon"><Image src={commentIcon} /></span>
      <div className="EventMessageText">Comments</div>
    </Link>
  );
}

function renderOutcomeList({ event, onClickOutcome }) {
  return (
    <OutcomeList event={event} onClick={onClickOutcome} />
  );
}

function renderDetails(props) {
  return (
    <div className="EventDetails">
      <div className="EvenFirstGroup">
        {renderEvenTimeLeft(props)}
        {renderEventTotalBets(props)}
      </div>
      {renderEventMessages(props)}
    </div>
  );
}

function EventItem(props) {
  return (
    <div className="EventItem">
      {renderEventName(props)}
      {renderEventNumberOfPlayers(props)}
      {renderOutcomeList(props)}
      {renderDetails(props)}
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
