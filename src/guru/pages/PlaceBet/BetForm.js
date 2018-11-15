import React from 'react';
import { Formik } from 'formik';
import { validationSchema } from './validation';
import BetFormControls from './BetFormControls';

class BetForm extends React.Component {
  handleOnSubmit = (values, { resetForm }) => {
    this.props.handleBet({ values });
    resetForm({ amount: '' });
  };

  handleOnChange = (e) => {
    this.props.handleChange(e.currentTarget.value);
  };

  renderForm = (formProps) => {
    const { props, handleOnChange } = this;
    const betFormControlsProps = {
      ...formProps,
      buttonClasses: props.buttonClasses,
      customOnChange: handleOnChange
    };
    return (<BetFormControls {...betFormControlsProps} />);
  }

  render() {
    const initialValues = { amount: this.props.amount };
    return (
      <div className="BetFormComponent">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={validationSchema}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default BetForm;
