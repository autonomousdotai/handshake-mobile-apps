import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
// constants
import { URL } from '@/constants';
// services
import BrowserDetect from '@/services/browser-detect';
import { createDynamicImport } from '@/services/app';
// components
import Loading from '@/components/core/presentation/Loading';
import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';

import { SEOPrediction, SEOWallet } from '@/components/SEO';

import PexExtension from '@/pages/PexExtension/PexExtension';
import TopUp from '@/pages/TopUp/TopUp';

const TypeFormFeedBack = createDynamicImport(() => import('@/pages/TypeFormFeedBack'), Loading);
const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);
const RouterAdmin = createDynamicImport(() => import('@/components/Router/Admin'), Loading);
const RouterAdminIDVerification = createDynamicImport(() => import('@/components/Router/AdminIDVerification'), Loading);
const RouterReport = createDynamicImport(() => import('@/components/Router/Report'), Loading);
const RouterLuckyPool = createDynamicImport(() => import('@/pages/LuckyLanding/LuckyLanding'), Loading);
const RouterPrediction = createDynamicImport(() => import('@/pages/Prediction/Prediction'), Loading);
const RouterReputation = createDynamicImport(() => import('@/guru/pages/Reputation/Reputation'), Loading);
const RouterWalletCoin = createDynamicImport(() => import('@/guru/pages/WalletCoin/WalletCoin'), Loading);
const RouterAuthCallback = createDynamicImport(() => import('@/guru/pages/WalletCoin/AuthCallback'), Loading);

// Guru's Routes
const RouterGuru = createDynamicImport(() => import('@/guru/pages/Home/Home'), Loading);
const GuruCreateEvent = createDynamicImport(() => import('@/guru/pages/CreateEvent/CreateEvent'), Loading);
const GuruPlaceBet = createDynamicImport(() => import('@/guru/pages/PlaceBet'), Loading);
const Extension = createDynamicImport(() => import('@/guru/pages/Extension'), Loading);

const RouterResolve = createDynamicImport(() => import('@/pages/Resolve/Resolve'), Loading);
const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Loading);
const ContentForWallet = createDynamicImport(() => import('@/pages/LandingPage/ContentForWallet'), Loading);
const ContentForPrediction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPrediction'), Loading);
const ContentForPexInstruction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPexInstruction'), Loading);

/* ======================== FOR MOBILE ======================== */
const configRoutesUsingMobileLayout = [
  // Guru
  { path: URL.GURU_CREATE_EVENT, component: GuruCreateEvent },
  { path: URL.GURU_PLACE_BET, component: GuruPlaceBet },
  { path: URL.HANDSHAKE_GURU, component: RouterGuru },
  { path: URL.HANDSHAKE_REPUTATION, component: RouterReputation },
  { path: URL.HANDSHAKE_COINBASE_WALLET, component: RouterWalletCoin },
  { path: URL.HANDSHAKE_COINBASE_AUTH, component: RouterAuthCallback },
  { path: URL.HANDSHAKE_PREDICTION, component: RouterPrediction },
  { path: URL.PEX_INSTRUCTION_URL, component: ContentForPexInstruction },
  { path: URL.HANDSHAKE_ME, component: RouterMe },
  { path: URL.HANDSHAKE_PEX, render: () => <Redirect to={{ pathname: URL.HANDSHAKE_PREDICTION }} /> },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet },
  { path: URL.COMMENTS_BY_SHAKE, component: RouterComment },
  { path: URL.ADMIN, component: RouterAdmin },
  { path: URL.REPORT, component: RouterReport },
  { path: URL.RESOLVE, component: RouterResolve },
  { path: URL.PEX_EXTENSION, component: PexExtension },
  { path: URL.WALLET_EXTENSION, component: TopUp },
];
const routesUsingMobileLayout = configRoutesUsingMobileLayout.map(route => (
  <Route
    key={Date.now()}
    {...route}
  />
));


/* ======================== FOR DESKTOP ======================== */
const PageMobileOnly = createDynamicImport(() => import('@/pages/Error/MobileOnly'), Loading, true);

let routesUsingDesktopLayout = null;
if (BrowserDetect.isDesktop) {
  const configRoutesUsingDesktopLayout = [
    { path: URL.LUCKY_POOL, component: RouterLuckyPool },
    { path: URL.FEEDBACK, component: TypeFormFeedBack },
    { path: URL.CHROME_EXTENSION, component: Extension },
    { path: URL.GURU_CREATE_EVENT, component: PageMobileOnly },
    { path: URL.PREDICTION, render: () => <ProjectDetail type="product" name="prediction" entireContentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.PRODUCT_WALLET_URL, render: () => <ProjectDetail type="product" name="wallet" reactHelmetElement={SEOWallet} entireContentComponent={<ContentForWallet />} /> },
    { path: URL.PEX_EXTENSION, render: () => <PexExtension reactHelmetElement={SEOPrediction} /> },
    { path: URL.ADMIN_ID_VERIFICATION, component: RouterAdminIDVerification },
  ];

  routesUsingDesktopLayout = configRoutesUsingDesktopLayout.map(route => (
    <Route
      key={Date.now()}
      {...route}
    />
  ));
}

const Page404 = createDynamicImport(() => import('@/pages/Error/Page404'), Loading, true);

class Router extends React.Component {
  render() {
    return (
      <Switch>
        {
          BrowserDetect.isDesktop && <Route exact path={URL.INDEX} component={Extension} />
        }

        <Route path={URL.PEX_INSTRUCTION_URL} render={() => <ProjectDetail type="landing" name="pex-instruction" entireContentComponent={<ContentForPexInstruction />} />} />
        {routesUsingDesktopLayout}
        <Route
          path={URL.INDEX}
          render={props => {
            return (
              <Layout {...props}>
                <ScrollToTop>
                  <Switch>
                    <Route exact path={URL.INDEX} render={() => {
                      return <Redirect to={{ pathname: URL.PREDICTION }} />
                    }}
                    />
                    {routesUsingMobileLayout}
                    <Route component={Page404} />
                  </Switch>
                </ScrollToTop>
              </Layout>
            );
          }}
        />
      </Switch>
    );
  }
}

export default connect(state => ({
  router: state.router
}))(Router);
