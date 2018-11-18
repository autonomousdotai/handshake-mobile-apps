import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Countdown from '@/components/Countdown/Countdown';
import CopyLink from '@/assets/images/share/link.svg';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import Statistics from '@/guru/components/Statistics/Statistics';
import Creator from '@/guru/components/Creator/Creator';
import { URL } from '@/constants';
import { Link } from 'react-router-dom';

import Image from '@/components/core/presentation/Image';
import Icon from '@/guru/components/Icon/Icon';
import { randomArrayItem } from '@/utils/array';
import NumberPlayersSVG from '@/assets/images/pex/number-players.svg';
import TimeSVG from '@/assets/images/pex/time.svg';
import CoinSVG from '@/assets/images/pex/coin.svg';
import MeIcon from '@/assets/images/navigation/ic_ninja_logo.svg';

import { formatAmount, calcPercent } from '@/utils/number';
import { shortAddress } from '@/utils/string';
import OutcomeList from './OutcomeList';
import { socialSharedMsg } from './constants';
import Outcome from '../../models/Outcome';

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

function renderEventImage({ event }) {
  const imageEvent = event.image_url;
  if (!imageEvent) return null;
  return (
    <div className="EventImage">
      <Image src={imageEvent} alt="Event Image" />
    </div>
  );
}

function renderEventNumberOfPlayers({ event }) {
  if (!event.total_users) return null;
  return (
    <div className="EventNumberOfPlayer">
      <span className="EventIcon"><Icon path={NumberPlayersSVG} className="NumberPlayer" /></span>
      <span className="NumberOfPlayerTitle">{event.total_users}</span>
    </div>
  );
}

function renderEvenTimeLeft({ event, onCountdownComplete }) {
  return (
    <div className="EventTimeLeft">
      <span className="EventIcon"><Icon path={TimeSVG} /></span>
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
      <span className="EventIcon"><Icon path={CoinSVG} /></span>
      <span className="EventTotalBetValue">{`${totalBets} ETH`}</span>
    </div>
  );
}

function renderCreator({ event, onClickCreator }) {
  const alias = event.creator_wallet_address || '0x3d00536dc2869cc7ee11c45f2fcc86c0336bffed';
  try {
    return (
      <div
        className="wrapperCreator"
        onClick={() => onClickCreator(event)}
      >
        <Creator alias={shortAddress(alias, '...')}>
          <Icon path={MeIcon} />
        </Creator>
      </div>
    );
  } catch (e) {
    return (<Creator />);
  }
}

function renderStatistics({ event }) {
  const statistics = event.bets_side;
  if (!statistics || !event.total_bets) return null;
  const totalPredict = Object.keys(statistics).reduce((acc, cur) => (
    statistics[acc] + statistics[cur]
  ));
  const listItems = Object.keys(statistics).sort((a, b) => (b > a))
    .map(key => ({
      name: key === 'support' ? 'Yes' : 'No',
      percent: (statistics[key] && Math.round(calcPercent(statistics[key], totalPredict))) || 0
    }));
  return (
    <Statistics listItems={listItems} />
  );
}

function renderBetOptions(props) {
  const opts = [{
    side: 1,
    label: 'yes',
    className: 'btn-primary'
  },
  {
    side: 2,
    label: 'no',
    className: 'btn-secondary'
  }];
  return (
    <div className="BetButtons">
      {
        opts.map(o => (
          <button
            key={o.side}
            className={`btn ${o.className}`}
            onClick={() => props.onClickOutcome({ ...props, side: o.side }, props.event.outcomes[0])}
          >
            {o.label}
          </button>
        ))
      }
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

function renderComment({ event }) {
  const commentLink = `${URL.COMMENTS_BY_SHAKE_INDEX}?objectId=${event.id}`;
  return (
    <div className="Comment">
      <i className="far fa-comment" />
      <Link to={commentLink}>Write a comment</Link>
    </div>
  );
}

function EventItem(props) {
  const eventDetailCls = classNames('EventDetails', {
    Full: props.event.total_bets > 0
  });
  return (
    <div className="EventItem">
      {/* {renderEventSource(props)} */}
      <div className="EventHeading">
        {renderEventName(props)}
        {renderEventImage(props)}
      </div>
      {renderCreator(props)}
      <div className={eventDetailCls}>
        <div className="EvenFirstGroup">
          {renderEvenTimeLeft(props)}
          {renderEventTotalBets(props)}
          {renderEventNumberOfPlayers(props)}
        </div>
        {renderStatistics(props)}
      </div>
      {renderBetOptions(props)}
      <div className="EventEnding">
        {renderComment(props)}
        {renderShareSocial(props)}
      </div>
      {/* {renderOutcomeList(props)} */}
    </div>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onClickOutcome: PropTypes.func,
  onCountdownComplete: PropTypes.func,
  onClickCreator: PropTypes.func,
};

EventItem.defaultProps = {
  onClickOutcome: undefined,
  onCountdownComplete: undefined,
  onClickCreator: undefined,
};

export default EventItem;
