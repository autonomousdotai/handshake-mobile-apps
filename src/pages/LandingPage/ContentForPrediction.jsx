import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl'
import { URL } from '@/constants';

import './ContentForCashBusiness.scss';

import imgPredictionContent from '@/assets/images/landing/prediction/fake-content.svg';
import { Link } from 'react-router-dom'

class ContentForPrediction extends React.Component {
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="row mt-5">
        <div className="col">
          <img src={imgPredictionContent} className="w-100" />
          <div className="mt-5">For instructions on how to play: <Link to={URL.PEX_INSTRUCTION_URL}>http://ninja.org/pex/instruction</Link></div>
        </div>
      </div>
    );
  }
}

ContentForPrediction.propTypes = {};

export default injectIntl(ContentForPrediction);
