import React from 'react';
import PropTypes from 'prop-types';
import Countdown from '@/components/Countdown/Countdown';

const TimeLeft = ({ date, onComplete }) => {
  const htmlClassName = 'TimeLeft';
  return (
    <div className={htmlClassName}>
      <span className="Icon fal fa-clock" />
      <Countdown endTime={date} onComplete={onComplete} />
    </div>
  );
};

TimeLeft.propTypes = {
  date: PropTypes.number,
  onComplete: PropTypes.func
};

TimeLeft.defaultProps = {
  date: undefined,
  onComplete: undefined
};

export default TimeLeft;
