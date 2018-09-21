import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
// constants
import { URL, LANDING_PAGE_TYPE } from '@/constants';
// services
import BrowserDetect from '@/services/browser-detect';
import { createDynamicImport } from '@/services/app';
// components
import Loading from '@/components/core/presentation/Loading';
import ScrollToTop from '@/components/App/ScrollToTop';
import Layout from '@/components/Layout/Main';
import { SEOHome, SEOCash, SEOPrediction, SEODad, SEOWallet, SEOWhisper, SEOPayForDevs, SEOPayForStores, SEOBecomeAtm } from '@/components/SEO';

import imgCash from '@/assets/images/landing/home/cash.jpg';
import imgCashContent from '@/assets/images/landing/cash/fake-content.svg';
import imgDadContent from '@/assets/images/landing/dad/fake-content.jpg';
// import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg';
// import imgBlockchainPrivacy from '@/assets/images/landing/home/blockchain-privacy.jpg';
import imgDad from '@/assets/images/landing/home/dad.jpg';
// import imgDao from '@/assets/images/landing/home/dao.jpg';
import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
import imgWallet from '@/assets/images/landing/home/wallet.jpg';
import imgWhisper from '@/assets/images/landing/home/whisper.jpg';
import imgUncommons from '@/assets/images/landing/home/uncommons.jpg';
import imgHivepayOnline from '@/assets/images/landing/home/hivepay-online.jpg';
import imgHivepayOffline from '@/assets/images/landing/home/hivepay-offline.jpg';

// import NetworkError from '@/components/Router/NetworkError';
import Maintain from '@/components/Router/Maintain';
import PexExtension from '@/pages/PexExtension/PexExtension';

const RouterMe = createDynamicImport(() => import('@/components/Router/Me'), Loading);
const RouterDiscover = createDynamicImport(() => import('@/components/Router/Discover'), Loading);
const RouterChat = createDynamicImport(() => import('@/components/Router/Chat'), Loading);
const RouterCreate = createDynamicImport(() => import('@/components/Router/Create'), Loading);
const RouterWallet = createDynamicImport(() => import('@/components/Router/Wallet'), Loading);
const RouterPayment = createDynamicImport(() => import('@/components/Router/Payment'), Loading);
const RouterComment = createDynamicImport(() => import('@/components/Router/Comment'), Loading);
const RouterAdmin = createDynamicImport(() => import('@/components/Router/Admin'), Loading);
const RouterReport = createDynamicImport(() => import('@/components/Router/Report'), Loading);
const RouterLuckyPool = createDynamicImport(() => import('@/pages/LuckyLanding/LuckyLanding'), Loading);
const RouterExchange = createDynamicImport(() => import('@/components/Router/Exchange'), Loading);
const CreateOwnMarket = createDynamicImport(() => import('@/pages/CreateMarket/CreateMarket'), Loading);
//const RouterExchange = createDynamicImport(() => import('@/pages/Exchange/Exchange'), Loading);
const RouterPrediction = createDynamicImport(() => import('@/pages/Prediction/Prediction'), Loading);
const RouterResolve = createDynamicImport(() => import('@/pages/Resolve/Resolve'), Loading);
const RouterLandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Loading);
const LandingPageMain = createDynamicImport(() => import('@/pages/LandingPage/Main'), Loading);
const ProjectDetail = createDynamicImport(() => import('@/components/ProjectDetail'), Loading);
const Recruiting = createDynamicImport(() => import('@/pages/Recruiting'), Loading);
const JobDetail = createDynamicImport(() => import('@/pages/Recruiting/JobDetail'), Loading);
const ContentForCashBusiness = createDynamicImport(() => import('@/pages/LandingPage/ContentForCashBusiness'), Loading);
const ContentForPayForDevs = createDynamicImport(() => import('@/pages/LandingPage/ContentForPayForDevs'), Loading);
const ContentForWallet = createDynamicImport(() => import('@/pages/LandingPage/ContentForWallet'), Loading);
const ContentForPrediction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPrediction'), Loading);
const ContentForPexInstruction = createDynamicImport(() => import('@/pages/LandingPage/ContentForPexInstruction'), Loading);
const Discover = createDynamicImport(() => import('@/pages/Discover/Discover'), Loading);
const RouterCCConfirm = createDynamicImport(() => import('@/components/Router/CCConfirm'), Loading);
const RouterBuyCC = createDynamicImport(() => import('@/components/Router/Credit'), Loading);
const RouterEscrowDeposit = createDynamicImport(() => import('@/pages/Escrow/Deposit'), Loading);
const RouterEscrowWithdraw = createDynamicImport(() => import('@/pages/Escrow/Withdraw'), Loading);
const RouterEscrowWithdrawSuccess = createDynamicImport(() => import('@/pages/Escrow/WithdrawSuccess'), Loading);
const RouterShop = createDynamicImport(() => import('@/components/Router/Shop'), Loading);
const RouterInternalWithdraw = createDynamicImport(() => import('@/components/Router/InternalWithdraw'), Loading);
const LandingBecomeAtm = createDynamicImport(() => import('@/pages/LandingPage/BecomeAtm'), Loading);

