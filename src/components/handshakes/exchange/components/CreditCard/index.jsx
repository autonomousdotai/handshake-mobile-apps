import React from 'react';
// import Button from '@/components/core/controls/Button/Button';
// import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import {FormattedMessage, injectIntl} from 'react-intl';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import styled from 'styled-components';
import { Field } from "redux-form";

import imgCC from '@/assets/images/card/credit-card.svg';
// import imgAmex from '@/assets/images/card/amex.svg';
// import imgDiscover from '@/assets/images/card/discover.svg';
// import imgMastercard from '@/assets/images/card/mastercard.svg';
// import imgVisa from '@/assets/images/card/visa.svg';

import { fieldInput, fieldCleave, fieldDropdown } from '@/components/core/form/customField'
import validation, { required } from '@/components/core/form/validation'
import { connect } from "react-redux";

const heightOfTabsHeader = 0.5;

// trick to make background larger than its div
const Wrapper = styled.div`
  background: #50af4f;

  // padding-left: ${heightOfTabsHeader}rem;
  // margin-left: -${heightOfTabsHeader}rem;
  //
  // padding-right: ${heightOfTabsHeader}rem;
  // margin-right: -${heightOfTabsHeader}rem;
  //
  // padding-bottom: ${heightOfTabsHeader}rem;
  // margin-bottom: -${heightOfTabsHeader}rem;
`


// const allCCTypes = {
//   amex: {
//     name: 'amex',
//     img: imgAmex
//   },
//   discover: {
//     name: 'discover',
//     img: imgDiscover
//   },
//   mastercard: {
//     name: 'mastercard',
//     img: imgMastercard
//   },
//   visa: {
//     name: 'visa',
//     img: imgVisa
//   },
// }


class Component extends React.Component {
  state = {
    ccType: '',
  }
  handleCCTypeChanged = (type) => {
    this.setState({ ccType: type })
  }

  render() {
    const {intl} = this.props;
    const { isCCExisting, lastDigits, isNewCCOpen, handleToggleNewCC } = this.props;
    const { ccType } = this.state;

    const newCCElement = (
      <div className="pt-2">
        <div className="d-flex">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}><FormattedMessage id="ccNumber"/></label>
          <div className='input-group'>
            <Field
              name="cc_number"
              className="form-control-custom form-control-custom-ex w-100"
              component={fieldCleave}
              // elementPrepend={
              //   <div className="input-group-prepend">
              //     <span className="input-group-text bg-white">
              //       <img width="26px" height="26px" src={(allCCTypes[ccType] && allCCTypes[ccType].img) || imgCC} />
              //     </span>
              //   </div>
              // }
              propsCleave={{
                // id: `card-number-${this.lastUniqueId()}`,
                placeholder: intl.formatMessage({id: 'required'}),
                options: {
                  creditCard: true,
                  onCreditCardTypeChanged: this.handleCCTypeChanged
                },
                // type: "tel",
                // maxLength: "19",
                // htmlRef: input => this.ccNumberRef = input,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
        <div className="d-flex mt-2">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}><FormattedMessage id="ccExpire"/></label>
          <div className='input-group'>
            <Field
              name="cc_expired"
              className='form-control-custom form-control-custom-ex w-100'
              component={fieldCleave}
              propsCleave={{
                placeholder: intl.formatMessage({id: 'ccExpireTemplate'}),
                options: {blocks: [2, 2], delimiter: '/', numericOnly: true},
                // type: "tel",
                // id: `cart-date-${this.lastUniqueId()}`,
                // htmlRef: input => this.ccExpiredRef = input,
                // onKeyDown: this.ccExpiredRefKeyDown,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
        <div className="d-flex mt-2">
          <label className="col-form-label mr-auto" style={{ width: '100px' }}><FormattedMessage id="ccCVC"/></label>
          <div className='input-group'>
            <Field
              name="cc_cvc"
              className='form-control-custom form-control-custom-ex w-100'
              component={fieldCleave}
              propsCleave={{
                placeholder: intl.formatMessage({id: 'securityCode'}),
                options: {blocks: [4], numericOnly: true},
                // type: "password",
                // maxLength: "4",
                // minLength: "3",
                // id: `cart-cvc-${this.lastUniqueId()}`,
                // htmlRef: input => this.ccCvcRef = input,
              }}
              // validate={(!isCCExisting || isNewCCOpen) ? [required] : []}
            />
          </div>
        </div>
      </div>
    )
    return (
      <Wrapper className="rounded p-2">
        <div className='col1'>
          {
            isCCExisting ? (
              <div>
                <div className='d-flex' style={{ height: '36px', lineHeight: '36px' }}>
                  <span>
                    <img className='mx-2' width="26px" height="26px" src={imgCC} />
                    <span>∗∗∗∗ ∗∗∗∗ ∗∗∗∗ {lastDigits}</span>
                  </span>
                  <span className="ml-auto" style={{ width: '120px' }}>
                    <Field
                      name="toggleCCOpen"
                      component={
                        ({ input: { onChange, value } }) =>
                          <button className="w-100 btn btn-link text-white" type='button'
                                  onClick={() => {
                                    onChange(!value)
                                    handleToggleNewCC()
                                  }}
                          >
                            {intl.formatMessage({id: 'change'})}<span className="ml-2">{value ? '﹀' : '〉'}</span>
                          </button>
                      }
                    />
                  </span>
                </div>
                <Collapse isOpen={isNewCCOpen}>
                  {newCCElement}
                </Collapse>
              </div>
            ) : (
              <div>
                {newCCElement}
              </div>
            )
          }
        </div>
      </Wrapper>
    )
  }
}

export default injectIntl(Component);
