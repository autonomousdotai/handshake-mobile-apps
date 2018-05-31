import React from 'react';
import {injectIntl} from 'react-intl';
import {formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {URL} from '@/config';
import './Exchange.scss';

import createForm from '@/components/core/form/createForm';
import {fieldCleave, fieldDropdown, fieldInput} from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';

import {createCCOrder, getCcLimits, getCryptoPrice, getUserCcLimit, getUserProfile,} from '@/reducers/exchange/action';
import {API_URL} from '@/constants';
import FeedCreditCard from "@/components/handshakes/exchange/Feed/FeedCreditCard";

const nameFormCreditCard = 'creditCard';
const FormCreditCard = createForm({
  propsReduxForm: {
    form: nameFormCreditCard,
    initialValues: { currency: 'ETH' },
  },
});
const selectorFormCreditCard = formValueSelector(nameFormCreditCard);

class Exchange extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  callbackFailed = () => {
    console.log('callbackFailed');
  }

  callbackSuccess = () => {
    console.log('callbackSuccess');
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <FeedCreditCard buttonTitle={ 'buttonTitle' } callbackFailed={this.callbackFailed} callbackSuccess={this.callbackSuccess}/>
          </div>
        </div>
      </div>
    );
    // return (
    //   <Grid>
    //     <Row>
    //       <Col xs={12}>
    //
    //       </Col>
    //     </Row>
    //   </Grid>
    // );
  }
}

const mapStateToProps = state => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits,
  amount: selectorFormCreditCard(state, 'amount'),
  currency: selectorFormCreditCard(state, 'currency'),
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Exchange));
