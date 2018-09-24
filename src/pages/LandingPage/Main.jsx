import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'

import { setLanguage } from '@/reducers/app/action';
// import VideoYoutube from '@/components/core/controls/VideoYoutube';
import { Link } from 'react-router-dom';
import BrowserDetect from '@/services/browser-detect';

// style
import imgNinja from '@/assets/images/ninja/ninja-header-black.svg';
import imgLogo from '@/assets/images/logo.png';
import imgCash from '@/assets/images/landing/home/cash.jpg';
import imgPrediction from '@/assets/images/landing/home/prediction.jpg';
import imgDad from '@/assets/images/landing/home/dad.jpg';
import imgWallet from '@/assets/images/landing/home/wallet.jpg';
import imgWhisper from '@/assets/images/landing/home/whisper.jpg';
import imgHivepayOnline from '@/assets/images/landing/home/hivepay-online.jpg';
import imgHivepayOffline from '@/assets/images/landing/home/hivepay-offline.jpg';
import imgFund from '@/assets/images/landing/home/fund.png';
import imgInternetCash from '@/assets/images/landing/home/internet-cash.jpg';
import imgUncommons from '@/assets/images/landing/home/uncommons.jpg';

import {
  URL,
} from '@/constants';

import LandingWrapper from '@/components/LandingWrapper';

const products = [
  {
    name: 'cash',
    title: <FormattedMessage id="landing_page.products.cash.title" />,
    subTitle: <FormattedMessage id="landing_page.products.cash.subTitle" />,
    img: imgCash,
    to: URL.PRODUCT_CASH_URL,
  },
  {
    name: 'prediction',
    title: <FormattedMessage id="landing_page.products.prediction.title" />,
    subTitle: <FormattedMessage id="landing_page.products.prediction.subTitle" />,
    img: imgPrediction,
    to: URL.PRODUCT_PREDICTION_URL,
  },
  {
    name: 'dad',
    title: <FormattedMessage id="landing_page.products.dad.title" />,
    subTitle: <FormattedMessage id="landing_page.products.dad.subTitle" />,
    img: imgDad,
    to: URL.PRODUCT_DAD_URL,
    href: URL.PRODUCT_DAD_URL_SUBDOMAIN,
  },
  {
    name: 'wallet',
    title: <FormattedMessage id="landing_page.products.wallet.title" />,
    subTitle: <FormattedMessage id="landing_page.products.wallet.subTitle" />,
    img: imgWallet,
    to: URL.PRODUCT_WALLET_URL
  },
  {
    name: 'whisper',
    title: <FormattedMessage id="landing_page.products.whisper.title" />,
    subTitle: <FormattedMessage id="landing_page.products.whisper.subTitle" />,
    img: imgWhisper,
    to: URL.PRODUCT_WHISPER_URL,
  },
  {
    name: 'hivepay-online',
    title: <FormattedMessage id="landing_page.products.hivepay-online.title" />,
    subTitle: <FormattedMessage id="landing_page.products.hivepay-online.subTitle" />,
    img: imgHivepayOnline,
    to: URL.PRODUCT_PAYFORDEVS_URL,
  },
  {
    name: 'hivepay-offline',
    title: <FormattedMessage id="landing_page.products.hivepay-offline.title" />,
    subTitle: <FormattedMessage id="landing_page.products.hivepay-offline.subTitle" />,
    img: imgHivepayOffline,
    to: URL.PRODUCT_PAYFORSTORES_URL,
  },
  {
    name: 'fund',
    title: <FormattedMessage id="landing_page.products.fund.title" />,
    subTitle: <FormattedMessage id="landing_page.products.fund.subTitle" />,
    img: imgFund,
    // to: URL.PRODUCT_FUND_URL,
    href: URL.PRODUCT_FUND_URL,
  },
]

const researches = [
  {
    title: <FormattedMessage id="landing_page.researches.uncommons.title" />,
    subTitle: <FormattedMessage id="landing_page.researches.uncommons.subTitle" />,
    img: imgUncommons,
    to: URL.RESEARCH_UNCOMMONS_URL,
  },
  {
    title: <FormattedMessage id="landing_page.researches.internetCash.title" />,
    subTitle: <FormattedMessage id="landing_page.researches.internetCash.subTitle" />,
    img: imgInternetCash,
    to: URL.RESEARCH_INTERNET_CASH_URL,
  }
]

import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';
import playVideoButton from '@/assets/images/ninja/play-video-button.svg';
import videoLeftCover from '@/assets/images/ninja/video-left-cover.jpg';
import videoRightCover from '@/assets/images/ninja/video-right-cover.jpg';
import phoneIcon from '@/assets/images/ninja/phone-icon.svg';
import './Main.scss';

class Main extends React.PureComponent {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.changeCountry = ::this.changeCountry;
  }

  componentDidMount() {
    console.log('mobile', this.props)
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode);
  }

  render() {
    const { messages, locale } = this.props.intl;
    const { type = 'product' } = this.props;
    return (
      <LandingWrapper type={type}>
        {
          type === 'product' ? (
            <div>
              <div className="row" style={{ marginTop: '45px' }}>
                <div className="col">
                  <div className="landing-header"><FormattedMessage id="landing_page.header.product" /></div>
                  <div className="landing-subHeader"><FormattedMessage id="landing_page.subHeader.product" /></div>
                </div>
              </div>

              <div className="row" style={{ marginTop: '18px' }}>
                {
                  products.map((product, index) => {
                    const { title, subTitle, img, to, href, name } = product

                    const content = (
                      <div>
                        <div><img src={img} className="img-fluid" /></div>
                        <div className="landing-title my-1">{title}</div>
                        <div className="landing-sub-title">{subTitle}</div>
                      </div>
                    )
                    let element = React.cloneElement(<Link to="" />, { to }, content)
                    if (href) {
                      element = React.createElement('a', { href }, content)
                    }
                    if (name === 'dad') {
                      element = !BrowserDetect.isDesktop ? React.createElement('a', { href }, content) : React.cloneElement(<Link to="" />, { to }, content)
                    }

                    return (
                      <div className="col-12 col-sm-6 col-md-4 product" key={index}>
                        {element}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ) : (
            <div>
              <div className="row mt-5">
                <div className="col">
                  <div className="landing-header"><FormattedMessage id="landing_page.header.research" /></div>
                  <div className="landing-subHeader"><FormattedMessage id="landing_page.subHeader.research" /></div>
                </div>
              </div>

              <div className="row" style={{ marginTop: '18px' }}>
                {
                  researches.map((product, index) => {
                    const { title, subTitle, img, to } = product
                    return (
                      <div className="col-12 col-sm-6 product" key={index}>
                        <Link to={to}>
                          <div><img src={img} className="img-fluid" /></div>
                          <div className="landing-title my-1">{title}</div>
                          <div className="landing-sub-title">{subTitle}</div>
                        </Link>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </LandingWrapper>
    )
  }
}

const mapDispatch = ({
  setLanguage,
});

export default injectIntl(connect(null, mapDispatch)(Main));
