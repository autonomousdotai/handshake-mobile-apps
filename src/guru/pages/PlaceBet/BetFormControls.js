import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';
import { ErrMsg } from '@/guru/components/Form';

const RedeemCodeInput = ({ values, touched, errors, status, handleOnChange }) => {
  const validate = (value) => {
    return new Promise(resolve => {
      setTimeout(resolve(status), 3000);
    }).then(err => {
      if (value === '' || err) return null;
      return 'Invalid Redeem code.';
    });
  };
  return (
    <React.Fragment>
      <Field
        name="redeem"
        placeholder="Enter redeem code here."
        type="text"
        autoComplete="off"
        value={values.redeem}
        onChange={handleOnChange}
        validate={validate}
        className={
          errors.redeem && touched.redeem
            ? 'TextInput Error'
            : 'TextInput'
        }
      />
      <ErrMsg name="redeem" />
    </React.Fragment>
  );
};

const BetFormControls = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  isValid,
  touched,
  errors,
  buttonText,
  buttonClasses,
  customOnChange,
  statusRedeem,
  isUseRedeem
}) => {
  const handleOnChange = (e) => {
    handleChange(e);
    customOnChange(e);
  };
  return (
    <Form onSubmit={handleSubmit} noValidate>
      {
        isUseRedeem &&
        <RedeemCodeInput
          values={values}
          touched={touched}
          errors={errors}
          status={statusRedeem}
          handleChange={handleChange}
          handleOnChange={handleOnChange}
        />
      }
      <input
        name="amount"
        placeholder="0.00 ETH"
        type="number"
        autoComplete="off"
        readOnly={isUseRedeem}
        value={values.amount}
        onChange={handleOnChange}
        onBlur={handleBlur}
        className={
          errors.amount && touched.amount
            ? 'TextInput Error'
            : 'TextInput'
        }
      />
      <ErrMsg name="amount" />
      <button type="submit" disabled={isSubmitting || !isValid} className={buttonClasses}>
        {buttonText}
      </button>
    </Form>
  );
};

BetFormControls.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  touched: PropTypes.object,
  errors: PropTypes.object,
  buttonClasses: PropTypes.string,
  customOnChange: PropTypes.func,
  statusRedeem: PropTypes.bool,
  isUseRedeem: PropTypes.bool
};

BetFormControls.defaultProps = {
  isSubmitting: false,
  isValid: false,
  touched: {},
  errors: {},
  buttonClasses: undefined,
  customOnChange: undefined,
  statusRedeem: true,
  isUseRedeem: false
};

export default BetFormControls;
