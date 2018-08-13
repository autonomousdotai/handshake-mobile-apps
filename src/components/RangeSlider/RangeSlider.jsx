import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slider from 'react-rangeslider';
import _ from 'lodash';
import 'react-rangeslider/lib/index.css';

class RangeSlider extends Component {
  static propTypes = {
    type: PropTypes.string,
    unit: PropTypes.string,
    input: PropTypes.object,
    options: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    type: 'number',
    unit: '',
    input: {},
    options: {},
    onChange: undefined,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.state = {
      volume: 1,
    };
  }

  handleOnChange = (value) => {
    this.setState({ volume: value });
  }

  handleOnChangeComplete = (value) => {
    this.props.onChange(value);
  }

  renderComponent = (props, state) => {
    const { volume } = state;
    const { input, options, type } = props;
    const htmlClassName = classNames('RangeSlider', {
      disabled: props.disabled,
    });
    const optionSlider = {
      ...options,
      value: input.value !== '' ? _.toNumber(input.value) : _.toNumber(volume),
      onChange: this.handleOnChange,
      onChangeComplete: this.handleOnChangeComplete,
    };
    const inputProps = input.value !== '' ? input : { ...input, value: volume };
    const unit = (props.unit && <span className="unit">{props.unit}</span>);
    return (
      <div className={htmlClassName}>
        <input
          {...inputProps}
          type={type}
          className={props.className}
          disabled={props.disabled}
          readOnly
          autoComplete="off"
          ref={this.inputRef}
        />{unit}
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
