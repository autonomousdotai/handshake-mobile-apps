import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { URL } from '@/config';
import { clearHeaderBack } from '@/reducers/app/action';

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
  };
  renderItem = ({ uri, text, src }) => {
    console.log(this.props);
    const suffixCss = this.props?.location?.pathname?.startsWith(uri)
      ? 'selected'
      : '';
    // const suffixCss = "";
    const classNameIcon = `icon${suffixCss}`;
    const classNameText = `text${suffixCss}`;
    const icon = require(`@/assets/images/${src}.svg.raw`);
    return (
      <Link
        to={uri}
        style={styles.actionButton}
        onClick={this.props.clearHeaderBack}
      >
        <div
          className={classNameIcon}
          dangerouslySetInnerHTML={{
            __html: icon,
          }}
        />
        <label className={classNameText}>{text}</label>
      </Link>
    );
  };
  render() {
    return (
      <footer className="footer">
        <ul>
          <li>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_private.svg.raw`) }}/>
              <label>Me</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_DISCOVER_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_discover.svg.raw`) }}/>
              <label>Discover</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_CREATE_INDEX}>
              <div className="create" dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_add.svg.raw`) }}/>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_CHAT_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_chat.svg.raw`) }}/>
              <label>Chat</label>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{__html: require(`@/assets/images/navigation/ic_wallet.svg.raw`) }}/>
              <label>Wallet</label>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    shadowOpacity: 0.5,
    shadowColor: '#E1E1E1',
    shadowRadius: 10,
    borderTop: '1px solid #E1E1E1',
    justifyContent: 'space-around',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textActionButton: {},
  textActionButtonSelected: {},
};

export default connect(null, { clearHeaderBack })(Navigation);
