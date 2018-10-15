import React from 'react';
import PropTypes from 'prop-types';
// style
import nodataNinjaSVG from '@/assets/images/ninja/nodata-ninja.svg';
import arrowDownSVG from '@/assets/images/icon/arrow-down.svg';
import './NoData.scss';

class NoData extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    isShowArrowDown: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: undefined,
    message: undefined,
    isShowArrowDown: false,
    children: undefined,
  };

  defaultBody = (props) => {
    const { className, message, isShowArrowDown } = props;
    return (
      <div className={`no-data ${className || ''}`}>
        <div>
          <img className="img-fluid img" src={nodataNinjaSVG} alt="nodata ninja" />
          <p className="text">{ message }</p>
          { isShowArrowDown && (<img className="img-fluid" src={arrowDownSVG} alt="arrow down" />)}
        </div>
      </div>
    );
  }

  renderComponent = (props) => {
    const { children } = props;
    if (children) {
      return children;
    }
    return this.defaultBody(props);
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default NoData;
