import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Counter extends Component {
  static propTypes = {
    maxLimit: PropTypes.number,
    minLimit: PropTypes.number,
  }

  static defaultProps = {
    maxLimit: 99,
    minLimit: 1,
  }

  state = {
    counter: 1,
  }

  onIncrement = (props, state) => {
    const { disabled, maxLimit } = props;
    if (!disabled) {
      const nextCounter = state.counter + 1;
      if (nextCounter <= parseInt(maxLimit, 10)) {
        this.setState({ counter: nextCounter });
      }
    }
  }

  onDecrement = (props, state) => {
    const { disabled, minLimit } = props;
    if (!disabled) {
      const nextCounter = state.counter - 1;
      if (nextCounter >= parseInt(minLimit, 10)) {
        this.setState({ counter: nextCounter });
      }
    }
  }

  render() {
    const { props, state } = this;
    const htmlClassName = classNames('counter', {
      disabled: props.disabled,
    });
    return (
      <div className={htmlClassName}>
        <span onClick={() => this.onDecrement(props, state)}>-</span>
        <input {...props.input} type={props.type} value={state.counter} readOnly />
        <span onClick={() => this.onIncrement(props, state)}>+</span>
      </div>
    );
  }
}

export default Counter;
