import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { CustomField, ErrMsg, Switch } from '@/guru/components/Form';
import Loading from '@/components/Loading';
import AppBar from '@/guru/components/AppBar/AppBar';

import { createEvent } from './action';
import ShareMarket from './ShareMarket';
import ReportSource from './ReportSource';
import Notification from './Notification';
import ImageUpload from './ImageUpload';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    createEvent: PropTypes.func.isRequired,
    email: PropTypes.string,
    verified: PropTypes.number,
    shareEvent: PropTypes.object
  };

  static defaultProps = {
    email: '',
    verified: 0,
    shareEvent: undefined
  };

  handleOnSubmit = values => {
    // values, actions
    this.props.createEvent({ values });
  };

  buildErrorCls = (errors, touched) => {
    const errFields = Object.keys(touched).filter(i => errors[i]);
    return errFields.length ? errFields.join(' ') : '';
  };

  renderEventTitle = () => {
    return (
      <div className="EventTitle">
        <p className="GroupTitle">Ninjas will predict YES or NO</p>
        <div className="OutcomeName">
          <label htmlFor="outcomeName">Will</label>
          <Field
            name="outcomeName"
            component="textarea"
            placeholder="[Outcome] Manchester United beat Juventus"
          />
        </div>
        <ErrMsg name="outcomeName" />
        <div className="EventName">
          <label htmlFor="eventName">in</label>
          <Field
            name="eventName"
            component="textarea"
            placeholder="[Event] Champions League table stage"
          />
        </div>
        <ErrMsg name="eventName" />
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
        <label htmlFor="marketFee" className="GroupTitle">
          Host fee
        </label>
        <Field
          name="marketFee"
          type="rangeSlider"
          unit="%"
          className="input-value"
          options={optionSlider}
          component={CustomField}
        />
        <div className="GroupNote">
          As a host of this debate, you'll receive this % of the all matched predictions.
          Friendly advice: no one wants to play with a greedy guts!
        </div>
      </div>
    );
  };

  renderReportSource = () => {
    return (
      <div className="ReportSource">
        <label htmlFor="source" className="GroupTitle">
          Report
        </label>
        <div className="GroupNote">
          You must provide the reference link to the report
        </div>
        <ReportSource />
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
        <span className="Hour">{val.format('HH:mm')}</span>
      </div>
    );
  };

  renderDateTime = startDate => {
    return (
      <div className="DateTime">
        <div className="BlockLeft">
          <label htmlFor="source" className="GroupTitle">
            Add a closing time
          </label>
          <div className="GroupNote">
            As the host, you will submit the closing time. The quicker the
            better!
          </div>
        </div>
        <div className="BlockRight">
          <Field
            name="closingTime"
            type="datetime"
            component={CustomField}
            title="Event closing time"
            placeholder="Event closing time"
            startDate={startDate}
            renderTrigger={props => this.renderPicker(props, startDate)}
          />
        </div>
        <ErrMsg name="closingTime" />
      </div>
    );
  };

  renderAppBar = (props) => {
    return (
      <AppBar>
        <span
          className="IconLeft BackAction"
          onClick={() => {
            props.history.go(-1);
          }}
        >
          <i className="far fa-angle-left" />
        </span>
        <span className="Title">Host a debate</span>
      </AppBar>
    );
  };

  render() {
    const { email, verified, shareEvent } = this.props;
    if (shareEvent) {
      return <ShareMarket shareEvent={shareEvent} />;
    }

    const initialClosingTime = moment()
      .add(60, 'm')
      .unix();

    const initialValues = {
      outcomeName: '',
      eventName: '',
      public: true,
      marketFee: 0,
      email: verified ? email : '',
      emailCode: '',
      closingTime: initialClosingTime, // TODO: Set to current
      image: '',
      source: ''
    };

    const validateEmail = (email && verified) ? {}
      : {
        email: Yup.string().required('Required').email('invalid email address'),
        emailCode: Yup.string().required('Required').matches(/^[0-9]{4}/, 'invalid Code')
      };

    const eventSchema = Yup.object().shape({
      eventName: Yup.string().trim().required('Required'),
      outcomeName: Yup.string().trim().required('Required'),
      closingTime: Yup.string().required('Required'), // validate at least 24 hours
      image: Yup.mixed()
        .test('image', 'invalid file type', f => {
          return !f ? true : /(gif|jpe?g|png)$/i.test(f.type);
        })
        .test('image', 'Exceeding maximum upload file size (5MB)', f => {
          return !f ? true : (f.size < (5 * 1024 * 1024));
        }),
      source: Yup.object({
        label: Yup.string().trim().required('Required').url('invalid URL')
      }),
      ...validateEmail
    });

    return (
      <div className={CreateEvent.displayName}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleOnSubmit}
          validationSchema={eventSchema}
        >
          {formProps => {
            const { isSubmitting, errors, touched, dirty } = formProps;
            return (
              <Form className={this.buildErrorCls(errors, touched)}>
                {this.renderAppBar(this.props)}
                <Loading isLoading={isSubmitting} />
                <div className="FormBlock">
                  {this.renderEventTitle(formProps)}
                  <div className="BlankLine" />
                  {this.renderPublicSwitcher(formProps)}
                </div>
                <div className="FormBlock">
                  {this.renderHostFee()}
                  <div className="BlankLine" />
                  <ImageUpload form={formProps} />
                </div>
                <div className="FormBlock">
                  {this.renderReportSource()}
                  <div className="BlankLine" />
                  {this.renderDateTime(initialClosingTime)}
                </div>
                <div className="FormBlock">
                  <Notification formProps={formProps} />
                </div>
                <button
                  className="SubmitBtn btn-primary"
                  type="submit"
                  disabled={isSubmitting || !dirty}
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

export default connect((state) => {
  return {
    email: state.auth.profile.email,
    verified: state.auth.profile.verified,
    shareEvent: state.guru.ui.shareEvent
  };
}, { createEvent })(CreateEvent);
