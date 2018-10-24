import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';
import CopyLink from '@/assets/images/share/link.svg';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import { URL } from '@/constants';
import Image from '@/components/core/presentation/Image';
import { randomArrayItem } from '@/utils/array';
import NumberPlayersSVG from '@/assets/images/pex/number-players.svg';
import TimeSVG from '@/assets/images/pex/time.svg';
import CoinSVG from '@/assets/images/pex/coin.svg';


import { formatAmount } from '@/utils/number';
import OutcomeList from './OutcomeList';
import { socialSharedMsg } from './constants';

function renderEventSource({ event }) {
  const { source } = event;
  const { name, url_icon: urlSource, url } = source;
  const sourceName = name || url;
  return (
    <div className="SourceLogo">
      <div className="LogoImage">
        <Image src={urlSource} alt="sourceLogo" width="23" />
      </div>
      <div className="SourceTitle">{sourceName}</div>
    </div>
  );
}
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
    <div className="EventNumberOfPlayer">
      <span><Image src={NumberPlayersSVG} alt="NumberPlayersSVG" /></span>
      <span className="NumberOfPlayerTitle">{msg}</span>
    </div>
  );
}

function renderEvenTimeLeft({ event, onCountdownComplete }) {
  return (
    <div className="EventTimeLeft">
      <span><Image src={TimeSVG} alt="TimeSVG" /></span>
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
      <span><Image src={CoinSVG} alt="CoinSVG" /></span>
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
      {renderEventSource(props)}
      {renderEventName(props)}
      {renderOutcomeList(props)}
      <div className="EventDetails">
        <div className="EvenFirstGroup">
          {renderEvenTimeLeft(props)}
          {renderEventTotalBets(props)}
          {renderEventNumberOfPlayers(props)}
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
