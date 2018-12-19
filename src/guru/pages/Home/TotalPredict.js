import React from 'react';
import PropTypes from 'prop-types';
import { formatAmount } from '@/utils/number';

const TotalPredict = ({ totalBets }) => {
  const htmlClassName = 'TotalPredict';
  const total = (totalBets && formatAmount(totalBets)) || 0;
  return (
    <div className={htmlClassName}>
      <span className="Icon fal fa-coins" />
      <span className="TotalPredict">{`${total} ETH`}</span>
    </div>
  );
};

TotalPredict.propTypes = {
  totalBets: PropTypes.number
};

TotalPredict.defaultProps = {
  totalBets: undefined
};

export default TotalPredict;
