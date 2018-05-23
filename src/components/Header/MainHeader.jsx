import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class MainHeader extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
  }

  render() {
    return (
      <header className="header">
        <div className="title">{this.props.app.headerTitle}</div>
      </header>
    );
  }
}

export default connect(state => ({ app: state.app }))(MainHeader);
