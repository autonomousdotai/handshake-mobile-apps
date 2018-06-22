import React from 'react';
import PropTypes from 'prop-types';

class ErrorBox extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
  }
  static defaultProps = {
    children: '',
  }
  render() {
    return (
      <div className="text-danger">
        { this.props.children }
      </div>
    );
  }
}

export default ErrorBox;
