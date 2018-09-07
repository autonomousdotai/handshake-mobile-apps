import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import FreeBetWinLogoSVG from '@/assets/images/luckypool/freebet_win_logo.svg';

import './FreeBetWin.scss';

class FreeBetWin extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }

  render() {
    return (
      <div className="wrapperFreeBetWin">
        <Image className="freeBetWinBanner" src={FreeBetWinLogoSVG} alt="freeBetLose" />
        <div className="freeBetWinDes">Hooray!</div>
        <div className="freeBetWinSmallDes">You saw the future and you <br/>got some money.
        </div>
        <Button
          className="freeBetWinButton"
          onClick={() => this.props.onButtonClick()}

        >
        Here’s a free one on us.
        </Button>
      </div>
    );
  }
}
export default FreeBetWin;
