import 'rc-time-picker/assets/index.css';

import React from 'react';

import moment from 'moment';

import TimePicker from 'rc-time-picker';

const format = 'h:mm a';

const now = moment().hour(0).minute(0);

class TimePickerComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: moment(),
      open: false,
    };
  }
  onTimeChange = (newValue) => {
    // `value` & `this.state.value` are both moment objects so we can use moment's `diff()` method
    const timeDifference = Math.abs(newValue.diff(this.state.value));
    if (timeDifference < moment.duration(1, 'hour') &&
        timeDifference >= moment.duration(1, 'minute')) {
      this.setOpen({ open: false }); // close the dropdown
    }

    this.setState({ value: newValue }); // update new (date) value
    this.props.onChangeTime(newValue);
  }

  setOpen = ({ open }) => {
    this.setState({ open });
  }

  render() {
    return (<TimePicker
      showSecond={false}
      defaultValue={now}
      className="timepicker"
      format={format}
      use12Hours
      disabled={this.props.disabled}
      inputReadOnly
      open={this.state.open}
      onOpen={this.setOpen}
      onClose={this.setOpen}
      onChange={this.onTimeChange}
      value={this.state.value}
    />
    );
  }
}

export default TimePickerComponent;
