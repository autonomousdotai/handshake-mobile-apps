import React from 'react';
import PropTypes from 'prop-types';

function Name(props) {
  const { name } = props;
  return (
    <span className="CreatorName">{name}</span>
  );
}

function Creator(props) {
  const { className, children } = props;
  return (
    <div className={className}>
      { children }
      {Name(props)}
    </div>
  );
}

Creator.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  name: PropTypes.string,
};

Creator.defaultProps = {
  className: null,
  children: null,
  name: null,
};

export default Creator;
