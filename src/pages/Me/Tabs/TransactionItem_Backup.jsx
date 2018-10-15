import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action'
import {
  API_URL,
  APP,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL
} from '@/constants'
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl'
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action'
// style
import { setOfflineStatus } from '@/reducers/auth/action'
import createForm from "@/components/core/form/createForm";
import { change, Field } from 'redux-form';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconChevronDown from '@/assets/images/icon/icons8-chevron_down.svg';
import iconChevronRight from '@/assets/images/icon/icons8-chevron_right.svg';
import iconUser from '@/assets/images/icon/icons8-user.svg';
import iconLogo from '@/assets/images/icon/logo.svg';
import iconThumbsUp from '@/assets/images/icon/icons8-thumbs_up.svg';
import iconMarker from '@/assets/images/icon/icons8-marker_red.svg';
import iconPhone from '@/assets/images/icon/icons8-phone_black.svg';
import iconChat from '@/assets/images/icon/icon_chat.svg';

class TransactionItem extends React.Component {

  state = {
    isExpanded: false
  }

  handleExpandCollapse = () => {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: !isExpanded
    })
  }
  render () {
    const { date } = this.props;
    const { isExpanded } = this.state;
    return (
      <div className="transaction">
        <div className="text-normal" style={{ padding: '0 15px' }}>{date}</div>
        <div className="transaction-detail">
          <div className="d-table w-100">
            <div className="d-table-cell font-weight-bold">
              <img src={iconBitcoin} width={19} />
              <span className="type-order ml-2">PURCHASE ORDER</span>
            </div>
            <div className="d-table-cell text-right">
              <img src={iconSpinner} width="14px" />
              <span className="status ml-2">Processing...</span>
            </div>
          </div>

          <div className="text-normal mt-2">
            Be patient - it can take a couple of minutes for your coin to be sent to escrow
          </div>

          <hr />


          <div className="d-table w-100">
            <div className="d-table-cell text-normal">
              Desired amount
            </div>
            <div className="d-table-cell text-right">
              <span className="font-weight-bold">5.00</span>
              &nbsp;
              <span className="text-normal">BTC</span>
            </div>
          </div>

          <div className="d-table w-100">
            <div className="d-table-cell text-normal">
              Price
            </div>
            <div className="d-table-cell text-right">
              <span className="font-weight-bold">50000</span>
              &nbsp;
              <span className="text-normal">USD</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="d-inline-block w-50 pr-1">
              <button className="btn primary-button btn-block">Main action</button>
            </div>
            <div className="d-inline-block w-50 pl-1">
              <button className="btn danger-button btn-block">Cancel</button>
            </div>
          </div>

          <div className="mt-3">
            <div className="d-table w-100" onClick={this.handleExpandCollapse}>
              <div className="d-table-cell" style={{ width: '28px' }}>
                <img src={iconUser} width={18} />
              </div>
              <div className="d-table-cell">
                <span className="text-normal" style={{ verticalAlign: 'sub' }}>Seller info</span>
              </div>
              <div className="d-table-cell text-right">
                <button className="btn bg-transparent">
                  <img src={isExpanded ? iconChevronDown : iconChevronRight } width={18} />
                </button>
              </div>
            </div>
            {
              isExpanded && (
                <div>

                  <hr />

                  <div className="media">
                    <img className="mr-2" src={iconLogo} width={20} />
                    <div className="media-body text-black font-weight-normal">Nguyen Van A</div>
                  </div>

                  <div className="media mt-2">
                    <img className="mr-2" src={iconThumbsUp} width={20} />
                    <div className="media-body text-black font-weight-normal">
                      <div><StarsRating className="d-inline-block" starPoint={2.74} startNum={5} /></div>
                    </div>
                  </div>

                  <div className="media mt-2">
                    <img className="mr-2" src={iconMarker} width={20} />
                    <div className="media-body text-black font-weight-normal">
                      138 Hong Ha, Phu Nhuan
                    </div>
                  </div>

                  <div className="media mt-2">
                    <img className="mr-2" src={iconPhone} width={20} />
                    <div className="media-body text-black font-weight-normal">
                      09293131323
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="btn d-inline-block button-chat rounded-circle">
                      <img src={iconChat} width={32} height={42} />
                    </button>
                  </div>
                </div>
              )
            }
          </div>

        </div>
      </div>
    )
  }
}

const mapState = state => ({
  // me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(connect(mapState, mapDispatch)(TransactionItem))
