import React from 'react';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconChat from '@/assets/images/icon/chat-icon.svg';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import iconLogoWhite from '@/assets/images/icon/logo-white.svg';
import iconInfo from '@/assets/images/icon/icons8-info_filled.svg';
import iconPhone from '@/assets/images/icon/icon-phone.svg';
import iconStar from '@/assets/images/icon/icon-star.svg';
import './FeedMe.scss';
import './FeedMeCash.scss';
import { Link } from 'react-router-dom';
import { EXCHANGE_ACTION, HANDSHAKE_USER, URL } from '@/constants';
import { daysBetween, formatAmountCurrency, formatMoneyByLocale } from '@/services/offer-util';
import { FormattedMessage } from 'react-intl';

class FeedMeCash extends React.PureComponent {
  state = { timePassing: '' };
  componentDidMount() {
    this.intervalCountdown = setInterval(() => {
      const { lastUpdateAt } = this.props;
      this.setState({ timePassing: daysBetween(new Date(lastUpdateAt * 1000), new Date()) });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  handleClickMoreInfo = () => {
    console.log('click more info');
    const {
      onShowModalDialog, phone, phoneDisplayed, review, reviewCount,
    } = this.props;
    onShowModalDialog({
      show: true,
      modalContent: (
        <div className="modal-more-info-content">
          <span className="button-close" onClick={() => onShowModalDialog({ show: false })}>&times;</span>
          <div className="d-table w-100">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}><img src={iconLogoWhite} width="35px" /></div>
            <div className="d-table-cell align-middle"><span className="heading-text"><FormattedMessage id="ex.shop.shake.label.information" /></span></div>
          </div>
          <hr className="line-hr" />

          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="d-table w-100">
                <div className="d-table-cell align-middle" style={{ width: '50px' }}>
                  <img src={iconPhone} width="35px" />
                </div>
                <div className="d-table-cell align-middle">
                  <div className="label-modal-more-info"><FormattedMessage id="ex.shop.shake.label.phone" /></div>
                  <div className="phone-number"><a href={`tel:${phoneDisplayed}`} >{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }

          <div className="d-table w-100 mt-3">
            <div className="d-table-cell align-middle" style={{ width: '50px' }}>
              <img src={iconStar} width="35px" />
            </div>
            <div className="d-table-cell align-middle">
              <div className="label-modal-more-info"><FormattedMessage id="ex.shop.shake.label.reviews" /></div>
              <div className="phone-number">
                <StarsRating className="d-inline-block" starPoint={review} startNum={5} />
                <span className="ml-2"><FormattedMessage id="ex.shop.shake.label.reviews.count" values={{ reviewCount }} /></span>
              </div>
            </div>
          </div>

        </div>
      ),
      propsModal: {
        className: 'modal-me-cash-more-info',
      },
    });
  };

  render() {
    const {
      statusText, message,
      cashTitle, coinTitle,
      isCreditCard,
      showInfo, showChat, chatUsername,
      nameShop,
      address, messageMovingCoin,
      actionButtons,
      amount,
      fiatAmount,
      currency,
      fiatCurrency,
      showClock,
      userAddress,
    } = this.props;
    // console.log('thisss', this.props);
    return (
      <div className="feed-me-cash">
        <div className="d-table w-100">
          <div className="d-table-cell">
            <div className="status">{statusText}</div>
            <div className="status-explanation">{messageMovingCoin}</div>
          </div>
          { showClock && (
            <div className="countdown d-table-cell text-right">
              <img src={iconSpinner} width="14px" style={{ marginTop: '-2px' }} />
              <span className="ml-1">{this.state.timePassing}</span>
            </div>)
          }
        </div>
        <div className={isCreditCard ? 'order-instant' : 'order-type'}>{message}</div>
        {
          !isCreditCard && (
            <div>
              <div>
                <div className="info-wrapper">
                  <div className="label">{coinTitle}</div>
                  <div className="price">{`${formatAmountCurrency(amount)} ${currency}`}</div>
                </div>
                <div className="info-wrapper">
                  <div className="label">{cashTitle}</div>
                  <div className="price">{`${formatMoneyByLocale(fiatAmount, fiatCurrency)} ${fiatCurrency}`}</div>
                </div>
              </div>
              <hr className="hrLine" />
              <div className="d-table w-100">
                <div className="d-table-cell align-middle" style={{ width: '42px' }}>
                  <img src={iconAvatar} width="35px" alt="" />
                </div>
                <div className="d-table-cell align-middle address-info">
                  <div className="name-shop">{nameShop}</div>
                  {
                    userAddress && (<div className="d-inline-block">{`${userAddress.substr(0, 4)}...${userAddress.substr(userAddress.length - 6)}`}</div>)
                  }
                  {
                    showInfo && (<div className="d-inline-block">{address}</div>)
                  }
                </div>
                {showInfo && (<div
                  className="d-table-cell text-right align-middle"
                  style={{width: '35px'}}
                >
                  <span className="d-inline-block p-0" onClick={this.handleClickMoreInfo}>
                    <img src={iconInfo} width="35px"/>
                  </span>
                      </div>)
                }

                {
                  !isCreditCard && showChat && (
                    <div
                      className="d-table-cell text-right align-middle"
                      style={{ width: '50px' }}
                    >
                <span className="d-inline-block p-0">
                  <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                    <img src={iconChat} width="35px" />
                  </Link>
                </span>
                    </div>
                  )
                }
              </div>
              {actionButtons}
            </div>
          )
        }
      </div>
    );
  }
}

export default FeedMeCash;
