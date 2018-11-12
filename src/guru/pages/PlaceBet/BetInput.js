import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

class BetInput extends React.Component {
  static propTypes = {
    handleBet: PropTypes.func.isRequired
  };

  static defaultProps = {};

  handleOnSubmit = (values) => {
    this.props.handleBet({ values });
  };

  renderComponent = () => {
    const initialValues = { amount: '' };
    const validationSchema = Yup.object().shape({
      amount: Yup.number().required('Required')
    });

    return (
      <div className="BetInputComponent">
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={validationSchema}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset
            } = props;
            return (
              <Form onSubmit={handleSubmit}>
                <label htmlFor="email" style={{ display: 'block' }}>
                  Email
                </label>
                <input
                  id="email"
                  placeholder="Enter your email"
                  type="text"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}

                <button
                  type="button"
                  className="outline"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </button>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>

                <DisplayFormikState {...props} />
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default BetInput;
