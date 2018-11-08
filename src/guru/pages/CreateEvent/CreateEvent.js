import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { CustomField, ErrMsg, Switch } from '@/guru/components/Form';

import { createEvent } from './action';
import ReportSource from './ReportSource';
import Notification from './Notification';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    createEvent: PropTypes.func.isRequired
  };

  handleOnSubmit = (values /* , actions */) => {
    this.props.createEvent({ values });
  };

  buildBlockTitle = title => {
    return <p className="BlockTitle">{title}</p>;
  };

  buildErrorCls = (errors, touched) => {
    const errFields = Object.keys(touched).filter(i => errors[i]);
    return errFields.length ? errFields.join(' ') : '';
  };

  renderEventTitle = formProps => {
    return (
      <div className="EventTitle">
        {this.buildBlockTitle('Gurus will predict YES or NO')}
        <div className="OutcomeName">
          <label htmlFor="outcomeName">Will</label>
          <Field
            name="outcomeName"
            placeholder="Manchester United beat Juventus"
          />
          <ErrMsg name="outcomeName" />
        </div>
        <div className="EventName">
          <label htmlFor="eventName">in</label>
          <Field name="eventName" placeholder="Champions League table stage" />
          <ErrMsg name="eventName" />
        </div>
      </div>
    );
  };

  renderPublicSwitcher = ({ values }) => {
    return (
      <div className="PublicSwitcher">
        <label htmlFor="public">Who can see this</label>
        <Switch onText="Public" offText="Private" checked={values.public} />
      </div>
    );
  };

  renderHostFee = () => {
    const optionSlider = {
      min: 0,
      max: 5,
      unit: '%',
      tooltip: false,
      orientation: 'horizontal'
    };

    return (
      <div className="HostFee">
        <label htmlFor="creatorFee">Host fee</label>
        <Field
          name="creatorFee"
          type="rangeSlider"
          unit="%"
          className="input-value"
          options={optionSlider}
          component={CustomField}
        />
        <div className="CreateEventFormGroupNote">
          As a host creator, you will receive this percentage of the total bets.
          Friendly advice: no one wants to play with a greedy guts!
        </div>
      </div>
    );
  };

  renderPicker = (props, startDate) => {
    const val = moment.unix(props.value || startDate);
    return (
      <div className="ClosingTime">
        <span className="Month">{val.format('MMM')}</span>
        <span className="Day">{val.format('DD')}</span>
        <span className="Year">{val.format('YYYY')}</span>
      </div>
    );
  };

  renderDateTime = () => {
    const startDate = moment()
      .add(60, 'm')
      .unix();
    return (
      <Field
        name="closingTime"
        type="datetime"
        component={CustomField}
        title="Event closing time"
        placeholder="Event closing time"
        startDate={startDate}
        renderTrigger={props => this.renderPicker(props, startDate)}
      />
    );
  };

  render() {
    const initialValues = {
      outcomeName: '',
      eventName: '',
      public: true,
      creatorFee: 0,
      email: '',
      emailCode: ''
    };

    const eventSchema = Yup.object().shape({
      outcomeName: Yup.string().required('Required'),
      eventName: Yup.string().required('Required'),
      // source: Yup.string().required('Required')
      email: Yup.string()
        .required('Required')
        .email('invalid email address'),
      emailCode: Yup.string()
        .required('Required')
        .matches(/^[0-9]{4}/, 'invalid Code')
    });

    return (
      <div className={CreateEvent.displayName}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={eventSchema}
        >
          {formProps => {
            const { isSubmitting, errors, touched, values } = formProps;
            return (
              <Form className={this.buildErrorCls(errors, touched)}>
                <div className="FormBlock">
                  {this.renderEventTitle(formProps)}
                  <div className="BlankLine" />
                  {this.renderPublicSwitcher(formProps)}
                </div>
                <div className="FormBlock">
                  {this.renderHostFee()}
                  <ReportSource />
                </div>
                <div className="FormBlock">
                  {this.renderDateTime()}
                  <Notification formProps={formProps} />
                </div>
                <button
                  className="SubmitBtn btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create
                </button>
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
