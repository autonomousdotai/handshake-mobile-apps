import React from 'react';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyLogoSVG from '@/assets/images/luckypool/lucky-landing-logo.svg';
import CloseIcon from '@/assets/images/icon/close.svg';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import GA from '@/services/googleAnalytics';


import './LuckyLanding.scss';

class LuckyLanding extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,
  }
  render() {
    return (
      <div className="wrapperLuckyLanding">
        <div className="luckyLandingTop">
          <div
            className="luckyLandingClose"
            //to={URL.HANDSHAKE_DISCOVER}
            onClick={() => {
              GA.clickInstructionClose();
              this.props.onButtonClick();
            }}
          >
            <Image src={CloseIcon} alt="CloseIcon" />
          </div>
          <Image className="luckyLandingLogo" src={LuckyLogoSVG} alt="luckyLogo" />

        </div>
        <div className="luckyTopContent">
          <div className="luckyLandingTitle">Hey Ninja!</div>
          <div className="luckyTitleDesc">
          We love seeing new masked faces!.
          {/*<br/>
          Here’s a guide and 3 free bets, all for you!*/}
          </div>
        </div>
        <Button
          className="btnLuckyLanding gotItButton"
          onClick={() => {
              GA.clickInstructionGotIt();
              this.props.onButtonClick();
          }}
        >
        Play Now
        </Button>
        <Link
          className="btnLuckyLanding guideButton"

          to={URL.PEX_INSTRUCTION_URL}
          onClick={()=>{
            GA.clickInstructionStartGuide();
            this.props.onButtonClick();

          }}
        >
            Quick start guide

        </Link>



      </div>
    );
  }
}
export default connect(state => ({ app: state.app }))(LuckyLanding);
