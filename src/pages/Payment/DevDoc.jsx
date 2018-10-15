import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import local from '@/services/localStore';
import {APP} from '@/constants';
import { StringHelper } from '@/services/helper';


class DevDoc extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      menu: 1,
    }
  }

  componentDidMount(){

  }

  code1() {
    return (
      <div className="content">
        <div className="title">
          <img src="https://bitpay.com/images/no-fees.fa98ab81.svg" width="50px" /><br/>
          Keep more of your money.
        </div>
        <p>Credit cards take up to 3% in processing fees on every transaction.
          Accept Bitcoin and Bitcoin Cash with Ninja Payment and get direct bank deposits
          in your own currency for a simple, flat 1% settlement charge.</p>

        <div className="title">
        <img src="https://bitpay.com/images/global.e6d6d38e.svg" width="50px" /><br/>
        Sell to anyone, anywhere.</div>
        <p>Connect to truly borderless payment networks with Bitcoin and Bitcoin Cash.
          Receive payment in any amount, from anywhere in the world,
          from any computer or mobile device.</p>

        <div className="title">
        <img src="https://bitpay.com/images/security.cda5a130.svg" width="50px" /><br/>
        End chargeback fraud and identity theft.</div>
        <p>Other payment methods force customers and businesses to shoulder the risks and costs of payment fraud.
          With Bitcoin ahd Bitcoin Cash, customers can pay without handing over sensitive personal information,
           and refunds are made through the merchant — no chargebacks.</p>
      </div>
    )
  }

  code2() {
    return (
      <div className="content text-left">
        <h5 className="text-center mt-5 mb-0">Platform</h5>
        <div className="title">Direct Bank Deposit </div>
        <p>Receive settlement directly to your bank account in 33 countries.</p>

        <div className="title">Cryptographically Secure API </div>
        <p>Integrate our platform for blockchain payments with secure and simple API.</p>

        <div className="title">Custom Transaction Speed Setting Options </div>
        <p>Choose from a range of options for your security and confirmation speed preferences.</p>
      </div>
    )
  }

  code3() {
    return (
      <div className="content text-left">
        <h5 className="text-center mt-5 mb-0">In app purchase</h5>
        <div className="title">Mobile Point of Sale App</div>
        <p>Accept Bitcoin and Bitcoin Cash on phones or tablets with Ninja Payment for iOS and Android.</p>

        <div className="title">Multiple User Capability</div>
        <p>Add multiple users to Ninja Payment or enable your cashiers and servers to accept Bitcoin and Bitcoin Cash to your account on their own phones.</p>

        <div className="title">Web-Based Checkout</div>
        <p>No app, no problem. Access responsive retail invoices via the web browser on laptops, phones, and desktops.</p>
      </div>
    )
  }

  code4() {
    return (
      <div className="content text-left">
        <h5 className="text-center mt-5 mb-0">E-Commerce</h5>
        <div className="title">Payment Buttons and Hosted Checkout</div>
        <p>Add a Bitcoin and Bitcoin Cash payment option to your website - just copy and paste a few lines of script.</p>

        <div className="title">Shopping Cart Plugins</div>
        <p>Use one of our popular ecommerce plug-ins to seamlessly enable blockchain payments on your website.</p>

        <div className="title">Hosted Integrations</div>
        <p>Activate blockchain payments through your ecommerce platform provider.</p>

        <div className="title">Custom Checkout Forms and Browser Redirect URLs</div>
        <p>Direct your customers through the checkout experience and return traffic to your website after payment.</p>
      </div>
    )
  }

  showMenu() {

    if(this.state.menu) {
      switch (this.state.menu) {
        case 2:
          return this.code2();
        case 3:
          return this.code3();
        case 4:
          return this.code4();
        default:
          return this.code1();
      }
    }

  }
  render() {

    const { messages } = this.props.intl;

    return (
      <div className="overview-wrapper">
        <ul className="inline-list subnav">
          <li><a className={this.state.menu == 1 ? "active" : ""} onClick={() => this.setState({menu:1})}>Code 1</a></li>
          <li><a className={this.state.menu == 2 ? "active" : ""} onClick={() => this.setState({menu:2})}>Code 2</a></li>
          <li><a className={this.state.menu == 3 ? "active" : ""} onClick={() => this.setState({menu:3})}>Code 3</a></li>
          <li><a className={this.state.menu == 4 ? "active" : ""} onClick={() => this.setState({menu:4})}>Code 4</a></li>
        </ul>
        {
          this.showMenu()
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DevDoc));

