import React from 'react';
import PropTypes from 'prop-types';
import { calcPercent } from '@/utils/number';
import Statistics from '@/guru/components/Statistics/Statistics';

const BetStatistics = ({ betSides, totalBets }) => {
  if (!betSides || !totalBets) return null;
  const totalPredict = Object.keys(betSides).reduce((acc, cur) => (
    betSides[acc] + betSides[cur]
  ));
  const listItems = Object.keys(betSides).sort((a, b) => (b > a))
    .map(key => ({
      name: key === 'support' ? 'Yes' : 'No',
      percent: (betSides[key] && Math.round(calcPercent(betSides[key], totalPredict))) || 0
    }));
  return (
    <div className="CardStatistics">
      <Statistics listItems={listItems} />
    </div>
  );
};

BetStatistics.propTypes = {
  betSides: PropTypes.object,
  totalBets: PropTypes.number
};

BetStatistics.defaultProps = {
  betSides: undefined,
  totalBets: undefined
};

export default BetStatistics;
