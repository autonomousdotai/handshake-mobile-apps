import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Card from '@/guru/components/Card/Card';
import { isJSON } from '@/utils/object';
import { loadMatches } from './action';
import { isLoading, eventSelector, isSharePage } from './selector';

class Home extends Component {
  static propTypes = {
    eventList: PropTypes.array,
    isSharePage: PropTypes.any,
  };

  static defaultProps = {
    eventList: [],
    isSharePage: false,
  };

  componentDidMount() {
    this.receiverMessage(this.props); // @TODO: Extensions
  }

  // @TODO: Extensions
  /* eslint no-useless-escape: 0 */
  receiverMessage = (props) => {
    const windowInfo = isJSON(window.name) ? JSON.parse(window.name) : null;
    if (windowInfo) {
      const { message } = windowInfo;
      if (window.self !== window.top && message) {
        const urlPattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/i;
        const { url } = message;
        const matches = url.match(urlPattern);
        const source = matches && matches[0];
        props.dispatch(loadMatches({ source }));
      }
    } else {
      props.dispatch(loadMatches({ isDetail: props.isSharePage }));
    }
  }

  renderCardItem = (itemProps) => {
    const cardProps = {
      key: itemProps.id,
      className: 'CardItem',
      title: itemProps.name,
      imageUrl: itemProps.image_url,
    };
    return (
      <Card {...cardProps}>
        This is a Card!
      </Card>
    );
  }

  renderCardList = (props) => {
    if (props.isLoading) return null;
    const { eventList } = props;
    if (!eventList || !eventList.length) {
      return (<p className="NoMsg">No event found</p>);
    }
    return (
      <div className="CardList">
        { eventList.map(eventItem => this.renderCardItem(eventItem)) }
      </div>
    );
  }

  renderHome = (props) => {
    return (
      <div className="HomeGuruContainer">
        { this.renderCardList(props) }
      </div>
    );
  }
  render() {
    return this.renderHome(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      isLoading: isLoading(state),
      eventList: eventSelector(state),
      isSharePage: isSharePage(state),
    };
  },
)(Home));
