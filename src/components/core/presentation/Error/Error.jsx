import React from 'react';
import PropTypes from 'prop-types';
// style
import './Error.scss';

class ErrorBox extends React.PureComponent {

  render() {
    const { message, className, isShow, ...props } = this.props;
    return (
      <span className={`error ${className || ''}`} {...props}>
        {isShow ? message : ''}
      </span>
    );
  }
}

ErrorBox.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  isShow: PropTypes.bool.isRequired,
};

ErrorBox.defaultProps = {
  isShow: true
};

export default ErrorBox;
