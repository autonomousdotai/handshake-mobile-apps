import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Loading from '@/components/Loading';
import GasAlert from '@/pages/CreateMarket/GasAlert';
import { eventDetailSelector } from '@/pages/CreateMarket/selector';
import { eventSelector } from '@/pages/Prediction/selector';
import { URL } from '@/constants';
import CreateEventForm from './CreateEventForm';
import { loadCreateEventData } from './action';
import { reportSelector, categorySelector, shareEventSelector, isLoading, hasEmail, insufficientGas, uId } from './selector';
import { createEventFormName } from './constants';

import './CreateMarket.scss';
import './ToggleSwitch.scss';

class CreateMarket extends React.Component {
  static displayName = 'CreateMarket';
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    eventList: PropTypes.array,
    reportList: PropTypes.array,
    categoryList: PropTypes.array,
    match: PropTypes.object,
    hasEmail: PropTypes.any,
    uId: PropTypes.any,
    insufficientGas: PropTypes.any,
    eventDetail: PropTypes.object,
  };

  static defaultProps = {
    eventList: [],
    reportList: [],
    categoryList: [],
    match: {},
    eventDetail: {},
    insufficientGas: undefined,
  };

  constructor(props) {
    super(props);
    const { eventId } = props.match.params;
    this.state = {
      eventId: eventId || 0,
      selectedEvent: props.eventDetail,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ((nextProps.eventDetail || {}).id !== (prevState.eventDetail || {}).id) {
      return {
        selectedEvent: nextProps.eventDetail,
      };
    }
    return null;
  }

  componentDidMount() {
    const { eventId } = this.props.match.params;
    this.props.dispatch(loadCreateEventData({ eventId }));
  }

  onSelectEvent = (item) => {
    this.setState({
      eventId: item.id || 0,
      selectedEvent: item,
    });
    this.props.dispatch(push(`${URL.HANDSHAKE_PEX_CREATOR}/${item.id || ''}`));
    // this.props.history.push(`${URL.HANDSHAKE_PEX_CREATOR}/${item.id || ''}`); // eslint-disable-line
  }

  renderCreateEventForm = (props, state) => {
    const { selectedEvent } = state;
    const selectedReport = props.reportList.find(i => i.id === selectedEvent.source_id);
    // const selectedEvent = state.eventId ? props.eventList.find(item => item.id.toString() === state.eventId.toString()) : props.eventDetail;
    const initialValues = (!selectedEvent || !selectedEvent.id) ? {
      outcomes: [{}],
      creatorFee: 0,
      private: false,
    } : {
      eventId: selectedEvent.id,
      eventName: {
        value: selectedEvent.id.toString(),
        label: selectedEvent.name,
      },
      private: !selectedEvent.public,
      outcomes: selectedEvent.outcomes.concat({}),
      creatorFee: selectedEvent.market_fee,
      reports: selectedReport,
      // reports: selectedEvent.source_id,
      category: selectedEvent.category_id,
      closingTime: selectedEvent.date,
      reportingTime: selectedEvent.reportTime,
      disputeTime: selectedEvent.disputeTime,
      grantPermission: selectedEvent.grant_permission,
    };
    return (
      <CreateEventForm
        initialValues={initialValues}
        reportList={props.reportList}
        categoryList={props.categoryList}
        isNew={!selectedEvent.id}
        eventList={props.eventList}
        shareEvent={props.shareEvent}
        dispatch={props.dispatch}
        onSelect={this.onSelectEvent}
        formAction={props.formAction}
        hasEmail={props.hasEmail}
        uid={props.uId}
        insufficientGas={props.insufficientGas}
      />
    );
  }

  renderComponent = (props, state) => {
    return (
      <React.Fragment>
        {/*<GasAlert insufficientGas={props.insufficientGas} />*/}
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
  (state, props) => {
    return {
      eventList: eventSelector(state, props),
      eventDetail: eventDetailSelector(state, props),
      isLoading: isLoading(state),
      reportList: reportSelector(state),
      categoryList: categorySelector(state),
      shareEvent: shareEventSelector(state),
      hasEmail: hasEmail(state),
      uId: uId(state),
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
