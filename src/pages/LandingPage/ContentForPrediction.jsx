import React from 'react'
import { injectIntl } from 'react-intl'
import { URL } from '@/constants'

import './ContentForCashBusiness.scss'
import imgBarline from '@/assets/images/landing/prediction/image-barline.svg'
import imgCircle from '@/assets/images/landing/prediction/image-circle.svg'
import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg'

import { Link } from 'react-router-dom'
import './ContentForPrediction.scss'

const roadmaps = [
  {
    time: 'FEBRUARY 2018',
    items: [
      {
        title: 'IDEA',
        content: (
          <span>
            Concept for an app that logs agreements and commitments on the
            blockchain called{' '}
            <i>
              <strong>Handshake</strong>
            </i>.<br />
            <a
              target='__blank'
              href='https://www.autonomous.ai/handshake-digital-signature'
            >
              https://www.autonomous.ai/handshake-digital-signature
            </a>
          </span>
        )
      }
    ]
  },
  {
    time: 'MARCH 2018',
    items: [
      {
        title: 'PRE-LAUNCH',
        content: (
          <span>
            <i>
              <strong>Handshake</strong>
            </i>{' '}
            launches and quickly becomes a popular product across US & Asian
            markets. Upon seeing the response, we realize the potential for a
            blockchain of exchanges. An exchange of commitments for everything
            and anything.
          </span>
        )
      }
    ]
  },
  {
    time: 'APRIL 2018',
    items: [
      {
        title: 'CONCEPT DEVELOPMENT',
        content: (
          <span>
            We evolve The exchange of commitments idea and turn{' '}
            <i>
              <strong>Handshake</strong>
            </i>{' '}
            into a{' '}
            <i>
              <strong>Prediction Exchange</strong>
            </i>. Predictions are logged between individual parties on the
            blockchain decentralizing the traditional betting systerm.
          </span>
        )
      }
    ]
  },
  {
    time: 'EARLY MAY 2018',
    items: [
      {
        title: 'PRODUCT DEVELOPMENT',
        content: (
          <span>
            We begin building the new decentralized prediction network obtaining
            all the required licenses and registrations, making it a web app in
            order to keep it 100% anonymous.
          </span>
        )
      }
    ]
  },
  {
    time: 'MAY 2018',
    items: [
      {
        title: 'SYSTEM DEVELOPMENT',
        content: (
          <span>
            Create the P2P matching system so you can bet directly with other
            people. Design a custom oddsmaker, where you can create your own
            odds for any event.
          </span>
        )
      }
    ]
  },
  {
    time: 'LATE MAY 2018',
    items: [
      {
        title: 'PRE-LAUNCH',
        content: <span>Launch on the testnet.</span>
      }
    ]
  },
  {
    time: 'JUNE 2018',
    items: [
      {
        title: 'FULL NETWORK LAUNCH',
        content: <span>Launch Prediction across all markets.</span>
      }
    ]
  },
  {
    time: 'JULY 2018',
    items: [
      {
        title: 'SYSTEM IMPROVEMENT',
        content: <span>Redesign the interface and update the UX.</span>
      }
    ]
  },
  {
    time: 'EARLY AUGUST 2018',
    items: [
      {
        title: 'MARKET CREATION FEATURE',
        content: (
          <span>
            We'll give users full control to create their own markets to host
            and play in.
          </span>
        )
      }
    ]
  },
  {
    time: 'MID AUGUST 2018',
    items: [
      {
        title: 'ERC20 TOKEN SUPPORT',
        content: (
          <span>
            Implement support for payment with an ERC20-compatible token.
          </span>
        )
      }
    ]
  },
  {
    time: 'LATE AUGUST 2018',
    items: [
      {
        title: 'BUG DISCOVERY',
        content: (
          <span>
            A public bounty program to help us identify bugs and vulnerabilities
            within the product.
          </span>
        )
      }
    ]
  },
  {
    time: 'SEPTEMBER 2018',
    items: [
      {
        title: 'REFERRAL & AMBASSADOR SYSTEM',
        content: (
          <span>
            Implement a referral system to reward ambassadors for bringing new
            business to the{' '}
            <i>
              <strong>Prediction Exchange</strong>
            </i>.
          </span>
        )
      },
      {
        title: 'REPUTATION',
        content: (
          <span>
            A protocol that tracks the history of users and unlocks in-app
            benefits for those with a good reputation.
          </span>
        )
      }
    ]
  },
  {
    time: 'OCTOBER 2018',
    items: [
      {
        title: 'ADD BITCOIN',
        content: (
          <span>
            Introduce Bitcoin as a playable coin within the{' '}
            <i>
              <strong>Prediction Exchange</strong>
            </i>.
          </span>
        )
      }
    ]
  },
  {
    time: 'NOVEMBER 2018',
    items: [
      {
        title: 'PERSONAL LOAN',
        content: (
          <span>
            We launch our own decentralized credit option for small and personal
            loans.
          </span>
        )
      }
    ]
  },
  {
    time: 'DECEMBER 2018',
    items: [
      {
        title: 'BUSINESS LOAN',
        content: <span>Expand our credit option for business.</span>
      }
    ]
  }
]


// renderRoadMap() {
//   return (

//   );
//}

class ContentForPrediction extends React.Component {

  renderRoadMapLine = (title, content) => {
    return (
      <div>
        <div className='title'>{title}</div>
        <div className='content'>{content}</div>
      </div>
    );
  }

  renderRoadMapItem =(index, time, items) => {
    return (
      <div>
        <div
          className={`${
            index % 2 === 0 ? 'text-left' : 'text-right'
          }`}
        >
          <div className={`${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className='time'>
              {time}
              <img src={imgBarline} className='barline' />
            </div>

            <div>
              {items.map(item => {
                const { title, content } = item
                return this.renderRoadMapLine(title, content);
              })}
            </div>
            <img src={imgCircle} className='circle' />
          </div>
        </div>
      </div>
    );
}

  render () {
    const { messages, locale } = this.props.intl
    return (
      <div className='row mt-5'>
        <div className='col'>
          <img src={imgPredictionContent} className='w-100' />
          <div className='text-center mt-5'>
            <h2 style={{ fontWeight: 600, marginBottom: '20px' }}>Road Map</h2>
            <div className='roadmaps'>
              {roadmaps.map((roadmap, index) => {
                const { time, items } = roadmap
                return (
                  this
                )
              })}
            </div>
          </div>
          <div className='mt-5'>
            For instructions on how to play:{' '}
            <Link to={URL.PEX_INSTRUCTION_URL}>
              http://ninja.org/pex/instruction
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

ContentForPrediction.propTypes = {}

export default injectIntl(ContentForPrediction)
