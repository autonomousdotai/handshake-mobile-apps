import React from 'react';
import Button from '@/components/core/controls/Button';
import Image from '@/components/core/presentation/Image';

import BannerSVG from '@/assets/images/banner/banner_bg.svg';

import './Banner.scss';

class Banner extends React.Component {

  render() {
    const text = `Let's get this crystal ball`;
    return (
      <div className="ShareToWinContainer">
        <Image className="ShareToWin" src={BannerSVG} alt="banner" />
        <div className="ShareToWinTitle">
          <div >
            {text}
          </div>
          <div className="RollingText">
            ROLLING!
          </div>
          <Button block className="btnBanner FollowButton">Follow quick start guide</Button>
        </div>
      </div>
    );
  }
}
export default Banner;
