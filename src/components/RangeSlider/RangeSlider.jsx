import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class RangeSlider extends Component {
  static propTypes = {
    unit: PropTypes.string,
    input: PropTypes.object,
    options: PropTypes.object,
  }

  static defaultProps = {
    unit: '',
    input: {},
    options: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      volume: 1,
    };
  }

  handleOnChange = (value) => {
    this.setState({ volume: value });
  }

  renderComponent = (props, state) => {
    const { volume } = state;
    const { input, options } = props;
    const htmlClassName = classNames('RangeSlider', {
      disabled: props.disabled,
    });
    const optionSlider = {
      ...options,
      value: input.value !== '' ? input.value : volume,
      onChange: this.handleOnChange,
    };
    const inputProps = input.value !== '' ? input : { ...input, value: volume };
    const unit = (props.unit && <span className="unit">{props.unit}</span>);
    return (
      <div className={htmlClassName}>
        <input {...inputProps} className={props.className} disabled={props.disabled} />{unit}
        <span className="rangeLimit minValue">{options.min}{props.unit}</span>
        <span className="rangeLimit maxValue">{options.max}{props.unit}</span>
        <Slider {...optionSlider} />
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default RangeSlider;
