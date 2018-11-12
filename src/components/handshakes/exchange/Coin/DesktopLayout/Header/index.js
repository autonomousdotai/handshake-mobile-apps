import React from 'react';
import { Link } from 'react-router-dom';
import { LANDING_PAGE_TYPE, URL } from '@/constants';
import imgNinja from '@/assets/images/ninja/ninja-header-black.svg';
import { FormattedMessage } from 'react-intl';
import './styles.scss';

const scopedCss = (className) => `crypto-coin-header-${className}`;

const Header = () => {
  const logo = <Link to="/" className="d-inline-block mt-1"><img alt="logo" src={imgNinja} width="100" /></Link>;
  const navLinks = (
    <span>
      <span><Link className="landing-nav-link" to={LANDING_PAGE_TYPE.product.url}>Product</Link></span>
      <span><Link className="landing-nav-link" to={LANDING_PAGE_TYPE.research.url}>Research</Link></span>
    </span>
  );
  const btnJoin = <Link className="btn btn-primary-landing" to={URL.RECRUITING}><FormattedMessage id="landing_page.btn.joinOurTeam" /></Link>;
  return (
    <div className={`${scopedCss('container')} row d-none d-md-flex`}>
      <div className="col-2">
        {logo}
      </div>
      <div className="col-10">
        <div className="text-right">
          {/*<span className="mr-4">{navLinks}</span>*/}
          {/*{btnJoin}*/}
        </div>
      </div>
    </div>
  );
};

export default Header;
