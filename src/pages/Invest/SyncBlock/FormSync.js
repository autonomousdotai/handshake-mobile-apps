import React from 'react';
import { connect } from 'react-redux';
import { linkWallet, resetLinkWallet } from '../../../reducers/invest/action';
import { InputGroup, Input } from 'reactstrap'
import { Button } from 'react-bootstrap'

class FormPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        }
    }

    handlePasswordChange = (e) => this.setState({ password: e.target.value })

    onSubmit = () => {
        const password = this.state.password;
        if(password.trim() === '') {
            alert('can not submit empty password');
            return
        }
        this.props.onHandleLinkWallet(password).then(r=>r).catch(err => console.log('err', err));
    }

    render() {
        return (
            <div>
                <InputGroup style={{ marginTop: 15, marginBottom: 10 }}>
                <label htmlFor='' className='label'>
                    {'Note: please create a strong password that is eight characters including one uppercase letter, one special character and alphanumeric characters. Never disclose your password to anyone as it might result in your loss'}
                </label>
                <Input type={'password'} value={this.state.password} placeholder='Enter your password' onChange={this.handlePasswordChange} />
                </InputGroup>
                <Button className='invest-submit-button' size='lg' onClick={this.onSubmit}>Submit</Button>
                {' '}
            </div>
        )
    }
}

const FormVerifiedCode = ({ verifyCode, onBack }) => (
    <div>
        <InputGroup style={{ marginTop: 10 }}>
            <label style={{ width: '100%' }} htmlFor='' className='label'>
              Your Verify Code
            </label>
            <Input readOnly value={verifyCode} />
            <Button className='invest-submit-button' size='lg' onClick={onBack} >Back</Button>
          </InputGroup>
    </div>
)

class FormSync extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formSubmited: false,
        }
    }
    handleOnBack = () => this.props.resetLinkWallet();

    componentWillUnmount() {
        this.props.resetLinkWallet();
    }
    render() {
        if (!this.props.syncedInfo)
            return <FormPassword onHandleLinkWallet={this.props.linkWallet} />
        else
            return <FormVerifiedCode onBack={this.handleOnBack} verifyCode={this.props.syncedInfo.verifyCode} />
    }
}

const mapState = state => ({
    syncedInfo: state.invest && state.invest.syncedInfo ? state.invest.syncedInfo : false
})
const mapDispatch = { linkWallet, resetLinkWallet }

export default connect(mapState, mapDispatch)(FormSync)