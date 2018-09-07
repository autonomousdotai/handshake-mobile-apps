import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import FreeBetLoseLogoSVG from '@/assets/images/luckypool/freebet_lose_logo.svg';

import './FreeBetLose.scss';

class FreeBetLose extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }

  render() {
    return (
      <div className="wrapperFreeBetLose">
        <Image className="freeBetLoseBanner" src={FreeBetLoseLogoSVG} alt="freeBetLose" />
        <div className="freeBetLoseDes">Damn.. you can’t win ‘em all.</div>
        <div className="freeBetLoseSmallDes">You deserve another shot.</div>
        <Button
          className="freeBetLoseButton"
          onClick={() => this.props.onButtonClick()}

        >
        Here’s a free bet
        </Button>
      </div>
    );
  }
}
export default FreeBetLose;
