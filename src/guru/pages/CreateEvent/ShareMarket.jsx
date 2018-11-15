import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import { randomArrayItem } from '@/utils/array';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import { URL } from '@/constants';
import CopyLink from '@/assets/images/share/link.svg';
import FacebookSVG from '@/assets/images/icon/icon_facebook.svg';
import TwitterSVG from '@/assets/images/icon/icon_twitter.svg';
import { socialSharedMsg } from '@/pages/Prediction/constants';

import { resetShareEvent } from './action';

class ShareMarket extends React.Component {
  static propTypes = {
    shareEvent: PropTypes.object,
    resetShareEvent: PropTypes.func.isRequired
  };

  static defaultProps = {
    shareEvent: null
  };

  componentWillUnmount() {
    this.props.resetShareEvent();
  }

  renderCheckmark = () => (
    <span className="checkmark">
      <div className="checkmark_circle" />
      <div className="checkmark_stem" />
      <div className="checkmark_kick" />
    </span>
  );

  renderMessage = (props) => {
    return (
      <div className="ShareEventMessage">
        <p>Your event was created successfully!</p>
        <p>The event will be approved in approx. 1 hour.</p>
      </div>
    );
  }

  renderShares = (props) => {
    const { shareEvent } = props;
    const { url } = shareEvent;
    const socialList = [
      {
        img: FacebookSVG,
        title: 'FACEBOOK'
      }, {
        img: TwitterSVG,
        title: 'TWITTER'
      },
      {
        img: CopyLink,
        title: 'COPY'
      }
    ];
    const title = randomArrayItem(socialSharedMsg);
    return (
      <div className="ShareEventToBuddies">
        <div className="ShareEventToBuddiesTitle">
          Invite your buddies to bet
        </div>
        <ShareSocial title={title} shareUrl={url} socialList={socialList} />
      </div>
    );
  }

  renderComponent = (props) => {
    return (
      <div className="ShareMarketContainer">
        {this.renderCheckmark()}
        {this.renderMessage(props)}
        {/*{this.renderShares(props)}*/}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default connect(null, { resetShareEvent, push })(ShareMarket);
