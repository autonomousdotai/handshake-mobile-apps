import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/guru/components/Icon/Icon';

const BetParams = ({ possibleWinning, gasPrice, marketFee, iconCoin, ...restProps }) => {
  return (
    <div {...restProps}>
      <div className="Item">
        <strong className="Label">Possible winnings</strong>
        <strong className="value">
          <Icon path={iconCoin} />
          {possibleWinning}
        </strong>
      </div>
      <div className="Item">
        <span className="Label">Gas price</span>
        <span className="value">{gasPrice}</span>
      </div>
      <div className="Item">
        <span className="Label">Market fee</span>
        <span className="value">{marketFee}</span>
      </div>
    </div>
  );
};

BetParams.propTypes = {
  possibleWinning: PropTypes.string.isRequired,
  gasPrice: PropTypes.string.isRequired,
  marketFee: PropTypes.string.isRequired
};

export default BetParams;
