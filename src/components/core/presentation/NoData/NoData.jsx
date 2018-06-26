import React from 'react';
import PropTypes from 'prop-types';
// style
import nodataNinjaSVG from '@/assets/images/ninja/nodata-ninja.svg';
import arrowDownSVG from '@/assets/images/icon/arrow-down.svg';
import './NoData.scss';

class NoData extends React.PureComponent {
  render() {
    const { className, message, isShowArrowDown, ...props } = this.props;
    return (
      <div className={`no-data ${className || ''}`} {...props}>
        <div>
          <img className="img-fluid img" src={nodataNinjaSVG} alt="nodata ninja" />
          <p className="text">{ message }</p>
          { isShowArrowDown && (<img className="img-fluid" src={arrowDownSVG} alt="arrow down" />)}
        </div>
      </div>
    );
  }
}

NoData.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  isShowArrowDown: PropTypes.bool,
};

NoData.defaultProps = {
  isShowArrowDown: false,
}

export default NoData;
