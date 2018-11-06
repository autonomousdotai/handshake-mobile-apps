import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CustomField, ErrMsg } from '@/guru/components/Form';

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

  buildErrorCls = (errors, touched) => {
    const errFields = Object.keys(touched).filter(i => errors[i]);
    return errFields.length ? errFields.join(' ') : '';
  }

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
        <ErrMsg name="outcomeName" />
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

    const initialValues = {
      outcomeName: '',
      eventName: '',
      public: true,
      creatorFee: 0
    };

    const eventSchema = Yup.object().shape({
      outcomeName: Yup.string().required('Required'),
      eventName: Yup.string().required('Required'),
      // source: Yup.string().required('Required')
    });

    return (
      <div className={cls}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={eventSchema}
        >
          {formProps => {
            const { isSubmitting, errors, touched } = formProps;
            return (
              <Form className={this.buildErrorCls(errors, touched)}>
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
