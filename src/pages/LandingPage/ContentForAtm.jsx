import React from 'react';
import { injectIntl } from 'react-intl';

import './ContentForCashBusiness.scss';

import iconCard from '@/assets/images/landing/cash-for-business/card.svg';
import iconEarnMore from '@/assets/images/landing/cash-for-business/earn-more-customers.svg';
import iconIphone from '@/assets/images/landing/cash-for-business/iphone.svg';
import iconLine from '@/assets/images/landing/cash-for-business/line.svg';
import iconMinimumEffort from '@/assets/images/landing/cash-for-business/minimum-effort.svg';
import iconSteadyIncome from '@/assets/images/landing/cash-for-business/steady-income.svg';


const features = [
  {
    name: 'easy-anonymous',
    title: 'Easy and anonymous',
    icon: iconMinimumEffort,
    caption: <span>No need to install an app. No signup or ID verification required.</span>,
  },
  {
    name: 'highly-protect',
    title: 'Highly protected',
    icon: iconEarnMore,
    caption: <span>Buy crypto directly from local human ATMs,  with escrow secured transactions</span>,
  },
  {
    name: 'best-rate',
    title: 'The best rates around',
    icon: iconSteadyIncome,
    caption: <span>No transaction fees. Consistently low prices for crypto across all ATMs</span>,
  },
]

const howToSetUpATM = [
  {
    id: 1,
    text: 'Open ninja.org/atm on your mobile browser',
  },
  {
    id: 2,
    text: 'Choose from the Ninja ATMs in your area',
  },
  {
    id: 3,
    text: 'Go to that Ninja ATM and buy crypto with cash, face to face',
  },
]


class ContentForAtm extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="content-for-cash-business mt-5">
        <div className="row features">
          {
            features.map((feature, index) => {
              const { name, title, icon, caption } = feature;
              return (
                <div key={name} className="col-12 col-md-4 mt-4">
                  <div><img src={icon} /></div>
                  <div className="feature-title">{title}</div>
                  <div><img src={iconLine} /></div>
                  <div className="feature-caption">{caption}</div>
                </div>
              )
            })
          }
        </div>
        <div className="row mt-5">
          <div className="col-12 col-md-6">
            <img src={iconIphone} />
          </div>
          <div className="col-12 col-md-6">
            <div className="mt-5 headline">How do I use Ninja ATM?</div>
            {
              howToSetUpATM.map(how => {
                const { id, text } = how;
                return (
                  <div key={id} className="mt-5">
                    <span className="how-to-index rounded-circle">{id}</span>
                    <span className="how-to-text">{text}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

ContentForAtm.propTypes = {};

export default injectIntl(ContentForAtm);