/* ======================== FOR MOBILE ======================== */
const configRoutesUsingMobileLayout = [
  { path: URL.HANDSHAKE_PREDICTION, component: RouterPrediction },
  { path: URL.HANDSHAKE_PEX, component: RouterExchange },
  { path: URL.HANDSHAKE_PEX_UPDATER, component: CreateOwnMarket },
  { path: URL.PEX_INSTRUCTION_URL, component: ContentForPexInstruction },

  { path: URL.HANDSHAKE_ME, component: RouterMe },
  { path: URL.HANDSHAKE_CASH, component: RouterDiscover },
  { path: URL.HANDSHAKE_ATM, component: RouterDiscover },
  { path: URL.HANDSHAKE_CHAT, component: RouterChat },
  { path: URL.HANDSHAKE_WALLET, component: RouterWallet },
  { path: URL.HANDSHAKE_PAYMENT, component: RouterPayment },
  { path: URL.HANDSHAKE_CREATE, component: RouterCreate },
  { path: URL.COMMENTS_BY_SHAKE, component: RouterComment },
  { path: URL.ADMIN, component: RouterAdmin },
  { path: URL.REPORT, component: RouterReport },
  { path: URL.CC_PAYMENT_URL, component: RouterCCConfirm },
  { path: URL.BUY_BY_CC_URL, component: RouterBuyCC },

  { path: URL.ESCROW_DEPOSIT, component: RouterEscrowDeposit },
  { path: URL.ESCROW_WITHDRAW, component: RouterEscrowWithdraw, exact: true },
  { path: URL.ESCROW_WITHDRAW_SUCCESS, component: RouterEscrowWithdrawSuccess },
  {
    path: URL.PRODUCT_DAD_URL,
    render: () => {
      window.location.href = URL.PRODUCT_DAD_URL_SUBDOMAIN;
      return null;
    }
  },
  { path: URL.RESOLVE, component: RouterResolve },
  { path: URL.SHOP_URL, component: RouterShop },
  { path: URL.LANDING_BECOME_ATM, render: () => <LandingBecomeAtm reactHelmetElement={SEOBecomeAtm} /> },
];
const routesUsingMobileLayout = configRoutesUsingMobileLayout.map(route => (
  <Route
    key={Date.now()}
    {...route}
  />
));


/* ======================== FOR DESKTOP ======================== */

