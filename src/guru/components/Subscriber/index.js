import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SubscriberForm from './Form';

class Subscriber extends React.Component {
  handleOnSubmit = (values, { resetForm }) => {
    this.props.handleSubmit({ values });
    resetForm({ amount: '' });
  };

  renderForm = (formProps) => {
    const { props } = this;
    const subscriberFromProps = {
      ...formProps,
      placeHolder: props.placeHolder,
      buttonText: props.buttonText,
      buttonClasses: props.buttonClasses
    };
    return (<SubscriberForm {...subscriberFromProps} />);
  }

  render() {
    const initialValues = { email: '' };
    const validationSchema = Yup.object().shape({
      email: Yup.string().required('Required').email('invalid email address')
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
