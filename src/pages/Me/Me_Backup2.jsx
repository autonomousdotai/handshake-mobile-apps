import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
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
import { FormattedMessage, injectIntl } from 'react-intl'
import cx from 'classnames';
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action'
// style
import { setOfflineStatus } from '@/reducers/auth/action'
import { fieldRadioButton } from '@/components/core/form/customField'
import createForm from '@/components/core/form/createForm'

import './Me.scss'
import { change } from 'redux-form'
import Overview from './Tabs/Overview'
import Transaction from './Tabs/Transaction'
import ManageAssets from './Tabs/ManageAssets'

const nameFormFilterFeeds = 'formFilterFeeds'
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds
  }
})

const tabs = [
  {
    id: 'overview',
    text: <FormattedMessage id="dashboard.label.overview" />,
    component: ManageAssets,
  },
  // {
  //   id: 'overview',
  //   text: <FormattedMessage id="dashboard.label.overview" />,
  //   component: Overview,
  // },
  {
    id: 'transaction',
    text: <FormattedMessage id="dashboard.label.transaction" />,
    component: Transaction,
  },
]

class Me extends React.Component {

  state = {
    activeTab: 'overview',
  }

  render () {

    const { activeTab } = this.state;

    const { component: Component } = tabs.find(i => i.id === activeTab);

    return (
      <div className="dashboard">
        <div className="bg-white">
          <button className="btn btn-lg bg-transparent d-inline-block btn-close">
            &times;
          </button>
          <div className="wrapper">
            <h4><FormattedMessage id="dashboard.heading" /></h4>
            <div className="tabs mt-3">
              {
                tabs.map(tab => {
                  const { id, text } = tab;
                  return (
                    <div
                      key={id}
                      onClick={() => this.setState({ activeTab: id })}
                      className={cx('tab text-normal', { active: activeTab === id })}
                    >
                      {text}
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="content">
          {<Component history={this.props.history}></Component>}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  me: state.me
})

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch)
})

export default injectIntl(compose(withFirebase, connect(mapState, mapDispatch))(Me))
