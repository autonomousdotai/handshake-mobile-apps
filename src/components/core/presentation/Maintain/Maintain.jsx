import React from 'react';
// style
import nodataNinjaSVG from '@/assets/images/ninja/nodata-ninja.svg';

import './Maintain.scss';

class Maintain extends React.PureComponent {

  render() {
    return (
      <div className="blockCountry">
        <img className="img-fluid img" src={nodataNinjaSVG} alt="noconnection ninja" />
        <p>We are maintaining</p>
      </div>
    );
  }
}

export default Maintain;
