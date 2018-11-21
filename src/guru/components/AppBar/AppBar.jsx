import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './AppBar.scss';

function AppBar(props) {
  // TODO: chrome-extension
  if (window.self !== window.top) return null;

  const { children, classNameProp } = props;
  const classNameComponent = classNames(
    'AppBarComponent',
    classNameProp
  );
  return (
    <div className={classNameComponent}>
      {children}
    </div>
  );
}

AppBar.propTypes = {
  children: PropTypes.node.isRequired,
  classNameProp: PropTypes.string
};

AppBar.defaultProps = {
  classNameProp: undefined
};

export default AppBar;
