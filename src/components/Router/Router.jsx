import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/config';
import { APP, FIREBASE_PATH } from '@/constants';

import local from '@/services/localStore';
import { signUp, fetchProfile } from '@/reducers/auth/action';

import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import { withFirebase } from 'react-redux-firebase';
import messages from '@/locals';

addLocaleData([...en, ...fr]);

const MeRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Me')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const DiscoverRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Discover')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const ChatRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Chat')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const WalletRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Wallet')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const CreateRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Create')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const ExchangeRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Exchange')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const TransactionRootRouter = props => (
  <DynamicImport
    loading={Loading}
    load={() => import('@/components/Router/Transaction')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);
const Page404 = props => (
  <DynamicImport
    isNotFound
    loading={Loading}
    load={() => import('@/pages/Error/Page404')}
  >
    {Component => <Component {...props} />}
  </DynamicImport>
);

class Router extends React.Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    firebase: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.isLogged !== prevState.isLogged) {
      return { isLogged: nextProps.auth.isLogged };
    }
    if (nextProps.auth.profileUpdatedAt !== prevState.profileUpdatedAt) {
      nextProps.firebase.unWatchEvent('value', `${FIREBASE_PATH.USERS}/${String(prevState.profile.id)}`);
      nextProps.firebase.watchEvent('value', `${FIREBASE_PATH.USERS}/${String(nextProps.auth.profile.id)}`);
      return { profile: nextProps.auth.profile, profileUpdatedAt: nextProps.auth.profileUpdatedAt };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      currentLocale: 'en',
      isLogged: this.props.auth.isLogged,
      profile: this.props.auth.profile,
      profileUpdatedAt: this.props.auth.profileUpdatedAt,
    };

    const token = local.get(APP.AUTH_TOKEN);

    // AUTH
    if (!token) {
      this.props.signUp({
        PATH_URL: 'user/sign-up',
        METHOD: 'POST',
        successFn: () => {
          this.props.fetchProfile({ PATH_URL: 'user/profile' });
        },
      });
    } else {
      this.props.fetchProfile({ PATH_URL: 'user/profile' });
    }
  }

  componentWillUnmount() {
    this.props.firebase.unWatchEvent('value', `${FIREBASE_PATH.USERS}/${String(this.state.profile.id)}`);
  }

  render() {
    if (!this.state.isLogged) {
      return (
        <BrowserRouter>
          <Route
            path={URL.INDEX}
            render={props => (
              <Layout {...props}>
                <Loading />
              </Layout>
            )}
          />
        </BrowserRouter>
      );
    }
    return (
      <IntlProvider
        locale={this.state.currentLocale}
        messages={messages[this.state.currentLocale]}
      >
        <BrowserRouter>
          <Route
            path={URL.INDEX}
            render={props => (
              <Layout {...props}>
                <ScrollToTop>
                  <Switch>
                    <Route
                      exact
                      path={URL.INDEX}
                      render={() => (
                        <Redirect to={{ pathname: URL.HANDSHAKE_DISCOVER }} />
                      )}
                    />
                    <Route path={URL.HANDSHAKE_ME} component={MeRootRouter} />
                    <Route
                      path={URL.HANDSHAKE_DISCOVER}
                      component={DiscoverRootRouter}
                    />
                    <Route
                      path={URL.HANDSHAKE_CHAT}
                      component={ChatRootRouter}
                    />
                    <Route
                      path={URL.HANDSHAKE_WALLET}
                      component={WalletRootRouter}
                    />
                    <Route
                      path={URL.HANDSHAKE_CREATE}
                      component={CreateRootRouter}
                    />
                    <Route
                      path={URL.HANDSHAKE_EXCHANGE}
                      component={ExchangeRootRouter}
                    />
                    <Route
                      path={URL.TRANSACTION_LIST}
                      component={TransactionRootRouter}
                    />
                    <Route component={Page404} />
                  </Switch>
                </ScrollToTop>
              </Layout>
            )}
          />
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default compose(
  withFirebase,
  connect(state => ({ auth: state.auth, app: state.app }), {
    signUp,
    fetchProfile,
  }),
)(Router);
