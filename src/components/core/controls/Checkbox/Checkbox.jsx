import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ type = 'checkbox', name, checked = false, onChange, disabled = false, className='' }) => (
  <input className={className} type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} />
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Checkbox.defaultProps = {
  type: 'checkbox',
  checked: false,
  disabled: false,
  className: '',
};

export default Checkbox;
