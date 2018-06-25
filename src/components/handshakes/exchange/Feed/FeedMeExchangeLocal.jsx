import React from 'react'
import PropTypes from 'prop-types'
// style
import { injectIntl } from 'react-intl'
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_USER,
  URL
} from '@/constants'
import { connect } from 'react-redux'
import { shakeOffer } from '@/reducers/exchange/action'
import { MasterWallet } from '@/models/MasterWallet'
import {
  formatAmountCurrency,
  getHandshakeUserType
} from '@/services/offer-util'
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action'
import { ExchangeHandshake } from '@/services/neuron'
import { feedBackgroundColors } from '@/components/handshakes/exchange/config'
import './FeedMeExchangeLocal.scss'
import StarsRating from '@/components/core/presentation/StarsRating'
import iconChat from '@/assets/images/icon/chat-icon.svg'
import exchangeLocalSVG from '@/assets/images/categories/exchange-local.svg'

class FeedMeExchangeLocal extends React.PureComponent {
  render () {
    return (
      <div className='feed-me-exchange-local'>
        <div className='top-part'>
          <span className='type'>
            <img src={exchangeLocalSVG} className='mr-2' />
            Swap
          </span>
          <span className='status'>Initiating...</span>
        </div>
        <div>
          <span className='left-part'>
            <span>I want to sell</span> <strong>a pack of cocaine</strong>
            <div className='amount'>0.1 ETH</div>
            <div className='rating'>
              <StarsRating
                className='d-inline-block'
                starPoint={2.3}
                startNum={5}
              />{' '}
              (25 reviews)
            </div>
          </span>
          <span className='right-part text-right'>
            <img
              src={
                'https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg'
              }
            />
          </span>
        </div>
        <div className='bottom-part'>
          <div>
            <span className='btn-chat'>
              <button className='btn' onClick={this.handleChat}>
                <img src={iconChat} />
              </button>
            </span>
            <span className='info-ex-local'>
              <div className='address'>From: 0x322</div>
              <div className='distance'>800 meters away</div>
            </span>
            <span className='buttons'>
              <button>Cancel</button>
            </span>
          </div>
        </div>
      </div>
    )
  }
}

FeedMeExchangeLocal.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string
}

const mapState = state => ({
  discover: state.discover,
  listOfferPrice: state.exchange.listOfferPrice,
  ipInfo: state.app.ipInfo,
  authProfile: state.auth.profile
})

const mapDispatch = {
  shakeOffer,
  showAlert,
  showLoading,
  hideLoading
}

export default injectIntl(connect(mapState, mapDispatch)(FeedMeExchangeLocal))
