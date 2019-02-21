import React, { lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// constants
import { URL } from '@/constants';
// services
import BrowserDetect from '@/services/browser-detect';
import { SEOPrediction, SEOWallet } from '@/components/SEO';


const PexExtension = lazy(() => import('@/pages/PexExtension/PexExtension'));
const TopUp = lazy(() => import('@/pages/TopUp/TopUp'));
const TypeFormFeedBack = lazy(() => import('@/pages/TypeFormFeedBack'));
const RouterMe = lazy(() => import('@/components/Router/Me'));
const RouterWallet = lazy(() => import('@/components/Router/Wallet'));
const RouterComment = lazy(() => import('@/components/Router/Comment'));
const RouterAdmin = lazy(() => import('@/components/Router/Admin'));
const RouterReport = lazy(() => import('@/components/Router/Report'));
const RouterLuckyPool = lazy(() => import('@/pages/LuckyLanding/LuckyLanding'));
const RouterPrediction = lazy(() => import('@/guru/pages/Home/Home'));
const RouterReputation = lazy(() => import('@/guru/pages/Reputation/Reputation'));
const RouterWalletCoin = lazy(() => import('@/guru/pages/WalletCoin/WalletCoin'));
const RouterAuthCallback = lazy(() => import('@/guru/pages/WalletCoin/AuthCallback'));

const CreateEvent = lazy(() => import('@/guru/pages/CreateEvent/CreateEvent'));
const GuruPlaceBet = lazy(() => import('@/guru/pages/PlaceBet'));
const Extension = lazy(() => import('@/guru/pages/Extension'));
const MeProfile = lazy(() => import('@/pages/Me/Profile'));

const RouterResolve = lazy(() => import('@/pages/Resolve/Resolve'));
const ProjectDetail = lazy(() => import('@/components/ProjectDetail'));
const ContentForWallet = lazy(() => import('@/pages/LandingPage/ContentForWallet'));
const ContentForPrediction = lazy(() => import('@/pages/LandingPage/ContentForPrediction'));
const ContentForPexInstruction = lazy(() => import('@/pages/LandingPage/ContentForPexInstruction'));
const ConstantTerm = lazy(() => import('@/guru/pages/ConstantTerm/ConstantTerm'));

const Page404 = lazy(() => import('@/pages/Error/Page404'));
const PageMobileOnly = lazy(() => import('@/pages/Error/MobileOnly'));

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
  { path: URL.PREDICTION, component: Extension, redirectTo: URL.INDEX, isDesktop: true },
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
  { path: URL.HANDSHAKE_ME_PROFILE, component: MeProfile, isDesktop: false },
  { path: URL.INDEX, isDesktop: false, redirectTo: URL.PREDICTION },
  { path: URL.HANDSHAKE_PEX, redirectTo: URL.PREDICTION, isDesktop: false },
  { path: URL.CONSTANT_TERM_URL, component: ConstantTerm, isDesktop: false }

].filter((r) => [isDesktop, undefined].includes(r.isDesktop)).map(r => {
  if (r.redirectTo) {
    return <Redirect exact key={r.path} from={r.path} to={r.redirectTo} />;
  }
  if (r.render) {
    return <Route exact key={r.path} path={r.path} render={r.render} />;
  }
  return <Route exact key={r.path} path={r.path} component={r.component} />;
});

export default class Router extends React.Component {
  render() {
    return (
      <Switch>
        {routeList}
        <Route component={Page404}>
          <Redirect to={URL.INDEX} />
        </Route>
      </Switch>
    );
  }
}
