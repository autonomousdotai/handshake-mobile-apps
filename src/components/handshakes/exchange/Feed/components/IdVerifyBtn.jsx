import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { EXCHANGE_ACTION, URL } from '@/constants';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import './styles.scss';

class IdVerifyBtn extends React.PureComponent {
  checkUserVerified = () => {
    const { messages } = this.props.intl;
    const { authProfile: { idVerified, idVerificationLevel }, coinTab } = this.props;

    let timeShow = 0;
    let title = '';
    let action = '';
    let className = '';

    console.log('coinTab',coinTab);

    switch (idVerified) {
      case 0: {
        timeShow = 24 * 60 * 60 * 1000;

        if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.BUY) >= 0) {
          title = messages.buy_coin.label.verify.notYet.title;
          action = messages.buy_coin.label.verify.notYet.action;
        } else if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.SELL) >= 0) {
          title = messages.sell_coin.label.verify.notYet.title;
          action = messages.sell_coin.label.verify.notYet.action;
        }

        break;
      }
      case -1: {
        timeShow = 24 * 60 * 60 * 1000;

        if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.BUY) >= 0) {
          title = messages.buy_coin.label.verify.rejected.title;
          action = messages.buy_coin.label.verify.rejected.action;
        } else if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.SELL) >= 0) {
          title = messages.sell_coin.label.verify.rejected.title;
          action = messages.sell_coin.label.verify.rejected.action;
        }

        break;
      }
      case 1: {
        timeShow = 24 * 60 * 60 * 1000;
        if (idVerificationLevel === 1) {
          if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.BUY) >= 0) {
            title = messages.buy_coin.label.verify.verified.level_1.title;
            action = messages.buy_coin.label.verify.verified.level_1.action;
          } else if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.SELL) >= 0) {
            title = messages.sell_coin.label.verify.verified.level_1.title;
            action = messages.sell_coin.label.verify.verified.level_1.action;
          }

          className = 'info';
        } else if (idVerificationLevel === 2) {
          if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.BUY) >= 0) {
            title = messages.buy_coin.label.verify.verified.level_2.title;
            action = messages.buy_coin.label.verify.verified.level_2.action;
          } else if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.SELL) >= 0) {
            title = messages.sell_coin.label.verify.verified.level_2.title;
            action = messages.sell_coin.label.verify.verified.level_2.action;
          }

          className = 'info';
        }
        break;
      }
      case 2: {
        timeShow = 24 * 60 * 60 * 1000;
        if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.BUY) >= 0) {
          title = messages.buy_coin.label.verify.processing.title;
          action = messages.buy_coin.label.verify.processing.action;
        } else if (coinTab.toLowerCase().indexOf(EXCHANGE_ACTION.SELL) >= 0) {
          title = messages.sell_coin.label.verify.processing.title;
          action = messages.sell_coin.label.verify.processing.action;
        }

        break;
      }
      default: {
      }
    }

    return { title, action, className };
  }

  render() {
    const { dispatch } = this.props;
    const { title, action, className } = this.checkUserVerified();
    return (
      <div className={`PexCreateBtn ${className}`} >
        <div className="Idea">
          <span>{title}</span>
          &nbsp;<Link
            className="verify-link"
            to={{ pathname: URL.HANDSHAKE_ME_PROFILE }}
            onClick={() => {
              dispatch(push(URL.HANDSHAKE_ME_PROFILE));
            }}
          >
            {action}
          </Link>
        </div>
      </div>
    );
  }
}

IdVerifyBtn.propTypes = {
  dispatch: PropTypes.func,
};

IdVerifyBtn.defaultProps = {
  dispatch: undefined,
};

const mapStateToProps = (state) => ({
  authProfile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(IdVerifyBtn));
