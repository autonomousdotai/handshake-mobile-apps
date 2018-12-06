import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formik';
import { ErrMsg } from '@/guru/components/Form';

const SubscriberForm = ({
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  isValid,
  touched,
  errors,
  status,
  placeHolder,
  buttonText,
  buttonClasses
}) => {
  return (
    <Form onSubmit={handleSubmit} noValidate>
      <input
        name="email"
        placeholder={placeHolder}
        type="email"
        autoComplete="off"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={
          errors.email && touched.email ? 'TextInput Error' : 'TextInput'
        }
      />
      {status && status.msg && <div className="ErrMsg">{status.msg}</div>}
      <ErrMsg name="email" />
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className={buttonClasses}
      >
        {isSubmitting ? 'Loading...' : buttonText}
      </button>
    </Form>
  );
};

SubscriberForm.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  placeHolder: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  status: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  buttonClasses: PropTypes.string
};

SubscriberForm.defaultProps = {
  isSubmitting: false,
  isValid: false,
  status: {},
  touched: {},
  errors: {},
  buttonClasses: undefined
};

export default SubscriberForm;
