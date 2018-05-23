import React from "react";
import PropTypes from "prop-types";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import ScrollToTop from "@/components/App/ScrollToTop";
import DynamicImport from "@/components/App/DynamicImport";
import Loading from "@/pages/Loading";
import { URL } from "@/config";

import Layout from "@/components/Layout/Main";

import { addLocaleData, IntlProvider } from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";

import messages from "@/locals";

addLocaleData([...en, ...fr]);

const Me = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Me')}>{Component => <Component {...props} />}</DynamicImport>);
const Discover = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Discover')}>{Component => <Component {...props} />}</DynamicImport>);
const Chat = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Chat')}>{Component => <Component {...props} />}</DynamicImport>);
const Wallet = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Wallet')}>{Component => <Component {...props} />}</DynamicImport>);
const Create = props => (<DynamicImport loading={Loading} load={() => import('@/components/Router/Create')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

class Router extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currentLocale: "en" };
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.currentLocale}
        messages={messages[this.state.currentLocale]}
      >
        <BrowserRouter>
          <Layout {...this.props}>
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
                <Route component={Page404} />
              </Switch>
            </ScrollToTop>
          </Layout>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default Router;
