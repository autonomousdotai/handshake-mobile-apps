import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { eventSelector } from '@/pages/Prediction/selector';
import Loading from '@/components/Loading';
import GasAlert from '@/pages/CreateMarket/GasAlert';
import CreateEventForm from './CreateEventForm';
import { loadCreateEventData } from './action';
import { reportSelector, categorySelector, shareEventSelector, isLoading, hasEmail, insufficientGas } from './selector';
import { createEventFormName } from './constants';

import './CreateMarket.scss';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    eventList: PropTypes.array,
    reportList: PropTypes.array,
    categoryList: PropTypes.array,
    match: PropTypes.object,
    insufficientGas: PropTypes.any,
  };

  static defaultProps = {
    eventList: [],
    reportList: [],
    categoryList: [],
    match: {},
    insufficientGas: undefined,
  };

  constructor(props) {
    super(props);
    const { eventId } = props.match.params;
    this.state = {
      eventId: eventId || 0,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadCreateEventData());
  }

  onSelectEvent = (item) => {
    this.setState({
      eventId: item.id || 0,
    });
  }

  renderCreateEventForm = (props, state) => {
    const selectedEvent = props.eventList.find(item => item.id.toString() === state.eventId.toString());
    const initialValues = !selectedEvent ? {
      outcomes: [{}],
      creatorFee: 0,
    } : {
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      outcomes: selectedEvent.outcomes.concat({}),
      creatorFee: selectedEvent.market_fee,
      reports: selectedEvent.source_id,
      category: selectedEvent.category_id,
      closingTime: selectedEvent.date,
      reportingTime: selectedEvent.reportTime,
      disputeTime: selectedEvent.disputeTime,
    };
    return (
      <CreateEventForm
        initialValues={initialValues}
        reportList={props.reportList}
        categoryList={props.categoryList}
        isNew={!selectedEvent}
        eventList={props.eventList}
        shareEvent={props.shareEvent}
        dispatch={props.dispatch}
        onSelect={this.onSelectEvent}
        formAction={props.formAction}
        hasEmail={props.hasEmail}
        insufficientGas={props.insufficientGas}
      />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        <GasAlert insufficientGas={props.insufficientGas} />
        <div className={CreateMarket.displayName}>
          <Loading isLoading={props.isLoading} />
          {this.renderCreateEventForm(props, state)}
        </div>
      </React.Fragment>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default connect(
  (state) => {
    return {
      eventList: eventSelector(state),
      isLoading: isLoading(state),
      reportList: reportSelector(state),
      categoryList: categorySelector(state),
      shareEvent: shareEventSelector(state),
      hasEmail: hasEmail(state),
      insufficientGas: insufficientGas(state),
    };
  },
  (dispatch) => ({
    formAction: (action, fieldName, value) => {
      return action(createEventFormName, fieldName, value);
    },
    dispatch,
  }),
)(CreateMarket);
