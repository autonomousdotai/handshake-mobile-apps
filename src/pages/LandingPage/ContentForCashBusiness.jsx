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
    name: 'steady-income',
    title: 'Steady income',
    icon: iconSteadyIncome,
    caption: <span>Surf on the crypto wave to earn up to <strong>30,000 USD/month</strong></span>
  },
  {
    name: 'minimum-effort',
    title: 'Minimum effort',
    icon: iconMinimumEffort,
    caption: <span>Say goodbye to complex systems and bulky hardware. We work on mobile phones and tablets.</span>
  },
  {
    name: 'earn-more',
    title: 'Earn more customers',
    icon: iconEarnMore,
    caption: <span>Attract crypto lovers and watch your customer base grow</span>
  }
]

const howToSetUpATM = [
  {
    id: 1,
    text: <span>Open <a href="https://ninja.org/cash">ninja.org/cash</a> on your phone or tablet</span>,
  },
  {
    id: 2,
    text: "Deposit fiat for crypto with a credit card",
  },
  {
    id: 3,
    text: "Set up your profit margin and trade with people",
  },
  {
    id: 4,
    text: "Top up anytime with just one click",
  },
  {
    id: 5,
    text: "Cash out quickly for instant profit",
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
            <div className="mt-5 headline">How to set up an ATM</div>
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
        <div className="row mt-5">
          <div className="col text-center headline">
            A new revenue stream for your business,<br />
            in addition to your regular atm
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <table className="table table-striped">
              <thead className="table-head">
                <tr>
                  <th scope="col" />
                  <th scope="col">REGULAR ATM</th>
                  <th scope="col">CRYPTO ATM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Setup Fee</th>
                  <td>$2,000 - $8,000</td>
                  <td>None</td>
                </tr>
                <tr>
                  <th scope="row">Machine maintenance</th>
                  <td>$1,000/year</td>
                  <td>None</td>
                </tr>
                <tr>
                  <th scope="row">Sales bonus</th>
                  <td>None</td>
                  <td>Monthly</td>
                </tr>
                <tr>
                  <th scope="row">Physical space</th>
                  <td>Bulky - up to 10 sqft</td>
                  <td>Pocket sized</td>
                </tr>
                <tr>
                  <th scope="row">Profit</th>
                  <td>Controlled by the bank provider</td>
                  <td>Set your own profit margins</td>
                </tr>
                <tr>
                  <th scope="row">Contract</th>
                  <td>12 months minimum</td>
                  <td>No fixed term contract</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="row text-center mt-5">
          <div className="col">
            <div className="headline">How Much Will You Be Charged On Ninja</div>
            <div className="subHeadline mt-2">We provide you with an easy, on the go app to exchange coin to coin.<br />You provide the venue, and decide the price to preserve your profits.</div>
            <div className="mt-2"><img src={iconCard} /></div>
          </div>
        </div>

      </div>
    );
  }
}

ContentForCashBusiness.propTypes = {};

export default injectIntl(ContentForCashBusiness);
