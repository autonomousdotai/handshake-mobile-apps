import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
import _ from 'lodash';
import 'react-rangeslider/lib/index.css';

class RangeSlider extends Component {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    options: {},
    onChange: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      volume: 1,
    };
  }

  handleOnChange = (value) => {
    if (this.props.disabled) return null;
    this.setState({ volume: value });
    this.props.onChange(value);
  };

  renderComponent = (props, state) => {
    const { volume } = state;
    const htmlClassName = classNames('RangeSlider', {
      disabled: props.disabled,
    });
    const optionSlider = {
      ...props.options,
      value: props.input.value !== '' ? _.toNumber(props.input.value) : _.toNumber(volume),
      onChange: this.handleOnChange,
    };
    const inputProps = props.input.value !== '' ? props.input : { ...props.input, value: volume };
    const unit = (props.unit && <span className="unit">{props.unit}</span>);
    return (
      <div className={htmlClassName}>
        <input
          {...inputProps}
          type={props.type}
          className={props.className}
          disabled={props.disabled}
          readOnly
          autoComplete="off"
        />{unit}
        <span className="rangeLimit minValue">{props.options.min}{props.unit}</span>
        <span className="rangeLimit maxValue">{props.options.max}{props.unit}</span>
        <Slider {...optionSlider} />
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default RangeSlider;
