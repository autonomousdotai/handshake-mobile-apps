import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class RangeSlider extends Component {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    options: {},
    onChange: undefined
  };

  constructor(props) {
    super(props);
    this.state = {
      volume: 0
    };
  }

  /* eslint consistent-return:0 */
  handleOnChange = value => {
    if (this.props.disabled) return null;
    this.setState({ volume: value });
    this.props.form.setFieldValue(this.props.name, value);
  };

  renderComponent = (props, state) => {
    const { volume } = state;
    const htmlClassName = classNames('RangeSliderContainer', {
      disabled: props.disabled
    });
    const optionSlider = {
      ...props.options,
      value: parseInt(props.value || 0, 10),
      onChange: this.handleOnChange
    };
    const unit = optionSlider.unit && <span className="unit">{optionSlider.unit}</span>;
    return (
      <div className={htmlClassName}>
        <div className="RangeValue">
          <input
            value={volume}
            type="number"
            className={props.className}
            disabled={props.disabled}
            readOnly
            autoComplete="off"
          />
          {unit}
        </div>
        <div className="RangeSlider">
          <span className="rangeLimit minValue">
            {props.options.min}
            {props.unit}
          </span>
          <Slider {...optionSlider} />
          <span className="rangeLimit maxValue">
            {props.options.max}
            {props.unit}
          </span>
        </div>
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default RangeSlider;
