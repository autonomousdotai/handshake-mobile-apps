import React from 'react';
import PropTypes from 'prop-types';
// style
import './Feed.scss';

class Feed extends React.PureComponent {
  BACKGROUND_COLORS = ['#0064ff','#ff00a2','#ff9b00', '#00ce7d'];

  backgroundCss(background) {
    return background ? background : this.BACKGROUND_COLORS[Math.floor(Math.random() * this.BACKGROUND_COLORS.length)];
  }

  render() {
    const { className, background, children, handshakeId, ...props } = this.props;
    const styleCss = {
      background: this.backgroundCss(background)
    };
    return (
      <div className={`feed ${className || ''}`} style={styleCss} {...props}>
        {children}
      </div>
    );
  }
}

Feed.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Feed;
