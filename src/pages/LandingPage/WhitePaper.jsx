/**
 * Trade component.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service
import axios from 'axios';
import qs from 'qs';
import { showAlert } from '@/reducers/app/action';
import { injectIntl } from 'react-intl';

import Alert from '@/components/core/presentation/Alert';

// style
import './WhitePaper.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/trading-ninja.svg';
import tradeCoinExchange from '@/assets/images/icon/landingpage/trade-coin-exchange.svg';
import tradeCoinExchangeRussia from '@/assets/images/icon/landingpage/trade-coin-exchange-russia.svg';
import tradeThirdContainer from '@/assets/images/icon/landingpage/trade-third-container.svg';
import paymentMethodIcon from '@/assets/images/icon/landingpage/trade-payment-method.svg';
import safeIcon from '@/assets/images/icon/landingpage/trade-safe.svg';
import fastAnOnIcon from '@/assets/images/icon/landingpage/trade-fast-and-on.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-white.svg';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';

class Handshake extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="whitePaper">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>{messages.WHITE_PAPER_H1}</h1>
              <p>{messages.WHITE_PAPER_SUBTITLE_1}</p>
              <p>
                {messages.WHITE_PAPER_SUBTITLE_2} <a href="https://t.me/ninja_org.">https://t.me/ninja_org.</a>
              </p>
            </div>

            <div className="col-lg-12">
              <p><strong>{messages.WHITE_PAPER_INTRO}</strong></p>
              <p>{messages.WHITE_PAPER_INTRO_1}</p>
              <ul>
                {messages.WHITE_PAPER_INTRO_2.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p>{messages.WHITE_PAPER_INTRO_3}</p>
              <p><strong>{messages.WHITE_PAPER_INTRO_4_HIGH_LIGHT}</strong></p>
              <p>{messages.WHITE_PAPER_INTRO_5}</p>
              <p>{messages.WHITE_PAPER_INTRO_6}</p>
              <p><strong>{messages.WHITE_PAPER_INTRO_7_HIGH_LIGHT}</strong> {messages.WHITE_PAPER_INTRO_8}</p>
            </div>

            <div className="col-lg-12">
              <h3>{messages.WHITE_PAPER_PEX}</h3>
              <p>{messages.WHITE_PAPER_PEX_1}</p>
              <ul>
                {messages.WHITE_PAPER_PEX_2.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*OiFFCIh0VMzOP5W9" />
              {/*<p className="text-center">{messages.WHITE_PAPER_PEX_3}</p>*/}
            </div>

            <div className="col-lg-12">
              <h3>{messages.WHITE_PAPER_OUTCOME}</h3>
              <p>{messages.WHITE_PAPER_OUTCOME_1}</p>
              <p>{messages.WHITE_PAPER_OUTCOME_2}</p>
              <p>{messages.WHITE_PAPER_OUTCOME_3}</p>
              <img className="img-fluid text-center" src="https://cdn-images-1.medium.com/max/1600/1*yAHrj5g6RzwUQUtyoh3MNg.png" />
              {/*<p className="text-center">{messages.WHITE_PAPER_OUTCOME_4}</p>*/}
            </div>

            <div className="col-lg-12">
              <h3>{messages.WHITE_PAPER_COMPARE}</h3>
              <p>{messages.WHITE_PAPER_COMPARE_1}</p>
              <p>{messages.WHITE_PAPER_COMPARE_2}</p>
              <p>{messages.WHITE_PAPER_COMPARE_3}</p>
              <p>{messages.WHITE_PAPER_COMPARE_4}</p>
              <img className="img-fluid text-center" src="https://cdn-images-1.medium.com/max/1600/0*CeFV-a_gSUS0do5S" />
              {/*<p className="text-center">{messages.WHITE_PAPER_COMPARE_5}</p>*/}
            </div>

             <div className="col-lg-12">
               <h3>{messages.WHITE_PAPER_PEX_WORK}</h3>
               <p>{messages.WHITE_PAPER_PEX_WORK_SUB_TITLE}</p>

               <p><strong>{messages.WHITE_PAPER_STEP_1}</strong></p>
               <p>{messages.WHITE_PAPER_STEP_1_1}</p>
               <p>{messages.WHITE_PAPER_STEP_1_2}</p>
               <img className="img-fluid text-center" src="https://cdn-images-1.medium.com/max/1600/0*a8YWxmX76z9_XA9u" />
               {/*<p className="text-center">{messages.WHITE_PAPER_STEP_1_3}</p>*/}

               <p><strong>{messages.WHITE_PAPER_STEP_2}</strong></p>
               <p>{messages.WHITE_PAPER_STEP_2_1}</p>
               <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*5w0aqMLQuqIElvnP" />
               {/*<p className="text-center">{messages.WHITE_PAPER_STEP_2_2}</p>*/}

               <p><strong>{messages.WHITE_PAPER_STEP_3}</strong></p>
               <p>{messages.WHITE_PAPER_STEP_3_1}</p>
               <p>{messages.WHITE_PAPER_STEP_3_2}</p>
               <p>{messages.WHITE_PAPER_STEP_3_3}</p>
               <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*p1ssaZDN5IrczCvs" />
               {/*<p className="text-center">{messages.WHITE_PAPER_STEP_3_4}</p>*/}

               <p><strong>{messages.WHITE_PAPER_STEP_4}</strong></p>
               <p>{messages.WHITE_PAPER_STEP_4_1}</p>
               <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*kj9pwxJ9_rRg1BH6" />
               {/*<p className="text-center">{messages.WHITE_PAPER_STEP_4_2}</p>*/}
            </div>

             <div className="col-lg-12">
               <h3>{messages.WHITE_PAPER_CREATE}</h3>
               <p>{messages.WHITE_PAPER_CREATE_1}</p>
            </div>

            <div className="col-lg-12">
              <h3>{messages.WHITE_PAPER_ARCHITECTURE}</h3>
              <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/1*Egzm5YVAAIH25AJqRovmEw.png"/>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_1}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_ARCHITECTURE_2_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_2}</p>
              <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*bNRuCO61Pg_hX_ra" />

              <ul>
                <li><strong>{messages.WHITE_PAPER_ARCHITECTURE_3_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_3}</p>
              <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*DzT7lTaGIqTUCFE9"/>
              {/*<p className="text-center">{messages.WHITE_PAPER_ARCHITECTURE_3_1}</p>*/}

              <ul>
                <li><strong>{messages.WHITE_PAPER_ARCHITECTURE_4_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_4_1}</p>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_4_2}</p>
              <img className="img-fluid" src="https://cdn-images-1.medium.com/max/1600/0*cWpKqwrxM3IUdbqa"/>
              {/*<p className="text-center">{messages.WHITE_PAPER_ARCHITECTURE_4_3}</p>*/}
              <ol>{messages.WHITE_PAPER_ARCHITECTURE_4_4.map((item, index) => (
                <li key={index}>{item}</li>
              ))}</ol>

              <ul>
                <li><strong>{messages.WHITE_PAPER_ARCHITECTURE_5_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_5}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_ARCHITECTURE_6_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_ARCHITECTURE_6}</p>
            </div>

            <div className="col-lg-12">
              <h3>{messages.WHITE_PAPER_PRIVACY}</h3>
              <p>{messages.WHITE_PAPER_PRIVACY_SUB}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_PRIVACY_1_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_PRIVACY_1}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_PRIVACY_2_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_PRIVACY_2_1} {messages.WHITE_PAPER_PRIVACY_2_2}</p>
              <p>{messages.WHITE_PAPER_PRIVACY_2_3}</p>
              <p>{messages.WHITE_PAPER_PRIVACY_2_4}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_PRIVACY_3_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_PRIVACY_3}</p>

              <ul>
                <li><strong>{messages.WHITE_PAPER_PRIVACY_4_HL}</strong></li>
              </ul>
              <p>{messages.WHITE_PAPER_PRIVACY_4}</p>
            </div>

            <div className="col-lg-12">
               <h3>{messages.WHITE_PAPER_FEE}</h3>
               <p>{messages.WHITE_PAPER_FEE_1}</p>
               <p>{messages.WHITE_PAPER_FEE_2}</p>
               <p dangerouslySetInnerHTML={{__html: messages.WHITE_PAPER_FEE_3}} />
               <p>{messages.WHITE_PAPER_FEE_4}</p>
            </div>

            <div className="col-lg-12">
               <h3>{messages.WHITE_PAPER_SETTLEMENT}</h3>
               <p>{messages.WHITE_PAPER_SETTLEMENT_1}</p>
               <p>{messages.WHITE_PAPER_SETTLEMENT_2}</p>
            </div>

            <div className="col-lg-12">
               <h3>{messages.WHITE_PAPER_SUMMARY}</h3>
              <p>{messages.WHITE_PAPER_SUMMARY_1} <strong>{messages.WHITE_PAPER_SUMMARY_2}</strong></p>
               <p>{messages.WHITE_PAPER_SUMMARY_3} <a href="https://github.com/ninjadotorg" target="_blank" rel="noopener noreferrer">https://github.com/ninjadotorg</a>.</p>
               <p>{messages.WHITE_PAPER_SUMMARY_4} <a href="https://t.me/ninja_org" target="_blank" rel="noopener noreferrer">https://t.me/ninja_org</a>.</p>
            </div>

            {
              locale === 'ru' && (
                <div className="col-lg-12">
                  <h3>{messages.WHITE_PAPER_END}</h3>
                  <p>
                    {messages.WHITE_PAPER_END_1} <a href="http://ninja.org" target="_blank" rel="noopener noreferrer">http://ninja.org</a>
                  </p>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}


Handshake.propTypes = {
};


export default injectIntl(Handshake);
