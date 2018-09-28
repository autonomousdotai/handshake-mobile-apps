import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyFreeSVG from '@/assets/images/luckypool/lucky-free.svg';

import './LuckyFree.scss';

class LuckyFree extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }
  render() {
    return (
      <div className="wrapperLuckyFree">
        <Image className="luckyFreeImage" src={LuckyFreeSVG} alt="luckyfree" />
        <div className="luckyFreeDes">Good Luck!<br />Wanna win one (or more!) of 10x 1ETH prizes?</div>
        <div className="luckyFreeSmallDes">Simply bet again to enter the prize draw.</div>
        <Button
          className="luckyFreeButton"
          onClick={() => this.props.onButtonClick()}
        >
            Bet again
        </Button>
      </div>
    );
  }
}
export default LuckyFree;
