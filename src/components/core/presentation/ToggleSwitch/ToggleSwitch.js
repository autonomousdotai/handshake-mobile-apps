import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// style
import './ToggleSwitch.scss';

class ToggleSwitch extends PureComponent {
  render() {
    const { className, defaultChecked, onChange } = this.props;
    return (
      <label className={`toggles-witch ${className}`}>
        <input type="checkbox" onChange={e => onChange(e.target.checked)} defaultChecked={defaultChecked} />
        <span className="slider round" />
      </label>
    );
  }
}

ToggleSwitch.propTypes = {
  className: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
};

ToggleSwitch.defaultProps = {
  className: '',
  defaultChecked: false,
  onChange: () => {},
};

export default ToggleSwitch;
