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
    // this.state = {
    //   selectedDate: moment(),
    // };
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  selectedDate = moment();

  get value() {
    return this.selectedDate;
  }

  isDate = date => (!!((new Date(date) !== 'Invalid Date' && !isNaN(new Date(date)))))

  onChangeDate(date) {
    // this.setState({ selectedDate: date });
    this.selectedDate = date;
    console.log('Date:', this.selectedDate);
    const { onChange } = this.props;
    console.log('test');
    const unixDate = this.isDate(date) ? date.unix() : date;
    if (this.isDate(date)) {
      onChange && onChange(unixDate);
    } else {}
  }
  // separate date validitiy based on type of form = reporting will have closing time and type will be reporting similarly dispute will have reporting time
  valid = (current) => {
    switch (this.props.name) {
      case 'closingTime':
        return current.isAfter(yesterday);

      case 'reportingTime':
        return current.isAfter(moment.unix(this.props.startDate));

      case 'disputeTime':
        return current.isAfter(moment.unix(this.props.startDate));

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
placeholder: this.props.placeholder, className: this.props.className, required: this.props.required, readOnly: true, disabled: this.props.disabled,
}}
        />
        <TimePickerComponent disabled={this.props.disabled} />
      </div>);
  }
}

export default DatePicker;
