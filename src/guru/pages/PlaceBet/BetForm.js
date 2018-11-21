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

  handleOnBlur = (e) => {
    this.props.handleBlur(e.currentTarget.value);
  };

  renderForm = (formProps) => {
    const { props, handleOnChange, handleOnBlur } = this;
    const betFormControlsProps = {
      ...formProps,
      buttonClasses: props.buttonClasses,
      customOnChange: handleOnChange,
      customOnBlur: handleOnBlur,
      isUseRedeem: props.isUseRedeem,
      statusRedeem: props.statusRedeem
    };
    return (<BetFormControls {...betFormControlsProps} />);
  }

  render() {
    const initialValues = { amount: this.props.amount, redeem: this.props.redeem };
    return (
      <div className="BetFormComponent">
        {this.props.redeemNotice}
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={this.handleOnSubmit}
          validationSchema={validationSchema}
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default BetForm;
