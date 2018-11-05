import React from 'react';
import PropTypes from 'prop-types';

class Redirect extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { url } = this.props;
    window.location.assign(url);
  }

  render() {
    return <div />;
  }
}

export default Redirect;
