import React from 'react';
import { PropTypes } from 'prop-types';

function Avatar(props) {
  const { className, src, alt } = props;
  return (
    <span className={className}>
      <img src={src} alt={alt} />
    </span>
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
};

Avatar.defaultProps = {
  className: 'AvatarComponent',
  src: '',
  alt: '',
};

export default Avatar;
