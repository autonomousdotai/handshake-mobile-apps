import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';

const TimeLeft = ({ date, onCountdownComplete }) => {
  const htmlClassName = 'TimeLeft';
  return (
    <div className={htmlClassName}>
      <span className="Icon fal fa-clock" />
      <Countdown endTime={date} onComplete={onCountdownComplete} />
    </div>
  );
};

TimeLeft.propTypes = {
  date: PropTypes.number,
  onCountdownComplete: PropTypes.func
};

TimeLeft.defaultProps = {
  date: undefined,
  onCountdownComplete: undefined
};

export default TimeLeft;
