import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetch_projects } from '@/reducers/invest/action'
import { Grid, Row, Col, ProgressBar, Button } from 'react-bootstrap'
import _ from 'lodash'
import Utils from './Utils'
import './ProjectList.scss'
import createForm from '@/components/core/form/createForm'
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'
import InvestNavigation from './InvestNavigation'
import { MasterWallet } from '../../services/Wallets/MasterWallet';
import { hasLinkedWallet } from '../../reducers/invest/action';
import FormSync from './SyncBlock/FormSync';
const FormInvest = createForm({
  propsReduxForm: {
    form: 'FormInvest'
  }
})

class LinkWallet extends Component {

  constructor (props) {
    super(props)
    this.state = {
      showCode: false
    }
    this.props.hasLinkedWallet();
  }

  componentDidMount() {
    this.checkCodeExpireInterval = setInterval(() => this.checkCodeExpire(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.checkCodeExpireInterval);
  }

  checkCodeExpire(){
    if (this.state.showCode && this.state.expire > new Date()){
      this.setState({
        showCode: false,
        verifyCode: null,
        expire: null
      })
    }
  }

  async showVerifyCode () {
    //TODO: show loading icon

    //fetch data
    let verifyCode = await Utils.fetchData("http://")
    this.setState({
      showCode: true,
      verifyCode: verifyCode.verifyCode,
      expire: verifyCode.expire
    })
    //TODO: not show loading

  }

  render () {
    // render show code
    if (this.state.showCode) {
      var body = (<FormSync />)
    } else {
      var body = (
        <div>
          <label htmlFor='' className='label'>
              {'Allows you to link your Ninja wallet to Ninja trader wallet. Before starting, note that you will need to link this wallet to the trader portal so make sure you already opened the Ninja fund trader portal on your desktop.'}
            </label>
          {this.props.syncWallet && <label style={{ color: 'red', fontWeight: '400' }}>Noted: Your wallet is synced</label>}
          <Button
            className='invest-submit-button'
            size='lg'
            onClick={() => this.setState({ showCode: true })}
          >
            Start
          </Button>
          {' '}
        </div>
      )
    }

    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <div className='invest-button-form-block'>
          <FormInvest>
            {body}
          </FormInvest>
        </div>
      </div>
    )
  }
}
const mapState = state => ({
  syncWallet: state.invest && state.invest.syncWallet ? state.invest.syncWallet : false
})
const mapDispatch = { hasLinkedWallet }

export default connect(mapState, mapDispatch)(LinkWallet)
