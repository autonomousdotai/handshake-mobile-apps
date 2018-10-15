import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import local from '@/services/localStore';
import {APP} from '@/constants';
import { StringHelper } from '@/services/helper';
import "./Overview.scss"


class PaymentOverview extends React.Component {
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

  Overview() {
    return (
      <div className="content">
        <h3>Why apply Ninja Payment?</h3>
        <div><iframe width="100%" height="315" src="https://www.youtube.com/embed/6bd6-XtO3Wk" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe></div>
        <div className="title">
          <img src="https://bitpay.com/images/no-fees.fa98ab81.svg" width="50px" /><br/>
          Keep more of your money.
        </div>
        <p>Credit cards take up to 3% in processing fees on every transaction.
          Accept Bitcoin and Bitcoin Cash with BitPay and get direct bank deposits
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

  Features() {
    return (
      <div className="content text-left">
        <h3 className="text-center mt-5 mb-0">Platform</h3>
        <div className="title">Direct Bank Deposit </div>
        <p>Receive settlement directly to your bank account in 33 countries.</p>

        <div className="title">Cryptographically Secure API </div>
        <p>Integrate our platform for blockchain payments with secure and simple API.</p>

        <div className="title">Custom Transaction Speed Setting Options </div>
        <p>Choose from a range of options for your security and confirmation speed preferences.</p>
      </div>
    )
  }

  SellingInPerson() {
    return (
      <div className="content text-left">
        <h3 className="text-center mt-5 mb-0">Retail</h3>
        <div className="title">Payment Buttons and Hosted Checkout</div>
        <p>Add a Bitcoin and Bitcoin Cash payment option to your website - just copy and paste a few lines of script.</p>

        <div className="title">Shopping Cart Plugins</div>
        <p>Use one of our popular ecommerce plug-ins to seamlessly enable blockchain payments on your website.</p>

        <div className="title">Hosted Integrations</div>
        <p>Activate blockchain payments through your ecommerce platform provider.</p>

        <div className="title">Custom Checkout Forms and Browser Redirect URLs</div>
        <p>Direct your customers through the checkout experience and return traffic to your website after payment.</p>

        <h3 className="text-center mt-5 mb-0">In app purchase</h3>
        <div className="title">Mobile Point of Sale App</div>
        <p>Accept Bitcoin and Bitcoin Cash on phones or tablets with Ninja Payment for iOS and Android.</p>

        <div className="title">Multiple User Capability</div>
        <p>Add multiple users to Ninja Payment or enable your cashiers and servers to accept Bitcoin and Bitcoin Cash to your account on their own phones.</p>

        <div className="title">Web-Based Checkout</div>
        <p>No app, no problem. Access responsive retail invoices via the web browser on laptops, phones, and desktops.</p>
      </div>
    )
  }

  SellingOnline() {
    return (
      <div className="content text-left">
        <h3 className="text-center mt-5 mb-0">E-Commerce</h3>
        <div className="title">Payment Buttons and Hosted Checkout</div>
        <p>Add a Bitcoin and Bitcoin Cash payment option to your website - just copy and paste a few lines of script.</p>

        <div className="title">Shopping Cart Plugins</div>
        <p>Use one of our popular ecommerce plug-ins to seamlessly enable blockchain payments on your website.</p>

        <div className="title">Hosted Integrations</div>
        <p>Activate blockchain payments through your ecommerce platform provider.</p>

        <div className="title">Custom Checkout Forms and Browser Redirect URLs</div>
        <p>Direct your customers through the checkout experience and return traffic to your website after payment.</p>

        <h3 className="text-center mt-5 mb-0">In app purchase</h3>
        <div className="title">Mobile Point of Sale App</div>
        <p>Accept Bitcoin and Bitcoin Cash on phones or tablets with BitPay Checkout for iOS and Android.</p>

        <div className="title">Multiple User Capability</div>
        <p>Add multiple users to BitPay Checkout or enable your cashiers and servers to accept Bitcoin and Bitcoin Cash to your account on their own phones.</p>

        <div className="title">Web-Based Checkout</div>
        <p>No app, no problem. Access responsive retail invoices via the web browser on laptops, phones, and desktops.</p>
      </div>
    )
  }

  showMenu() {

    if(this.state.menu) {
      switch (this.state.menu) {
        case 2:
          return this.Features();
        case 3:
          return this.SellingOnline();
        case 4:
          return this.SellingInPerson();
        default:
          return this.Overview();
      }
    }

  }
  render() {

    const { messages } = this.props.intl;

    return (
      // <div className="overview-wrapper">
      //   <ul className="inline-list subnav">
      //     <li className={this.state.menu == 1 ? "active" : ""}><a onClick={() => this.setState({menu:1})}>Overview</a></li>
      //     <li className={this.state.menu == 2 ? "active" : ""}><a  onClick={() => this.setState({menu:2})}>Features</a></li>
      //     <li className={this.state.menu == 3 ? "active" : ""}><a onClick={() => this.setState({menu:3})}>Selling Online</a></li>
      //     <li className={this.state.menu == 4 ? "active" : ""}><a onClick={() => this.setState({menu:4})}>Selling In Person</a></li>
      //   </ul>
      //   {
      //     this.showMenu()
      //   }
      // </div>
      <div className="overview-wrapper"><h3 className="text-center">Coming soon</h3></div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PaymentOverview));

