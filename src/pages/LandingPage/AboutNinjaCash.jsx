import React from "react";
import { showAlert } from "@/reducers/app/action";
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';

// style
import "./AboutNinjaCash.scss";
import logo from '@/assets/images/logo.png';

class About extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="about-cash">
        <div className="container">
          <div className="row text-center">
            <div className="col">
              <div className="heading-text"><FormattedMessage id="ex.about.label.about" /></div>
              <div><img className="logo" src={logo} /></div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col">
              <FormattedHTMLMessage id="ex.about.description" />
              <h4 className="mt-5"><FormattedMessage id="ex.about.label.connectWith" /></h4>
              <ul>
                <li>
                  <div><FormattedMessage id="ex.about.label.website" />: <FormattedMessage id="ex.about.label.website.value" /></div>
                </li>
                <li>
                  <div><FormattedMessage id="ex.about.label.telegram" />: <FormattedMessage id="ex.about.label.telegram.value" /></div>
                </li>
                {/*<li>
                  <div><FormattedMessage id="ex.about.label.medium" />:<a target="__blank" className="btn btn-link" href="http://medium.com/@ninjadotorg">medium.com/@ninjadotorg</a></div>
                </li>
                <li>
                  <div><FormattedMessage id="ex.about.label.github" />:<a target="__blank" className="btn btn-link" href="https://github.com/ninjadotorg">github.com/ninjadotorg</a></div>
                </li>
                <li>
                  <div><FormattedMessage id="ex.about.label.twitter" />:<a target="__blank" className="btn btn-link" href="http://twitter.com/@ninjadotorg">twitter.com/@ninjadotorg</a></div>
                </li>*/}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

About.propTypes = {};

export default injectIntl(About);
