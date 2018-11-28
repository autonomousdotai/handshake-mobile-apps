/* eslint jsx-a11y/iframe-has-title: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@/guru/components/Icon/Icon';

import './YtbFrame.scss';

class YtbFrame extends React.Component {
  static propTypes = {
    config: PropTypes.shape({
      title: PropTypes.string,
      src: PropTypes.string,
      allow: PropTypes.string,
      allowFullScreen: PropTypes.bool,
      className: PropTypes.string,
      frameBorder: PropTypes.string
    }).isRequired,
    pathFrame: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.frameHolder = React.createRef();
  }

  setDimensionFrame = () => {
    const frameContainer = document.getElementsByClassName('FrameClip')[0];
    const { clientWidth, clientHeight } = this.frameHolder.current;
    const style = `
       width: ${clientWidth * (clientHeight / clientWidth)}px;
       height: ${clientHeight}px;
    `;
    frameContainer.setAttribute('style', style);
  }

  renderYtbFrame = (props) => {
    const { config, pathFrame } = props;
    return (
      <div className="GuideClipArea">
        <div className="GuideClipAreaInner">
          <div className="FrameHolder" ref={this.frameHolder}>
            <Icon path={pathFrame} completedInjected={this.setDimensionFrame} />
          </div>
          <div className="FrameClip">
            <div className="FrameContent">
              <div className="FrameBorder">
                <iframe {...config} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.renderYtbFrame(this.props);
  }
}

export default YtbFrame;
