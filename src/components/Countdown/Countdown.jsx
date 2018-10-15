import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export default class Countdown extends Component {
  static displayName = 'Countdown';
  static propTypes = {
    classNames: PropTypes.string,
    endTime: PropTypes.number.isRequired, // milliseconds
    renderer: PropTypes.func,
    separator: PropTypes.string,
    format: PropTypes.string,
    onComplete: PropTypes.func,
    timeLeftToWarning: PropTypes.number,
    onWarning: PropTypes.func,
    hideHours: PropTypes.bool
  };

  static defaultProps = {
    classNames: null,
    separator: ':',
    onComplete: undefined,
    format: null,
    hideHours: false
  };

  constructor(props) {
    super(props);
    this.state = {
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      warning: null,
    };
    this.mounted = false;
  }

  componentDidMount() {
    const { timeLeftToWarning } = this.props;
    this.mounted = true;

    if(timeLeftToWarning){
      let warning = this.convertToSeconds(timeLeftToWarning);
      this.setState({ warning });
    }

    this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props);
      if (date && this.mounted) {
        this.setState(date);
      } else {
        this.stop();
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.stop();
  }

  convertToSeconds = (date) => {
    let result = 0;

    if (date.toString().length === 10){
      result = date * 1000;
    }
    else{
      result = date;
    }

    result = parseInt((Math.max(0, result - Date.now()) / 1000).toFixed(0), 10);
    return result;
  }

  stop = () => {
    this.mounted = false;
    clearInterval(this.interval);
    delete this.interval;
  }

  addLeadingZeros = (value, size = 2) => {
    let s = String(value);
    while (s.length < size) { s = `0${s}`; }
    return s;
  }

  calculateCountdown = ({ endTime, onComplete, timeLeftToWarning, onWarning }) => {
    const seconds = this.convertToSeconds(endTime);

    const { warning } = this.state;

    if(warning && onWarning && warning == seconds){
      onWarning();
    }
    else if (seconds <= 0) {
      this.stop();
      if (onComplete) {
        onComplete();
      }
    }

    return {
      days: Number(this.addLeadingZeros(Math.floor(seconds / (3600 * 24)))),
      hours: this.addLeadingZeros(Math.floor((seconds / 3600) % 24)),
      minutes: this.addLeadingZeros(Math.floor((seconds / 60) % 60)),
      seconds: this.addLeadingZeros(Math.floor(seconds % 60)),
      // milliseconds: Number(((seconds % 1) * 1000).toFixed()),
      completed: seconds === 0,
    };
  };

  renderDays = (days) => {
    if (days <= 0) return null;
    const pl = (days > 1) ? 'days' : 'day';
    return (<span className="CountdownItem Days">{`${days} ${pl}`}</span>);
  }

  renderHours = (hours) => {
    return (<span className="CountdownItem Hours">{hours}</span>);
  }

  renderMinutes = (minutes) => {
    return (<span className="CountdownItem Minutes">{minutes}</span>);
  }

  renderSeconds = (seconds) => {
    return (<span className="CountdownItem Seconds">{seconds}</span>);
  }

  renderSeparator = (separator) => {
    return (
      <span className="CountdownSeparator">{separator}</span>
    );
  }

  renderTime = (props, state) => {
    if (state.days > 0) return null;
    return (
      <div className="CountdownTime">
        {/* {
          !props.format || (props.format && props.format.indexOf("HH") >= 0) && this.renderHours(state.hours)
        } */}
        {!props.hideHours && state.hours && this.renderHours(state.hours)}
        {!props.hideHours && state.hours && state.minutes && this.renderSeparator(props.separator)}
        {this.renderMinutes(state.minutes)}
        {state.minutes && state.seconds && this.renderSeparator(props.separator)}
        {this.renderSeconds(state.seconds)}
      </div>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(Countdown.displayName, {
      [props.classNames]: !!props.classNames,
    });

    if (props.renderer) {
      return (
        <div className={cls}>
          {props.renderer({ ...props, ...state })}
        </div>
      );
    }

    return (
      <div className={cls}>
        {this.renderDays(state.days)}
        {this.renderTime(props, state)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
