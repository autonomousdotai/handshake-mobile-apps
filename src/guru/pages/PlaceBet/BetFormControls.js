import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formik';
import { ErrMsg } from '@/guru/components/Form';

const BetFormControls = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
  buttonClasses,
  customOnChange
}) => {
  const handleOnChange = (e) => {
    handleChange(e);
    customOnChange(e);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <input
        name="amount"
        placeholder="0.00 ETH"
        type="text"
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
      <button type="submit" disabled={isSubmitting} className={buttonClasses}>Bet</button>
    </Form>
  );
};

BetFormControls.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  touched: PropTypes.object,
  errors: PropTypes.object,
  buttonClasses: PropTypes.string,
  customOnChange: PropTypes.func
};

BetFormControls.defaultProps = {
  isSubmitting: false,
  touched: {},
  errors: {},
  buttonClasses: undefined,
  customOnChange: undefined
};

export default BetFormControls;
