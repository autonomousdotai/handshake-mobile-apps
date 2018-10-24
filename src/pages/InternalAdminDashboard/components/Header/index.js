import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const scopeCss = (className) => `internal-admin-header-${className}`;

export default class Header extends Component {
  render() {
    const { title } = this.props;
    return (
      <div className={scopeCss('container')}>
        <span><span className="header-title">Admin Dashboard</span>{title ? ` - ${title}` : ''}</span>
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
};

Header.defaultProps = {
  title: null,
};
