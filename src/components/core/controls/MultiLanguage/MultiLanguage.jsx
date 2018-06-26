/**
 * MultiLanguage Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// action
import { setLanguage } from '@/reducers/app/action';
// components
import ModalDialog from '@/components/core/controls/ModalDialog';

import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import TickSVG from '@/assets/images/icon/tick.svg';
// style
import './MultiLanguage.scss';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
  }, {
    code: 'fr',
    name: 'French',
  }, {
    code: 'de',
    name: 'German',
  }, {
    code: 'es',
    name: 'Spanish',
  }, {
    code: 'zh',
    name: 'Chinese',
  }, {
    code: 'ru',
    name: 'Russian',
  }, {
    code: 'ko',
    name: 'Korean',
  }, {
    code: 'ja',
    name: 'Japan',
  },
];

class MultiLanguage extends React.PureComponent {
  constructor(props) {
    super(props);
    // bind
    this.changeCountry = ::this.changeCountry;
  }

  getFlagIcon(code) {
    switch (code) {
      case 'en':
        return 'gb';
      case 'ja':
        return 'jp';
      case 'zh':
        return 'cn';
      case 'ko':
        return 'kr';
      default:
        return code;
    }
  }

  getCountryName(locale) {
    const hasSupportLanguage = LANGUAGES.find(language => language.code === locale);
    return hasSupportLanguage || LANGUAGES[0];
  }

  changeCountry(countryCode) {
    this.props.setLanguage(countryCode, false);
    this.modalLanguageRef.close();
  }

  render() {
    const { locale } = this.props.app;
    const countrySelecting = this.getCountryName(locale);
    return (
      <div className={`multi-language ${this.props.className || ''}`}>
        <span className="country-name" onClick={() => this.modalLanguageRef.open()}>
          {countrySelecting.name}
        </span>
        <img className="expand-arrow" src={ExpandArrowSVG} alt="expand" />
        <ModalDialog onRef={(modal) => { this.modalLanguageRef = modal; return null; }}>
          <div className="country-block">
            <p className="text">Select your language</p>
            {
              LANGUAGES.map(language => (
                <div
                  key={language.code}
                  className={`country ${locale === language.code && 'active'}`}
                  onClick={() => this.changeCountry(language.code)}
                >
                  <span className="name">{language.name}</span>
                  {
                    locale === language.code && (
                      <img className="tick" src={TickSVG} alt="active" />
                    )
                  }
                </div>
              ))
            }
          </div>
        </ModalDialog>
      </div>
    );
  }
}

MultiLanguage.propTypes = {
  className: PropTypes.string,
  app: PropTypes.object.isRequired,
  setLanguage: PropTypes.func.isRequired,
};

MultiLanguage.defaultProps = {
  className: '',
};

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  setLanguage,
});

export default connect(mapState, mapDispatch)(MultiLanguage);
