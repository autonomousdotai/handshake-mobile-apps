import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import CustomField from '@/guru/components/Form/CustomField';

import { createEvent } from './action';
import ReportSource from './ReportSource';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    createEvent: PropTypes.func.isRequired,
    classNames: PropTypes.string
  };

  static defaultProps = {
    classNames: ''
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnSubmit = (values/* , actions */) => {
    this.props.createEvent({ values });
  }

  buildBlockTitle = title => {
    return <p className="BlockTitle">{title}</p>;
  };

  renderHostFee = () => {
    const optionSlider = { min: 0, max: 5, tooltip: false, orientation: 'horizontal' };

    return (
      <React.Fragment>
        <Field name="creatorFee" type="rangeSlider" unit="%" className="input-value" options={optionSlider} component={CustomField} />
        <div className="CreateEventFormGroupNote">
          As a host creator, you will receive this percentage of the total bets.
          Friendly advice: no one wants to play with a greedy guts!
        </div>
      </React.Fragment>
    );
  };

  renderEventTitle = formProps => {
    const { values } = formProps;
    return (
      <div className="Block">
        {this.buildBlockTitle('Gurus will predict YES or NO')}
        <label htmlFor="outcomeName">Will</label>
        <Field
          name="outcomeName"
          placeholder="Manchester United beat Juventus"
        />
        <label htmlFor="eventName">in</label>
        <Field name="eventName" placeholder="Champions League table stage" />
        <label className="switch">
          <Field name="public" type="checkbox" checked={values.public} />
          <div className="slider round">
            <span className="on">Public</span>
            <span className="off">Private</span>
          </div>
        </label>
      </div>
    );
  };

  render() {
    const cls = cx(CreateEvent.displayName, {
      [this.props.classNames]: this.props.classNames
    });
    const initialValues = { outcomeName: '', eventName: '', public: true, creatorFee: 0 };

    return (
      <div className={cls}>
        <Formik initialValues={initialValues} onSubmit={this.handleOnSubmit}>
          {formProps => {
            const { isSubmitting } = formProps;
            return (
              <Form>
                {this.renderEventTitle(formProps)}
                <ReportSource />
                {this.renderHostFee()}
                <button type="submit" disabled={isSubmitting}>Submit</button>
                <Debug props={formProps} />
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default connect(null, { createEvent })(CreateEvent);
