import React from 'react';
import PropTypes from 'prop-types';
import ExtLogo from '@/assets/images/pex/ext-landing-page/logo.svg';
import GuideClip from '@/assets/images/pex/ext-landing-page/guide-clip.gif';
import MacBook from '@/assets/images/pex/ext-landing-page/macbook.svg';

import Blank from '@/assets/images/pex/ext-landing-page/blank.png';

import './PexExtension.scss';

class PexExtension extends React.Component {
  static displayName = 'PexExtension';
  static propTypes = {
    reactHelmetElement: PropTypes.element,
  };

  static defaultProps = {
    reactHelmetElement: null,
  };

  renderComponent = () => {
    const URL_EXT = 'https://chrome.google.com/webstore/detail/ninja-prediction/lmbfnjfjefcjgbddmaijlmkkpfipbjhb';
    return (
      <React.Fragment>
        <div className="PexExtensionContent">
          {/* <h1>
            <a href="/" title="Ninja Prediction">
              <img src={ExtLogo} alt="Ninja Prediction" className="ExtLogo" />
            </a>
          </h1> */}
          <div className="Heading">
            <div className="LineText">
              Ninja: Bet on anything, against anyone on the Internet.
            </div>
            <a href={URL_EXT} target="blank" alt="Extension App" className="btn btn-warning">Get your exclusive copy</a>
          </div>
          <div className="GuideClipArea">
            <div className="GuideClipAreaInner">
              <img src={MacBook} alt="Extension Instruction" className="MacBook" />
              <div className="FrameClip">
                {/* <img src={GuideClip} alt="Extension Instruction" className="GuideClip" /> */}
                {/* <img src={Blank} alt="Extension Instruction" /> */}
                <div className="FrameContent">
                  <div className="FrameBorder">
                    <iframe
                      title="Chrome Extension Instruction"
                      src="https://www.youtube.com/embed/tb67Prx3wMs?rel=0&amp;autoplay=1&amp;loop=1&playlist=tb67Prx3wMs"
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
          {/* <div className="Description">
            <span>Bet on anything, against anyone on the Internet.</span>
            <a href={URL_EXT} target="blank" title="Add to chrome" className="btn btn-warning">Add to chrome</a>
          </div> */}
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
