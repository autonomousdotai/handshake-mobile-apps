/**
 * MultiLanguage Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// action
import { setLanguage } from '@/reducers/app/action';
// style
import './ChangeLanguage.scss';

const LANGUAGES = {
  EN: {
    code: 'en',
    name: '🇺🇸 English',
  },
  // VN: {
  //   code: 'vi',
  //   name: '🇻🇳 Tiếng Việt',
  // },
  HK: {
    code: 'zh-HK',
    name: '🇭🇰 Hong Kong',
  },
};

const scopedCss = (className) => `change-language-${className}`;

class ChangeLanguage extends React.PureComponent {
  constructor(props) {
    super(props);
    // bind
    this.changeCountry = ::this.changeCountry;
  }

  getOtherLang() {
    const { locale } = this.props;
    if (locale === 'zh-HK') {
      return LANGUAGES.EN;
    }
    return LANGUAGES.HK;
  }

  changeCountry(locale) {
    this.props.setLanguage(locale, true);
  }

  render() {
    const otherLang = this.getOtherLang();
    const { className } = this.props;
    return (
      <div className={`${scopedCss('container')} ${className}`}>
        <span className="country-name" onClick={() => this.changeCountry(otherLang.code)}>
          {otherLang.name}
        </span>
      </div>
    );
  }
}

ChangeLanguage.propTypes = {
  className: PropTypes.string,
  setLanguage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

ChangeLanguage.defaultProps = {
  className: '',
};

const mapState = state => ({
  locale: state?.app.locale || 'zh-HK',
});

const mapDispatch = ({
  setLanguage,
});

export default connect(mapState, mapDispatch)(ChangeLanguage);
