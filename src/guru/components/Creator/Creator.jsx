import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
      <Link to={URL.HANDSHAKE_REPUTATION} >
        { children }
        { Alias(props) }
      </Link>
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
