import React from 'react';
import PropTypes from 'prop-types';
// component
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.svg';
// style
import './Loading.scss';

class Loading extends React.PureComponent {
  render() {
    const { className, loadingImg, message } = this.props;
    return (
      <div className={`loading ${className || ''}`}>
        <Image src={loadingImg ? loadingImg : loadingSVG} alt="loading" />
        {
          message && (<p className="text">{message}</p>)
        }
      </div>
    );
  }
}

Loading.propTypes = {
  className: PropTypes.string,
  loadingImg: PropTypes.any,
  message: PropTypes.string
}

export default Loading;
