import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@/guru/components/Card/Card';
import BetCreator from './Creator';
import TimeLeft from './TimeLeft';
import TotalPredict from './TotalPredict';
import CountPlayer from './CountPlayer';
import Statistics from './Statistics';
import Options from './Options';
import ShareSocial from './ShareSocial';
import Comment from './Comment';

function createItemChildren(itemProps) {
  const { eventItem, onClickCreator, onClickBetSide } = itemProps;
  return (
    <React.Fragment>
      <BetCreator walletAddress={eventItem.creator_wallet_address} onClick={onClickCreator} />
      <div className="CardParameters">
        <TimeLeft date={eventItem.date} onCountdownComplete={() => {}} />
        <TotalPredict totalBets={eventItem.total_bets} />
        <CountPlayer totalUsers={eventItem.total_users} />
      </div>
      <Statistics betSides={eventItem.bets_side} totalBets={eventItem.total_bets} />
      <Options event={eventItem} onClickOutcome={onClickBetSide} />
      <div className="CardShares">
        <Comment event={eventItem} />
        <ShareSocial event={eventItem} />
      </div>
    </React.Fragment>
  );
}

const CardItem = (props) => {
  const { eventItem } = props;
  if (!eventItem) return null;
  const htmlClassName = classNames('CardItem', {
    HasStatistics: eventItem.total_bets > 0
  });
  const cardProps = {
    className: htmlClassName,
    title: eventItem.name,
    imageUrl: eventItem.image_url
  };
  return (
    <Card {...cardProps}>
      {createItemChildren(props)}
    </Card>
  );
};

export default CardItem;
