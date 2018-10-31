import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import questionIcon from '@/assets/images/pages/coin/question_icon.png';
import './styles.scss';

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
          <Link to="coin/faq"><span>{this.getLocalStr().faq}</span></Link>
        </div>
        <div className={scopedCss('item')}>
          <img src={questionIcon} alt="" />
          <Link to=""><span>{this.getLocalStr().chat_with_us}</span></Link>
        </div>
        <div className={scopedCss('item')}>
          <img src={questionIcon} alt="" />
          <a href="tel:0902425186"><span>{this.getLocalStr().phone_cs}</span></a>
        </div>
      </div>
    );
  }
}

Contact.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Contact);