let routesUsingDesktopLayout = null;
if (BrowserDetect.isDesktop) {
  const configRoutesUsingDesktopLayout = [
    { path: URL.LUCKY_POOL, component: RouterLuckyPool },
    { path: URL.PRODUCT_CASH_URL, render: () => <ProjectDetail type="product" name="cash" img={imgCash} imgContent={imgCashContent} reactHelmetElement={SEOCash} /> },
    { path: URL.PRODUCT_ATM_URL, render: () => <ProjectDetail type="product" name="cash" img={imgCash} imgContent={imgCashContent} reactHelmetElement={SEOCash} /> },
    { path: URL.BUY_BY_CC_URL, render: () => <ProjectDetail type="product" name="cash" img={imgCash} imgContent={imgCashContent} reactHelmetElement={SEOCash} /> },
    { path: URL.PRODUCT_PREDICTION_URL, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} contentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.HANDSHAKE_PEX, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} contentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.PRODUCT_WALLET_URL, render: () => <ProjectDetail type="product" name="wallet" img={imgWallet} reactHelmetElement={SEOWallet} entireContentComponent={<ContentForWallet />} /> },
    { path: URL.PEX_EXTENSION, render: () => <PexExtension reactHelmetElement={SEOPrediction} /> },
    { path: URL.HANDSHAKE_PEX_CREATOR, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} contentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.HANDSHAKE_EXCHANGE, render: () => <ProjectDetail type="product" name="prediction" img={imgPrediction} contentComponent={<ContentForPrediction />} reactHelmetElement={SEOPrediction} /> },
    { path: URL.PRODUCT_HIVEPAY_OFFLINE_URL, render: () => <ProjectDetail type="product" name="pay-for-stores" img={imgHivepayOffline} reactHelmetElement={SEOPayForStores} /> },
    { path: URL.PRODUCT_HIVEPAY_ONLINE_URL, render: () => <ProjectDetail type="product" name="pay-for-devs" reactHelmetElement={SEOPayForDevs} entireContentComponent={<ContentForPayForDevs />} /> },
    { path: URL.RESEARCH_INTERNET_CASH_URL, render: () => <ProjectDetail type="research" name="internet-cash" img={imgInternetCash} /> },
    { path: URL.PRODUCT_DAD_URL, render: () => <ProjectDetail type="product" name="dad" img={imgDad} imgContent={imgDadContent} reactHelmetElement={SEODad} /> },
    { path: URL.RESEARCH_UNCOMMONS_URL, render: () => <ProjectDetail type="research" name="uncommons" img={imgUncommons} /> },
    { path: URL.PRODUCT_WHISPER_URL, render: () => <ProjectDetail type="product" name="whisper" img={imgWhisper} reactHelmetElement={SEOWhisper} /> },
    { path: URL.LANDING_BECOME_ATM, render: () => <LandingBecomeAtm reactHelmetElement={SEOBecomeAtm} /> },
    { path: URL.INTERNAL_WITHDRAW_URL, component: RouterInternalWithdraw },
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
  componentDidMount() {
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

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {
            BrowserDetect.isDesktop && <Route exact path={URL.INDEX} component={RouterLandingPageMain} />
          }

          <Route path={LANDING_PAGE_TYPE.product.url} render={() => <LandingPageMain type="product" />} />
          <Route path={LANDING_PAGE_TYPE.research.url} render={() => <LandingPageMain type="research" />} />
          <Route exact path={URL.RECRUITING} component={Recruiting} />
          <Route path={URL.RECRUITING_JOB_DETAIL} component={JobDetail} />
          <Route path={URL.CASH_FOR_BUSINESS} render={() => <ProjectDetail type="landing" name="cash-for-business" img={imgDad} contentComponent={<ContentForCashBusiness />} />} />
          <Route path={URL.PEX_INSTRUCTION_URL} render={() => <ProjectDetail type="landing" name="pex-instruction" entireContentComponent={<ContentForPexInstruction />} />} />
          {routesUsingDesktopLayout}

          {/* Cash on mobile uses a completely different layout! */}
          {/* <Route path={URL.HANDSHAKE_CASH} component={Discover} /> */}
          <Route
            path={URL.INDEX}
            render={props => {
              return (
                <Layout {...props}>
                  {
                    this.state.firebaseApp.config.isMaintain
                      ? <Maintain />
                      : (
                        <ScrollToTop>
                          <Switch>
                            <Route exact path={URL.INDEX} render={() => {
                              return <Redirect to={{ pathname: URL.BUY_BY_CC_URL }} />
                            }}
                            />
                            {/*<Route*/}
                            {/*exact*/}
                            {/*path={URL.INDEX}*/}
                            {/*render={() => {*/}
                            {/*if (process.env.isDojo) {*/}
                            {/*return <Redirect to={{ pathname: URL.HANDSHAKE_CASH }} />*/}
                            {/*}*/}
                            {/*return <Redirect to={{ pathname: URL.HANDSHAKE_PREDICTION }} />*/}
                            {/*}}*/}
                            {/*/>*/}
                            {routesUsingMobileLayout}
                            <Route component={Page404} />
                          </Switch>
                        </ScrollToTop>
                      )
                  }
                </Layout>
              )
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(state => ({ firebaseApp: state.firebase.data }))(Router);
