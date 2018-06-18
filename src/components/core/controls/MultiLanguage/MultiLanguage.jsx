/**
 * MultiLanguage Component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// action
import { changeLocale } from '@/reducers/app/action';
// components
import ModalDialog from '@/components/core/controls/ModalDialog';
// style
import './MultiLanguage.scss';

const LANGUAGES = [
  {
    code: 'gb',
    name: 'English',
  },{
    code: 'fr',
    name: 'French',
  },{
    code: 'de',
    name: 'German',
  },{
    code: 'es',
    name: 'Spanish',
  },{
    code: 'cn',
    name: 'Chinese',
  },{
    code: 'ru',
    name: 'Russian',
  },{
    code: 'kr',
    name: 'Korean',
  },{
    code: 'jp',
    name: 'Japan',
  },
];

class MultiLanguage extends React.PureComponent {
  constructor(props) {
    super(props);
    // bind
    this.changeCountry  = ::this.changeCountry;
  }

  changeCountry(countryCode) {
    this.props.changeLocale(countryCode);
    this.modalLanguageRef.close();
  }

  render() {
    const { locale } = this.props.app;
    const flag = locale === 'en' ? 'gb' : locale;
    return (
      <div className="multi-language">
        <span className={`flag-icon flag-icon-${flag}`} onClick={() => this.modalLanguageRef.open()} />
        <ModalDialog onRef={modal => this.modalLanguageRef = modal}>
          <div className="country-block">
            <p className="text">Delivered Language</p>
            {
              LANGUAGES.map(language => (
                <div
                  key={language.code} 
                  className={`country ${locale === language.code && 'active'}`}
                  onClick={() => this.changeCountry(language.code)}>
                  <span className={`flag flag-icon flag-icon-${language.code}`} />
                  <span className="name">{language.name}</span>
                  <span className="radio" />
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
  app: PropTypes.object,
  changeLocale: PropTypes.func,
};

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  changeLocale,
});

export default connect(mapState, mapDispatch)(MultiLanguage);
