import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import ModalDialog from '@/components/core/controls/ModalDialog';
import NavigationBar from '@/modules/NavigationBar/NavigationBar';
import { eventSelector } from './selector';
import { loadMatches } from './action';
import EventItem from './EventItem';

import './Prediction.scss';

class Prediction extends React.Component {
  static displayName = 'Prediction';
  static propTypes = {
    eventList: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    eventList: [],
  };
  state = {
    isShowOrder: false,
    selectedOutcome: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadMatches());
  }

  handleClickEventItem = (id, e, props, itemData) => {
    const { event } = props;
    const selectedOutcome = {
      hid: itemData.hid,
      id: itemData.id,
      marketOdds: itemData.market_odds,
      value: itemData.name,
    };
    const selectedMatch = {
      date: event.date,
      id: event.id,
      marketFee: event.market_fee,
      reportTime: event.reportTime,
      value: event.name,
    };
    this.modalOrderPlace.open();
    this.setState({
      isShowOrder: true,
      selectedOutcome,
      selectedMatch,
    });
  };

  renderEventList = (props) => {
    if (!props.eventList || !props.eventList.length) return null;
    return (
      <div className="EventList">
        {props.eventList.map((event) => {
          return <EventItem key={event.id} event={event} onClick={this.handleClickEventItem} />;
        })}
      </div>
    );
  };

  renderShareToWin = () => {
    return (
      <div className="ShareToWin">
        <div className="ShareToWinTitle">
          SHARE TO <span>WIN 10 ETH</span>
        </div>
      </div>
    );
  }

  renderComponent = (props, state) => {
    return (
      <div className={Prediction.displayName}>
        <NavigationBar />
        {this.renderShareToWin()}
        {this.renderEventList(props)}
        <ModalDialog onRef={(modal) => { this.modalOrderPlace = modal; }}>
          <BettingFilter
            selectedOutcome={state.selectedOutcome}
            selectedMatch={state.selectedMatch}
            render={state.isShowOrder}
          />
        </ModalDialog>
      </div>
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
    };
  },
)(Prediction);
