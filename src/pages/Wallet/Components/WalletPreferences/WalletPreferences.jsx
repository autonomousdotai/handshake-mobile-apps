import React from 'react';
import PropTypes from 'prop-types';

import './WalletPreferences.scss';

import Switch from '../../../../components/core/controls/Switch';

class WalletPreferences extends React.Component {
  constructor(props) {
    super(props);       
  }

  componentDidMount() {
   
  }

  componentWillUnmount() {
   
  }

  renderLink(){
    const { hasLink, title, icon, icon2, linkTitle, onLinkClick, onIcon2Click } = this.props;
    if (!hasLink) return "";
    let html ='';
    if (icon){
     html = <img onClick={onLinkClick} src={icon} />
    }
    else    
      html = <div onClick={onLinkClick} className="headerLink">{linkTitle}</div>
    if (icon2){
      html = <div> <img className="header-icon-2" onClick={onIcon2Click} src={icon2} />{html} </div>
    }
    return html;
    
  }

  render() {
    const { onItemClick } = this.props;
    return (
        <div className="box-setting">
            <div className="item">
                <div className="name">
                    <label>Name</label>
                </div>
                <div className="value">
                    <span className="text">Phuong De</span>
                </div>
            </div>

            <div className="item">
                <div className="name">
                    <label>Hide Balance</label>
                </div>
                <div className="value">
                  <Switch />
                </div>
            </div>

            <div className="item">
                <div className="name">
                    <label>Backup Wallet</label>
                </div>
                <div className="value">
                  
                </div>
            </div>

            <div className="item">
                <div className="name">
                    <label>Delete Wallet</label>
                </div>
                <div className="value">
                  
                </div>
            </div>


        </div>
    );
  }
}

WalletPreferences.propTypes = {
  hasLink: PropTypes.bool,
  title: PropTypes.string,
  linkTitle: PropTypes.string,
  icon : PropTypes.any,
  icon2: PropTypes.any,
  onLinkClick: PropTypes.func,
  onIcon2Click: PropTypes.func,
};

export default WalletPreferences;
