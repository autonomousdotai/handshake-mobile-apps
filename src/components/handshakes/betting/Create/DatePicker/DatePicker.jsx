import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

// style
import './DatePicker.scss';

class DatePicker extends React.PureComponent {

  render() {
    const { className, ...props } = this.props;
    return (<Datetime {...props} />);
  }
}

export default DatePicker;
