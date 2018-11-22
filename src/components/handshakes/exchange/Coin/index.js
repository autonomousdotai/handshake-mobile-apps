import React, { Component } from 'react';
import MainLayout from './MainLayout';
import CoinDesktop from './DesktopLayout';
import './styles.scss';
import { SEOHome } from '@/components/SEO';
import { injectIntl } from 'react-intl';

const scopedCss = (className) => `crypto-coin-${className}`;

class Coin extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const { messages } = this.props.intl;
    const data = {
      title: messages.coinbowl.fullname,
      description: messages.coinbowl.description,
      og_description: messages.coinbowl.description,
      keywords: messages.coinbowl.keywords,
      og_site_name: messages.coinbowl.fullname,
    };

    return (
      <React.Fragment>
        <SEOHome data={data} />
        <div className={scopedCss('desktop')}>
          <CoinDesktop>
            <MainLayout />
          </CoinDesktop>
        </div>
        <div className={scopedCss('mobile')}>
          <MainLayout />
        </div>
      </React.Fragment>
    );
  }
}

export default injectIntl(Coin);
