import React from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import { Tooltip } from 'reactstrap';
import { CustomField, ErrMsg, Switch } from '@/guru/components/Form';
import Loading from '@/components/Loading';
import AppBar from '@/guru/components/AppBar/AppBar';
import { isURL } from '@/utils/string';
import { getAddress } from '@/components/handshakes/betting/utils';

import { apiCreateEvent } from './action';
import ShareMarket from './ShareMarket';
import ReportSource from './ReportSource';
import Notification from './Notification';
import ImageUpload from './ImageUpload';
import Debug from './Debug';
import './CreateEvent.scss';

class CreateEvent extends React.Component {
  static displayName = 'CreateEvent';
  static propTypes = {
    apiCreateEvent: PropTypes.func.isRequired,
    email: PropTypes.string,
    verified: PropTypes.number
  };

  static defaultProps = {
    email: '',
    verified: 0
  };

  state = {
    titleToolTip: false,
    createSuccess: false
  };

  onKeyDownEventName = (e) => {
    /* eslint-disable no-param-reassign */
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    /* eslint-enable no-param-reassign */
  };

  setFieldToState = (fieldName, value) => {
    this.setState({
      [fieldName]: value
    });
  };

  handleName = (str) => {
    const l = str.length - 1;
    return (str.charAt(l) === '?') ? str.substring(0, l - 1) : str;
  }

  handleOnSubmit = values => { // values, actions
    const { id, value } = values.source;
    const reportSource = id ? { source_id: id } : {
      source: { name: value, url: value }
    };
    const event_name = values.eventName.trim();

    const newEventData = {
      // outcome_name: values.outcomeName,
      event_name,
      name: `Will ${this.handleName(event_name)}?`,
      public: values.public,
      date: values.closingTime,
      reportTime: values.closingTime + 86400, // (24 * 60 * 60) - 24h
      disputeTime: values.closingTime + 90000, // (24 * 60 * 60) + (60 * 60) - 25h
      market_fee: values.marketFee,
      grant_permission: true,
      category_id: 7,
      creator_wallet_address: getAddress(),
      ...reportSource
    };
    console.log('newEventData', newEventData);
    const formData = new FormData();
    formData.set('data', JSON.stringify(newEventData));
    formData.set('image', values.image);
    this.props.apiCreateEvent({ data: formData })
      .then(res => {
        console.log('res', res);
        this.setState({ createSuccess: true });
      })
      .catch(e => {
        console.error(e);
      });
  };


  buildErrorCls = (errors, touched) => {
    const errFields = Object.keys(touched).filter(i => errors[i]);
    return errFields.length ? errFields.join(' ') : '';
  };

  renderEventTitle = (state) => {
    return (
      <div className="EventTitle">
        <div className="GroupTitle">
          Ninjas will predict YES or NO
          <i className="far fa-question-circle" id="TitleTT" />
        </div>
        <Tooltip
          isOpen={state.titleToolTip}
          target="TitleTT"
          toggle={() => this.setFieldToState('titleToolTip', !state.titleToolTip)}
        >
          Start the debate with a yes/no question.
          Your question should clearly state the date and situation where the proposed outcome will happen.
          <br />
          Eg:<br />
          - Will BTC price go above $6000 by the end of 2018?<br />
          - Will Manchester United beat Crystal Palace in Premier League Nov 24 2018?
        </Tooltip>
        <div className="EventName">
          <label htmlFor="eventName">Will</label>
          <Field
            rows={1}
            onKeyDown={this.onKeyDownEventName}
            name="eventName"
            component="textarea"
            // placeholder="A win B in C tomorrow"
          />
        </div>
        <ErrMsg name="eventName" />
        <div className="GroupNote">
          E.g. <b>Will</b> Manchester United beat Juventus <b>in</b> Champions League table stage?
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
        <div className="GroupTitle">Host fee</div>
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
        <div className="GroupTitle">Report</div>
        <div className="GroupNote">
          You must report the result using the link sent to your email within 24hrs of the closing time.
          Which website will you use to verify the result?
        </div>
        <ReportSource />
        <div className="GroupNote">
          There will be a 1hr dispute window after the reporting time.
        </div>
      </div>
    );
  };

  renderPicker = (props, startDate) => {
    const val = moment.unix(props.value || startDate);
    return (
      <div className="ClosingTime">
        <span className="DMY">{val.format('MMMM Do, YYYY')}</span>
        <span className="Separator" />
        <span className="HM">{val.format('HH:mm')}</span>
      </div>
    );
  };

  renderDateTime = startDate => {
    return (
      <div className="DateTime">
        <div className="GroupTitle">Add a closing time</div>
        <div className="GroupNote">
          When will the event close?
        </div>
        <Field
          name="closingTime"
          type="datetime"
          component={CustomField}
          title="Event closing time"
          placeholder="Event closing time"
          startDate={startDate}
          renderTrigger={props => this.renderPicker(props, startDate)}
        />
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
    const { email, verified } = this.props;
    if (this.state.createSuccess) {
      return <ShareMarket />;
    }

    const initialClosingTime = moment()
      .add(60, 'm')
      .unix();

    const initialValues = {
      // outcomeName: '',
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
      // outcomeName: Yup.string().trim().required('Required'),
      closingTime: Yup.string().required('Required'), // validate at least 24 hours
      image: Yup.mixed()
        .test('image', 'invalid file type', f => {
          return !f ? true : /(gif|jpe?g|png)$/i.test(f.type);
        })
        .test('image', 'Exceeding maximum upload file size (5MB)', f => {
          return !f ? true : (f.size < (5 * 1024 * 1024));
        }),
      source: Yup.object({
        label: Yup.string()
          .trim()
          .required('Required')
          .test('source', 'invalid URL', l => {
            return !l ? true : isURL(l);
          })
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
                  {this.renderEventTitle(this.state)}
                  <div className="BlankLine" />
                  {this.renderPublicSwitcher(formProps)}
                </div>
                <div className="FormBlock">
                  {this.renderDateTime(initialClosingTime)}
                  <div className="BlankLine" />
                  {this.renderReportSource()}
                </div>
                <div className="FormBlock">
                  {this.renderHostFee()}
                  <div className="BlankLine" />
                  <ImageUpload form={formProps} />
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
                <Prompt when={dirty} message="Are you sure you want to leave?" />
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
  };
}, { apiCreateEvent })(CreateEvent);
