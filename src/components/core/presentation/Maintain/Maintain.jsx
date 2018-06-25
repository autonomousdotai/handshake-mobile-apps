import React from 'react';
// style
import blockcountrySVG from '@/assets/images/pages/block-country/block-country.svg';
import SpiderImg1 from '@/assets/images/maintain/spider.png';
import SpiderImg2 from '@/assets/images/maintain/spider2.png';

import './Maintain.scss';

class Maintain extends React.PureComponent {
  render() {
    return (
      <div className="maintain-tab">
        <img src={SpiderImg1} alt="" className="spider spider-1" />
        <img src={SpiderImg2} alt="" className="spider spider-2" />
        <img className="img-fluid img img-center" src={blockcountrySVG} alt="noconnection ninja" />
        <p className="title">OUT TO LUNCH.</p>
        <p className="title">BACK SOON.</p>
        <p>Damn bugs got all over the picnic table.</p>
        <p>See you 29/6</p>
      </div>
    );
  }
}

export default Maintain;
