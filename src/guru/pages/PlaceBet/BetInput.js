import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ErrMsg } from '@/guru/components/Form';

import Debug from '../CreateEvent/Debug';
class BetInput extends React.Component {
  static propTypes = {
    handleBet: PropTypes.func.isRequired
  };

  handleOnSubmit = (values) => {
    this.props.handleBet({ values });
  };

  renderComponent = (props) => {
    const buttonClasses = classNames('btn btn-block', {
      'btn-primary': props.side === 1,
      'btn-secondary': props.side === 2
    });
    const initialValues = { amount: '' };
    const validationSchema = Yup.object().shape({
      amount: Yup.number().required('Required')
    });
    return (
      <div className="BetInputComponent">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={validationSchema}
        >
          {formProps => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit
            } = formProps;
            return (
              <Form onSubmit={handleSubmit}>
                <input
                  ref={this.amountInput}
                  name="amount"
                  placeholder="0.00 ETH"
                  type="text"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.amount && touched.amount
                      ? 'TextInput Error'
                      : 'TextInput'
                  }
                />
                <ErrMsg name="amount" />
                <button type="submit" disabled={isSubmitting} className={buttonClasses}>Bet</button>
                {/* <Debug {...formProps} /> */}
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default BetInput;
