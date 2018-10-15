import React from 'react';
import PropTypes from 'prop-types';

import './Payment.scss';


class Header extends React.Component {
  constructor(props) {
    super(props);
    // bind
    // this.open = this.open.bind(this);
    // this.close = this.close.bind(this);
  }

  open() {
    // this.modalRef && this.modalRef.classList.add('modal-custom-show');
  }

  close() {
    // this.modalRef && this.modalRef.classList.remove('modal-custom-show');
  }

  componentDidMount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    // this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  renderLink(){
    const { hasLink, title, linkTitle, onLinkClick } = this.props;
    if (!hasLink) return "";
    return (
      <div onClick={onLinkClick} className="headerLink">{linkTitle}</div>
    );
  }

  render() {
    const { hasLink, title, linkTitle, onLinkClick } = this.props;
    return (
        <div className="headerBox">
          <span className="headerText">{title}</span>
          {this.renderLink()}
        </div>
    );
  }
}

Header.propTypes = {
  hasLink: PropTypes.bool,
  title: PropTypes.string,
  linkTitle: PropTypes.string,
  onLinkClick: PropTypes.func,
};

export default Header;
