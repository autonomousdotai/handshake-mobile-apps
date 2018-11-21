import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'formik';
import { ErrMsg } from '@/guru/components/Form';

const RedeemCodeInput = ({ values, touched, errors, status, handleChange, handleOnBlur }) => {
  const validate = () => {
    if (status) return null;
    return 'Invalid Redeem code.';
  };
  return (
    <React.Fragment>
      <Field
        name="redeem"
        placeholder="Redeem code"
        type="text"
        autoComplete="off"
        value={values.redeem}
        onBlur={handleOnBlur}
        onChange={handleChange}
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
  disabled,
  touched,
  errors,
  buttonClasses,
  customOnChange,
  customOnBlur,
  statusRedeem,
  isUseRedeem
}) => {
  const handleOnChange = (e) => {
    handleChange(e);
    customOnChange(e);
  };
  const handleOnBlur = (e) => {
    handleBlur(e);
    customOnBlur(e);
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
          handleOnBlur={handleOnBlur}
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
      <button type="submit" disabled={isSubmitting || disabled} className={buttonClasses}>Bet</button>
    </Form>
  );
};

BetFormControls.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  disabled: PropTypes.bool,
  touched: PropTypes.object,
  errors: PropTypes.object,
  buttonClasses: PropTypes.string,
  customOnChange: PropTypes.func,
  customOnBlur: PropTypes.func,
  statusRedeem: PropTypes.bool,
  isUseRedeem: PropTypes.bool
};

BetFormControls.defaultProps = {
  isSubmitting: false,
  disabled: false,
  touched: {},
  errors: {},
  buttonClasses: undefined,
  customOnChange: undefined,
  customOnBlur: undefined,
  statusRedeem: true,
  isUseRedeem: false
};

export default BetFormControls;
