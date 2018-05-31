import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import CreditCard from './components/CreditCard';
import Tabs from './components/Tabs';
import LevelItem from './components/LevelItem';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import localStore from '@/services/localStore';
import { URL } from '@/config';
import './Exchange.scss';
import { validate } from './validation';
import throttle from 'lodash/throttle';

import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldCleave, fieldDropdown } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';

import {
  getUserProfile, getCryptoPrice, createCCOrder,
  getUserCcLimit, getCcLimits,
} from '@/reducers/exchange/action';
import { API_URL } from '@/constants';
import CreditCardFeed from '@/pages/Exchange/components/Feed/CreditCardFeed';

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

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <CreditCardFeed />
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
