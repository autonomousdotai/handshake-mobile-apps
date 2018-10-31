import React from 'react';
import { PropTypes } from 'prop-types';

function Title(props) {
  const { title } = props;
  return (
    <div className="MediaTitle">{title}</div>
  );
}

function Image(props) {
  const { src, alt } = props;
  return (<image src={src} alt={alt} />);
}

function Media(props) {
  const { className } = props;
  return (
    <div className={className}>
      {Title(props)}
      {Image(props)}
    </div>
  );
}

Media.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
};

Media.defaultProps = {
  className: null,
  src: '',
  alt: '',
};

export default Media;
