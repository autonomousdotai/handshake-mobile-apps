import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
// constants
import { URL } from '@/constants';
// services
import { createDynamicImport } from '@/services/app';
// components
import Loading from '@/components/core/presentation/Loading';
import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

// import NetworkError from '@/components/Router/NetworkError';
import Maintain from '@/components/Router/Maintain';

const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterDiscover = createDynamicImport(() => import('@/components/Router/Discover'), Loading);
const RouterChat = createDynamicImport(() => import('@/components/Router/Chat'), Loading);
const RouterCreate = createDynamicImport(() => import('@/components/Router/Create'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterExchange = createDynamicImport(() => import('@/components/Router/Exchange'), Loading);
const RouterTransaction = createDynamicImport(() => import('@/components/Router/Transaction'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);
const RouterAdmin = createDynamicImport(() => import('@/components/Router/Admin'), Loading);

const rootRouterMap = [
  { path: URL.HANDSHAKE_ME, component: RouterMe },
  { path: URL.HANDSHAKE_DISCOVER, component: RouterDiscover },
  { path: URL.HANDSHAKE_CHAT, component: RouterChat },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet },
  { path: URL.HANDSHAKE_CREATE, component: RouterCreate },
  { path: URL.HANDSHAKE_EXCHANGE, component: RouterExchange },
  { path: URL.TRANSACTION_LIST, component: RouterTransaction },
  { path: URL.COMMENTS_BY_SHAKE, component: RouterComment },
  { path: URL.ADMIN, component: RouterAdmin },
];

const Page404 = createDynamicImport(() => import('@/pages/Error/Page404'), Loading, true);

class Router extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);

    const initFirebaseApp = this.props.firebaseApp;
    if (!initFirebaseApp.config) initFirebaseApp.config = {};

    this.state = {
      firebaseApp: initFirebaseApp,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebaseApp.config) {
      if (nextProps.firebaseApp.config.isMaintain !== prevState.firebaseApp.config.isMaintain) {
        return { firebaseApp: nextProps.firebaseApp };
      }
      if (nextProps.firebaseApp.config.version !== prevState.firebaseApp.config.version) {
        window.location.reload();
      }
    }
    return null;
  }

  routers() {
    return rootRouterMap.map(router => (
      <Route
        key={Date.now()}
        path={router.path}
        component={router.component}
      />
    ));
  }

  render() {
    return (
      <BrowserRouter>
        <Route
          path={URL.INDEX}
          render={props =>
            (
              <Layout {...props}>
                {
                  this.state.firebaseApp.config.isMaintain
                  ? <Maintain />
                  : (
                    <ScrollToTop>
                      <Switch>
                        <Route
                          exact
                          path={URL.INDEX}
                          render={() => (
                            <Redirect to={{ pathname: URL.HANDSHAKE_DISCOVER }} />
                          )}
                        />
                        {this.routers()}
                        <Route component={Page404} />
                      </Switch>
                    </ScrollToTop>
                  )
                }
              </Layout>
            )
          }
        />
      </BrowserRouter>
    );
  }
}

export default connect(state => ({ firebaseApp: state.firebase.data }))(Router);
