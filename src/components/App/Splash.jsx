import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import Logo from '@/assets/images/logo.png';

class Splash extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.intl.messages.app.name,
      description: this.props.intl.messages.app.description,
      loading: this.props.intl.messages.app.loading,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.intl.messages.app.name !== prevState.name) {
      return { name: nextProps.intl.messages.app.name };
    }
    if (nextProps.intl.messages.app.description !== prevState.description) {
      return { description: nextProps.intl.messages.app.description };
    }
    if (nextProps.intl.messages.app.loading !== prevState.loading) {
      return { loading: nextProps.intl.messages.app.loading };
    }
    return null;
  }

  render() {
    return (
      <div className="splash">
        <div className="splash-content">
          <img src={Logo} alt="Ninja logo" />
          <p className="splash-loading-text">{this.state.loading}</p>
          <p className="splash-title">{this.state.name}: {this.state.description}</p>
        </div>
      </div>
    );
  }
}

export default injectIntl(Splash);
