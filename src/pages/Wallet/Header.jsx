import React from 'react';
import PropTypes from 'prop-types';

import './Wallet.scss';


class Header extends React.Component {
  render() {
    const { title } = this.props;
    return (
        <div className="headerBox">
          <span className="headerText">{title}</span>
        </div>
    );
  }
}

Header.propTypes = {
  hasLink: PropTypes.bool,
  title: PropTypes.string,
  linkTitle: PropTypes.string,
  icon : PropTypes.any,
  icon2: PropTypes.any,
  onLinkClick: PropTypes.func,
  onIcon2Click: PropTypes.func,
};

export default Header;
