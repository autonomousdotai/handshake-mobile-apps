import React from 'react';
// import PropTypes from 'prop-types';
// components
import Button from '@/components/core/controls/Button';
import Image from '@/components/core/presentation/Image';
// style
import versusSVG from '@/assets/images/icon/betting/versus.svg';
import './Detail.scss';

class BettingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="beeting-detail">
        <div className="info">
          <div className="head">
            <div className="ninjas">
              <p>2 ninjas</p>
              <p>10 ETH</p>
            </div>
            <div className="versus">
              <Image src={versusSVG} alt="versus"/>
              <p>vs</p>
            </div>
            <div className="ninjas">
              <p>7 ninjas</p>
              <p>10 ETH</p>
            </div>
          </div>
          <hr className="line"/>
          <div className="content">
            <p className="title">Brazil vs Argentina</p>
            <time className="font-size-20">9/7/2018</time>
            <p className="font-size-20">10 ETH that Brazil wins</p>
            <p>
              <span>1:10</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>0 +1</span>
            </p>
          </div>
        </div>
        <div className="btn-shake">
          <Button block>Shake now</Button>
        </div>
      </div>
    );
  }
}

export default BettingDetail;
