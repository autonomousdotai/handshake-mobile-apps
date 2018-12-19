import React from 'react';
import PropTypes from 'prop-types';

const CountPlayer = ({ totalUsers }) => {
  const htmlClassName = 'CountPlayer';
  if (!totalUsers) return null;
  return (
    <div className={htmlClassName}>
      <span className="Icon fal fa-user" />
      <span className="NumberOfPlayer">{totalUsers}</span>
    </div>
  );
};

CountPlayer.propTypes = {
  totalUsers: PropTypes.number
};

CountPlayer.defaultProps = {
  totalUsers: undefined
};

export default CountPlayer;
