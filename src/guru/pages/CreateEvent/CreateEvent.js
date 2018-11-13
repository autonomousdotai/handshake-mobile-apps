import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { CustomField, ErrMsg, Switch, Thumbnail } from '@/guru/components/Form';
import DefaultEvent from '@/assets/images/pex/create/default-event.svg';
import { isURL } from '@/utils/string';
import Loading from '@/components/Loading';

import { createEvent } from './action';
import ShareMarket from './ShareMarket';
import ReportSource from './ReportSource';
import Notification from './Notification';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    createEvent: PropTypes.func.isRequired,
    email: PropTypes.string,
    shareEvent: PropTypes.object
  };

  static defaultProps = {
    email: '',
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
        <p className="GroupTitle">Gurus will predict YES or NO</p>
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
          As a host creator, you will receive this percentage of the total bets.
          Friendly advice: no one wants to play with a greedy guts!
        </div>
      </div>
    );
  };

  renderImageUpload = ({ values, setFieldValue }) => {
    return (
      <div className="ImageUpload">
        <div className="BlockLeft">
          <label htmlFor="image" className="GroupTitle">
            Image
          </label>
          <div className="GroupNote">
            Upload an image for your debates (optional)
          </div>
        </div>
        <div className="BlockRight">
          <input
            name="image"
            type="file"
            className="FileInput"
            onChange={e => {
              setFieldValue('image', e.currentTarget.files[0]);
            }}
          />
          <Thumbnail file={values.image} defaultImage={DefaultEvent} />
        </div>
        <ErrMsg name="image" />
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
          You must report the result to close the bet and get your fee.
        </div>
        <ReportSource />
      </div>
    );
  };

  renderPicker = (props, startDate) => {
    const val = moment.unix(props.value || startDate);
    return (
      <div className="ClosingTime">
        {/* <input type="text" name="closingTime" defaultValue={val} {...props.field} /> */}
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
            Add a report deadline
          </label>
          <div className="GroupNote">
            As the host, you will be the reporter of the result. The quicker the
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

  render() {
    const { email, shareEvent } = this.props;
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
      email,
      closingTime: initialClosingTime, // TODO: Set to current
      image: '',
      source: ''
    };

    const validateEmail = email
      ? {}
      : {
        email: Yup.string()
          .required('Required')
          .email('invalid email address'),
        emailCode: Yup.string()
          .required('Required')
          .matches(/^[0-9]{4}/, 'invalid Code')
      };

    const eventSchema = Yup.object().shape({
      eventName: Yup.string().trim().required('Required'),
      outcomeName: Yup.string().trim().required('Required'), // should not = eventName
      closingTime: Yup.string().required('Required'), // validate at least 24 hours
      image: Yup.mixed().test('image', 'invalid file type', f => {
        return !f ? true : /(gif|jpe?g|png)$/i.test(f.type);
      }),
      source: Yup.mixed()
        .required('Required')
        .test('source', 'invalid URL', s => {
          return !s ? true : isURL((s || {}).label); // validate create first time
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
                <Loading isLoading={isSubmitting} />
                <div className="FormBlock">
                  {this.renderEventTitle(formProps)}
                  <div className="BlankLine" />
                  {this.renderPublicSwitcher(formProps)}
                </div>
                <div className="FormBlock">
                  {this.renderHostFee()}
                  <div className="BlankLine" />
                  {this.renderImageUpload(formProps)}
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
                  disabled={
                    isSubmitting || !dirty || !Object.keys(errors).length
                  }
                >
                  Create
                </button>
                <Debug props={formProps} hide />
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
    shareEvent: state.guru.ui.shareEvent
  };
}, { createEvent })(CreateEvent);
