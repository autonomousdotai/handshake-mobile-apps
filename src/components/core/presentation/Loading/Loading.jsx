import React from 'react';
import PropTypes from 'prop-types';
// component
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
// style
import './Loading.scss';

class Loading extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    loadingImg: PropTypes.any,
    message: PropTypes.string,
    style: PropTypes.object,
  }
  static defaultProps = {
    className: '',
    loadingImg: loadingSVG,
    message: '',
    style: {},
  }
  render() {
    const {
      className, loadingImg, message, style,
    } = this.props;
    return (
      <div className={`loading ${className}`} style={style}>
        <Image src={loadingImg} alt="loading" />
        {
          message && (<p className="text">{message}</p>)
        }
      </div>
    );
  }
}

export default Loading;
