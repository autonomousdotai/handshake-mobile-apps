import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

// style
import './DatePicker.scss';
import DetailBettingEvent from '@/components/handshakes/betting-event/Detail/Detail';
import TimePickerComponent from './TimePicker';

const moment = require('moment');

const yesterday = Datetime.moment().subtract(1, 'day');

class DatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTime: moment().add(10, 'minutes').format('h:mm a'),
      selectedDateValue: '',
      finalDateTime: '',
    };
    this.onChangeDate = this.onChangeDate.bind(this);
  }


  onChangeDate(date) {
    this.selectedDate = date;
    this.setState({ selectedDateValue: date }, this.findFinalDateTime);
  }


  onChangeTime=(time) => {
    this.setState({
      selectedTime: time.format('h:mm a'),
    }, this.findFinalDateTime);
  }
  get value() {
    return this.selectedDate;
  }

  callOnChangeProps() {
    const { onChange } = this.props;
    onChange && onChange(this.state.finalDateTime);
  }

  findFinalDateTime() {
    if (this.state.selectedDateValue !== '') {
      this.setState({
        finalDateTime: moment(`${this.state.selectedDateValue.format('YYYY-MM-DD')} ${this.state.selectedTime}`, 'YYYY-MM-DD h:mm a').unix(),
      }, this.callOnChangeProps);
    }
  }
  selectedDate = moment();

  isDate = date => (!!((new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)))))


  // separate date validitiy based on type of form = reporting will have closing time and type will be reporting similarly dispute will have reporting time
  valid = (current) => {
    const fromDate = this.props.startDate ? moment(new Date(this.props.startDate * 1000)).subtract(1, 'days') : yesterday;
    switch (this.props.name) {
      case 'closingTime':
        return current.isAfter(yesterday);

      case 'reportingTime':
        return current.isAfter(fromDate);

      case 'disputeTime':
        return current.isAfter(fromDate);

      default:
        return current.isAfter(yesterday);
    }
  };


  render() {
    const { className, onChange, ...props } = this.props;
    return (
      <div className="date-time-block">
        <Datetime
          onChange={this.onChangeDate}
          {...props}
          isValidDate={this.valid}
          style
          closeOnSelect
          timeFormat={false}
          viewDate={this.props.startDate ? `${new Date(this.props.startDate * 1000)}` : new Date()}
          inputProps={{
            placeholder: this.props.placeholder,
            className: this.props.className,
            required: this.props.required,
            readOnly: true, disabled:
            this.props.disabled,
          }}
        />
        <TimePickerComponent
          disabled={this.props.disabled}
          onChangeTime={this.onChangeTime}
          value={props.value}
          inputProps={{
            placeholder: this.props.timePlaceholder,
            required: this.props.required,
          }}
        />
      </div>);
  }
}

export default DatePicker;
