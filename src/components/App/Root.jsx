import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'querystring';
import { initApp } from '@/reducers/app/action';
import I18n from '@/components/App/I18n';
import Handle from '@/components/App/Handle';
// styles
import '@/styles/main';
import '@/styles/custom-icons/styles.css';

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    initApp: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { language, ref } = querystringParsed;
    this.props.initApp(language, ref);
  }

  render() {
    if (this.props.app.rootLoading) return null;
    return (
      <I18n>
        <div className="root">
          <Handle setLanguage={this.setLanguage} refer={this.refer} />
        </div>
      </I18n>
    );
  }
}

export default connect(state => ({
  app: state.app,
}), { initApp })(Root);
