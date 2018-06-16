import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import moment from 'moment';

// style
import './DatePicker.scss';

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

  onChangeDate(date) {
    // this.setState({ selectedDate: date });
    this.selectedDate = date;
    console.log('Date:', this.selectedDate);
    const { onChange } = this.props;
    const unixDate = date.unix();
    onChange && onChange(unixDate);
  }

  render() {
    const { className, onChange, ...props } = this.props;
    return (<Datetime onChange={this.onChangeDate} {...props} inputProps={{ placeholder: this.props.placeholder, className: this.props.className }} />);
  }
}

export default DatePicker;
