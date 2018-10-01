import React from 'react';
import { injectIntl } from 'react-intl';

import './ContentForCashBusiness.scss';

import iconCard from '@/assets/images/landing/cash-for-business/card.svg';
import iconEarnMore from '@/assets/images/landing/cash-for-business/earn-more-customers.svg';
import iconIphone from '@/assets/images/landing/cash-for-business/iphone.svg';
import iconLine from '@/assets/images/landing/cash-for-business/line.svg';
import iconMinimumEffort from '@/assets/images/landing/cash-for-business/minimum-effort.svg';
import iconSteadyIncome from '@/assets/images/landing/cash-for-business/steady-income.svg';
import iconSchedule from '@/assets/images/landing/cash-for-business/schedule.svg';


const features = [
  {
    name: 'easy-setup',
    title: 'Easy set up',
    icon: iconMinimumEffort,
    caption: <span>No financial investment or extra manpower needed. All you need to set up is your smartphone</span>,
  },
  {
    name: 'own-schedule',
    title: 'Set your own schedule',
    icon: iconSchedule,
    caption: <span>You decide when and where you want to work. You’re the boss</span>,
  },
  {
    name: 'great-income',
    title: 'Make great income',
    icon: iconSteadyIncome,
    caption: <span>Earn up to <strong>1000 USD/month</strong> easily </span>,
  },
  {
    name: 'grow-customer-base',
    title: 'Grow your customer base',
    icon: iconEarnMore,
    caption: <span>Convert crypto enthusiasts into regular customers</span>,
  }
]

const howToSetUpATM = [
  {
    id: 1,
    text: 'Register for free to become a Ninja ATM. We just need your phone number and email address',
  },
  {
    id: 2,
    text: 'Customers find you on the map showing nearby Ninja ATMs and come to your store to buy crypto with cash.',
  },
  {
    id: 3,
    text: 'You conduct the transaction. Here’s how',
  },
  {
    id: 4,
    text: 'You keep the commission from the transaction',
  },
]


class ContentForCashBusiness extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="content-for-cash-business mt-5">
        <div className="row features">
          {
            features.map((feature, index) => {
              const { name, title, icon, caption } = feature;
              return (
                <div key={name} className="col-12 col-md-3 mt-4">
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
            <div className="mt-5 headline">How does Ninja ATM work?</div>
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

ContentForCashBusiness.propTypes = {};

export default injectIntl(ContentForCashBusiness);
