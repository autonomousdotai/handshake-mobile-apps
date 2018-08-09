import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';
import DatePicker from 'rmc-date-picker';
import PopPicker from 'rmc-date-picker/lib/Popup';

import './DateTimePicker.scss';

const outputTypeConst = ['unix', 'date'];

class DateTimePicker extends Component {
  static displayName = 'DateTimePicker';
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    mode: PropTypes.oneOf(['datetime', 'date', 'time', 'year', 'month']),
    outputType: PropTypes.oneOf(outputTypeConst),
    onChange: PropTypes.func,
    onDateChange: PropTypes.func,
    popupTriggerRenderer: PropTypes.func,
    use12Hours: PropTypes.bool,
    shortName: PropTypes.bool,
    minuteStep: PropTypes.number,
    value: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
    startDate: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    endDate: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    defaultDate: PropTypes.PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  };

  static defaultProps = {
    className: '',
    placeholder: 'Choose date',
    mode: 'datetime',
    outputType: 'unix',
    title: 'DateTime Picker',
    use12Hours: false,
    minuteStep: 1,
    shortName: true,
    value: null,
    startDate: null,
    endDate: null,
    defaultDate: new Date(),
    onChange: undefined,
    onDateChange: undefined,
    popupTriggerRenderer: undefined,
  };

  onDismiss = (props) => {
    props.onDismiss && props.onDismiss();
  };

  onOpenPopPicker = (props) => {
    props.onOpenPopPicker && props.onOpenPopPicker();
  };

  onOK = (value, props) => {
    const formattedValue = this.formatOutput(value, props.outputType);
    props.onChange && props.onChange(formattedValue);
    props.onDateChange && props.onDateChange(formattedValue);
  }

  formatMonth = (month, props) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return props.shortName ? monthNames[month].substr(0, 3) : monthNames[month];
  };

  ordinal = (n) => ['st','nd','rd'][((n+90)%100-10)%10-1]||'th'; // eslint-disable-line

  formatDay = (day) => {
    return <span>{`${day} `}<span className="Ordinal">{this.ordinal(day)}</span></span>;
  }

  unixToLocal = (value) => {
    return (Number.isInteger(value)) ? new Date(value * 1000) : value;
  };

  localToUnix = (value) => {
    return parseInt((new Date(value).getTime() / 1000).toFixed(0), 10);
  };

  formatOutput = (value, outputType) => {
    if (!value) return value;
    return (outputType === outputTypeConst[0]) ? this.localToUnix(value) : value;
  };

  renderDateTimePicker = (props) => {
    return (
      <DatePicker
        rootNativeProps={{ 'data-xx': 'yy' }}
        minDate={this.unixToLocal(props.startDate)}
        maxDate={this.unixToLocal(props.endDate)}
        defaultDate={this.unixToLocal(props.defaultDate)}
        mode={props.mode}
        use12Hours={props.use12Hours}
        minuteStep={props.minuteStep}
        formatMonth={(value) => this.formatMonth(value, props)}
        formatDay={this.formatDay}
        // onDateChange={(value) => this.onDateChange(value, props)}
      />
    );
  };

  renderPopupTrigger = (props) => {
    return props.popupTriggerRenderer ? props.popupTriggerRenderer(props) : (
      <div className="rmc-picker-date-time">
        <input
          {...props.inputProps}
          onBlur={this.onOpenPopPicker(props)}
          placeholder={props.placeholder}
          value={this.unixToLocal(props.value)}
        />
      </div>
    );
  }

  renderComponent = (props) => {
    const cls = classNames(DateTimePicker.displayName, {
      [props.className]: !!props.className,
    });
    const visible = (props.inputProps || {}).disabled ? { visible: false } : {};
    return (
      <PopPicker
        datePicker={this.renderDateTimePicker(props)}
        transitionName="rmc-picker-popup-slide-fade"
        maskTransitionName="rmc-picker-popup-fade"
        title={props.title}
        date={this.unixToLocal(props.value)}
        onDismiss={() => this.onDismiss(props)}
        className={cls}
        onChange={(value) => this.onOK(value, props)}
        {...visible}
      >
        {this.renderPopupTrigger(props)}
      </PopPicker>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default DateTimePicker;
