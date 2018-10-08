import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyFreeSVG from '@/assets/images/luckypool/lucky-free.svg';

import './LuckyFree.scss';

class LuckyFree extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,
    totalBets: PropTypes.number,

  }
  renderCountDown() {
    const { totalBets } = this.props;
    return (
      <div className="countdown"><strong>{totalBets}</strong> bets left until we draw the winners</div>
    );
  }
  render() {
    return (
      <div className="wrapperLuckyFree">
        <Image className="luckyFreeImage" src={LuckyFreeSVG} alt="luckyfree" />
        <div className="luckyFreeDes">Good Luck!<br />Wanna win one (or more!) of <strong>10x 1ETH</strong> prizes?</div>
        {this.renderCountDown()}
        <div className="luckyFreeSmallDes"><strong>Simply bet again to enter the prize draw.</strong></div>
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
