import React from 'react';
import { Formik } from 'formik';
import { validationSchema } from './validation';
import BetFormControls from './BetFormControls';

class BetForm extends React.Component {
  handleOnSubmit = (values) => {
    this.props.handleBet({ values });
  };

  handleOnChange = (e) => {
    this.props.handleChange(e.target);
  };

  renderForm = (formProps) => {
    const { props, handleOnChange } = this;
    const betFormControlsProps = {
      ...formProps,
      buttonText: props.buttonText,
      buttonClasses: props.buttonClasses,
      customOnChange: handleOnChange,
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
          validateOnChange
          render={this.renderForm}
        />
      </div>
    );
  }
}

export default BetForm;
