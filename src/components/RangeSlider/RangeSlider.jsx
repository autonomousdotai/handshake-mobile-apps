import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
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
      volume: 0,
    };
  }

  /* eslint consistent-return:0 */
  handleOnChange = (value) => {
    if (this.props.disabled) return null;
    this.setState({ volume: value });
    this.props.onChange(value);
  };

  renderComponent = (props, state) => {
    const { volume } = state;
    const htmlClassName = classNames('RangeSliderContainer', {
      disabled: props.disabled,
    });
    const optionSlider = {
      ...props.options,
      value: props.input.value !== '' ? parseInt(props.input.value, 10) : parseInt(volume, 10),
      onChange: this.handleOnChange,
    };
    const inputProps = props.input.value !== '' ? props.input : { ...props.input, value: volume };
    const unit = (props.unit && <span className="unit">{props.unit}</span>);
    return (
      <div className={htmlClassName}>
        <div className="RangeValue">
          <input
            {...inputProps}
            type="number"
            className={props.className}
            disabled={props.disabled}
            readOnly
            autoComplete="off"
          />{unit}
        </div>
        <div className="RangeSlider">
          <span className="rangeLimit minValue">{props.options.min}{props.unit}</span>
          <Slider {...optionSlider} />
          <span className="rangeLimit maxValue">{props.options.max}{props.unit}</span>
        </div>
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default RangeSlider;
