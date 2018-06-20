import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

// style
import './DatePicker.scss';
import DetailBettingEvent from '@/components/handshakes/betting-event/Detail/Detail';

const moment = require('moment');

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

  render() {
    const { className, onChange, ...props } = this.props;
    return (<Datetime
      onChange={this.onChangeDate}
      {...props}
      inputProps={{
      placeholder: this.props.placeholder, className: this.props.className, required: this.props.required, readOnly: true,
      }}
    />);
  }
}

export default DatePicker;
