import React from 'react';
import PropTypes from 'prop-types';
// style
import './Feed.scss';

class Feed extends React.PureComponent {
  BACKGROUND_COLORS = ['#007AFF', '#5AC8FA', '#009688', '#FF9500', '#FF2D55', '#4CD964', '#9C27B0', '#FF3B30', '#5677FC', '#FF5722'];

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
