import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import questionIcon from '@/assets/images/pages/coin/question_icon.png';
import './styles.scss';
import { URL } from '@/constants';

const scopedCss = (className) => `crypto-coin-contact-${className}`;

class Contact extends PureComponent {
  getLocalStr = () => {
    const { intl: { messages } } = this.props;
    return messages?.coin_crypto?.contact || {};
  }

  render() {
    return (
      <div className={scopedCss('container')}>
        <div className={scopedCss('item')}>
          <img src={questionIcon} alt="" />
          <Link to={URL.BUY_COIN_FAQ_URL}><span>{this.getLocalStr().faq}</span></Link>
        </div>
        <div className={scopedCss('item')}>
          <img src={questionIcon} alt="" />
          <Link to={URL.ABOUT_NINJA_CASH}><span>{this.getLocalStr().chat_with_us}</span></Link>
        </div>
        {/* <div className={scopedCss('item')}>
          <img src={questionIcon} alt="" />
          <a href={`tel:${this.getLocalStr().phone_cs.replace(/\D/g, '')}`}><span>{this.getLocalStr().phone_cs}</span></a>
        </div> */}
      </div>
    );
  }
}

Contact.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Contact);

