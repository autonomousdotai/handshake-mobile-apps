import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
    type: PropTypes.string,
    onRef: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object,
    checkError: PropTypes.bool,
  }

  render() {
    const { type, name, meta, placeholder, onRef, className, checkError, ...props } = this.props;

    let inRef = onRef || ((div) => this.inputRef = div);

    let errorClass = '';
    if (checkError && meta.error) {
      errorClass = 'input-error';
    }
    
    return (
      <input
        {...props}
        className={`form-control ${errorClass} ${className || ''}`}
        type={type || 'text'}
        name={name}
        ref={inRef}
        placeholder={placeholder || ''}
      />
    );
  }
}

export default Input;
