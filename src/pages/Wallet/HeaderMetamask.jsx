
import iconAddPlus from '@/assets/images/wallet/icons/icon-add-plus.svg';
import iconAlignJust from '@/assets/images/wallet/icons/icon-align-just.svg';

import React from 'react';
import PropTypes from 'prop-types';

import './Wallet.scss';

class HeaderMetamask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      icon: !props.status ? iconAddPlus : iconAlignJust,
      status: props.status
    };
  }

  onStatusClick = () => {
    if (this.state.status === undefined) {
      return;
    }
    const status = !this.state.status;
    this.props.onChangeStatus(status);
    this.setState({
      icon: status ? iconAlignJust : iconAddPlus,
      status
    });
  };

  onGetTitle = () => {
    return this.state.status === undefined ? 'Please active Metamask' : this.props.title;
  };

  render() {
    return (
      <div className="headerBox" >
        <span className="headerText"> {this.onGetTitle()} </span>
        <span onClick={this.onStatusClick} >
          <img alt="" src={this.state.icon} />
        </span>
      </div>
    );
  }
}

HeaderMetamask.propTypes = {
  title: PropTypes.string,
  status: PropTypes.bool,
  onChangeStatus: PropTypes.func
};

HeaderMetamask.defaultProps = {
  title: '',
  status: undefined,
  onChangeStatus: undefined
};

export default HeaderMetamask;
