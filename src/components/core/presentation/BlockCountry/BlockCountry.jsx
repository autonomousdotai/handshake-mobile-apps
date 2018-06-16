import React from 'react';
// style
import blockcountrySVG from '@/assets/images/pages/block-country/block-country.svg';
import './BlockCountry.scss';

class BlockCountry extends React.PureComponent {

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={`blockCountry ${className || ''}`} {...props}>
        <img className="img-fluid" src={blockcountrySVG} alt="block country" />
        <h2>Hey Ninja</h2>
        <p>The Man says your IP address can’t come out to play today.</p>
        <p className="bottom">See you on the flipside.</p>
      </div>
    );
  }
}

export default BlockCountry;
