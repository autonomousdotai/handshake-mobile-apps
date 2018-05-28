import React from 'react';
import PropTypes from 'prop-types';
// style
import './Label.scss';

class Label extends React.PureComponent {

  typeClass(type) {
    switch (type) {
      case 'primary': return 'primary';
      case 'secondary': return 'secondary';
      case 'success': return 'success';
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'primary';
    }
  }

  render() {
    const { type, onClick, className, text } = this.props;
    let typeClass = this.typeClass(type);

    return (
      <span className={`label ${typeClass} ${className || ''}`} onClick={onClick || null}>
        {text}
      </span>
    );
  }
}

Label.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func
};

export default Label;
