import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import zh from 'react-intl/locale-data/zh';
import de from 'react-intl/locale-data/de';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import ru from 'react-intl/locale-data/ru';
import es from 'react-intl/locale-data/es';
import messages from '@/locals';

addLocaleData([...en, ...fr, ...zh, ...de, ...ja, ...ko, ...ru, ...es]);

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      locale: this.props.app.locale,
      messages: messages[this.props.app.locale],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('i18n - nextProps.app.locale', nextProps.app.locale);
    if (nextProps.app.locale !== prevState.locale) {
      return { locale: nextProps.app.locale, messages: messages[nextProps.app.locale] };
    }
    return null;
  }

  render() {
    console.log('i18n - this.state.locale', this.state.locale);
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} key={this.state.locale}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

export default connect(state => ({ app: state.app }))(Root);

