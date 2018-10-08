import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const MAX_TIME = 30 * 60; // in seconds

class ClockCount extends PureComponent {
  constructor() {
    super();
    this.state = {
      time: '',
      expired: false,
    };

    this.timer = null;

    this.count = :: this.count;
    this.clearTimer = :: this.clearTimer;
  }

  componentDidMount() {
    // start timer
    this.count();
    this.timer = setInterval(this.count, 1000);
  }

  componentWillUnmount() {
    // clear timer
    this.clearTimer();
  }

  clearTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  padIt(number = 0) {
    return number < 10 ? `0${number}` : number;
  }

  count() {
    const { startAt } = this.props;
    const now = moment();
    const diffTime = now.diff(moment(startAt), 'second');
    const remainSecond = MAX_TIME - diffTime || 0;

    if (remainSecond > 0) {
      const min = Math.floor(remainSecond / 60);
      const second = remainSecond % 60;
      const time = `${this.padIt(min)}:${this.padIt(second)}`;
      this.setState({ time });
    } else {
      this.setState({ expired: true });
      this.clearTimer();
      this.props.onExpired();
    }
  }

  render() {
    const { expired, time } = this.state;
    const { expiredText } = this.props;
    if (expired) {
      return (
        <span className="time">{expiredText}</span>
      );
    }
    return (
      <span className="time">{time}</span>
    );
  }
}

ClockCount.propTypes = {
  startAt: PropTypes.string.isRequired,
  expiredText: PropTypes.string.isRequired,
  onExpired: PropTypes.func.isRequired,
};

export default ClockCount;
