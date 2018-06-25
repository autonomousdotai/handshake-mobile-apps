import 'rc-time-picker/assets/index.css';

import React from 'react';

import moment from 'moment';

import TimePicker from 'rc-time-picker';

const format = 'h:mm a';

const now = moment().hour(0).minute(0);

class TimePickerComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  onChange=(value) => {
    console.log(value);
  }
  render() {
    return (<TimePicker
      showSecond={false}
      defaultValue={now}
      className="timepicker"
      onChange={this.onChange}
      format={format}
      use12Hours
      disabled={this.props.disabled}
      inputReadOnly
    />
    );
  }
}

export default TimePickerComponent;
