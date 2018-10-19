import React from 'react';
import PropTypes from 'prop-types';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import { randomArrayItem } from '@/utils/array';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';

import { URL } from '@/constants';
import ShareLink from '@/assets/images/icon/icon_share.svg';
import FacebookSVG from '@/assets/images/icon/icon_facebook.svg';
import TwitterSVG from '@/assets/images/icon/icon_twitter.svg';
import { socialSharedMsg } from '@/pages/Prediction/constants';

class ShareMarket extends React.Component {
  static propTypes = {
    shareEvent: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    shareEvent: null,
  };

  renderCheckmark = () => (
    <span className="checkmark">
      <div className="checkmark_circle" />
      <div className="checkmark_stem" />
      <div className="checkmark_kick" />
    </span>
  );

  renderMessage = (props) => {
    const type = props.isNew ? 'event' : 'outcome';
    const { url } = props.shareEvent;
    const toUrl = {
      pathname: URL.HANDSHAKE_PEX,
      search: url.substring(url.indexOf('?')),
    };
    return (
      <React.Fragment>
        <div className="ShareEventMessage">
          Your {type} was successfully created!
        </div>
        <Link
          className="ViewSharedEvent"
          to={toUrl}
          onClick={() => { props.dispatch(push(toUrl)); }}
        >
          View Event
        </Link>
      </React.Fragment>
    );
  }

  renderShares = (props) => {
    const { shareEvent } = props;
    const { url } = shareEvent;
    const socialList = [
      {
        img: FacebookSVG,
        title: 'FACEBOOK',
      }, {
        img: TwitterSVG,
        title: 'TWITTER',
      },
      {
        img: ShareLink,
        title: 'COPY',
      },
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
        {this.renderShares(props)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default ShareMarket;
