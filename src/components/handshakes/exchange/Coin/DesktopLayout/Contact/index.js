import React from 'react';
import { Link } from 'react-router-dom';
import { LANDING_PAGE_TYPE, URL } from '@/constants';
import questionIcon from '@/assets/images/pages/coin/question_icon.png';
import './styles.scss';

const scopedCss = (className) => `crypto-coin-contact-${className}`;

const Contact = () => {
  return (
    <div className={scopedCss('container')}>
      <div className={scopedCss('item')}>
        <img src={questionIcon} alt="" />
        <Link to="coin/faq"><span>FAQs</span></Link>
      </div>
      <div className={scopedCss('item')}>
        <img src={questionIcon} alt="" />
        <a href="tel:0902425186"><span>0902 425 186</span></a>
      </div>
    </div>
  );
};

export default Contact;
