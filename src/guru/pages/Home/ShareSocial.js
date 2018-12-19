import React from 'react';
import { PropTypes } from 'prop-types';
import { URL } from '@/constants';
import { randomArrayItem } from '@/utils/array';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import CopyLink from '@/assets/images/share/link.svg';

const BetShare = (props) => {
  const { event, socialList, shareMessages } = props;
  const { id } = event;
  const title = randomArrayItem(shareMessages);
  const shareURL = `${window.location.origin}${URL.HANDSHAKE_PREDICTION}?match=${id}`;
  return (<ShareSocial title={title} shareUrl={shareURL} socialList={socialList} />);
};

BetShare.propTypes = {
  event: PropTypes.object,
  socialList: PropTypes.arrayOf(PropTypes.object),
  //   PropTypes.shape({
  //     title: PropTypes.string,
  //     img: PropTypes.string
  //   })
  // ),
  shareMessages: PropTypes.arrayOf(PropTypes.string)
};

BetShare.defaultProps = {
  event: undefined,
  socialList: [
    // {
    //   title: 'facebook',
    //   icon: 'fab fa-facebook-l'
    // },
    // {
    //   title: 'twitter',
    //   icon: 'fab fa-twitter'
    // },
    // {
    //   title: 'copy',
    //   icon: 'fas fa-copy'
    // }
    {
      id: 1,
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/facebook.svg',
      title: 'FACEBOOK'
    }, {
      id: 2,
      img: 'https://d2q7nqismduvva.cloudfront.net/static/images/icon-svg/common/share/twitter.svg',
      title: 'TWITTER'
    }, {
      id: 3,
      img: CopyLink,
      title: 'COPY'
    }
  ],
  shareMessages: [
    'Check out this event. I’ve put some crypto on the outcome. Join me?',
    'Hey, found a crypto p2p prediction platform. No bookies, 100% anonymous! Check it out.',
    'Oi, put crypto where your mouth is. Play against me on Ninja.',
    'Feel good about this result. Placed a prediction on Ninja. You in?',
    'I’m predicting the future on Ninja. Will probably win ETH as i’m always right. You should try it.',
    'Hey, I’m gonna win crypto for being clever on Ninja. You get a free go - use it!',
    'Hey check out this crypto prediction platform. You can create events for free - and make money when people predict!',
    'Just tried out Ninja Predicts. Seems pretty cool. You get a free first prediction - nothing to lose. Could win crypto!',
    'I’ve just put some crypto on this. Wanna play against me? Your first prediction is free!',
    'Waiting to cash out on Ninja Predicts. Have a go, you might win some crypto. Your first try is free!'
  ]
};

export default BetShare;
