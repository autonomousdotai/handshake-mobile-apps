import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/components/core/presentation/Loading';
import { URL } from '@/config';


import local from '@/services/localStore';
import { APP } from '@/constants';
import { signUp } from '@/reducers/auth/action';

import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

import messages from '@/locals';

addLocaleData([...en, ...fr]);

const Me = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Me')}>{Component => <Component {...props} />}</DynamicImport>);
const Discover = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Discover')}>{Component => <Component {...props} />}</DynamicImport>); 
const Chat = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Chat')}>{Component => <Component {...props} />}</DynamicImport>);
const Wallet = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Wallet')}>{Component => <Component {...props} />}</DynamicImport>);
const Create = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Create')}>{Component => <Component {...props} />}</DynamicImport>);
const Exchange = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Exchange')}>{Component => <Component {...props} />}</DynamicImport>);
const Transaction = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Transaction')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

class Router extends React.Component {
  static propTypes = {
    signUp: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    this.state = { currentLocale: 'en' };

    const token = local.get(APP.TOKEN);

    if (!token) {
      this.props.signUp({ PATH_URL: 'user/sign-up', METHOD: 'POST' });
    }
  }

  render() {
    return (
      <IntlProvider locale={this.state.currentLocale} messages={messages[this.state.currentLocale]}>
        <BrowserRouter>
          <Route
            path={URL.INDEX}
            render={
              props => (
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
                      <Route path={URL.HANDSHAKE_ME} component={Me} />
                      <Route path={URL.HANDSHAKE_DISCOVER} component={Discover} />
                      <Route path={URL.HANDSHAKE_CHAT} component={Chat} />
                      <Route path={URL.HANDSHAKE_WALLET} component={Wallet} />
                      <Route path={URL.HANDSHAKE_CREATE} component={Create} />
                      <Route path={URL.HANDSHAKE_EXCHANGE} component={Exchange} />
                      <Route path={URL.TRANSACTION_LIST} component={Transaction} />
                      <Route component={Page404} />
                    </Switch>
                  </ScrollToTop>
                </Layout>
              )
            }
          />
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default connect(null, ({ signUp }))(Router);
