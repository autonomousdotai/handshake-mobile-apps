import React from 'react';
import PropTypes from 'prop-types';
import { URL } from '@/constants';
import CardItem from './CardItem';
import {
  removeExpiredEvent,
  getReportCount
} from './action';

class CardList extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    eventList: PropTypes.array.isRequired
  };

  handleClickCreator = (eventItem) => {
    const userId = eventItem.created_user_id || 0;
    const address = eventItem.creator_wallet_address || '0x3D0...fEd';
    this.props.history.push(`${URL.HANDSHAKE_REPUTATION}?id=${userId}&address=${address}`);
  }

  handleClickBetSide = (itemProps, itemData) => {
    const { event } = itemProps;
    const { token = undefined } = event;
    const { permissionConstToken } = this.props;
    console.log('permissionConstToken:', permissionConstToken);
    let url = null;
    if (token) { // Constant
      if (!permissionConstToken || (permissionConstToken && permissionConstToken.status !== 1)) {
        let status = undefined;
        if (permissionConstToken) status = permissionConstToken.status;
        url = `${URL.CONSTANT_TERM_URL}?status=${status}`;
      }
    } else { // Etherum
      url = `${URL.GURU_PLACE_BET}?event_id=${itemProps.event.id}&outcome_id=${itemData.id}&side=${itemProps.side}`;
    }

    this.props.history.push(url);
  }

  handleCountdownComplete = (eventId) => {
    this.props.dispatch(removeExpiredEvent({ eventId }));
    this.props.dispatch(getReportCount());
  }

  createCardItem = (eventItem) => {
    return (
      <CardItem
        key={eventItem.id}
        eventItem={eventItem}
        onClickCreator={() => this.handleClickCreator(eventItem)}
        onClickBetSide={this.handleClickBetSide}
        onCountdownComplete={() => this.handleCountdownComplete(eventItem.id)}
      />);
  }

  createCardList = (eventList) => {
    return eventList.map(eventItem => this.createCardItem(eventItem));
  }

  renderCardList = (props) => {
    const htmlClassName = 'CardList';
    const { eventList } = props;
    if (!eventList || !eventList.length) {
      return (<div className="NoMsg">No event found</div>);
    }
    return (
      <div className={htmlClassName}>
        {this.createCardList(eventList)}
      </div>
    );
  }

  render() {
    return this.renderCardList(this.props);
  }
}

export default CardList;
