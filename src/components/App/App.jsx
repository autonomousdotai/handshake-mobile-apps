import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { initApp } from '@/reducers/app/action';
import Router from '@/components/Router/Router';
import I18n from '@/components/App/I18n';

import '@/styles/main';
import '@/styles/custom-icons/styles.css';

class App extends React.Component {
  static propTypes = {
    initApp: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.initApp();
  }

  render() {
    return (
      <I18n>
        <div className="root">
          <Router />
        </div>
      </I18n>
    );
  }
}

export default connect((state) => {
  return {
    router: state.router
  };
}, { initApp })(App);
