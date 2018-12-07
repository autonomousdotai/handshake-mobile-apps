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
import { SEOPrediction, SEOWallet } from '@/components/SEO';

import PexExtension from '@/pages/PexExtension/PexExtension';
import TopUp from '@/pages/TopUp/TopUp';

const TypeFormFeedBack = createDynamicImport(() => import('@/pages/TypeFormFeedBack'), Loading);
const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);
const RouterAdmin = createDynamicImport(() => import('@/components/Router/Admin'), Loading);
const RouterReport = createDynamicImport(() => import('@/components/Router/Report'), Loading);
const RouterLuckyPool = createDynamicImport(() => import('@/pages/LuckyLanding/LuckyLanding'), Loading);
const RouterPrediction = createDynamicImport(() => import('@/guru/pages/Home/Home'), Loading);
const RouterReputation = createDynamicImport(() => import('@/guru/pages/Reputation/Reputation'), Loading);
const RouterWalletCoin = createDynamicImport(() => import('@/guru/pages/WalletCoin/WalletCoin'), Loading);
const RouterAuthCallback = createDynamicImport(() => import('@/guru/pages/WalletCoin/AuthCallback'), Loading);

// Guru's Routes
const CreateEvent = createDynamicImport(() => import('@/guru/pages/CreateEvent/CreateEvent'), Loading);
const GuruPlaceBet = createDynamicImport(() => import('@/guru/pages/PlaceBet'), Loading);
const Extension = createDynamicImport(() => import('@/guru/pages/Extension'), Loading);

const RouterResolve = createDynamicImport(() => import('@/pages/Resolve/Resolve'), Loading);
const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Loading);
const ContentForWallet = createDynamicImport(() => import('@/pages/LandingPage/ContentForWallet'), Loading);
const ContentForPrediction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPrediction'), Loading);
const ContentForPexInstruction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPexInstruction'), Loading);

const Page404 = createDynamicImport(() => import('@/pages/Error/Page404'), Loading, true);
const PageMobileOnly = createDynamicImport(() => import('@/pages/Error/MobileOnly'), Loading, true);

/**
 * ======================== ROUTE LIST ========================
 */

const { isDesktop } = BrowserDetect;

const routeList = [
  // DESKTOP & MOBILE
  { path: URL.FEEDBACK, component: TypeFormFeedBack },
  { path: URL.PEX_INSTRUCTION_URL, component: ContentForPexInstruction },


  // Only DESKTOP
  { path: URL.INDEX, component: Extension, isDesktop: true },
  { path: URL.CHROME_EXTENSION, component: Extension, isDesktop: true },
  { path: URL.LUCKY_POOL, component: RouterLuckyPool, isDesktop: true },
  { path: URL.CREATE_EVENT, component: PageMobileOnly, isDesktop: true },

  // WARNING: Please do not use ProjectDetail anymore
  { path: URL.PREDICTION, isDesktop: true, render: () => <ProjectDetail type="product" name="prediction" entireContentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
  { path: URL.PRODUCT_WALLET_URL, isDesktop: true, render: () => <ProjectDetail type="product" name="wallet" reactHelmetElement={SEOWallet} entireContentComponent={<ContentForWallet />} /> },
  { path: URL.PEX_EXTENSION, isDesktop: true, render: () => <PexExtension reactHelmetElement={SEOPrediction} /> },


  // Only MOBILE
  { path: URL.PREDICTION, component: RouterPrediction, isDesktop: false },
  { path: URL.CREATE_EVENT, component: CreateEvent, isDesktop: false },
  { path: URL.GURU_PLACE_BET, component: GuruPlaceBet, isDesktop: false },
  { path: URL.HANDSHAKE_REPUTATION, component: RouterReputation, isDesktop: false },
  { path: URL.HANDSHAKE_COINBASE_WALLET, component: RouterWalletCoin, isDesktop: false },
  { path: URL.HANDSHAKE_COINBASE_AUTH, component: RouterAuthCallback, isDesktop: false },
  { path: URL.HANDSHAKE_ME, component: RouterMe, isDesktop: false },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet, isDesktop: false },
  { path: URL.COMMENTS, component: RouterComment, isDesktop: false },
  { path: URL.ADMIN, component: RouterAdmin, isDesktop: false },
  { path: URL.REPORT, component: RouterReport, isDesktop: false },
  { path: URL.RESOLVE, component: RouterResolve, isDesktop: false },
  { path: URL.WALLET_EXTENSION, component: TopUp, isDesktop: false },
  { path: URL.INDEX, isDesktop: false, redirectTo: URL.PREDICTION },
  { path: URL.HANDSHAKE_PEX, redirectTo: URL.PREDICTION, isDesktop: false }
].filter((r) => [isDesktop, undefined].includes(r.isDesktop)).map(r => {
  if (r.redirectTo) {
    return <Redirect exact key={r.path} from={r.path} to={r.redirectTo} />;
  }
  if (r.render) {
    return <Route exact key={r.path} path={r.path} render={r.render} />;
  }
  return <Route exact key={r.path} path={r.path} component={r.component} />;
});

class Router extends React.Component {
  render() {
    return (
      <Switch>
        {routeList}
        <Route component={Page404} />
      </Switch>
    );
  }
}

export default connect(state => ({
  router: state.router
}))(Router);
