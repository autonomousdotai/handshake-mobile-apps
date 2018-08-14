import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { reduxForm, Field, FieldArray } from 'redux-form';
import IconPlus from '@/assets/images/icon/icon-plus.svg';
import IconTrash from '@/assets/images/icon/icon-trash.svg';
import Dropdown from '@/components/core/controls/Dropdown';
import RangeSlider from '@/components/RangeSlider/RangeSlider';
import AutoSuggestion from '@/components/AutoSuggestion/AutoSuggestion';
import moment from 'moment';
import DateTimePicker from '@/components/DateTimePicker/DateTimePicker';
import { renderField } from './form';
import { required, urlValidator, intValidator, smallerThan } from './validate';
import { createEvent } from './action';
import ShareMarket from './ShareMarket';

const minStep = 15;
const secStep = minStep * 60;

class CreateEventForm extends Component {
  static displayName = 'CreateEventForm';
  static propTypes = {
    className: PropTypes.string,
    reportList: PropTypes.array,
    isNew: PropTypes.bool,
    initialValues: PropTypes.object,
    shareEvent: PropTypes.object,
    eventList: PropTypes.array,
  };

  static defaultProps = {
    className: '',
    reportList: undefined,
    isNew: true,
    initialValues: {},
    shareEvent: null,
    eventList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      closingTime: props.initialValues.closingTime,
      reportingTime: props.initialValues.reportingTime,
      disputeTime: props.initialValues.disputeTime,
      selectedReportSource: undefined,
    };
  }

  onCreateNewEvent = (values, dispatch, props) => {
    console.log('CreateNew', values);
    // dispatch(createEvent({
    //   values,
    //   isNew: props.isNew,
    //   selectedSource: this.state.selectedReportSource,
    // }));
  }

  setFieldValueToState = (fieldName, value) => {
    this.setState({
      [fieldName]: value,
    });
  }

  addMoreOutcomes = (fields) => {
    const isValid = fields.getAll().every(o => {
      return o.name && o.name.trim();
    });
    if (isValid) {
      fields.push({});
    }
  }

  unixToDateFormat = (value) => {
    if (!value) return value;
    return moment.unix(value).format('DD MMMM YYYY HH:mm');
  }

  buildPicker = ({ inputProps, value }) => {
    return (
      <div className="rmc-picker-date-time">
        <input
          className="form-control"
          {...inputProps}
          value={this.unixToDateFormat(value)}
        />
      </div>
    );
  }

  buildEventSelectorData = (props) => {
    return props.eventList.map((event) => {
      return {
        ...event,
        value: event.name,
      };
    }).concat({
      id: 0,
      value: 'Create a new event',
    }).sort((a, b) => a.id - b.id);
  }

  smallerThanReportingTime = (value) => {
    if (!this.state.reportingTime) return null;
    return (value + secStep) <= this.state.reportingTime ? null
      : `Closing time must be before Reporting Time at least ${minStep}min`;
  }

  smallerThanDisputeTime = (value) => {
    if (!this.state.disputeTime) return null;
    return (value + secStep) <= this.state.disputeTime ? null
      : `Reporting time must be before Dispute Time at least ${minStep}min`;
  }

  renderGroupTitle = (title) => {
    return (<div className="CreateEventFormGroupTitle">{title}</div>);
  }

  renderGroupNote = (text) => {
    return (<div className="CreateEventFormGroupNote">{text}</div>);
  }

  renderEventDropdownList = (props, state) => {
    const title = 'EVENT';
    const { shareEvent } = props;
    if (shareEvent) return null;
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Dropdown
          placeholder="Create a new event"
          className="EventDropdown"
          defaultId={state.selectedEvent}
          source={this.buildEventSelectorData(props)}
          onItemSelected={props.onSelectEvent}
          hasSearch
        />
      </React.Fragment>
    );
  }

  renderEventSuggest = (props) => {
    const title = 'EVENT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="eventName"
          className="form-control"
          onSelectEvent={props.onSelectEvent}
          source={props.eventList}
          component={this.renderAutoSuggestion}
        />
      </React.Fragment>
    );
  };

  renderAutoSuggestion = (props) => {
    const { touched, dirty, error, warning } = props.meta;
    const cls = classNames('form-group', {
      'form-error': (touched || dirty) && error,
      'form-warning': (touched || dirty) && warning,
    });
    console.log(props.meta);
    return (
      <div class={cls}>
        <AutoSuggestion
          {...props}
          name="eventName"
          placeholder="Choose an Event or Create a new"
          className="form-control"
          value={props.input.value}
          onChange={props.input.onChange}
        />
        {(touched || dirty) && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
      </div>
    );
  };

  renderEvent = ({ isNew }) => {
    if (!isNew) return null;
    const title = 'CREATE AN EVENT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <Field
          name="eventName"
          type="text"
          className="form-group"
          fieldClass="form-control"
          component={renderField}
          placeholder="Event name"
          validate={[required]}
        />
        <Field name="eventId" type="hidden" component={renderField} />
      </React.Fragment>
    );
  }

  renderOutComes = (props) => {
    const { fields, meta: { error }, isNew } = props;
    const title = 'OUTCOME';
    return (
      <React.Fragment>
        { this.renderGroupTitle(title) }
        {
          fields.map((outcome, index) => {
            return (
              <div className="form-group-custom" key={`${outcome}.id`}>
                <Field
                  name={`${outcome}.name`}
                  type="text"
                  className="form-group"
                  fieldClass="form-control"
                  component={renderField}
                  validate={[required]}
                  disabled={!isNew && fields.get(index).id}
                />
                {!fields.get(index).id && !!index &&
                <button
                  type="button"
                  className="trash"
                  onClick={() => fields.remove(index)}
                >
                  <img src={IconTrash} alt="" />
                </button>}
              </div>
            );
          })
        }
        {/*{error && <li className="ErrorMsg">{error}</li>}*/}
        <button
          className="AddMoreOutCome"
          type="button"
          disabled={error}
          onClick={() => this.addMoreOutcomes(fields)}
        >
          <img src={IconPlus} alt="" className="IconPlus" />
          <span>Add more outcomes</span>
        </button>
      </React.Fragment>
    );
  }

  renderFee = ({ isNew }) => {
    const title = 'CREATOR FEE';
    const textNote = 'The creator fee is a percentage of the total winnings of the market.';
    const optionSlider = {
      min: 1,
      max: 99,
      tooltip: false,
      orientation: 'horizontal',
    };
    return (
      <div className="CreateEventFormBlock">
        {this.renderGroupTitle(title)}
        <Field
          name="creatorFee"
          type="number"
          unit="%"
          className="input-value"
          disabled={!isNew}
          options={optionSlider}
          component={this.renderRangleSlider}
        />
        {this.renderGroupNote(textNote)}
      </div>
    );
  }

  renderRangleSlider = (props) => {
    return (
      <RangeSlider
        {...props}
        value={props.input.value}
        onChange={props.input.onChange}
      />
    );
  }

  renderReport = (props, state) => {
    const title = 'REPORT';
    return (
      <React.Fragment>
        {this.renderGroupTitle(title)}
        <div className="form-group">
          <Field
            name="reports"
            component="select"
            className="form-control custom-select"
            disabled={!props.isNew}
            onChange={(e, newValue) => this.setFieldValueToState('selectedReportSource', newValue)}
          >
            <option value="">Please select a verified source</option>
            {props.reportList.map(r => <option value={r.id} key={r.id}>{`${r.name} - ${r.url}`}</option>)}
          </Field>
        </div>
        {
          props.isNew && !state.selectedReportSource &&
          <React.Fragment>
            <div className="CreateEventOption"><span>Or</span></div>
            <Field
              name="ownReportName"
              type="text"
              className="form-group"
              fieldClass="form-control"
              component={renderField}
              placeholder="Enter your own source name"
              validate={[required]}
            />
            <Field
              name="ownReportUrl"
              type="text"
              className="form-group"
              fieldClass="form-control"
              component={renderField}
              placeholder="Enter your own source URL"
              validate={[required, urlValidator]}
            />
            {this.renderGroupNote('We will review your source and get back to you within 24 hours.')}
          </React.Fragment>
        }
      </React.Fragment>
    );
  }

  renderDateTime = ({ input, disabled, type, title, placeholder, startDate, endDate, meta }) => {
    const { value, name, ...onEvents } = input;
    const { touched, dirty, error, warning } = meta;
    const inputProps = {
      name,
      type,
      placeholder,
      disabled,
    };
    const cls = classNames('form-group', {
      'form-error': (touched || dirty) && error,
      'form-warning': (touched || dirty) && warning,
    });
    return (
      <div className={cls}>
        <DateTimePicker
          onDateChange={(date) => this.setFieldValueToState(name, date)}
          value={value}
          title={title}
          inputProps={inputProps}
          {...onEvents}
          startDate={startDate}
          endDate={endDate}
          popupTriggerRenderer={this.buildPicker}
        />
        {(touched || dirty) && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
      </div>
    );
  }

  renderTimeGroup = (props, state) => {
    const closingStartTime = moment().add(minStep, 'm').unix();
    return (
      <React.Fragment>
        <Field
          name="closingTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Closing Time"
          title="Closing Time"
          validate={[required, this.smallerThanReportingTime]}
          disabled={!props.isNew}
          value={state.closingTime}
          startDate={closingStartTime}
          // endDate={state.reportingTime - secStep}
        />
        <Field
          name="reportingTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Reporting Time"
          title="Reporting Time"
          validate={[required, this.smallerThanDisputeTime]}
          disabled={!props.isNew || !state.closingTime}
          value={state.reportingTime}
          startDate={state.closingTime + secStep}
          // endDate={state.disputeTime - secStep}
        />
        <Field
          name="disputeTime"
          type="text"
          component={this.renderDateTime}
          placeholder="Dispute Time"
          title="Dispute Time"
          validate={[required]}
          disabled={!props.isNew || !state.reportingTime}
          value={state.disputeTime}
          startDate={state.reportingTime + secStep}
        />
      </React.Fragment>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(CreateEventForm.displayName, {
      [props.className]: !!props.className,
    });
    const { isNew, shareEvent } = props;
    if (shareEvent) {
      return (<ShareMarket shareEvent={shareEvent} isNew={isNew} />);
    }
    return (
      <form className={cls} onSubmit={props.handleSubmit(this.onCreateNewEvent)}>
        <div className="CreateEventFormBlock">
          {/* {this.renderEventDropdownList(props, state)} */}
          {this.renderEventSuggest(props, state)}
          {/* {this.renderEvent(props)} */}
          <FieldArray
            name="outcomes"
            isNew={props.isNew}
            component={this.renderOutComes}
          />
        </div>
        {this.renderFee(props)}
        <div className="CreateEventFormBlock">
          {this.renderReport(props, state)}
          {this.renderTimeGroup(props, state)}
          <button type="submit" className="btn btn-primary btn-block" disabled={props.pristine || props.submitting}>
            {props.isNew ? 'Create a new event' : 'Add new outcomes'}
          </button>
        </div>
      </form>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default reduxForm({
  form: 'CreateEventForm',
  enableReinitialize: true,
})(CreateEventForm);
