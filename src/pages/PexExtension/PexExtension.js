import React from 'react';
import PropTypes from 'prop-types';
import { EXT } from '@/constants';
import Logo from '@/assets/images/pex/ext-landing-page/logo.svg';
import ChromeLogo from '@/assets/images/pex/ext-landing-page/icon_chrome.svg';
import MacBook from '@/assets/images/pex/ext-landing-page/macbook.svg';

import './PexExtension.scss';

class PexExtension extends React.Component {
  static displayName = 'PexExtension';
  static propTypes = {
    reactHelmetElement: PropTypes.element,
  };

  static defaultProps = {
    reactHelmetElement: null,
  };

  constructor(props) {
    super(props);
    this.macbook = React.createRef();
  }

  componentDidMount() {
    const frameContainer = document.getElementsByClassName('FrameClip')[0];
    window.addEventListener('resize', () => {
      this.setFrameClip(frameContainer);
    });
  }

  setFrameClip = (frame) => {
    const { clientWidth, clientHeight } = this.macbook.current;
    const style = `
       width: ${clientWidth * (clientHeight / clientWidth)}px;
       height: ${clientHeight}px;
    `;
    frame.setAttribute('style', style);
    this.setDimensionHeading();
  };

  setDimensionHeading = () => {
    const FrameContent = document.getElementsByClassName('FrameContent')[0];
    const Heading = document.getElementsByClassName('Heading')[0];
    if (window.innerWidth > 1180) {
      Heading.setAttribute('style', `width: ${FrameContent.clientWidth}px`);
    }
  };

  handleImageLoaded = () => {
    const frameContainer = document.getElementsByClassName('FrameClip')[0];
    this.setFrameClip(frameContainer);
  };

  renderComponent = () => {
    return (
      <React.Fragment>
        <div className="PexExtensionContent">
          <div className="Heading">
            <div className="AppIcons">
              <span className="Icon">
                <img src={Logo} alt="Ninja Extension" />
              </span>
              <div className="LineText">
                <span className="HeadLine"><span className="HighlightText">Outsmart</span> the Internet</span>
                <span className="Describes">Predict the future of politics, technology, money and sports.</span>
              </div>
            </div>
            <div className="ActionGetApp">
              <span className="NoteText">You've unlocked exclusive access</span>
              <a href={EXT.URL} target="blank" alt="Extension App" className="btn btn-primary">
                <img src={ChromeLogo} alt="Chrome Logo" />
                <span>Add to Chrome</span>
              </a>
            </div>
          </div>
          <div className="GuideClipArea">
            <div className="GuideClipAreaInner">
              <img
                src={MacBook}
                alt="Extension Instruction"
                ref={this.macbook}
                className="MacBook"
                onLoad={this.handleImageLoaded}
              />
              <div className="FrameClip">
                <div className="FrameContent">
                  <div className="FrameBorder">
                    <iframe
                      title="Chrome Extension Instruction"
                      src={EXT.CLIP_SOURCE}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="videoClip"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={PexExtension.displayName}>
        {this.props.reactHelmetElement}
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}


export default PexExtension;
