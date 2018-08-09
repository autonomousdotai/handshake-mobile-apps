import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { eventSelector } from '@/pages/Prediction/selector';
import Loading from '@/components/Loading';
import CreateEventForm from './CreateEventForm';
import { loadCreateEventData } from './action';
import { reportSelector, shareEventSelector, isLoading } from './selector';


class CreateEventContainer extends React.Component {
  static displayName = 'CreateEventContainer';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    eventList: PropTypes.array,
  };

  static defaultProps = {
    eventList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: 0,
    };
  }

  componentDidMount() {
    this.props.dispatch(loadCreateEventData());
  }

  onSelectEvent = (item) => {
    this.setState({
      selectedEvent: item.id ? item : 0,
    });
  }

  renderCreateEventForm = (props, state) => {
    const { selectedEvent } = state;
    const initialValues = !selectedEvent ? {
      outcomes: [{}],
    } : {
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      outcomes: selectedEvent.outcomes,
      creatorFee: selectedEvent.market_fee,
      reports: selectedEvent.source_id,
      closingTime: selectedEvent.date,
      reportingTime: selectedEvent.reportTime,
      disputeTime: selectedEvent.disputeTime,
    };
    return (
      <CreateEventForm
        initialValues={initialValues}
        reportList={props.reportList || []}
        isNew={!selectedEvent}
        eventList={props.eventList}
        shareEvent={props.shareEvent}
        dispatch={props.dispatch}
        onSelectEvent={this.onSelectEvent}
      />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        <Loading isLoading={props.isLoading} />
        {this.renderCreateEventForm(props, state)}
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className={CreateEventContainer.displayName}>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      eventList: eventSelector(state),
      isLoading: isLoading(state),
      reportList: reportSelector(state),
      shareEvent: shareEventSelector(state),
    };
  },
)(CreateEventContainer);
