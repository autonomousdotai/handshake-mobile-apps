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
  disabled,
  touched,
  errors,
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
          errors.email && touched.email
            ? 'TextInput Error'
            : 'TextInput'
        }
      />
      <ErrMsg name="email" />
      <button type="submit" disabled={isSubmitting || disabled} className={buttonClasses}>{buttonText}</button>
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
  disabled: PropTypes.bool,
  touched: PropTypes.object,
  errors: PropTypes.object,
  buttonClasses: PropTypes.string
};

SubscriberForm.defaultProps = {
  isSubmitting: false,
  disabled: false,
  touched: {},
  errors: {},
  buttonClasses: undefined
};

export default SubscriberForm;
