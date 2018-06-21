import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { changeLocale } from '@/reducers/app/action';
import VideoYoutube from "@/components/core/controls/VideoYoutube";

// style
import onlyMobileTabletSVG from '@/assets/images/ninja/ninja-header.svg';
import shurikenIcon from '@/assets/images/ninja/shuriken-icon.svg';
import playVideoButton from '@/assets/images/ninja/play-video-button.svg';
import videoLeftCover from '@/assets/images/ninja/video-left-cover.jpg';
import videoRightCover from '@/assets/images/ninja/video-right-cover.jpg';
import './MobileOrTablet.scss';

const whitePaperLink = 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8';
const mediumLink = 'https://t.me/ninja_org';
const countryList = [
  {
    code: 'en',
    title: 'EN',
  },
  {
    code: 'zh',
    title: 'CN',
  },
  {
    code: 'fr',
    title: 'FR',
  },
  {
    code: 'de',
    title: 'DE',
  },
  {
    code: 'ja',
    title: 'JP',
  },
  {
    code: 'ko',
    title: 'KR',
  },
  {
    code: 'ru',
    title: 'RU',
  },
  {
    code: 'es',
    title: 'ES',
  },
];

const languagesWhitePaper = [ 'zh', 'fr', 'de', 'ru', 'ja', 'ko', 'es' ];

class MobileOrTablet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.changeCountry = ::this.changeCountry;
  }

  componentDidMount() {
    const appContainer = document.getElementById('app');
    appContainer.classList.add('mobileTabletApp');
  }

  changeCountry(countryCode) {
    this.props.changeLocale(countryCode);
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="container mobile-tablet">
        <div className="row">
          <div className="col-lg-12">
            <div className="chooseLanguage">
              {
                countryList.map((item, index) => (
                  <div
                    key={index}
                    className={`countryName ${locale === item.code ? 'countryActive' : ''}`}
                    onClick={() => this.changeCountry(item.code)}
                  >
                    <span>{item.title}</span>
                  </div>)
                )
              }
            </div>
          </div>
          <div className="col-lg-12 text-center topBox">
            <VideoYoutube
              playButtonIcon={playVideoButton}
              imageUrl={videoLeftCover}
              imageAlt="ninja place prediction"
              videoUrl="https://youtu.be/YYZJlLDzeEs"
              autoPlayVideo
            />
            <div>
              <img className="img-fluid imageHeader" src={onlyMobileTabletSVG} alt="ninja"/>
              <h1>{messages.MOT_TITLE}</h1>
            </div>
            <VideoYoutube
              playButtonIcon={playVideoButton}
              imageUrl={videoRightCover}
              imageAlt="prediction exchange walk thru"
              videoUrl="https://youtu.be/6bd6-XtO3Wk"
            />
          </div>
          <div className="col-lg-12 text-center">
            <p>
              {messages.MOT_CONTENT_0}
              <br/>
              {messages.MOT_CONTENT_1} <span className="website">www.ninja.org</span> {messages.MOT_CONTENT_2}
              <br />
              <span className="whiteColor">{messages.MOT_CONTENT_3}</span>
            </p>
          </div>
          <div className="col-lg-12">
            <div>
              <ul>
                {
                  locale === 'en' && (
                    <li>
                      <img src={shurikenIcon} alt="shuriken icon" /> Jump in for <a href="/shuriken">Airdrop</a>
                    </li>
                  )
                }
                {
                  messages.MOT_LIST_CONTENT.map((item, index) => {
                    let link = item.link;
                    if(index === 0 && locale !== 'en' && languagesWhitePaper.indexOf(locale) !== -1) {
                      link = '/whitepaper';
                    }
                    return (<li key={index}>
                      <img src={shurikenIcon} alt="shuriken icon"/> {item.mainContent || ''} <a href={link}
                                                                                                target="_blank">{item.placeHolderLink}</a> {item.mainContent1 || ''}
                    </li>);
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = ({
  changeLocale,
});

export default injectIntl(connect(null, mapDispatch)(MobileOrTablet));
