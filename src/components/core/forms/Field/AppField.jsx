import React from 'react';
import PropTypes from 'prop-types';

class AppField extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
  }
  render() {
    return (
      <div className="field">{this.props.children}</div>
    );
  }
}

export default AppField;
