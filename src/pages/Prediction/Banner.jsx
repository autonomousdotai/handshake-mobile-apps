import React from 'react';
import Button from '@/components/core/controls/Button';
import Image from '@/components/core/presentation/Image';
import { URL } from '@/constants';
import { Link } from 'react-router-dom';

import BannerBG from '@/assets/images/banner/banner_bg.png';
import GA from '@/services/googleAnalytics';

import './Banner.scss';

class Banner extends React.Component {

  render() {
    const text = `Let's get this crystal ball`;
    return (
      <div className="ShareToWinContainer">
        <Image className="ShareToWin" src={BannerBG} alt="banner" />
        <div className="ShareToWinTitle">
          <div >
            {text}
          </div>
          <div className="RollingText">
            ROLLING!
          </div>
          <Link to={URL.PEX_INSTRUCTION_URL}
            onClick={()=>{
              GA.clickInstructionStartGuide();
            }}
          >
            <Button className="btnBanner FollowButton">Follow quick start guide</Button>
          </Link>

        </div>
      </div>
    );
  }
}
export default Banner;
