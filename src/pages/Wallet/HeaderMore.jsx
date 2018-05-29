import React from 'react';
import PropTypes from 'prop-types';

import './Wallet.scss';
import iconHeaderMode from '@/assets/images/icon/icon-more-wallet.svg';


class HeaderMore extends React.Component {
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

  render() {
    const { onHeaderMoreClick } = this.props;
    return (
      <img src={iconHeaderMode} onClick={onHeaderMoreClick}/> 
    );
  }
}

HeaderMore.propTypes = {
  onHeaderMoreClick: PropTypes.func,
};

export default HeaderMore;
