import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SubscriberForm from './Form';

class Subscriber extends React.Component {
  static defaultProps = {
    buttonText: 'Submit',
    placeHolder: ''
  };

  handleOnSubmit = (values, { setErrors }) => {
    this.props.handleSubmit({ values });
    if (!this.props.statusSubscribe) {
      setErrors({ email: 'Your email is already registered' });
    }
  };

  renderForm = formProps => {
    const { props } = this;
    const subscriberFromProps = {
      ...formProps,
      isSubmitting: props.isSubmitting,
      placeHolder: props.placeHolder,
      buttonText: props.buttonText,
      buttonClasses: props.buttonClasses
    };
    return <SubscriberForm {...subscriberFromProps} />;
  };

  render() {
    const initialValues = { email: '' };
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email address')
    });
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={this.handleOnSubmit}
        validationSchema={validationSchema}
        render={this.renderForm}
      />
    );
  }
}

export default Subscriber;
