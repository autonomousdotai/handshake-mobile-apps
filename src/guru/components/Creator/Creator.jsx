import React from 'react';
import PropTypes from 'prop-types';
import { URL } from '@/constants';

function Alias(props) {
  const { alias } = props;
  return (
    <span className="CreatorAlias">{alias}</span>
  );
}

function Creator(props) {
  const { children } = props;
  return (
    <div className="CreatorComponent">
      { children }
      { Alias(props) }
    </div>
  );
}

Creator.propTypes = {
  children: PropTypes.node,
  alias: PropTypes.string
};

Creator.defaultProps = {
  children: null,
  alias: 'admin'
};

export default Creator;
