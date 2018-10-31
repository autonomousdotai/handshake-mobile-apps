import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import debounce from '@/utils/debounce';

const MAX_TIME = 30 * 60; // in seconds

class ClockCount extends PureComponent {
  constructor() {
    super();
    this.state = {
      time: '',
      expired: false,
      startAtInternal: new Date(),
    };

    this.timer = null;

    this.count = :: this.count;
    this.clearTimer = :: this.clearTimer;
    this.onExpired = debounce(:: this.onExpired, 1200);
  }

  componentDidMount() {
    // start timer
    this.initTimer();
  }

  componentWillUnmount() {
    // clear timer
    this.clearTimer();
  }

  onExpired() {
    const { onExpired } = this.props;
    if (typeof onExpired === 'function') {
      onExpired();
    }
  }

  initTimer = () => {
    this.clearTimer();
    this.timer = setInterval(this.count, 1000);

    // start timer
    this.count();
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  padIt(number = 0) {
    return number < 10 ? `0${number}` : number;
  }

  count() {
    const { startAt, duration, internalClockdown, loop } = this.props;
    const { startAtInternal } = this.state;
    const startTime = internalClockdown ? startAtInternal : startAt;
    const now = moment();
    const diffTime = now.diff(moment(startTime), 'second');
    const remainSecond = duration - diffTime || 0;

    if (remainSecond >= 0) {
      const min = Math.floor(remainSecond / 60);
      const second = remainSecond % 60;
      const time = `${this.padIt(min)}:${this.padIt(second)}`;
      this.setState({ time });
    } else {
      this.onExpired();
      if (loop && internalClockdown) {
        // update start time of the timer for another cycle
        this.setState({ startAtInternal: new Date() }, this.initTimer);
      } else {
        // clear the timer, and finishing job
        this.setState({ expired: true });
        this.clearTimer();
      }
    }
  }

  render() {
    const { expired, time } = this.state;
    const { expiredText, className } = this.props;
    return (
      <span className={`time ${className}`}>{expired ? expiredText : time}</span>
    );
  }
}

ClockCount.defaultProps = {
  className: '',
  duration: MAX_TIME,
  startAt: new Date().toISOString(),
  expiredText: '',
  onExpired: null,
  loop: false,
  internalClockdown: false,
};

ClockCount.propTypes = {
  className: PropTypes.string,
  startAt: PropTypes.string,
  expiredText: PropTypes.string,
  onExpired: PropTypes.func,
  duration: PropTypes.number,
  loop: PropTypes.bool,
  internalClockdown: PropTypes.bool,
};

export default ClockCount;
