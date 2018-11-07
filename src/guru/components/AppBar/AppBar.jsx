import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './AppBar.scss';

function AppBar(props) {
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
