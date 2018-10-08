import React from "react";
import { Fade, Flip, Zoom, Slide, LightSpeed } from 'react-reveal';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import $http from '@/services/api';
import { BASE_API } from '@/constants';

import imgBTC from '@/assets/images/landing/wallet/btc.svg';
import imgLTC from '@/assets/images/landing/wallet/ltc.svg';
import imgETH from '@/assets/images/landing/wallet/eth.svg';
import imgXRP from '@/assets/images/landing/wallet/xrp.svg';
import imgZEC from '@/assets/images/landing/wallet/zec.svg';
import imgIPHONE from '@/assets/images/landing/wallet/iphone1.png';
import img1 from '@/assets/images/landing/wallet/1.png';
import imgPromo1 from '@/assets/images/landing/wallet/promo-1.png';
import imgLock from '@/assets/images/landing/wallet/lock-solid.svg';
import imgCheck from '@/assets/images/landing/wallet/check-solid.svg';
import iconSubmitEmail from '@/assets/images/icon/landingpage/email_submit.svg';

import './ContentForWallet.css';
import './ContentForWallet.scss';


const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});

class ContentForWallet extends React.Component {

  constructor() {
    super();

    this.state = {
      isSubscribed: false
    }
  }

  handleSubmit = values => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('product', 'wallet');

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(() => {
        this.setState({isSubscribed: true});
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };

  renderEmailForm(opt = { withDesc: true }) {
    const {
      intl,
    } = this.props;
    const { withDesc } = opt;
    return (
      <span>
        <FormSubscribeEmail onSubmit={this.handleSubmit}>
          <div className="">
              <div className="text-white align-top">
                For updates, subscribe your email
              </div>
              <div className="email-control-group">
                <div className="emailField">
                  <Field
                    name="email"
                    className="form-control control-subscribe-email"
                    placeholder={intl.formatMessage({ id: 'landing_page.detail.email_placeholder' })}
                    type="text"
                    validate={[required, email]}
                    component={fieldInput}
                  />
                  <div className="emailSubmit">
                    <button className="btnEmail" type="submit">
                      <img src={iconSubmitEmail} alt="iconSubmitEmail" />
                    </button>
                  </div>
                </div>

              </div>
          </div>
        </FormSubscribeEmail>
      </span>
    );
  }

  get showCSS(){
    return <style dangerouslySetInnerHTML={{__html: `




    @media (min-width: 576px)
    {
        .container
        {
            max-width: 540px;
        }
    }
    @media (min-width: 768px)
    {
        .container
        {
            max-width: 720px;
        }
    }
    @media (min-width: 992px)
    {
        .container
        {
            max-width: 960px;
        }
    }
    @media (min-width: 1200px)
    {
        .container
        {
            max-width: 1040px;
        }
    }

    .container-fluid
    {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding-right: 15px;
        padding-left: 15px;
    }

    .row
    {
        display: flex;

        margin-right: -15px;
        margin-left: -15px;

        flex-wrap: wrap;
    }

    .no-gutters
    {
        margin-right: 0;
        margin-left: 0;
    }
    .no-gutters > .col,
    .no-gutters > [class*='col-']
    {
        padding-right: 0;
        padding-left: 0;
    }

    .col-1,
    .col-2,
    .col-3,
    .col-4,
    .col-5,
    .col-6,
    .col-7,
    .col-8,
    .col-9,
    .col-10,
    .col-11,
    .col-12,
    .col,
    .col-auto,
    .col-sm-1,
    .col-sm-2,
    .col-sm-3,
    .col-sm-4,
    .col-sm-5,
    .col-sm-6,
    .col-sm-7,
    .col-sm-8,
    .col-sm-9,
    .col-sm-10,
    .col-sm-11,
    .col-sm-12,
    .col-sm,
    .col-sm-auto,
    .col-md-1,
    .col-md-2,
    .col-md-3,
    .col-md-4,
    .col-md-5,
    .col-md-6,
    .col-md-7,
    .col-md-8,
    .col-md-9,
    .col-md-10,
    .col-md-11,
    .col-md-12,
    .col-md,
    .col-md-auto,
    .col-lg-1,
    .col-lg-2,
    .col-lg-3,
    .col-lg-4,
    .col-lg-5,
    .col-lg-6,
    .col-lg-7,
    .col-lg-8,
    .col-lg-9,
    .col-lg-10,
    .col-lg-11,
    .col-lg-12,
    .col-lg,
    .col-lg-auto,
    .col-xl-1,
    .col-xl-2,
    .col-xl-3,
    .col-xl-4,
    .col-xl-5,
    .col-xl-6,
    .col-xl-7,
    .col-xl-8,
    .col-xl-9,
    .col-xl-10,
    .col-xl-11,
    .col-xl-12,
    .col-xl,
    .col-xl-auto
    {
        position: relative;

        width: 100%;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }

    .col
    {
        max-width: 100%;

        flex-basis: 0;
        flex-grow: 1;
    }

    .col-auto
    {
        width: auto;
        max-width: none;

        flex: 0 0 auto;
    }

    .col-1
    {
        max-width: 8.33333%;

        flex: 0 0 8.33333%;
    }

    .col-2
    {
        max-width: 16.66667%;

        flex: 0 0 16.66667%;
    }

    .col-3
    {
        max-width: 25%;

        flex: 0 0 25%;
    }

    .col-4
    {
        max-width: 33.33333%;

        flex: 0 0 33.33333%;
    }

    .col-5
    {
        max-width: 41.66667%;

        flex: 0 0 41.66667%;
    }

    .col-6
    {
        max-width: 50%;

        flex: 0 0 50%;
    }

    .col-7
    {
        max-width: 58.33333%;

        flex: 0 0 58.33333%;
    }

    .col-8
    {
        max-width: 66.66667%;

        flex: 0 0 66.66667%;
    }

    .col-9
    {
        max-width: 75%;

        flex: 0 0 75%;
    }

    .col-10
    {
        max-width: 83.33333%;

        flex: 0 0 83.33333%;
    }

    .col-11
    {
        max-width: 91.66667%;

        flex: 0 0 91.66667%;
    }

    .col-12
    {
        max-width: 100%;

        flex: 0 0 100%;
    }

    .order-first
    {
        order: -1;
    }

    .order-last
    {
        order: 13;
    }

    .order-0
    {
        order: 0;
    }

    .order-1
    {
        order: 1;
    }

    .order-2
    {
        order: 2;
    }

    .order-3
    {
        order: 3;
    }

    .order-4
    {
        order: 4;
    }

    .order-5
    {
        order: 5;
    }

    .order-6
    {
        order: 6;
    }

    .order-7
    {
        order: 7;
    }

    .order-8
    {
        order: 8;
    }

    .order-9
    {
        order: 9;
    }

    .order-10
    {
        order: 10;
    }

    .order-11
    {
        order: 11;
    }

    .order-12
    {
        order: 12;
    }

    .offset-1
    {
        margin-left: 8.33333%;
    }

    .offset-2
    {
        margin-left: 16.66667%;
    }

    .offset-3
    {
        margin-left: 25%;
    }

    .offset-4
    {
        margin-left: 33.33333%;
    }

    .offset-5
    {
        margin-left: 41.66667%;
    }

    .offset-6
    {
        margin-left: 50%;
    }

    .offset-7
    {
        margin-left: 58.33333%;
    }

    .offset-8
    {
        margin-left: 66.66667%;
    }

    .offset-9
    {
        margin-left: 75%;
    }

    .offset-10
    {
        margin-left: 83.33333%;
    }

    .offset-11
    {
        margin-left: 91.66667%;
    }

    @media (min-width: 576px)
    {
        .col-sm
        {
            max-width: 100%;

            flex-basis: 0;
            flex-grow: 1;
        }
        .col-sm-auto
        {
            width: auto;
            max-width: none;

            flex: 0 0 auto;
        }
        .col-sm-1
        {
            max-width: 8.33333%;

            flex: 0 0 8.33333%;
        }
        .col-sm-2
        {
            max-width: 16.66667%;

            flex: 0 0 16.66667%;
        }
        .col-sm-3
        {
            max-width: 25%;

            flex: 0 0 25%;
        }
        .col-sm-4
        {
            max-width: 33.33333%;

            flex: 0 0 33.33333%;
        }
        .col-sm-5
        {
            max-width: 41.66667%;

            flex: 0 0 41.66667%;
        }
        .col-sm-6
        {
            max-width: 50%;

            flex: 0 0 50%;
        }
        .col-sm-7
        {
            max-width: 58.33333%;

            flex: 0 0 58.33333%;
        }
        .col-sm-8
        {
            max-width: 66.66667%;

            flex: 0 0 66.66667%;
        }
        .col-sm-9
        {
            max-width: 75%;

            flex: 0 0 75%;
        }
        .col-sm-10
        {
            max-width: 83.33333%;

            flex: 0 0 83.33333%;
        }
        .col-sm-11
        {
            max-width: 91.66667%;

            flex: 0 0 91.66667%;
        }
        .col-sm-12
        {
            max-width: 100%;

            flex: 0 0 100%;
        }
        .order-sm-first
        {
            order: -1;
        }
        .order-sm-last
        {
            order: 13;
        }
        .order-sm-0
        {
            order: 0;
        }
        .order-sm-1
        {
            order: 1;
        }
        .order-sm-2
        {
            order: 2;
        }
        .order-sm-3
        {
            order: 3;
        }
        .order-sm-4
        {
            order: 4;
        }
        .order-sm-5
        {
            order: 5;
        }
        .order-sm-6
        {
            order: 6;
        }
        .order-sm-7
        {
            order: 7;
        }
        .order-sm-8
        {
            order: 8;
        }
        .order-sm-9
        {
            order: 9;
        }
        .order-sm-10
        {
            order: 10;
        }
        .order-sm-11
        {
            order: 11;
        }
        .order-sm-12
        {
            order: 12;
        }
        .offset-sm-0
        {
            margin-left: 0;
        }
        .offset-sm-1
        {
            margin-left: 8.33333%;
        }
        .offset-sm-2
        {
            margin-left: 16.66667%;
        }
        .offset-sm-3
        {
            margin-left: 25%;
        }
        .offset-sm-4
        {
            margin-left: 33.33333%;
        }
        .offset-sm-5
        {
            margin-left: 41.66667%;
        }
        .offset-sm-6
        {
            margin-left: 50%;
        }
        .offset-sm-7
        {
            margin-left: 58.33333%;
        }
        .offset-sm-8
        {
            margin-left: 66.66667%;
        }
        .offset-sm-9
        {
            margin-left: 75%;
        }
        .offset-sm-10
        {
            margin-left: 83.33333%;
        }
        .offset-sm-11
        {
            margin-left: 91.66667%;
        }
    }

    @media (min-width: 768px)
    {
        .col-md
        {
            max-width: 100%;

            flex-basis: 0;
            flex-grow: 1;
        }
        .col-md-auto
        {
            width: auto;
            max-width: none;

            flex: 0 0 auto;
        }
        .col-md-1
        {
            max-width: 8.33333%;

            flex: 0 0 8.33333%;
        }
        .col-md-2
        {
            max-width: 16.66667%;

            flex: 0 0 16.66667%;
        }
        .col-md-3
        {
            max-width: 25%;

            flex: 0 0 25%;
        }
        .col-md-4
        {
            max-width: 33.33333%;

            flex: 0 0 33.33333%;
        }
        .col-md-5
        {
            max-width: 41.66667%;

            flex: 0 0 41.66667%;
        }
        .col-md-6
        {
            max-width: 50%;

            flex: 0 0 50%;
        }
        .col-md-7
        {
            max-width: 58.33333%;

            flex: 0 0 58.33333%;
        }
        .col-md-8
        {
            max-width: 66.66667%;

            flex: 0 0 66.66667%;
        }
        .col-md-9
        {
            max-width: 75%;

            flex: 0 0 75%;
        }
        .col-md-10
        {
            max-width: 83.33333%;

            flex: 0 0 83.33333%;
        }
        .col-md-11
        {
            max-width: 91.66667%;

            flex: 0 0 91.66667%;
        }
        .col-md-12
        {
            max-width: 100%;

            flex: 0 0 100%;
        }
        .order-md-first
        {
            order: -1;
        }
        .order-md-last
        {
            order: 13;
        }
        .order-md-0
        {
            order: 0;
        }
        .order-md-1
        {
            order: 1;
        }
        .order-md-2
        {
            order: 2;
        }
        .order-md-3
        {
            order: 3;
        }
        .order-md-4
        {
            order: 4;
        }
        .order-md-5
        {
            order: 5;
        }
        .order-md-6
        {
            order: 6;
        }
        .order-md-7
        {
            order: 7;
        }
        .order-md-8
        {
            order: 8;
        }
        .order-md-9
        {
            order: 9;
        }
        .order-md-10
        {
            order: 10;
        }
        .order-md-11
        {
            order: 11;
        }
        .order-md-12
        {
            order: 12;
        }
        .offset-md-0
        {
            margin-left: 0;
        }
        .offset-md-1
        {
            margin-left: 8.33333%;
        }
        .offset-md-2
        {
            margin-left: 16.66667%;
        }
        .offset-md-3
        {
            margin-left: 25%;
        }
        .offset-md-4
        {
            margin-left: 33.33333%;
        }
        .offset-md-5
        {
            margin-left: 41.66667%;
        }
        .offset-md-6
        {
            margin-left: 50%;
        }
        .offset-md-7
        {
            margin-left: 58.33333%;
        }
        .offset-md-8
        {
            margin-left: 66.66667%;
        }
        .offset-md-9
        {
            margin-left: 75%;
        }
        .offset-md-10
        {
            margin-left: 83.33333%;
        }
        .offset-md-11
        {
            margin-left: 91.66667%;
        }
    }

    @media (min-width: 992px)
    {
        .col-lg
        {
            max-width: 100%;

            flex-basis: 0;
            flex-grow: 1;
        }
        .col-lg-auto
        {
            width: auto;
            max-width: none;

            flex: 0 0 auto;
        }
        .col-lg-1
        {
            max-width: 8.33333%;

            flex: 0 0 8.33333%;
        }
        .col-lg-2
        {
            max-width: 16.66667%;

            flex: 0 0 16.66667%;
        }
        .col-lg-3
        {
            max-width: 25%;

            flex: 0 0 25%;
        }
        .col-lg-4
        {
            max-width: 33.33333%;

            flex: 0 0 33.33333%;
        }
        .col-lg-5
        {
            max-width: 41.66667%;

            flex: 0 0 41.66667%;
        }
        .col-lg-6
        {
            max-width: 50%;

            flex: 0 0 50%;
        }
        .col-lg-7
        {
            max-width: 58.33333%;

            flex: 0 0 58.33333%;
        }
        .col-lg-8
        {
            max-width: 66.66667%;

            flex: 0 0 66.66667%;
        }
        .col-lg-9
        {
            max-width: 75%;

            flex: 0 0 75%;
        }
        .col-lg-10
        {
            max-width: 83.33333%;

            flex: 0 0 83.33333%;
        }
        .col-lg-11
        {
            max-width: 91.66667%;

            flex: 0 0 91.66667%;
        }
        .col-lg-12
        {
            max-width: 100%;

            flex: 0 0 100%;
        }
        .order-lg-first
        {
            order: -1;
        }
        .order-lg-last
        {
            order: 13;
        }
        .order-lg-0
        {
            order: 0;
        }
        .order-lg-1
        {
            order: 1;
        }
        .order-lg-2
        {
            order: 2;
        }
        .order-lg-3
        {
            order: 3;
        }
        .order-lg-4
        {
            order: 4;
        }
        .order-lg-5
        {
            order: 5;
        }
        .order-lg-6
        {
            order: 6;
        }
        .order-lg-7
        {
            order: 7;
        }
        .order-lg-8
        {
            order: 8;
        }
        .order-lg-9
        {
            order: 9;
        }
        .order-lg-10
        {
            order: 10;
        }
        .order-lg-11
        {
            order: 11;
        }
        .order-lg-12
        {
            order: 12;
        }
        .offset-lg-0
        {
            margin-left: 0;
        }
        .offset-lg-1
        {
            margin-left: 8.33333%;
        }
        .offset-lg-2
        {
            margin-left: 16.66667%;
        }
        .offset-lg-3
        {
            margin-left: 25%;
        }
        .offset-lg-4
        {
            margin-left: 33.33333%;
        }
        .offset-lg-5
        {
            margin-left: 41.66667%;
        }
        .offset-lg-6
        {
            margin-left: 50%;
        }
        .offset-lg-7
        {
            margin-left: 58.33333%;
        }
        .offset-lg-8
        {
            margin-left: 66.66667%;
        }
        .offset-lg-9
        {
            margin-left: 75%;
        }
        .offset-lg-10
        {
            margin-left: 83.33333%;
        }
        .offset-lg-11
        {
            margin-left: 91.66667%;
        }
    }

    @media (min-width: 1200px)
    {
        .col-xl
        {
            max-width: 100%;

            flex-basis: 0;
            flex-grow: 1;
        }
        .col-xl-auto
        {
            width: auto;
            max-width: none;

            flex: 0 0 auto;
        }
        .col-xl-1
        {
            max-width: 8.33333%;

            flex: 0 0 8.33333%;
        }
        .col-xl-2
        {
            max-width: 16.66667%;

            flex: 0 0 16.66667%;
        }
        .col-xl-3
        {
            max-width: 25%;

            flex: 0 0 25%;
        }
        .col-xl-4
        {
            max-width: 33.33333%;

            flex: 0 0 33.33333%;
        }
        .col-xl-5
        {
            max-width: 41.66667%;

            flex: 0 0 41.66667%;
        }
        .col-xl-6
        {
            max-width: 50%;

            flex: 0 0 50%;
        }
        .col-xl-7
        {
            max-width: 58.33333%;

            flex: 0 0 58.33333%;
        }
        .col-xl-8
        {
            max-width: 66.66667%;

            flex: 0 0 66.66667%;
        }
        .col-xl-9
        {
            max-width: 75%;

            flex: 0 0 75%;
        }
        .col-xl-10
        {
            max-width: 83.33333%;

            flex: 0 0 83.33333%;
        }
        .col-xl-11
        {
            max-width: 91.66667%;

            flex: 0 0 91.66667%;
        }
        .col-xl-12
        {
            max-width: 100%;

            flex: 0 0 100%;
        }
        .order-xl-first
        {
            order: -1;
        }
        .order-xl-last
        {
            order: 13;
        }
        .order-xl-0
        {
            order: 0;
        }
        .order-xl-1
        {
            order: 1;
        }
        .order-xl-2
        {
            order: 2;
        }
        .order-xl-3
        {
            order: 3;
        }
        .order-xl-4
        {
            order: 4;
        }
        .order-xl-5
        {
            order: 5;
        }
        .order-xl-6
        {
            order: 6;
        }
        .order-xl-7
        {
            order: 7;
        }
        .order-xl-8
        {
            order: 8;
        }
        .order-xl-9
        {
            order: 9;
        }
        .order-xl-10
        {
            order: 10;
        }
        .order-xl-11
        {
            order: 11;
        }
        .order-xl-12
        {
            order: 12;
        }
        .offset-xl-0
        {
            margin-left: 0;
        }
        .offset-xl-1
        {
            margin-left: 8.33333%;
        }
        .offset-xl-2
        {
            margin-left: 16.66667%;
        }
        .offset-xl-3
        {
            margin-left: 25%;
        }
        .offset-xl-4
        {
            margin-left: 33.33333%;
        }
        .offset-xl-5
        {
            margin-left: 41.66667%;
        }
        .offset-xl-6
        {
            margin-left: 50%;
        }
        .offset-xl-7
        {
            margin-left: 58.33333%;
        }
        .offset-xl-8
        {
            margin-left: 66.66667%;
        }
        .offset-xl-9
        {
            margin-left: 75%;
        }
        .offset-xl-10
        {
            margin-left: 83.33333%;
        }
        .offset-xl-11
        {
            margin-left: 91.66667%;
        }
    }

    .table
    {
        width: 100%;
        margin-bottom: 1rem;

        background-color: transparent;
    }
    .table th,
    .table td
    {
        padding: 1rem;

        vertical-align: top;

        border-top: .0625rem solid #dee2e6;
    }
    .table thead th
    {
        vertical-align: bottom;

        border-bottom: .125rem solid #dee2e6;
    }
    .table tbody + tbody
    {
        border-top: .125rem solid #dee2e6;
    }
    .table .table
    {
        background-color: #fff;
    }

    .table-sm th,
    .table-sm td
    {
        padding: .3rem;
    }

    .table-bordered
    {
        border: .0625rem solid #dee2e6;
    }
    .table-bordered th,
    .table-bordered td
    {
        border: .0625rem solid #dee2e6;
    }
    .table-bordered thead th,
    .table-bordered thead td
    {
        border-bottom-width: .125rem;
    }

    .table-borderless th,
    .table-borderless td,
    .table-borderless thead th,
    .table-borderless tbody + tbody
    {
        border: 0;
    }

    .table-striped tbody tr:nth-of-type(odd)
    {
        background-color: rgba(0, 0, 0, .05);
    }

    .table-hover tbody tr:hover
    {
        background-color: rgba(0, 0, 0, .075);
    }

    .table-primary,
    .table-primary > th,
    .table-primary > td
    {
        background-color: #d2d8f7;
    }

    .table-hover .table-primary:hover
    {
        background-color: #bcc5f3;
    }
    .table-hover .table-primary:hover > td,
    .table-hover .table-primary:hover > th
    {
        background-color: #bcc5f3;
    }

    .table-secondary,
    .table-secondary > th,
    .table-secondary > td
    {
        background-color: #fcfcfd;
    }

    .table-hover .table-secondary:hover
    {
        background-color: #ededf3;
    }
    .table-hover .table-secondary:hover > td,
    .table-hover .table-secondary:hover > th
    {
        background-color: #ededf3;
    }

    .table-success,
    .table-success > th,
    .table-success > td
    {
        background-color: #c4f1de;
    }

    .table-hover .table-success:hover
    {
        background-color: #afecd2;
    }
    .table-hover .table-success:hover > td,
    .table-hover .table-success:hover > th
    {
        background-color: #afecd2;
    }

    .table-info,
    .table-info > th,
    .table-info > td
    {
        background-color: #bcf1fb;
    }

    .table-hover .table-info:hover
    {
        background-color: #a4ecfa;
    }
    .table-hover .table-info:hover > td,
    .table-hover .table-info:hover > th
    {
        background-color: #a4ecfa;
    }

    .table-warning,
    .table-warning > th,
    .table-warning > td
    {
        background-color: #fed3ca;
    }

    .table-hover .table-warning:hover
    {
        background-color: #febeb1;
    }
    .table-hover .table-warning:hover > td,
    .table-hover .table-warning:hover > th
    {
        background-color: #febeb1;
    }

    .table-danger,
    .table-danger > th,
    .table-danger > td
    {
        background-color: #fcc7d1;
    }

    .table-hover .table-danger:hover
    {
        background-color: #fbafbd;
    }
    .table-hover .table-danger:hover > td,
    .table-hover .table-danger:hover > th
    {
        background-color: #fbafbd;
    }

    .table-light,
    .table-light > th,
    .table-light > td
    {
        background-color: #e8eaed;
    }

    .table-hover .table-light:hover
    {
        background-color: #dadde2;
    }
    .table-hover .table-light:hover > td,
    .table-hover .table-light:hover > th
    {
        background-color: #dadde2;
    }

    .table-dark,
    .table-dark > th,
    .table-dark > td
    {
        background-color: #c1c2c3;
    }

    .table-hover .table-dark:hover
    {
        background-color: #b4b5b6;
    }
    .table-hover .table-dark:hover > td,
    .table-hover .table-dark:hover > th
    {
        background-color: #b4b5b6;
    }

    .table-default,
    .table-default > th,
    .table-default > td
    {
        background-color: #bec4cd;
    }

    .table-hover .table-default:hover
    {
        background-color: #b0b7c2;
    }
    .table-hover .table-default:hover > td,
    .table-hover .table-default:hover > th
    {
        background-color: #b0b7c2;
    }

    .table-white,
    .table-white > th,
    .table-white > td
    {
        background-color: white;
    }

    .table-hover .table-white:hover
    {
        background-color: #f2f2f2;
    }
    .table-hover .table-white:hover > td,
    .table-hover .table-white:hover > th
    {
        background-color: #f2f2f2;
    }

    .table-neutral,
    .table-neutral > th,
    .table-neutral > td
    {
        background-color: white;
    }

    .table-hover .table-neutral:hover
    {
        background-color: #f2f2f2;
    }
    .table-hover .table-neutral:hover > td,
    .table-hover .table-neutral:hover > th
    {
        background-color: #f2f2f2;
    }

    .table-darker,
    .table-darker > th,
    .table-darker > td
    {
        background-color: #b8b8b8;
    }

    .table-hover .table-darker:hover
    {
        background-color: #ababab;
    }
    .table-hover .table-darker:hover > td,
    .table-hover .table-darker:hover > th
    {
        background-color: #ababab;
    }

    .table-active,
    .table-active > th,
    .table-active > td
    {
        background-color: rgba(0, 0, 0, .075);
    }

    .table-hover .table-active:hover
    {
        background-color: rgba(0, 0, 0, .075);
    }
    .table-hover .table-active:hover > td,
    .table-hover .table-active:hover > th
    {
        background-color: rgba(0, 0, 0, .075);
    }

    .table .thead-dark th
    {
        color: #fff;
        border-color: #32383e;
        background-color: #212529;
    }

    .table .thead-light th
    {
        color: #525f7f;
        border-color: #dee2e6;
        background-color: #e9ecef;
    }

    .table-dark
    {
        color: #fff;
        background-color: #212529;
    }
    .table-dark th,
    .table-dark td,
    .table-dark thead th
    {
        border-color: #32383e;
    }
    .table-dark.table-bordered
    {
        border: 0;
    }
    .table-dark.table-striped tbody tr:nth-of-type(odd)
    {
        background-color: rgba(255, 255, 255, .05);
    }
    .table-dark.table-hover tbody tr:hover
    {
        background-color: rgba(255, 255, 255, .075);
    }

    @media (max-width: 575.98px)
    {
        .table-responsive-sm
        {
            display: block;
            overflow-x: auto;

            width: 100%;

            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
        }
        .table-responsive-sm > .table-bordered
        {
            border: 0;
        }
    }

    @media (max-width: 767.98px)
    {
        .table-responsive-md
        {
            display: block;
            overflow-x: auto;

            width: 100%;

            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
        }
        .table-responsive-md > .table-bordered
        {
            border: 0;
        }
    }

    @media (max-width: 991.98px)
    {
        .table-responsive-lg
        {
            display: block;
            overflow-x: auto;

            width: 100%;

            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
        }
        .table-responsive-lg > .table-bordered
        {
            border: 0;
        }
    }

    @media (max-width: 1199.98px)
    {
        .table-responsive-xl
        {
            display: block;
            overflow-x: auto;

            width: 100%;

            -webkit-overflow-scrolling: touch;
            -ms-overflow-style: -ms-autohiding-scrollbar;
        }
        .table-responsive-xl > .table-bordered
        {
            border: 0;
        }
    }

    .table-responsive
    {
        display: block;
        overflow-x: auto;

        width: 100%;

        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }
    .table-responsive > .table-bordered
    {
        border: 0;
    }

    .form-control
    {
        font-size: 1rem;
        line-height: 1.5;

        display: block;

        width: 100%;
        height: calc(2.75rem + 2px);
        padding: .625rem .75rem;

        transition: all .2s cubic-bezier(.68, -.55, .265, 1.55);

        color: #8898aa;
        border: 1px solid #cad1d7;
        border-radius: .25rem;
        background-color: #fff;
        background-clip: padding-box;
        box-shadow: none;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .form-control
        {
            transition: none;
        }
    }
    .form-control::-ms-expand
    {
        border: 0;
        background-color: transparent;
    }
    .form-control:focus
    {
        color: #8898aa;
        border-color: rgba(50, 151, 211, .25);
        outline: 0;
        background-color: #fff;
        box-shadow: none, none;
    }
    .form-control::-webkit-input-placeholder
    {
        opacity: 1;
        color: #adb5bd;
    }
    .form-control:-ms-input-placeholder
    {
        opacity: 1;
        color: #adb5bd;
    }
    .form-control::-ms-input-placeholder
    {
        opacity: 1;
        color: #adb5bd;
    }
    .form-control::placeholder
    {
        opacity: 1;
        color: #adb5bd;
    }
    .form-control:disabled,
    .form-control[readonly]
    {
        opacity: 1;
        background-color: #e9ecef;
    }

    select.form-control:focus::-ms-value
    {
        color: #8898aa;
        background-color: #fff;
    }

    .form-control-file,
    .form-control-range
    {
        display: block;

        width: 100%;
    }

    .col-form-label
    {
        font-size: inherit;
        line-height: 1.5;

        margin-bottom: 0;
        padding-top: calc(.625rem + 1px);
        padding-bottom: calc(.625rem + 1px);
    }

    .col-form-label-lg
    {
        font-size: 1.25rem;
        line-height: 1.5;

        padding-top: calc(.875rem + 1px);
        padding-bottom: calc(.875rem + 1px);
    }

    .col-form-label-sm
    {
        font-size: .875rem;
        line-height: 1.5;

        padding-top: calc(.25rem + 1px);
        padding-bottom: calc(.25rem + 1px);
    }

    .form-control-plaintext
    {
        line-height: 1.5;

        display: block;

        width: 100%;
        margin-bottom: 0;
        padding-top: .625rem;
        padding-bottom: .625rem;

        color: #525f7f;
        border: solid transparent;
        border-width: 1px 0;
        background-color: transparent;
    }
    .form-control-plaintext.form-control-sm,
    .form-control-plaintext.form-control-lg
    {
        padding-right: 0;
        padding-left: 0;
    }

    .form-control-sm
    {
        font-size: .875rem;
        line-height: 1.5;

        height: calc(1.8125rem + 2px);
        padding: .25rem .5rem;

        border-radius: .2rem;
    }

    .form-control-lg
    {
        font-size: 1.25rem;
        line-height: 1.5;

        height: calc(3.625rem + 2px);
        padding: .875rem 1rem;

        border-radius: .3rem;
    }

    select.form-control[size],
    select.form-control[multiple]
    {
        height: auto;
    }

    textarea.form-control
    {
        height: auto;
    }

    .form-group
    {
        margin-bottom: 1rem;
    }

    .form-text
    {
        display: block;

        margin-top: .25rem;
    }

    .form-row
    {
        display: flex;

        margin-right: -5px;
        margin-left: -5px;

        flex-wrap: wrap;
    }
    .form-row > .col,
    .form-row > [class*='col-']
    {
        padding-right: 5px;
        padding-left: 5px;
    }

    .form-check
    {
        position: relative;

        display: block;

        padding-left: 1.25rem;
    }

    .form-check-input
    {
        position: absolute;

        margin-top: .3rem;
        margin-left: -1.25rem;
    }
    .form-check-input:disabled ~ .form-check-label
    {
        color: #8898aa;
    }

    .form-check-label
    {
        margin-bottom: 0;
    }

    .form-check-inline
    {
        display: inline-flex;

        margin-right: .75rem;
        padding-left: 0;

        align-items: center;
    }
    .form-check-inline .form-check-input
    {
        position: static;

        margin-top: 0;
        margin-right: .3125rem;
        margin-left: 0;
    }

    .valid-feedback
    {
        font-size: 80%;

        display: none;

        width: 100%;
        margin-top: .25rem;

        color: #2dce89;
    }

    .valid-tooltip
    {
        font-size: .875rem;
        line-height: 1;

        position: absolute;
        z-index: 5;
        top: 100%;

        display: none;

        max-width: 100%;
        margin-top: .1rem;
        padding: .5rem;

        color: #fff;
        border-radius: .2rem;
        background-color: rgba(45, 206, 137, .8);
    }

    .was-validated .form-control:valid,
    .form-control.is-valid,
    .was-validated
    .custom-select:valid,
    .custom-select.is-valid
    {
        border-color: #2dce89;
    }
    .was-validated .form-control:valid:focus,
    .form-control.is-valid:focus,
    .was-validated
      .custom-select:valid:focus,
    .custom-select.is-valid:focus
    {
        border-color: #2dce89;
    }
    .was-validated .form-control:valid ~ .valid-feedback,
    .was-validated .form-control:valid ~ .valid-tooltip,
    .form-control.is-valid ~ .valid-feedback,
    .form-control.is-valid ~ .valid-tooltip,
    .was-validated
      .custom-select:valid ~ .valid-feedback,
    .was-validated
      .custom-select:valid ~ .valid-tooltip,
    .custom-select.is-valid ~ .valid-feedback,
    .custom-select.is-valid ~ .valid-tooltip
    {
        display: block;
    }

    .was-validated .form-check-input:valid ~ .form-check-label,
    .form-check-input.is-valid ~ .form-check-label
    {
        color: #2dce89;
    }

    .was-validated .form-check-input:valid ~ .valid-feedback,
    .was-validated .form-check-input:valid ~ .valid-tooltip,
    .form-check-input.is-valid ~ .valid-feedback,
    .form-check-input.is-valid ~ .valid-tooltip
    {
        display: block;
    }

    .was-validated .custom-control-input:valid ~ .custom-control-label,
    .custom-control-input.is-valid ~ .custom-control-label
    {
        color: #2dce89;
    }
    .was-validated .custom-control-input:valid ~ .custom-control-label::before,
    .custom-control-input.is-valid ~ .custom-control-label::before
    {
        border-color: #93e7c3;
        background-color: #93e7c3;
    }

    .was-validated .custom-control-input:valid ~ .valid-feedback,
    .was-validated .custom-control-input:valid ~ .valid-tooltip,
    .custom-control-input.is-valid ~ .valid-feedback,
    .custom-control-input.is-valid ~ .valid-tooltip
    {
        display: block;
    }

    .was-validated .custom-control-input:valid:checked ~ .custom-control-label::before,
    .custom-control-input.is-valid:checked ~ .custom-control-label::before
    {
        border-color: #93e7c3;
        background-color: #54daa1;
    }

    .was-validated .custom-control-input:valid:focus ~ .custom-control-label::before,
    .custom-control-input.is-valid:focus ~ .custom-control-label::before
    {
        box-shadow: 0 0 0 1px #fff, 0 0 0 0 rgba(45, 206, 137, .25);
    }

    .was-validated .custom-file-input:valid ~ .custom-file-label,
    .custom-file-input.is-valid ~ .custom-file-label
    {
        border-color: #2dce89;
    }
    .was-validated .custom-file-input:valid ~ .custom-file-label::before,
    .custom-file-input.is-valid ~ .custom-file-label::before
    {
        border-color: inherit;
    }

    .was-validated .custom-file-input:valid ~ .valid-feedback,
    .was-validated .custom-file-input:valid ~ .valid-tooltip,
    .custom-file-input.is-valid ~ .valid-feedback,
    .custom-file-input.is-valid ~ .valid-tooltip
    {
        display: block;
    }

    .was-validated .custom-file-input:valid:focus ~ .custom-file-label,
    .custom-file-input.is-valid:focus ~ .custom-file-label
    {
        box-shadow: 0 0 0 0 rgba(45, 206, 137, .25);
    }

    .invalid-feedback
    {
        font-size: 80%;

        display: none;

        width: 100%;
        margin-top: .25rem;

        color: #fb6340;
    }

    .invalid-tooltip
    {
        font-size: .875rem;
        line-height: 1;

        position: absolute;
        z-index: 5;
        top: 100%;

        display: none;

        max-width: 100%;
        margin-top: .1rem;
        padding: .5rem;

        color: #fff;
        border-radius: .2rem;
        background-color: rgba(251, 99, 64, .8);
    }

    .was-validated .form-control:invalid,
    .form-control.is-invalid,
    .was-validated
    .custom-select:invalid,
    .custom-select.is-invalid
    {
        border-color: #fb6340;
    }
    .was-validated .form-control:invalid:focus,
    .form-control.is-invalid:focus,
    .was-validated
      .custom-select:invalid:focus,
    .custom-select.is-invalid:focus
    {
        border-color: #fb6340;
    }
    .was-validated .form-control:invalid ~ .invalid-feedback,
    .was-validated .form-control:invalid ~ .invalid-tooltip,
    .form-control.is-invalid ~ .invalid-feedback,
    .form-control.is-invalid ~ .invalid-tooltip,
    .was-validated
      .custom-select:invalid ~ .invalid-feedback,
    .was-validated
      .custom-select:invalid ~ .invalid-tooltip,
    .custom-select.is-invalid ~ .invalid-feedback,
    .custom-select.is-invalid ~ .invalid-tooltip
    {
        display: block;
    }

    .was-validated .form-check-input:invalid ~ .form-check-label,
    .form-check-input.is-invalid ~ .form-check-label
    {
        color: #fb6340;
    }

    .was-validated .form-check-input:invalid ~ .invalid-feedback,
    .was-validated .form-check-input:invalid ~ .invalid-tooltip,
    .form-check-input.is-invalid ~ .invalid-feedback,
    .form-check-input.is-invalid ~ .invalid-tooltip
    {
        display: block;
    }

    .was-validated .custom-control-input:invalid ~ .custom-control-label,
    .custom-control-input.is-invalid ~ .custom-control-label
    {
        color: #fb6340;
    }
    .was-validated .custom-control-input:invalid ~ .custom-control-label::before,
    .custom-control-input.is-invalid ~ .custom-control-label::before
    {
        border-color: #fec9bd;
        background-color: #fec9bd;
    }

    .was-validated .custom-control-input:invalid ~ .invalid-feedback,
    .was-validated .custom-control-input:invalid ~ .invalid-tooltip,
    .custom-control-input.is-invalid ~ .invalid-feedback,
    .custom-control-input.is-invalid ~ .invalid-tooltip
    {
        display: block;
    }

    .was-validated .custom-control-input:invalid:checked ~ .custom-control-label::before,
    .custom-control-input.is-invalid:checked ~ .custom-control-label::before
    {
        border-color: #fec9bd;
        background-color: #fc8c72;
    }

    .was-validated .custom-control-input:invalid:focus ~ .custom-control-label::before,
    .custom-control-input.is-invalid:focus ~ .custom-control-label::before
    {
        box-shadow: 0 0 0 1px #fff, 0 0 0 0 rgba(251, 99, 64, .25);
    }

    .was-validated .custom-file-input:invalid ~ .custom-file-label,
    .custom-file-input.is-invalid ~ .custom-file-label
    {
        border-color: #fb6340;
    }
    .was-validated .custom-file-input:invalid ~ .custom-file-label::before,
    .custom-file-input.is-invalid ~ .custom-file-label::before
    {
        border-color: inherit;
    }

    .was-validated .custom-file-input:invalid ~ .invalid-feedback,
    .was-validated .custom-file-input:invalid ~ .invalid-tooltip,
    .custom-file-input.is-invalid ~ .invalid-feedback,
    .custom-file-input.is-invalid ~ .invalid-tooltip
    {
        display: block;
    }

    .was-validated .custom-file-input:invalid:focus ~ .custom-file-label,
    .custom-file-input.is-invalid:focus ~ .custom-file-label
    {
        box-shadow: 0 0 0 0 rgba(251, 99, 64, .25);
    }

    .form-inline
    {
        display: flex;

        flex-flow: row wrap;
        align-items: center;
    }
    .form-inline .form-check
    {
        width: 100%;
    }
    @media (min-width: 576px)
    {
        .form-inline label
        {
            display: flex;

            margin-bottom: 0;

            align-items: center;
            justify-content: center;
        }
        .form-inline .form-group
        {
            display: flex;

            margin-bottom: 0;

            flex: 0 0 auto;
            flex-flow: row wrap;
            align-items: center;
        }
        .form-inline .form-control
        {
            display: inline-block;

            width: auto;

            vertical-align: middle;
        }
        .form-inline .form-control-plaintext
        {
            display: inline-block;
        }
        .form-inline .input-group,
        .form-inline .custom-select
        {
            width: auto;
        }
        .form-inline .form-check
        {
            display: flex;

            width: auto;
            padding-left: 0;

            align-items: center;
            justify-content: center;
        }
        .form-inline .form-check-input
        {
            position: relative;

            margin-top: 0;
            margin-right: .25rem;
            margin-left: 0;
        }
        .form-inline .custom-control
        {
            align-items: center;
            justify-content: center;
        }
        .form-inline .custom-control-label
        {
            margin-bottom: 0;
        }
    }

    .btn
    {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.5;

        display: inline-block;

        padding: .625rem 1.25rem;

        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;

        border: 1px solid transparent;
        border-radius: .25rem;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .btn
        {
            transition: none;
        }
    }
    .btn:hover,
    .btn:focus
    {
        text-decoration: none;
    }
    .btn:focus,
    .btn.focus
    {
        outline: 0;
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    }
    .btn.disabled,
    .btn:disabled
    {
        opacity: .65;
        box-shadow: none;
    }
    .btn:not(:disabled):not(.disabled)
    {
        cursor: pointer;
    }
    .btn:not(:disabled):not(.disabled):active,
    .btn:not(:disabled):not(.disabled).active
    {
        box-shadow: none;
    }
    .btn:not(:disabled):not(.disabled):active:focus,
    .btn:not(:disabled):not(.disabled).active:focus
    {
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08), none;
    }

    a.btn.disabled,
    fieldset:disabled a.btn
    {
        pointer-events: none;
    }

    .btn-primary
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-primary:hover
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }
    .btn-primary:focus,
    .btn-primary.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(94, 114, 228, .5);
    }
    .btn-primary.disabled,
    .btn-primary:disabled
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }
    .btn-primary:not(:disabled):not(.disabled):active,
    .btn-primary:not(:disabled):not(.disabled).active,
    .show > .btn-primary.dropdown-toggle
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #324cdd;
    }
    .btn-primary:not(:disabled):not(.disabled):active:focus,
    .btn-primary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-primary.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(94, 114, 228, .5);
    }

    .btn-secondary
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #f4f5f7;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-secondary:hover
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #f4f5f7;
    }
    .btn-secondary:focus,
    .btn-secondary.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(244, 245, 247, .5);
    }
    .btn-secondary.disabled,
    .btn-secondary:disabled
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #f4f5f7;
    }
    .btn-secondary:not(:disabled):not(.disabled):active,
    .btn-secondary:not(:disabled):not(.disabled).active,
    .show > .btn-secondary.dropdown-toggle
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #d6dae2;
    }
    .btn-secondary:not(:disabled):not(.disabled):active:focus,
    .btn-secondary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-secondary.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(244, 245, 247, .5);
    }

    .btn-success
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #2dce89;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-success:hover
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #2dce89;
    }
    .btn-success:focus,
    .btn-success.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(45, 206, 137, .5);
    }
    .btn-success.disabled,
    .btn-success:disabled
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #2dce89;
    }
    .btn-success:not(:disabled):not(.disabled):active,
    .btn-success:not(:disabled):not(.disabled).active,
    .show > .btn-success.dropdown-toggle
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #24a46d;
    }
    .btn-success:not(:disabled):not(.disabled):active:focus,
    .btn-success:not(:disabled):not(.disabled).active:focus,
    .show > .btn-success.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(45, 206, 137, .5);
    }

    .btn-info
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #11cdef;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-info:hover
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #11cdef;
    }
    .btn-info:focus,
    .btn-info.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(17, 205, 239, .5);
    }
    .btn-info.disabled,
    .btn-info:disabled
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #11cdef;
    }
    .btn-info:not(:disabled):not(.disabled):active,
    .btn-info:not(:disabled):not(.disabled).active,
    .show > .btn-info.dropdown-toggle
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #0da5c0;
    }
    .btn-info:not(:disabled):not(.disabled):active:focus,
    .btn-info:not(:disabled):not(.disabled).active:focus,
    .show > .btn-info.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(17, 205, 239, .5);
    }

    .btn-warning
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fb6340;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-warning:hover
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fb6340;
    }
    .btn-warning:focus,
    .btn-warning.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(251, 99, 64, .5);
    }
    .btn-warning.disabled,
    .btn-warning:disabled
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fb6340;
    }
    .btn-warning:not(:disabled):not(.disabled):active,
    .btn-warning:not(:disabled):not(.disabled).active,
    .show > .btn-warning.dropdown-toggle
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fa3a0e;
    }
    .btn-warning:not(:disabled):not(.disabled):active:focus,
    .btn-warning:not(:disabled):not(.disabled).active:focus,
    .show > .btn-warning.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(251, 99, 64, .5);
    }

    .btn-danger
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #f5365c;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-danger:hover
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #f5365c;
    }
    .btn-danger:focus,
    .btn-danger.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(245, 54, 92, .5);
    }
    .btn-danger.disabled,
    .btn-danger:disabled
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #f5365c;
    }
    .btn-danger:not(:disabled):not(.disabled):active,
    .btn-danger:not(:disabled):not(.disabled).active,
    .show > .btn-danger.dropdown-toggle
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #ec0c38;
    }
    .btn-danger:not(:disabled):not(.disabled):active:focus,
    .btn-danger:not(:disabled):not(.disabled).active:focus,
    .show > .btn-danger.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(245, 54, 92, .5);
    }

    .btn-light
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #adb5bd;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-light:hover
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #adb5bd;
    }
    .btn-light:focus,
    .btn-light.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(173, 181, 189, .5);
    }
    .btn-light.disabled,
    .btn-light:disabled
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #adb5bd;
    }
    .btn-light:not(:disabled):not(.disabled):active,
    .btn-light:not(:disabled):not(.disabled).active,
    .show > .btn-light.dropdown-toggle
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #919ca6;
    }
    .btn-light:not(:disabled):not(.disabled):active:focus,
    .btn-light:not(:disabled):not(.disabled).active:focus,
    .show > .btn-light.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(173, 181, 189, .5);
    }

    .btn-dark
    {
        color: #fff;
        border-color: #212529;
        background-color: #212529;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-dark:hover
    {
        color: #fff;
        border-color: #212529;
        background-color: #212529;
    }
    .btn-dark:focus,
    .btn-dark.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(33, 37, 41, .5);
    }
    .btn-dark.disabled,
    .btn-dark:disabled
    {
        color: #fff;
        border-color: #212529;
        background-color: #212529;
    }
    .btn-dark:not(:disabled):not(.disabled):active,
    .btn-dark:not(:disabled):not(.disabled).active,
    .show > .btn-dark.dropdown-toggle
    {
        color: #fff;
        border-color: #212529;
        background-color: #0a0c0d;
    }
    .btn-dark:not(:disabled):not(.disabled):active:focus,
    .btn-dark:not(:disabled):not(.disabled).active:focus,
    .show > .btn-dark.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(33, 37, 41, .5);
    }

    .btn-default
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #172b4d;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-default:hover
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #172b4d;
    }
    .btn-default:focus,
    .btn-default.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(23, 43, 77, .5);
    }
    .btn-default.disabled,
    .btn-default:disabled
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #172b4d;
    }
    .btn-default:not(:disabled):not(.disabled):active,
    .btn-default:not(:disabled):not(.disabled).active,
    .show > .btn-default.dropdown-toggle
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #0b1526;
    }
    .btn-default:not(:disabled):not(.disabled):active:focus,
    .btn-default:not(:disabled):not(.disabled).active:focus,
    .show > .btn-default.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(23, 43, 77, .5);
    }

    .btn-white
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-white:hover
    {
        color: #212529;
        border-color: white;
        background-color: white;
    }
    .btn-white:focus,
    .btn-white.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(255, 255, 255, .5);
    }
    .btn-white.disabled,
    .btn-white:disabled
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-white:not(:disabled):not(.disabled):active,
    .btn-white:not(:disabled):not(.disabled).active,
    .show > .btn-white.dropdown-toggle
    {
        color: #212529;
        border-color: white;
        background-color: #e6e6e6;
    }
    .btn-white:not(:disabled):not(.disabled):active:focus,
    .btn-white:not(:disabled):not(.disabled).active:focus,
    .show > .btn-white.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(255, 255, 255, .5);
    }

    .btn-neutral
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-neutral:hover
    {
        color: #212529;
        border-color: white;
        background-color: white;
    }
    .btn-neutral:focus,
    .btn-neutral.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(255, 255, 255, .5);
    }
    .btn-neutral.disabled,
    .btn-neutral:disabled
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-neutral:not(:disabled):not(.disabled):active,
    .btn-neutral:not(:disabled):not(.disabled).active,
    .show > .btn-neutral.dropdown-toggle
    {
        color: #212529;
        border-color: white;
        background-color: #e6e6e6;
    }
    .btn-neutral:not(:disabled):not(.disabled):active:focus,
    .btn-neutral:not(:disabled):not(.disabled).active:focus,
    .show > .btn-neutral.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(255, 255, 255, .5);
    }

    .btn-darker
    {
        color: #fff;
        border-color: black;
        background-color: black;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-darker:hover
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }
    .btn-darker:focus,
    .btn-darker.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(0, 0, 0, .5);
    }
    .btn-darker.disabled,
    .btn-darker:disabled
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }
    .btn-darker:not(:disabled):not(.disabled):active,
    .btn-darker:not(:disabled):not(.disabled).active,
    .show > .btn-darker.dropdown-toggle
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }
    .btn-darker:not(:disabled):not(.disabled):active:focus,
    .btn-darker:not(:disabled):not(.disabled).active:focus,
    .show > .btn-darker.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(0, 0, 0, .5);
    }

    .btn-outline-primary
    {
        color: #546FF7;
        border-color: #546FF7;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-primary:hover
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }
    .btn-outline-primary:focus,
    .btn-outline-primary.focus
    {
        box-shadow: 0 0 0 0 rgba(94, 114, 228, .5);
    }
    .btn-outline-primary.disabled,
    .btn-outline-primary:disabled
    {
        color: #546FF7;
        background-color: transparent;
    }
    .btn-outline-primary:not(:disabled):not(.disabled):active,
    .btn-outline-primary:not(:disabled):not(.disabled).active,
    .show > .btn-outline-primary.dropdown-toggle
    {
        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }
    .btn-outline-primary:not(:disabled):not(.disabled):active:focus,
    .btn-outline-primary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-primary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(94, 114, 228, .5);
    }

    .btn-outline-secondary
    {
        color: #f4f5f7;
        border-color: #f4f5f7;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-secondary:hover
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #f4f5f7;
    }
    .btn-outline-secondary:focus,
    .btn-outline-secondary.focus
    {
        box-shadow: 0 0 0 0 rgba(244, 245, 247, .5);
    }
    .btn-outline-secondary.disabled,
    .btn-outline-secondary:disabled
    {
        color: #f4f5f7;
        background-color: transparent;
    }
    .btn-outline-secondary:not(:disabled):not(.disabled):active,
    .btn-outline-secondary:not(:disabled):not(.disabled).active,
    .show > .btn-outline-secondary.dropdown-toggle
    {
        color: #212529;
        border-color: #f4f5f7;
        background-color: #f4f5f7;
    }
    .btn-outline-secondary:not(:disabled):not(.disabled):active:focus,
    .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-secondary.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(244, 245, 247, .5);
    }

    .btn-outline-success
    {
        color: #2dce89;
        border-color: #2dce89;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-success:hover
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #2dce89;
    }
    .btn-outline-success:focus,
    .btn-outline-success.focus
    {
        box-shadow: 0 0 0 0 rgba(45, 206, 137, .5);
    }
    .btn-outline-success.disabled,
    .btn-outline-success:disabled
    {
        color: #2dce89;
        background-color: transparent;
    }
    .btn-outline-success:not(:disabled):not(.disabled):active,
    .btn-outline-success:not(:disabled):not(.disabled).active,
    .show > .btn-outline-success.dropdown-toggle
    {
        color: #fff;
        border-color: #2dce89;
        background-color: #2dce89;
    }
    .btn-outline-success:not(:disabled):not(.disabled):active:focus,
    .btn-outline-success:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-success.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(45, 206, 137, .5);
    }

    .btn-outline-info
    {
        color: #11cdef;
        border-color: #11cdef;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-info:hover
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #11cdef;
    }
    .btn-outline-info:focus,
    .btn-outline-info.focus
    {
        box-shadow: 0 0 0 0 rgba(17, 205, 239, .5);
    }
    .btn-outline-info.disabled,
    .btn-outline-info:disabled
    {
        color: #11cdef;
        background-color: transparent;
    }
    .btn-outline-info:not(:disabled):not(.disabled):active,
    .btn-outline-info:not(:disabled):not(.disabled).active,
    .show > .btn-outline-info.dropdown-toggle
    {
        color: #fff;
        border-color: #11cdef;
        background-color: #11cdef;
    }
    .btn-outline-info:not(:disabled):not(.disabled):active:focus,
    .btn-outline-info:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-info.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(17, 205, 239, .5);
    }

    .btn-outline-warning
    {
        color: #fb6340;
        border-color: #fb6340;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-warning:hover
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fb6340;
    }
    .btn-outline-warning:focus,
    .btn-outline-warning.focus
    {
        box-shadow: 0 0 0 0 rgba(251, 99, 64, .5);
    }
    .btn-outline-warning.disabled,
    .btn-outline-warning:disabled
    {
        color: #fb6340;
        background-color: transparent;
    }
    .btn-outline-warning:not(:disabled):not(.disabled):active,
    .btn-outline-warning:not(:disabled):not(.disabled).active,
    .show > .btn-outline-warning.dropdown-toggle
    {
        color: #fff;
        border-color: #fb6340;
        background-color: #fb6340;
    }
    .btn-outline-warning:not(:disabled):not(.disabled):active:focus,
    .btn-outline-warning:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-warning.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(251, 99, 64, .5);
    }

    .btn-outline-danger
    {
        color: #f5365c;
        border-color: #f5365c;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-danger:hover
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #f5365c;
    }
    .btn-outline-danger:focus,
    .btn-outline-danger.focus
    {
        box-shadow: 0 0 0 0 rgba(245, 54, 92, .5);
    }
    .btn-outline-danger.disabled,
    .btn-outline-danger:disabled
    {
        color: #f5365c;
        background-color: transparent;
    }
    .btn-outline-danger:not(:disabled):not(.disabled):active,
    .btn-outline-danger:not(:disabled):not(.disabled).active,
    .show > .btn-outline-danger.dropdown-toggle
    {
        color: #fff;
        border-color: #f5365c;
        background-color: #f5365c;
    }
    .btn-outline-danger:not(:disabled):not(.disabled):active:focus,
    .btn-outline-danger:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-danger.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(245, 54, 92, .5);
    }

    .btn-outline-light
    {
        color: #adb5bd;
        border-color: #adb5bd;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-light:hover
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #adb5bd;
    }
    .btn-outline-light:focus,
    .btn-outline-light.focus
    {
        box-shadow: 0 0 0 0 rgba(173, 181, 189, .5);
    }
    .btn-outline-light.disabled,
    .btn-outline-light:disabled
    {
        color: #adb5bd;
        background-color: transparent;
    }
    .btn-outline-light:not(:disabled):not(.disabled):active,
    .btn-outline-light:not(:disabled):not(.disabled).active,
    .show > .btn-outline-light.dropdown-toggle
    {
        color: #fff;
        border-color: #adb5bd;
        background-color: #adb5bd;
    }
    .btn-outline-light:not(:disabled):not(.disabled):active:focus,
    .btn-outline-light:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-light.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(173, 181, 189, .5);
    }

    .btn-outline-dark
    {
        color: #212529;
        border-color: #212529;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-dark:hover
    {
        color: #fff;
        border-color: #212529;
        background-color: #212529;
    }
    .btn-outline-dark:focus,
    .btn-outline-dark.focus
    {
        box-shadow: 0 0 0 0 rgba(33, 37, 41, .5);
    }
    .btn-outline-dark.disabled,
    .btn-outline-dark:disabled
    {
        color: #212529;
        background-color: transparent;
    }
    .btn-outline-dark:not(:disabled):not(.disabled):active,
    .btn-outline-dark:not(:disabled):not(.disabled).active,
    .show > .btn-outline-dark.dropdown-toggle
    {
        color: #fff;
        border-color: #212529;
        background-color: #212529;
    }
    .btn-outline-dark:not(:disabled):not(.disabled):active:focus,
    .btn-outline-dark:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-dark.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(33, 37, 41, .5);
    }

    .btn-outline-default
    {
        color: #172b4d;
        border-color: #172b4d;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-default:hover
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #172b4d;
    }
    .btn-outline-default:focus,
    .btn-outline-default.focus
    {
        box-shadow: 0 0 0 0 rgba(23, 43, 77, .5);
    }
    .btn-outline-default.disabled,
    .btn-outline-default:disabled
    {
        color: #172b4d;
        background-color: transparent;
    }
    .btn-outline-default:not(:disabled):not(.disabled):active,
    .btn-outline-default:not(:disabled):not(.disabled).active,
    .show > .btn-outline-default.dropdown-toggle
    {
        color: #fff;
        border-color: #172b4d;
        background-color: #172b4d;
    }
    .btn-outline-default:not(:disabled):not(.disabled):active:focus,
    .btn-outline-default:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-default.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(23, 43, 77, .5);
    }

    .btn-outline-white
    {
        color: #fff;
        border-color: #fff;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-white:hover
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-outline-white:focus,
    .btn-outline-white.focus
    {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, .5);
    }
    .btn-outline-white.disabled,
    .btn-outline-white:disabled
    {
        color: #fff;
        background-color: transparent;
    }
    .btn-outline-white:not(:disabled):not(.disabled):active,
    .btn-outline-white:not(:disabled):not(.disabled).active,
    .show > .btn-outline-white.dropdown-toggle
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-outline-white:not(:disabled):not(.disabled):active:focus,
    .btn-outline-white:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-white.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, .5);
    }

    .btn-outline-neutral
    {
        color: #fff;
        border-color: #fff;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-neutral:hover
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-outline-neutral:focus,
    .btn-outline-neutral.focus
    {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, .5);
    }
    .btn-outline-neutral.disabled,
    .btn-outline-neutral:disabled
    {
        color: #fff;
        background-color: transparent;
    }
    .btn-outline-neutral:not(:disabled):not(.disabled):active,
    .btn-outline-neutral:not(:disabled):not(.disabled).active,
    .show > .btn-outline-neutral.dropdown-toggle
    {
        color: #212529;
        border-color: #fff;
        background-color: #fff;
    }
    .btn-outline-neutral:not(:disabled):not(.disabled):active:focus,
    .btn-outline-neutral:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-neutral.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, .5);
    }

    .btn-outline-darker
    {
        color: black;
        border-color: black;
        background-color: transparent;
        background-image: none;
    }
    .btn-outline-darker:hover
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }
    .btn-outline-darker:focus,
    .btn-outline-darker.focus
    {
        box-shadow: 0 0 0 0 rgba(0, 0, 0, .5);
    }
    .btn-outline-darker.disabled,
    .btn-outline-darker:disabled
    {
        color: black;
        background-color: transparent;
    }
    .btn-outline-darker:not(:disabled):not(.disabled):active,
    .btn-outline-darker:not(:disabled):not(.disabled).active,
    .show > .btn-outline-darker.dropdown-toggle
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }
    .btn-outline-darker:not(:disabled):not(.disabled):active:focus,
    .btn-outline-darker:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-darker.dropdown-toggle:focus
    {
        box-shadow: 0 0 0 0 rgba(0, 0, 0, .5);
    }

    .btn-link
    {
        font-weight: 400;

        color: #000;
        background-color: transparent;
    }
    .btn-link:hover
    {
        text-decoration: none;

        color: #233dd2;
        border-color: transparent;
        background-color: transparent;
    }
    .btn-link:focus,
    .btn-link.focus
    {
        text-decoration: none;

        border-color: transparent;
        box-shadow: none;
    }
    .btn-link:disabled,
    .btn-link.disabled
    {
        pointer-events: none;

        color: #8898aa;
    }

    .btn-lg,
    .btn-group-lg > .btn
    {
        font-size: 1.25rem;
        line-height: 1.5;

        padding: .875rem 1rem;

        border-radius: .3rem;
    }

    .btn-sm,
    .btn-group-sm > .btn
    {
        font-size: .875rem;
        line-height: 1.5;

        padding: .25rem .5rem;

        border-radius: .25rem;
    }

    .btn-block
    {
        display: block;

        width: 100%;
    }
    .btn-block + .btn-block
    {
        margin-top: .5rem;
    }

    input[type='submit'].btn-block,
    input[type='reset'].btn-block,
    input[type='button'].btn-block
    {
        width: 100%;
    }

    .fade
    {
        transition: opacity .15s linear;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .fade
        {
            transition: none;
        }
    }
    .fade:not(.show)
    {
        opacity: 0;
    }

    .collapse:not(.show)
    {
        display: none;
    }

    .collapsing
    {
        position: relative;

        overflow: hidden;

        height: 0;

        transition: height .35s ease;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .collapsing
        {
            transition: none;
        }
    }

    .dropup,
    .dropright,
    .dropdown,
    .dropleft
    {
        position: relative;
    }

    .dropdown-toggle::after
    {
        display: inline-block;

        width: 0;
        height: 0;
        margin-left: .255em;

        content: '';
        vertical-align: .255em;

        border-top: .3em solid;
        border-right: .3em solid transparent;
        border-bottom: 0;
        border-left: .3em solid transparent;
    }

    .dropdown-toggle:empty::after
    {
        margin-left: 0;
    }

    .dropdown-menu
    {
        font-size: 1rem;

        position: absolute;
        z-index: 1000;
        top: 100%;
        left: 0;

        display: none;
        float: left;

        min-width: 10rem;
        margin: .125rem 0 0;
        padding: .5rem 0;

        list-style: none;

        text-align: left;

        color: #525f7f;
        border: 0 solid rgba(0, 0, 0, .15);
        border-radius: .3rem;
        background-color: #fff;
        background-clip: padding-box;
        box-shadow: 0 50px 100px rgba(50, 50, 93, .1), 0 15px 35px rgba(50, 50, 93, .15), 0 5px 15px rgba(0, 0, 0, .1);
    }

    .dropdown-menu-right
    {
        right: 0;
        left: auto;
    }

    .dropup .dropdown-menu
    {
        top: auto;
        bottom: 100%;

        margin-top: 0;
        margin-bottom: .125rem;
    }

    .dropup .dropdown-toggle::after
    {
        display: inline-block;

        width: 0;
        height: 0;
        margin-left: .255em;

        content: '';
        vertical-align: .255em;

        border-top: 0;
        border-right: .3em solid transparent;
        border-bottom: .3em solid;
        border-left: .3em solid transparent;
    }

    .dropup .dropdown-toggle:empty::after
    {
        margin-left: 0;
    }

    .dropright .dropdown-menu
    {
        top: 0;
        right: auto;
        left: 100%;

        margin-top: 0;
        margin-left: .125rem;
    }

    .dropright .dropdown-toggle::after
    {
        display: inline-block;

        width: 0;
        height: 0;
        margin-left: .255em;

        content: '';
        vertical-align: .255em;

        border-top: .3em solid transparent;
        border-right: 0;
        border-bottom: .3em solid transparent;
        border-left: .3em solid;
    }

    .dropright .dropdown-toggle:empty::after
    {
        margin-left: 0;
    }

    .dropright .dropdown-toggle::after
    {
        vertical-align: 0;
    }

    .dropleft .dropdown-menu
    {
        top: 0;
        right: 100%;
        left: auto;

        margin-top: 0;
        margin-right: .125rem;
    }

    .dropleft .dropdown-toggle::after
    {
        display: inline-block;

        width: 0;
        height: 0;
        margin-left: .255em;

        content: '';
        vertical-align: .255em;
    }

    .dropleft .dropdown-toggle::after
    {
        display: none;
    }

    .dropleft .dropdown-toggle::before
    {
        display: inline-block;

        width: 0;
        height: 0;
        margin-right: .255em;

        content: '';
        vertical-align: .255em;

        border-top: .3em solid transparent;
        border-right: .3em solid;
        border-bottom: .3em solid transparent;
    }

    .dropleft .dropdown-toggle:empty::after
    {
        margin-left: 0;
    }

    .dropleft .dropdown-toggle::before
    {
        vertical-align: 0;
    }

    .dropdown-menu[x-placement^='top'],
    .dropdown-menu[x-placement^='right'],
    .dropdown-menu[x-placement^='bottom'],
    .dropdown-menu[x-placement^='left']
    {
        right: auto;
        bottom: auto;
    }

    .dropdown-divider
    {
        overflow: hidden;

        height: 0;
        margin: .5rem 0;

        border-top: 1px solid #e9ecef;
    }

    .dropdown-item
    {
        font-weight: 400;

        display: block;
        clear: both;

        width: 100%;
        padding: .25rem 1.5rem;

        text-align: inherit;
        white-space: nowrap;

        color: #212529;
        border: 0;
        background-color: transparent;
    }
    .dropdown-item:hover,
    .dropdown-item:focus
    {
        text-decoration: none;

        color: #16181b;
        background-color: #f6f9fc;
    }
    .dropdown-item.active,
    .dropdown-item:active
    {
        text-decoration: none;

        color: #fff;
        background-color: #546FF7;
    }
    .dropdown-item.disabled,
    .dropdown-item:disabled
    {
        color: #8898aa;
        background-color: transparent;
    }

    .dropdown-menu.show
    {
        display: block;
    }

    .dropdown-header
    {
        font-size: .875rem;

        display: block;

        margin-bottom: 0;
        padding: .5rem 1.5rem;

        white-space: nowrap;

        color: #8898aa;
    }

    .dropdown-item-text
    {
        display: block;

        padding: .25rem 1.5rem;

        color: #212529;
    }

    .btn-group,
    .btn-group-vertical
    {
        position: relative;

        display: inline-flex;

        vertical-align: middle;
    }
    .btn-group > .btn,
    .btn-group-vertical > .btn
    {
        position: relative;

        flex: 0 1 auto;
    }
    .btn-group > .btn:hover,
    .btn-group-vertical > .btn:hover
    {
        z-index: 1;
    }
    .btn-group > .btn:focus,
    .btn-group > .btn:active,
    .btn-group > .btn.active,
    .btn-group-vertical > .btn:focus,
    .btn-group-vertical > .btn:active,
    .btn-group-vertical > .btn.active
    {
        z-index: 1;
    }
    .btn-group .btn + .btn,
    .btn-group .btn + .btn-group,
    .btn-group .btn-group + .btn,
    .btn-group .btn-group + .btn-group,
    .btn-group-vertical .btn + .btn,
    .btn-group-vertical .btn + .btn-group,
    .btn-group-vertical .btn-group + .btn,
    .btn-group-vertical .btn-group + .btn-group
    {
        margin-left: -1px;
    }

    .btn-toolbar
    {
        display: flex;

        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .btn-toolbar .input-group
    {
        width: auto;
    }

    .btn-group > .btn:first-child
    {
        margin-left: 0;
    }

    .btn-group > .btn:not(:last-child):not(.dropdown-toggle),
    .btn-group > .btn-group:not(:last-child) > .btn
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .btn-group > .btn:not(:first-child),
    .btn-group > .btn-group:not(:first-child) > .btn
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .dropdown-toggle-split
    {
        padding-right: .9375rem;
        padding-left: .9375rem;
    }
    .dropdown-toggle-split::after,
    .dropup .dropdown-toggle-split::after,
    .dropright .dropdown-toggle-split::after
    {
        margin-left: 0;
    }
    .dropleft .dropdown-toggle-split::before
    {
        margin-right: 0;
    }

    .btn-sm + .dropdown-toggle-split,
    .btn-group-sm > .btn + .dropdown-toggle-split
    {
        padding-right: .375rem;
        padding-left: .375rem;
    }

    .btn-lg + .dropdown-toggle-split,
    .btn-group-lg > .btn + .dropdown-toggle-split
    {
        padding-right: .75rem;
        padding-left: .75rem;
    }

    .btn-group.show .dropdown-toggle
    {
        box-shadow: none;
    }
    .btn-group.show .dropdown-toggle.btn-link
    {
        box-shadow: none;
    }

    .btn-group-vertical
    {
        flex-direction: column;

        align-items: flex-start;
        justify-content: center;
    }
    .btn-group-vertical .btn,
    .btn-group-vertical .btn-group
    {
        width: 100%;
    }
    .btn-group-vertical > .btn + .btn,
    .btn-group-vertical > .btn + .btn-group,
    .btn-group-vertical > .btn-group + .btn,
    .btn-group-vertical > .btn-group + .btn-group
    {
        margin-top: -1px;
        margin-left: 0;
    }
    .btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),
    .btn-group-vertical > .btn-group:not(:last-child) > .btn
    {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .btn-group-vertical > .btn:not(:first-child),
    .btn-group-vertical > .btn-group:not(:first-child) > .btn
    {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .btn-group-toggle > .btn,
    .btn-group-toggle > .btn-group > .btn
    {
        margin-bottom: 0;
    }
    .btn-group-toggle > .btn input[type='radio'],
    .btn-group-toggle > .btn input[type='checkbox'],
    .btn-group-toggle > .btn-group > .btn input[type='radio'],
    .btn-group-toggle > .btn-group > .btn input[type='checkbox']
    {
        position: absolute;

        clip: rect(0, 0, 0, 0);

        pointer-events: none;
    }

    .input-group
    {
        position: relative;

        display: flex;

        width: 100%;

        flex-wrap: wrap;
        align-items: stretch;
    }
    .input-group > .form-control,
    .input-group > .custom-select,
    .input-group > .custom-file
    {
        position: relative;

        width: 1%;
        margin-bottom: 0;

        flex: 1 1 auto;
    }
    .input-group > .form-control + .form-control,
    .input-group > .form-control + .custom-select,
    .input-group > .form-control + .custom-file,
    .input-group > .custom-select + .form-control,
    .input-group > .custom-select + .custom-select,
    .input-group > .custom-select + .custom-file,
    .input-group > .custom-file + .form-control,
    .input-group > .custom-file + .custom-select,
    .input-group > .custom-file + .custom-file
    {
        margin-left: -1px;
    }
    .input-group > .form-control:focus,
    .input-group > .custom-select:focus,
    .input-group > .custom-file .custom-file-input:focus ~ .custom-file-label
    {
        z-index: 3;
    }
    .input-group > .custom-file .custom-file-input:focus
    {
        z-index: 4;
    }
    .input-group > .form-control:not(:last-child),
    .input-group > .custom-select:not(:last-child)
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .input-group > .form-control:not(:first-child),
    .input-group > .custom-select:not(:first-child)
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .input-group > .custom-file
    {
        display: flex;

        align-items: center;
    }
    .input-group > .custom-file:not(:last-child) .custom-file-label,
    .input-group > .custom-file:not(:last-child) .custom-file-label::after
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .input-group > .custom-file:not(:first-child) .custom-file-label
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .input-group-prepend,
    .input-group-append
    {
        display: flex;
    }
    .input-group-prepend .btn,
    .input-group-append .btn
    {
        position: relative;
        z-index: 2;
    }
    .input-group-prepend .btn + .btn,
    .input-group-prepend .btn + .input-group-text,
    .input-group-prepend .input-group-text + .input-group-text,
    .input-group-prepend .input-group-text + .btn,
    .input-group-append .btn + .btn,
    .input-group-append .btn + .input-group-text,
    .input-group-append .input-group-text + .input-group-text,
    .input-group-append .input-group-text + .btn
    {
        margin-left: -1px;
    }

    .input-group-prepend
    {
        margin-right: -1px;
    }

    .input-group-append
    {
        margin-left: -1px;
    }

    .input-group-text
    {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;

        display: flex;

        margin-bottom: 0;
        padding: .625rem .75rem;

        text-align: center;
        white-space: nowrap;

        color: #adb5bd;
        border: 1px solid #cad1d7;
        border-radius: .25rem;
        background-color: #fff;

        align-items: center;
    }
    .input-group-text input[type='radio'],
    .input-group-text input[type='checkbox']
    {
        margin-top: 0;
    }

    .input-group-lg > .form-control,
    .input-group-lg > .input-group-prepend > .input-group-text,
    .input-group-lg > .input-group-append > .input-group-text,
    .input-group-lg > .input-group-prepend > .btn,
    .input-group-lg > .input-group-append > .btn
    {
        font-size: 1.25rem;
        line-height: 1.5;

        height: calc(3.625rem + 2px);
        padding: .875rem 1rem;

        border-radius: .3rem;
    }

    .input-group-sm > .form-control,
    .input-group-sm > .input-group-prepend > .input-group-text,
    .input-group-sm > .input-group-append > .input-group-text,
    .input-group-sm > .input-group-prepend > .btn,
    .input-group-sm > .input-group-append > .btn
    {
        font-size: .875rem;
        line-height: 1.5;

        height: calc(1.8125rem + 2px);
        padding: .25rem .5rem;

        border-radius: .2rem;
    }

    .input-group > .input-group-prepend > .btn,
    .input-group > .input-group-prepend > .input-group-text,
    .input-group > .input-group-append:not(:last-child) > .btn,
    .input-group > .input-group-append:not(:last-child) > .input-group-text,
    .input-group > .input-group-append:last-child > .btn:not(:last-child):not(.dropdown-toggle),
    .input-group > .input-group-append:last-child > .input-group-text:not(:last-child)
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .input-group > .input-group-append > .btn,
    .input-group > .input-group-append > .input-group-text,
    .input-group > .input-group-prepend:not(:first-child) > .btn,
    .input-group > .input-group-prepend:not(:first-child) > .input-group-text,
    .input-group > .input-group-prepend:first-child > .btn:not(:first-child),
    .input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child)
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .custom-control
    {
        position: relative;

        display: block;

        min-height: 1.5rem;
        padding-left: 1.75rem;
    }

    .custom-control-inline
    {
        display: inline-flex;

        margin-right: 1rem;
    }

    .custom-control-input
    {
        position: absolute;
        z-index: -1;

        opacity: 0;
    }
    .custom-control-input:checked ~ .custom-control-label::before
    {
        color: #fff;
        background-color: #546FF7;
        box-shadow: none;
    }
    .custom-control-input:focus ~ .custom-control-label::before
    {
        box-shadow: none;
    }
    .custom-control-input:active ~ .custom-control-label::before
    {
        color: #fff;
        background-color: #546FF7;
        box-shadow: none;
    }
    .custom-control-input:disabled ~ .custom-control-label
    {
        color: #8898aa;
    }
    .custom-control-input:disabled ~ .custom-control-label::before
    {
        background-color: #e9ecef;
    }

    .custom-control-label
    {
        position: relative;

        margin-bottom: 0;
    }
    .custom-control-label::before
    {
        position: absolute;
        top: .125rem;
        left: -1.75rem;

        display: block;

        width: 1.25rem;
        height: 1.25rem;

        content: '';
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
        pointer-events: none;

        background-color: #fff;
        box-shadow: none;
    }
    .custom-control-label::after
    {
        position: absolute;
        top: .125rem;
        left: -1.75rem;

        display: block;

        width: 1.25rem;
        height: 1.25rem;

        content: '';

        background-repeat: no-repeat;
        background-position: center center;
        background-size: 50% 50%;
    }

    .custom-checkbox .custom-control-label::before
    {
        border-radius: .2rem;
    }

    .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before
    {
        background-color: #546FF7;
    }

    .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3E%3Cpath fill=\'%23fff\' d=\'M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z\'/%3E%3C/svg%3E');
    }

    .custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::before
    {
        background-color: #546FF7;
        box-shadow: none;
    }

    .custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::after
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 4\'%3E%3Cpath stroke=\'%23fff\' d=\'M0 2h4\'/%3E%3C/svg%3E');
    }

    .custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before
    {
        background-color: rgba(94, 114, 228, .5);
    }

    .custom-checkbox .custom-control-input:disabled:indeterminate ~ .custom-control-label::before
    {
        background-color: rgba(94, 114, 228, .5);
    }

    .custom-radio .custom-control-label::before
    {
        border-radius: 50%;
    }

    .custom-radio .custom-control-input:checked ~ .custom-control-label::before
    {
        background-color: #546FF7;
    }

    .custom-radio .custom-control-input:checked ~ .custom-control-label::after
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3E%3Ccircle r=\'3\' fill=\'%23fff\'/%3E%3C/svg%3E');
    }

    .custom-radio .custom-control-input:disabled:checked ~ .custom-control-label::before
    {
        background-color: rgba(94, 114, 228, .5);
    }

    .custom-select
    {
        line-height: 1.5;

        display: inline-block;

        width: 100%;
        height: calc(2.75rem + 2px);
        padding: .375rem 1.75rem .375rem .75rem;

        vertical-align: middle;

        color: #8898aa;
        border: 1px solid #cad1d7;
        border-radius: .25rem;
        background: #fff url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'%3E%3Cpath fill=\'%2332325d\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/%3E%3C/svg%3E') no-repeat right .75rem center;
        background-size: 8px 10px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .075);

        -webkit-appearance: none;
           -moz-appearance: none;
                appearance: none;
    }
    .custom-select:focus
    {
        border-color: rgba(50, 151, 211, .25);
        outline: 0;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .075), 0 0 0 0 rgba(50, 151, 211, .5);
    }
    .custom-select:focus::-ms-value
    {
        color: #8898aa;
        background-color: #fff;
    }
    .custom-select[multiple],
    .custom-select[size]:not([size='1'])
    {
        height: auto;
        padding-right: .75rem;

        background-image: none;
    }
    .custom-select:disabled
    {
        color: #8898aa;
        background-color: #e9ecef;
    }
    .custom-select::-ms-expand
    {
        opacity: 0;
    }

    .custom-select-sm
    {
        font-size: 75%;

        height: calc(1.8125rem + 2px);
        padding-top: .375rem;
        padding-bottom: .375rem;
    }

    .custom-select-lg
    {
        font-size: 125%;

        height: calc(3.625rem + 2px);
        padding-top: .375rem;
        padding-bottom: .375rem;
    }

    .custom-file
    {
        position: relative;

        display: inline-block;

        width: 100%;
        height: calc(2.75rem + 2px);
        margin-bottom: 0;
    }

    .custom-file-input
    {
        position: relative;
        z-index: 2;

        width: 100%;
        height: calc(2.75rem + 2px);
        margin: 0;

        opacity: 0;
    }
    .custom-file-input:focus ~ .custom-file-label
    {
        border-color: rgba(50, 151, 211, .25);
        box-shadow: none;
    }
    .custom-file-input:focus ~ .custom-file-label::after
    {
        border-color: rgba(50, 151, 211, .25);
    }
    .custom-file-input:disabled ~ .custom-file-label
    {
        background-color: #e9ecef;
    }
    .custom-file-input:lang(en) ~ .custom-file-label::after
    {
        content: 'Browse';
    }

    .custom-file-label
    {
        line-height: 1.5;

        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        left: 0;

        height: calc(2.75rem + 2px);
        padding: .625rem .75rem;

        color: #8898aa;
        border: 1px solid #cad1d7;
        border-radius: .25rem;
        background-color: #fff;
        box-shadow: none;
    }
    .custom-file-label::after
    {
        line-height: 1.5;

        position: absolute;
        z-index: 3;
        top: 0;
        right: 0;
        bottom: 0;

        display: block;

        height: 2.75rem;
        padding: .625rem .75rem;

        content: 'Browse';

        color: #8898aa;
        border-left: 1px solid #cad1d7;
        border-radius: 0 .25rem .25rem 0;
        background-color: #fff;
    }

    .custom-range
    {
        width: 100%;
        padding-left: 0;

        background-color: transparent;

        -webkit-appearance: none;
           -moz-appearance: none;
                appearance: none;
    }
    .custom-range:focus
    {
        outline: none;
    }
    .custom-range:focus::-webkit-slider-thumb
    {
        box-shadow: 0 0 0 1px #fff, none;
    }
    .custom-range:focus::-moz-range-thumb
    {
        box-shadow: 0 0 0 1px #fff, none;
    }
    .custom-range:focus::-ms-thumb
    {
        box-shadow: 0 0 0 1px #fff, none;
    }
    .custom-range::-moz-focus-outer
    {
        border: 0;
    }
    .custom-range::-webkit-slider-thumb
    {
        width: 1rem;
        height: 1rem;
        margin-top: -.25rem;

        transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

        border: 0;
        border-radius: 1rem;
        background-color: #546FF7;
        box-shadow: 0 .1rem .25rem rgba(0, 0, 0, .1);

        -webkit-appearance: none;
                appearance: none;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .custom-range::-webkit-slider-thumb
        {
            transition: none;
        }
    }
    .custom-range::-webkit-slider-thumb:active
    {
        background-color: #f7f8fe;
    }
    .custom-range::-webkit-slider-runnable-track
    {
        width: 100%;
        height: .5rem;

        cursor: pointer;

        color: transparent;
        border-color: transparent;
        border-radius: 1rem;
        background-color: #dee2e6;
        box-shadow: inset 0 .25rem .25rem rgba(0, 0, 0, .1);
    }
    .custom-range::-moz-range-thumb
    {
        width: 1rem;
        height: 1rem;

        transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

        border: 0;
        border-radius: 1rem;
        background-color: #546FF7;
        box-shadow: 0 .1rem .25rem rgba(0, 0, 0, .1);

        -moz-appearance: none;
             appearance: none;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .custom-range::-moz-range-thumb
        {
            transition: none;
        }
    }
    .custom-range::-moz-range-thumb:active
    {
        background-color: #f7f8fe;
    }
    .custom-range::-moz-range-track
    {
        width: 100%;
        height: .5rem;

        cursor: pointer;

        color: transparent;
        border-color: transparent;
        border-radius: 1rem;
        background-color: #dee2e6;
        box-shadow: inset 0 .25rem .25rem rgba(0, 0, 0, .1);
    }
    .custom-range::-ms-thumb
    {
        width: 1rem;
        height: 1rem;
        margin-top: 0;
        margin-right: 0;
        margin-left: 0;

        transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;

        border: 0;
        border-radius: 1rem;
        background-color: #546FF7;
        box-shadow: 0 .1rem .25rem rgba(0, 0, 0, .1);

        appearance: none;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .custom-range::-ms-thumb
        {
            transition: none;
        }
    }
    .custom-range::-ms-thumb:active
    {
        background-color: #f7f8fe;
    }
    .custom-range::-ms-track
    {
        width: 100%;
        height: .5rem;

        cursor: pointer;

        color: transparent;
        border-width: .5rem;
        border-color: transparent;
        background-color: transparent;
        box-shadow: inset 0 .25rem .25rem rgba(0, 0, 0, .1);
    }
    .custom-range::-ms-fill-lower
    {
        border-radius: 1rem;
        background-color: #dee2e6;
    }
    .custom-range::-ms-fill-upper
    {
        margin-right: 15px;

        border-radius: 1rem;
        background-color: #dee2e6;
    }

    .custom-control-label::before,
    .custom-file-label,
    .custom-select
    {
        transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .custom-control-label::before,
        .custom-file-label,
        .custom-select
        {
            transition: none;
        }
    }

    .nav
    {
        display: flex;

        margin-bottom: 0;
        padding-left: 0;

        list-style: none;

        flex-wrap: wrap;
    }

    .nav-link
    {
        display: block;

        padding: .25rem .75rem;
    }
    .nav-link:hover,
    .nav-link:focus
    {
        text-decoration: none;
    }
    .nav-link.disabled
    {
        color: #8898aa;
    }

    .nav-tabs
    {
        border-bottom: .0625rem solid #dee2e6;
    }
    .nav-tabs .nav-item
    {
        margin-bottom: -.0625rem;
    }
    .nav-tabs .nav-link
    {
        border: .0625rem solid transparent;
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    .nav-tabs .nav-link:hover,
    .nav-tabs .nav-link:focus
    {
        border-color: #e9ecef #e9ecef #dee2e6;
    }
    .nav-tabs .nav-link.disabled
    {
        color: #8898aa;
        border-color: transparent;
        background-color: transparent;
    }
    .nav-tabs .nav-link.active,
    .nav-tabs .nav-item.show .nav-link
    {
        color: #525f7f;
        border-color: #dee2e6 #dee2e6 #fff;
        background-color: #fff;
    }
    .nav-tabs .dropdown-menu
    {
        margin-top: -.0625rem;

        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .nav-pills .nav-link
    {
        border-radius: .25rem;
    }

    .nav-pills .nav-link.active,
    .nav-pills .show > .nav-link
    {
        color: #fff;
        background-color: #546FF7;
    }

    .nav-fill .nav-item
    {
        text-align: center;

        flex: 1 1 auto;
    }

    .nav-justified .nav-item
    {
        text-align: center;

        flex-basis: 0;
        flex-grow: 1;
    }

    .tab-content > .tab-pane
    {
        display: none;
    }

    .tab-content > .active
    {
        display: block;
    }

    .navbar
    {
        position: relative;

        display: flex;

        padding: 1rem 1rem;

        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }
    .navbar > .container,
    .navbar > .container-fluid
    {
        display: flex;

        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }

    .navbar-brand
    {
        font-size: 1.25rem;
        line-height: inherit;

        display: inline-block;

        margin-right: 1rem;
        padding-top: .0625rem;
        padding-bottom: .0625rem;

        white-space: nowrap;
    }
    .navbar-brand:hover,
    .navbar-brand:focus
    {
        text-decoration: none;
    }

    .navbar-nav
    {
        display: flex;
        flex-direction: column;

        margin-bottom: 0;
        padding-left: 0;

        list-style: none;
    }
    .navbar-nav .nav-link
    {
        padding-right: 0;
        padding-left: 0;
    }
    .navbar-nav .dropdown-menu
    {
        position: static;

        float: none;
    }

    .navbar-text
    {
        display: inline-block;

        padding-top: .25rem;
        padding-bottom: .25rem;
    }

    .navbar-collapse
    {
        flex-basis: 100%;
        flex-grow: 1;
        align-items: center;
    }

    .navbar-toggler
    {
        font-size: 1.25rem;
        line-height: 1;

        padding: .25rem .75rem;

        border: .0625rem solid transparent;
        border-radius: .25rem;
        background-color: transparent;
    }
    .navbar-toggler:hover,
    .navbar-toggler:focus
    {
        text-decoration: none;
    }
    .navbar-toggler:not(:disabled):not(.disabled)
    {
        cursor: pointer;
    }

    .navbar-toggler-icon
    {
        display: inline-block;

        width: 1.5em;
        height: 1.5em;

        content: '';
        vertical-align: middle;

        background: no-repeat center center;
        background-size: 100% 100%;
    }

    @media (max-width: 575.98px)
    {
        .navbar-expand-sm > .container,
        .navbar-expand-sm > .container-fluid
        {
            padding-right: 0;
            padding-left: 0;
        }
    }

    @media (min-width: 576px)
    {
        .navbar-expand-sm
        {
            flex-flow: row nowrap;
            justify-content: flex-start;
        }
        .navbar-expand-sm .navbar-nav
        {
            flex-direction: row;
        }
        .navbar-expand-sm .navbar-nav .dropdown-menu
        {
            position: absolute;
        }
        .navbar-expand-sm .navbar-nav .nav-link
        {
            padding-right: 1rem;
            padding-left: 1rem;
        }
        .navbar-expand-sm > .container,
        .navbar-expand-sm > .container-fluid
        {
            flex-wrap: nowrap;
        }
        .navbar-expand-sm .navbar-collapse
        {
            display: flex !important;

            flex-basis: auto;
        }
        .navbar-expand-sm .navbar-toggler
        {
            display: none;
        }
    }

    @media (max-width: 767.98px)
    {
        .navbar-expand-md > .container,
        .navbar-expand-md > .container-fluid
        {
            padding-right: 0;
            padding-left: 0;
        }
    }

    @media (min-width: 768px)
    {
        .navbar-expand-md
        {
            flex-flow: row nowrap;
            justify-content: flex-start;
        }
        .navbar-expand-md .navbar-nav
        {
            flex-direction: row;
        }
        .navbar-expand-md .navbar-nav .dropdown-menu
        {
            position: absolute;
        }
        .navbar-expand-md .navbar-nav .nav-link
        {
            padding-right: 1rem;
            padding-left: 1rem;
        }
        .navbar-expand-md > .container,
        .navbar-expand-md > .container-fluid
        {
            flex-wrap: nowrap;
        }
        .navbar-expand-md .navbar-collapse
        {
            display: flex !important;

            flex-basis: auto;
        }
        .navbar-expand-md .navbar-toggler
        {
            display: none;
        }
    }

    @media (max-width: 991.98px)
    {
        .navbar-expand-lg > .container,
        .navbar-expand-lg > .container-fluid
        {
            padding-right: 0;
            padding-left: 0;
        }
    }

    @media (min-width: 992px)
    {
        .navbar-expand-lg
        {
            flex-flow: row nowrap;
            justify-content: flex-start;
        }
        .navbar-expand-lg .navbar-nav
        {
            flex-direction: row;
        }
        .navbar-expand-lg .navbar-nav .dropdown-menu
        {
            position: absolute;
        }
        .navbar-expand-lg .navbar-nav .nav-link
        {
            padding-right: 1rem;
            padding-left: 1rem;
        }
        .navbar-expand-lg > .container,
        .navbar-expand-lg > .container-fluid
        {
            flex-wrap: nowrap;
        }
        .navbar-expand-lg .navbar-collapse
        {
            display: flex !important;

            flex-basis: auto;
        }
        .navbar-expand-lg .navbar-toggler
        {
            display: none;
        }
    }

    @media (max-width: 1199.98px)
    {
        .navbar-expand-xl > .container,
        .navbar-expand-xl > .container-fluid
        {
            padding-right: 0;
            padding-left: 0;
        }
    }

    @media (min-width: 1200px)
    {
        .navbar-expand-xl
        {
            flex-flow: row nowrap;
            justify-content: flex-start;
        }
        .navbar-expand-xl .navbar-nav
        {
            flex-direction: row;
        }
        .navbar-expand-xl .navbar-nav .dropdown-menu
        {
            position: absolute;
        }
        .navbar-expand-xl .navbar-nav .nav-link
        {
            padding-right: 1rem;
            padding-left: 1rem;
        }
        .navbar-expand-xl > .container,
        .navbar-expand-xl > .container-fluid
        {
            flex-wrap: nowrap;
        }
        .navbar-expand-xl .navbar-collapse
        {
            display: flex !important;

            flex-basis: auto;
        }
        .navbar-expand-xl .navbar-toggler
        {
            display: none;
        }
    }

    .navbar-expand
    {
        flex-flow: row nowrap;
        justify-content: flex-start;
    }
    .navbar-expand > .container,
    .navbar-expand > .container-fluid
    {
        padding-right: 0;
        padding-left: 0;
    }
    .navbar-expand .navbar-nav
    {
        flex-direction: row;
    }
    .navbar-expand .navbar-nav .dropdown-menu
    {
        position: absolute;
    }
    .navbar-expand .navbar-nav .nav-link
    {
        padding-right: 1rem;
        padding-left: 1rem;
    }
    .navbar-expand > .container,
    .navbar-expand > .container-fluid
    {
        flex-wrap: nowrap;
    }
    .navbar-expand .navbar-collapse
    {
        display: flex !important;

        flex-basis: auto;
    }
    .navbar-expand .navbar-toggler
    {
        display: none;
    }

    .navbar-light .navbar-brand
    {
        color: rgba(0, 0, 0, .9);
    }
    .navbar-light .navbar-brand:hover,
    .navbar-light .navbar-brand:focus
    {
        color: rgba(0, 0, 0, .9);
    }

    .navbar-light .navbar-nav .nav-link
    {
        color: rgba(0, 0, 0, .5);
    }
    .navbar-light .navbar-nav .nav-link:hover,
    .navbar-light .navbar-nav .nav-link:focus
    {
        color: rgba(0, 0, 0, .7);
    }
    .navbar-light .navbar-nav .nav-link.disabled
    {
        color: rgba(0, 0, 0, .3);
    }

    .navbar-light .navbar-nav .show > .nav-link,
    .navbar-light .navbar-nav .active > .nav-link,
    .navbar-light .navbar-nav .nav-link.show,
    .navbar-light .navbar-nav .nav-link.active
    {
        color: rgba(0, 0, 0, .9);
    }

    .navbar-light .navbar-toggler
    {
        color: rgba(0, 0, 0, .5);
        border-color: transparent;
    }

    .navbar-light .navbar-toggler-icon
    {
        background-image: url('data:image/svg+xml !default;charset=utf8,%3Csvg viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke=\'rgba(0, 0, 0, 0.5)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 7h22M4 15h22M4 23h22\'/%3E%3C/svg%3E');
    }

    .navbar-light .navbar-text
    {
        color: rgba(0, 0, 0, .5);
    }
    .navbar-light .navbar-text a
    {
        color: rgba(0, 0, 0, .9);
    }
    .navbar-light .navbar-text a:hover,
    .navbar-light .navbar-text a:focus
    {
        color: rgba(0, 0, 0, .9);
    }

    .navbar-dark .navbar-brand
    {
        color: rgba(255, 255, 255, .65);
    }
    .navbar-dark .navbar-brand:hover,
    .navbar-dark .navbar-brand:focus
    {
        color: rgba(255, 255, 255, .65);
    }

    .navbar-dark .navbar-nav .nav-link
    {
        color: rgba(255, 255, 255, .95);
    }
    .navbar-dark .navbar-nav .nav-link:hover,
    .navbar-dark .navbar-nav .nav-link:focus
    {
        color: rgba(255, 255, 255, .65);
    }
    .navbar-dark .navbar-nav .nav-link.disabled
    {
        color: rgba(255, 255, 255, .25);
    }

    .navbar-dark .navbar-nav .show > .nav-link,
    .navbar-dark .navbar-nav .active > .nav-link,
    .navbar-dark .navbar-nav .nav-link.show,
    .navbar-dark .navbar-nav .nav-link.active
    {
        color: rgba(255, 255, 255, .65);
    }

    .navbar-dark .navbar-toggler
    {
        color: rgba(255, 255, 255, .95);
        border-color: transparent;
    }

    .navbar-dark .navbar-toggler-icon
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke=\'rgba(255, 255, 255, 0.95)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 7h22M4 15h22M4 23h22\'/%3E%3C/svg%3E');
    }

    .navbar-dark .navbar-text
    {
        color: rgba(255, 255, 255, .95);
    }
    .navbar-dark .navbar-text a
    {
        color: rgba(255, 255, 255, .65);
    }
    .navbar-dark .navbar-text a:hover,
    .navbar-dark .navbar-text a:focus
    {
        color: rgba(255, 255, 255, .65);
    }

    .card
    {
        position: relative;

        display: flex;
        flex-direction: column;

        min-width: 0;

        word-wrap: break-word;

        border: .0625rem solid rgba(0, 0, 0, .05);
        border-radius: .25rem;
        background-color: #fff;
        background-clip: border-box;
    }
    .card > hr
    {
        margin-right: 0;
        margin-left: 0;
    }
    .card > .list-group:first-child .list-group-item:first-child
    {
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    .card > .list-group:last-child .list-group-item:last-child
    {
        border-bottom-right-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }

    .card-body
    {
        padding: 1.5rem;

        flex: 1 1 auto;
    }

    .card-title
    {
        margin-bottom: 1.25rem;
    }

    .card-subtitle
    {
        margin-top: -.625rem;
        margin-bottom: 0;
    }

    .card-text:last-child
    {
        margin-bottom: 0;
    }

    .card-link:hover
    {
        text-decoration: none;
    }

    .card-link + .card-link
    {
        margin-left: 1.5rem;
    }

    .card-header
    {
        margin-bottom: 0;
        padding: 1.25rem 1.5rem;

        border-bottom: .0625rem solid rgba(0, 0, 0, .05);
        background-color: #f6f9fc;
    }
    .card-header:first-child
    {
        border-radius: calc(.25rem - .0625rem) calc(.25rem - .0625rem) 0 0;
    }
    .card-header + .list-group .list-group-item:first-child
    {
        border-top: 0;
    }

    .card-footer
    {
        padding: 1.25rem 1.5rem;

        border-top: .0625rem solid rgba(0, 0, 0, .05);
        background-color: #f6f9fc;
    }
    .card-footer:last-child
    {
        border-radius: 0 0 calc(.25rem - .0625rem) calc(.25rem - .0625rem);
    }

    .card-header-tabs
    {
        margin-right: -.75rem;
        margin-bottom: -1.25rem;
        margin-left: -.75rem;

        border-bottom: 0;
    }

    .card-header-pills
    {
        margin-right: -.75rem;
        margin-left: -.75rem;
    }

    .card-img-overlay
    {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        padding: 1.25rem;
    }

    .card-img
    {
        width: 100%;

        border-radius: calc(.25rem - .0625rem);
    }

    .card-img-top
    {
        width: 100%;

        border-top-left-radius: calc(.25rem - .0625rem);
        border-top-right-radius: calc(.25rem - .0625rem);
    }

    .card-img-bottom
    {
        width: 100%;

        border-bottom-right-radius: calc(.25rem - .0625rem);
        border-bottom-left-radius: calc(.25rem - .0625rem);
    }

    .card-deck
    {
        display: flex;
        flex-direction: column;
    }
    .card-deck .card
    {
        margin-bottom: 15px;
    }
    @media (min-width: 576px)
    {
        .card-deck
        {
            margin-right: -15px;
            margin-left: -15px;

            flex-flow: row wrap;
        }
        .card-deck .card
        {
            display: flex;
            flex-direction: column;

            margin-right: 15px;
            margin-bottom: 0;
            margin-left: 15px;

            flex: 1 0;
        }
    }

    .card-group
    {
        display: flex;
        flex-direction: column;
    }
    .card-group > .card
    {
        margin-bottom: 15px;
    }
    @media (min-width: 576px)
    {
        .card-group
        {
            flex-flow: row wrap;
        }
        .card-group > .card
        {
            margin-bottom: 0;

            flex: 1 0;
        }
        .card-group > .card + .card
        {
            margin-left: 0;

            border-left: 0;
        }
        .card-group > .card:first-child
        {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .card-group > .card:first-child .card-img-top,
        .card-group > .card:first-child .card-header
        {
            border-top-right-radius: 0;
        }
        .card-group > .card:first-child .card-img-bottom,
        .card-group > .card:first-child .card-footer
        {
            border-bottom-right-radius: 0;
        }
        .card-group > .card:last-child
        {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .card-group > .card:last-child .card-img-top,
        .card-group > .card:last-child .card-header
        {
            border-top-left-radius: 0;
        }
        .card-group > .card:last-child .card-img-bottom,
        .card-group > .card:last-child .card-footer
        {
            border-bottom-left-radius: 0;
        }
        .card-group > .card:only-child
        {
            border-radius: .25rem;
        }
        .card-group > .card:only-child .card-img-top,
        .card-group > .card:only-child .card-header
        {
            border-top-left-radius: .25rem;
            border-top-right-radius: .25rem;
        }
        .card-group > .card:only-child .card-img-bottom,
        .card-group > .card:only-child .card-footer
        {
            border-bottom-right-radius: .25rem;
            border-bottom-left-radius: .25rem;
        }
        .card-group > .card:not(:first-child):not(:last-child):not(:only-child)
        {
            border-radius: 0;
        }
        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-top,
        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-img-bottom,
        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-header,
        .card-group > .card:not(:first-child):not(:last-child):not(:only-child) .card-footer
        {
            border-radius: 0;
        }
    }

    .card-columns .card
    {
        margin-bottom: 1.25rem;
    }

    @media (min-width: 576px)
    {
        .card-columns
        {
            column-count: 3;
            column-gap: 1.25rem;
            orphans: 1;
            widows: 1;
        }
        .card-columns .card
        {
            display: inline-block;

            width: 100%;
        }
    }

    .accordion .card:not(:first-of-type):not(:last-of-type)
    {
        border-bottom: 0;
        border-radius: 0;
    }

    .accordion .card:not(:first-of-type) .card-header:first-child
    {
        border-radius: 0;
    }

    .accordion .card:first-of-type
    {
        border-bottom: 0;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .accordion .card:last-of-type
    {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .breadcrumb
    {
        display: flex;

        margin-bottom: 1rem;
        padding: .75rem 1rem;

        list-style: none;

        border-radius: .25rem;
        background-color: #e9ecef;

        flex-wrap: wrap;
    }

    .breadcrumb-item + .breadcrumb-item
    {
        padding-left: .5rem;
    }
    .breadcrumb-item + .breadcrumb-item::before
    {
        display: inline-block;

        padding-right: .5rem;

        content: '/';

        color: #8898aa;
    }

    .breadcrumb-item + .breadcrumb-item:hover::before
    {
        text-decoration: underline;
    }

    .breadcrumb-item + .breadcrumb-item:hover::before
    {
        text-decoration: none;
    }

    .breadcrumb-item.active
    {
        color: #8898aa;
    }

    .pagination
    {
        display: flex;

        padding-left: 0;

        list-style: none;

        border-radius: .25rem;
    }

    .page-link
    {
        line-height: 1.25;

        position: relative;

        display: block;

        margin-left: -.0625rem;
        padding: .5rem .75rem;

        color: #8898aa;
        border: .0625rem solid #dee2e6;
        background-color: #fff;
    }
    .page-link:hover
    {
        z-index: 2;

        text-decoration: none;

        color: #8898aa;
        border-color: #dee2e6;
        background-color: #dee2e6;
    }
    .page-link:focus
    {
        z-index: 2;

        outline: 0;
        box-shadow: none;
    }
    .page-link:not(:disabled):not(.disabled)
    {
        cursor: pointer;
    }

    .page-item:first-child .page-link
    {
        margin-left: 0;

        border-top-left-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }

    .page-item:last-child .page-link
    {
        border-top-right-radius: .25rem;
        border-bottom-right-radius: .25rem;
    }

    .page-item.active .page-link
    {
        z-index: 1;

        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }

    .page-item.disabled .page-link
    {
        cursor: auto;
        pointer-events: none;

        color: #8898aa;
        border-color: #dee2e6;
        background-color: #fff;
    }

    .pagination-lg .page-link
    {
        font-size: 1.25rem;
        line-height: 1.5;

        padding: .75rem 1.5rem;
    }

    .pagination-lg .page-item:first-child .page-link
    {
        border-top-left-radius: .3rem;
        border-bottom-left-radius: .3rem;
    }

    .pagination-lg .page-item:last-child .page-link
    {
        border-top-right-radius: .3rem;
        border-bottom-right-radius: .3rem;
    }

    .pagination-sm .page-link
    {
        font-size: .875rem;
        line-height: 1.5;

        padding: .25rem .5rem;
    }

    .pagination-sm .page-item:first-child .page-link
    {
        border-top-left-radius: .2rem;
        border-bottom-left-radius: .2rem;
    }

    .pagination-sm .page-item:last-child .page-link
    {
        border-top-right-radius: .2rem;
        border-bottom-right-radius: .2rem;
    }

    .badge
    {
        font-size: 66%;
        font-weight: 600;
        line-height: 1;

        display: inline-block;

        padding: .35rem .375rem;

        text-align: center;
        vertical-align: baseline;
        white-space: nowrap;

        border-radius: .25rem;
    }
    .badge:empty
    {
        display: none;
    }

    .btn .badge
    {
        position: relative;
        top: -1px;
    }

    .badge-pill
    {
        padding-right: .875em;
        padding-left: .875em;

        border-radius: 10rem;
    }

    .badge-primary
    {
        color: #2643e9;
        background-color: rgba(203, 210, 246, .5);
    }
    .badge-primary[href]:hover,
    .badge-primary[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #324cdd;
    }

    .badge-secondary
    {
        color: #d3d9e5;
        background-color: rgba(255, 255, 255, .5);
    }
    .badge-secondary[href]:hover,
    .badge-secondary[href]:focus
    {
        text-decoration: none;

        color: #212529;
        background-color: #d6dae2;
    }

    .badge-success
    {
        color: #1aae6f;
        background-color: rgba(147, 231, 195, .5);
    }
    .badge-success[href]:hover,
    .badge-success[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #24a46d;
    }

    .badge-info
    {
        color: #03acca;
        background-color: rgba(136, 230, 247, .5);
    }
    .badge-info[href]:hover,
    .badge-info[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #0da5c0;
    }

    .badge-warning
    {
        color: #ff3709;
        background-color: rgba(254, 201, 189, .5);
    }
    .badge-warning[href]:hover,
    .badge-warning[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #fa3a0e;
    }

    .badge-danger
    {
        color: #f80031;
        background-color: rgba(251, 175, 190, .5);
    }
    .badge-danger[href]:hover,
    .badge-danger[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #ec0c38;
    }

    .badge-light
    {
        color: #879cb0;
        background-color: rgba(244, 245, 246, .5);
    }
    .badge-light[href]:hover,
    .badge-light[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #919ca6;
    }

    .badge-dark
    {
        color: #090c0e;
        background-color: rgba(90, 101, 112, .5);
    }
    .badge-dark[href]:hover,
    .badge-dark[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #0a0c0d;
    }

    .badge-default
    {
        color: #091428;
        background-color: rgba(52, 98, 175, .5);
    }
    .badge-default[href]:hover,
    .badge-default[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: #0b1526;
    }

    .badge-white
    {
        color: #e8e3e3;
        background-color: rgba(255, 255, 255, .5);
    }
    .badge-white[href]:hover,
    .badge-white[href]:focus
    {
        text-decoration: none;

        color: #212529;
        background-color: #e6e6e6;
    }

    .badge-neutral
    {
        color: #e8e3e3;
        background-color: rgba(255, 255, 255, .5);
    }
    .badge-neutral[href]:hover,
    .badge-neutral[href]:focus
    {
        text-decoration: none;

        color: #212529;
        background-color: #e6e6e6;
    }

    .badge-darker
    {
        color: black;
        background-color: rgba(64, 64, 64, .5);
    }
    .badge-darker[href]:hover,
    .badge-darker[href]:focus
    {
        text-decoration: none;

        color: #fff;
        background-color: black;
    }

    .jumbotron
    {
        margin-bottom: 2rem;
        padding: 2rem 1rem;

        border-radius: .3rem;
        background-color: #e9ecef;
    }
    @media (min-width: 576px)
    {
        .jumbotron
        {
            padding: 4rem 2rem;
        }
    }

    .jumbotron-fluid
    {
        padding-right: 0;
        padding-left: 0;

        border-radius: 0;
    }

    .alert
    {
        position: relative;

        margin-bottom: 1rem;
        padding: 1rem 1.5rem;

        border: .0625rem solid transparent;
        border-radius: .25rem;
    }

    .alert-heading
    {
        color: inherit;
    }

    .alert-link
    {
        font-weight: 600;
    }

    .alert-dismissible
    {
        padding-right: 4.5rem;
    }
    .alert-dismissible .close
    {
        position: absolute;
        top: 0;
        right: 0;

        padding: 1rem 1.5rem;

        color: inherit;
    }

    .alert-primary
    {
        color: #fff;
        border-color: #7889e8;
        background-color: #7889e8;
    }
    .alert-primary hr
    {
        border-top-color: #6276e4;
    }
    .alert-primary .alert-link
    {
        color: #324cdd;
    }

    .alert-secondary
    {
        color: #212529;
        border-color: #f6f7f8;
        background-color: #f6f7f8;
    }
    .alert-secondary hr
    {
        border-top-color: #e8eaed;
    }
    .alert-secondary .alert-link
    {
        color: #d6dae2;
    }

    .alert-success
    {
        color: #fff;
        border-color: #4fd69c;
        background-color: #4fd69c;
    }
    .alert-success hr
    {
        border-top-color: #3ad190;
    }
    .alert-success .alert-link
    {
        color: #24a46d;
    }

    .alert-info
    {
        color: #fff;
        border-color: #37d5f2;
        background-color: #37d5f2;
    }
    .alert-info hr
    {
        border-top-color: #1fd0f0;
    }
    .alert-info .alert-link
    {
        color: #0da5c0;
    }

    .alert-warning
    {
        color: #fff;
        border-color: #fc7c5f;
        background-color: #fc7c5f;
    }
    .alert-warning hr
    {
        border-top-color: #fc6846;
    }
    .alert-warning .alert-link
    {
        color: #fa3a0e;
    }

    .alert-danger
    {
        color: #fff;
        border-color: #f75676;
        background-color: #f75676;
    }
    .alert-danger hr
    {
        border-top-color: #f63e62;
    }
    .alert-danger .alert-link
    {
        color: #ec0c38;
    }

    .alert-light
    {
        color: #fff;
        border-color: #bac1c8;
        background-color: #bac1c8;
    }
    .alert-light hr
    {
        border-top-color: #acb4bd;
    }
    .alert-light .alert-link
    {
        color: #919ca6;
    }

    .alert-dark
    {
        color: #fff;
        border-color: #45484b;
        background-color: #45484b;
    }
    .alert-dark hr
    {
        border-top-color: #393b3e;
    }
    .alert-dark .alert-link
    {
        color: #0a0c0d;
    }

    .alert-default
    {
        color: #fff;
        border-color: #3c4d69;
        background-color: #3c4d69;
    }
    .alert-default hr
    {
        border-top-color: #334159;
    }
    .alert-default .alert-link
    {
        color: #0b1526;
    }

    .alert-white
    {
        color: #212529;
        border-color: white;
        background-color: white;
    }
    .alert-white hr
    {
        border-top-color: #f2f2f2;
    }
    .alert-white .alert-link
    {
        color: #e6e6e6;
    }

    .alert-neutral
    {
        color: #212529;
        border-color: white;
        background-color: white;
    }
    .alert-neutral hr
    {
        border-top-color: #f2f2f2;
    }
    .alert-neutral .alert-link
    {
        color: #e6e6e6;
    }

    .alert-darker
    {
        color: #fff;
        border-color: #292929;
        background-color: #292929;
    }
    .alert-darker hr
    {
        border-top-color: #1c1c1c;
    }
    .alert-darker .alert-link
    {
        color: black;
    }

    @keyframes progress-bar-stripes
    {
        from
        {
            background-position: 1rem 0;
        }
        to
        {
            background-position: 0 0;
        }
    }

    .progress
    {
        font-size: .75rem;

        display: flex;
        overflow: hidden;

        height: 1rem;

        border-radius: .25rem;
        background-color: #e9ecef;
        box-shadow: inset 0 .1rem .1rem rgba(0, 0, 0, .1);
    }

    .progress-bar
    {
        display: flex;
        flex-direction: column;

        transition: width .6s ease;
        text-align: center;
        white-space: nowrap;

        color: #fff;
        background-color: #546FF7;

        justify-content: center;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .progress-bar
        {
            transition: none;
        }
    }

    .progress-bar-striped
    {
        background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
        background-size: 1rem 1rem;
    }

    .progress-bar-animated
    {
        animation: progress-bar-stripes 1s linear infinite;
    }

    .media
    {
        display: flex;

        align-items: flex-start;
    }

    .media-body
    {
        flex: 1 1;
    }

    .list-group
    {
        display: flex;
        flex-direction: column;

        margin-bottom: 0;
        padding-left: 0;
    }

    .list-group-item-action
    {
        width: 100%;

        text-align: inherit;

        color: #525f7f;
    }
    .list-group-item-action:hover,
    .list-group-item-action:focus
    {
        text-decoration: none;

        color: #525f7f;
        background-color: #f6f9fc;
    }
    .list-group-item-action:active
    {
        color: #525f7f;
        background-color: #e9ecef;
    }

    .list-group-item
    {
        position: relative;

        display: block;

        margin-bottom: -.0625rem;
        padding: 1rem 1rem;

        border: .0625rem solid #e9ecef;
        background-color: #fff;
    }
    .list-group-item:first-child
    {
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    .list-group-item:last-child
    {
        margin-bottom: 0;

        border-bottom-right-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }
    .list-group-item:hover,
    .list-group-item:focus
    {
        z-index: 1;

        text-decoration: none;
    }
    .list-group-item.disabled,
    .list-group-item:disabled
    {
        color: #8898aa;
        background-color: #fff;
    }
    .list-group-item.active
    {
        z-index: 2;

        color: #fff;
        border-color: #546FF7;
        background-color: #546FF7;
    }

    .list-group-flush .list-group-item
    {
        border-right: 0;
        border-left: 0;
        border-radius: 0;
    }

    .list-group-flush:first-child .list-group-item:first-child
    {
        border-top: 0;
    }

    .list-group-flush:last-child .list-group-item:last-child
    {
        border-bottom: 0;
    }

    .list-group-item-primary
    {
        color: #313b77;
        background-color: #d2d8f7;
    }
    .list-group-item-primary.list-group-item-action:hover,
    .list-group-item-primary.list-group-item-action:focus
    {
        color: #313b77;
        background-color: #bcc5f3;
    }
    .list-group-item-primary.list-group-item-action.active
    {
        color: #fff;
        border-color: #313b77;
        background-color: #313b77;
    }

    .list-group-item-secondary
    {
        color: #7f7f80;
        background-color: #fcfcfd;
    }
    .list-group-item-secondary.list-group-item-action:hover,
    .list-group-item-secondary.list-group-item-action:focus
    {
        color: #7f7f80;
        background-color: #ededf3;
    }
    .list-group-item-secondary.list-group-item-action.active
    {
        color: #fff;
        border-color: #7f7f80;
        background-color: #7f7f80;
    }

    .list-group-item-success
    {
        color: #176b47;
        background-color: #c4f1de;
    }
    .list-group-item-success.list-group-item-action:hover,
    .list-group-item-success.list-group-item-action:focus
    {
        color: #176b47;
        background-color: #afecd2;
    }
    .list-group-item-success.list-group-item-action.active
    {
        color: #fff;
        border-color: #176b47;
        background-color: #176b47;
    }

    .list-group-item-info
    {
        color: #096b7c;
        background-color: #bcf1fb;
    }
    .list-group-item-info.list-group-item-action:hover,
    .list-group-item-info.list-group-item-action:focus
    {
        color: #096b7c;
        background-color: #a4ecfa;
    }
    .list-group-item-info.list-group-item-action.active
    {
        color: #fff;
        border-color: #096b7c;
        background-color: #096b7c;
    }

    .list-group-item-warning
    {
        color: #833321;
        background-color: #fed3ca;
    }
    .list-group-item-warning.list-group-item-action:hover,
    .list-group-item-warning.list-group-item-action:focus
    {
        color: #833321;
        background-color: #febeb1;
    }
    .list-group-item-warning.list-group-item-action.active
    {
        color: #fff;
        border-color: #833321;
        background-color: #833321;
    }

    .list-group-item-danger
    {
        color: #7f1c30;
        background-color: #fcc7d1;
    }
    .list-group-item-danger.list-group-item-action:hover,
    .list-group-item-danger.list-group-item-action:focus
    {
        color: #7f1c30;
        background-color: #fbafbd;
    }
    .list-group-item-danger.list-group-item-action.active
    {
        color: #fff;
        border-color: #7f1c30;
        background-color: #7f1c30;
    }

    .list-group-item-light
    {
        color: #5a5e62;
        background-color: #e8eaed;
    }
    .list-group-item-light.list-group-item-action:hover,
    .list-group-item-light.list-group-item-action:focus
    {
        color: #5a5e62;
        background-color: #dadde2;
    }
    .list-group-item-light.list-group-item-action.active
    {
        color: #fff;
        border-color: #5a5e62;
        background-color: #5a5e62;
    }

    .list-group-item-dark
    {
        color: #111315;
        background-color: #c1c2c3;
    }
    .list-group-item-dark.list-group-item-action:hover,
    .list-group-item-dark.list-group-item-action:focus
    {
        color: #111315;
        background-color: #b4b5b6;
    }
    .list-group-item-dark.list-group-item-action.active
    {
        color: #fff;
        border-color: #111315;
        background-color: #111315;
    }

    .list-group-item-default
    {
        color: #0c1628;
        background-color: #bec4cd;
    }
    .list-group-item-default.list-group-item-action:hover,
    .list-group-item-default.list-group-item-action:focus
    {
        color: #0c1628;
        background-color: #b0b7c2;
    }
    .list-group-item-default.list-group-item-action.active
    {
        color: #fff;
        border-color: #0c1628;
        background-color: #0c1628;
    }

    .list-group-item-white
    {
        color: #858585;
        background-color: white;
    }
    .list-group-item-white.list-group-item-action:hover,
    .list-group-item-white.list-group-item-action:focus
    {
        color: #858585;
        background-color: #f2f2f2;
    }
    .list-group-item-white.list-group-item-action.active
    {
        color: #fff;
        border-color: #858585;
        background-color: #858585;
    }

    .list-group-item-neutral
    {
        color: #858585;
        background-color: white;
    }
    .list-group-item-neutral.list-group-item-action:hover,
    .list-group-item-neutral.list-group-item-action:focus
    {
        color: #858585;
        background-color: #f2f2f2;
    }
    .list-group-item-neutral.list-group-item-action.active
    {
        color: #fff;
        border-color: #858585;
        background-color: #858585;
    }

    .list-group-item-darker
    {
        color: black;
        background-color: #b8b8b8;
    }
    .list-group-item-darker.list-group-item-action:hover,
    .list-group-item-darker.list-group-item-action:focus
    {
        color: black;
        background-color: #ababab;
    }
    .list-group-item-darker.list-group-item-action.active
    {
        color: #fff;
        border-color: black;
        background-color: black;
    }

    .close
    {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1;

        float: right;

        opacity: .5;
        color: rgba(0, 0, 0, .6);
        text-shadow: none;
    }
    .close:not(:disabled):not(.disabled)
    {
        cursor: pointer;
    }
    .close:not(:disabled):not(.disabled):hover,
    .close:not(:disabled):not(.disabled):focus
    {
        text-decoration: none;

        opacity: .75;
        color: rgba(0, 0, 0, .6);
    }

    button.close
    {
        padding: 0;

        border: 0;
        background-color: transparent;

        -webkit-appearance: none;
    }

    .modal-open
    {
        overflow: hidden;
    }
    .modal-open .modal
    {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .modal
    {
        position: fixed;
        z-index: 1050;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        display: none;
        overflow: hidden;

        outline: 0;
    }

    .modal-dialog
    {
        position: relative;

        width: auto;
        margin: .5rem;

        pointer-events: none;
    }
    .modal.fade .modal-dialog
    {
        transition: transform .3s ease-out;
        transform: translate(0, -25%);
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .modal.fade .modal-dialog
        {
            transition: none;
        }
    }
    .modal.show .modal-dialog
    {
        transform: translate(0, 0);
    }

    .modal-dialog-centered
    {
        display: flex;

        min-height: calc(100% - (.5rem * 2));

        align-items: center;
    }
    .modal-dialog-centered::before
    {
        display: block;

        height: calc(100vh - (.5rem * 2));

        content: '';
    }

    .modal-content
    {
        position: relative;

        display: flex;
        flex-direction: column;

        width: 100%;

        pointer-events: auto;

        border: 1px solid rgba(0, 0, 0, .2);
        border-radius: .3rem;
        outline: 0;
        background-color: #fff;
        background-clip: padding-box;
        box-shadow: 0 15px 35px rgba(50, 50, 93, .2), 0 5px 15px rgba(0, 0, 0, .17);
    }

    .modal-backdrop
    {
        position: fixed;
        z-index: 1040;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-color: #000;
    }
    .modal-backdrop.fade
    {
        opacity: 0;
    }
    .modal-backdrop.show
    {
        opacity: .16;
    }

    .modal-header
    {
        display: flex;

        padding: 1.25rem;

        border-bottom: 1px solid #e9ecef;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;

        align-items: flex-start;
        justify-content: space-between;
    }
    .modal-header .close
    {
        margin: -1.25rem -1.25rem -1.25rem auto;
        padding: 1.25rem;
    }

    .modal-title
    {
        line-height: 1.1;

        margin-bottom: 0;
    }

    .modal-body
    {
        position: relative;

        padding: 1.5rem;

        flex: 1 1 auto;
    }

    .modal-footer
    {
        display: flex;

        padding: 1.5rem;

        border-top: 1px solid #e9ecef;

        align-items: center;
        justify-content: flex-end;
    }
    .modal-footer > :not(:first-child)
    {
        margin-left: .25rem;
    }
    .modal-footer > :not(:last-child)
    {
        margin-right: .25rem;
    }

    .modal-scrollbar-measure
    {
        position: absolute;
        top: -9999px;

        overflow: scroll;

        width: 50px;
        height: 50px;
    }

    @media (min-width: 576px)
    {
        .modal-dialog
        {
            max-width: 500px;
            margin: 1.75rem auto;
        }
        .modal-dialog-centered
        {
            min-height: calc(100% - (1.75rem * 2));
        }
        .modal-dialog-centered::before
        {
            height: calc(100vh - (1.75rem * 2));
        }
        .modal-content
        {
            box-shadow: 0 15px 35px rgba(50, 50, 93, .2), 0 5px 15px rgba(0, 0, 0, .17);
        }
        .modal-sm
        {
            max-width: 380px;
        }
    }

    @media (min-width: 992px)
    {
        .modal-lg
        {
            max-width: 800px;
        }
    }

    .tooltip
    {
        font-family: 'motiva-sans', sans-serif;
        font-size: .875rem;
        font-weight: 400;
        font-style: normal;
        line-height: 1.5;

        position: absolute;
        z-index: 1070;

        display: block;

        margin: 0;

        text-align: left;
        text-align: start;
        white-space: normal;
        text-decoration: none;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        word-wrap: break-word;
        word-break: normal;

        opacity: 0;
        text-shadow: none;

        line-break: auto;
    }
    .tooltip.show
    {
        opacity: .9;
    }
    .tooltip .arrow
    {
        position: absolute;

        display: block;

        width: .8rem;
        height: .4rem;
    }
    .tooltip .arrow::before
    {
        position: absolute;

        content: '';

        border-style: solid;
        border-color: transparent;
    }

    .bs-tooltip-top,
    .bs-tooltip-auto[x-placement^='top']
    {
        padding: .4rem 0;
    }
    .bs-tooltip-top .arrow,
    .bs-tooltip-auto[x-placement^='top'] .arrow
    {
        bottom: 0;
    }
    .bs-tooltip-top .arrow::before,
    .bs-tooltip-auto[x-placement^='top'] .arrow::before
    {
        top: 0;

        border-width: .4rem .4rem 0;
        border-top-color: #000;
    }

    .bs-tooltip-right,
    .bs-tooltip-auto[x-placement^='right']
    {
        padding: 0 .4rem;
    }
    .bs-tooltip-right .arrow,
    .bs-tooltip-auto[x-placement^='right'] .arrow
    {
        left: 0;

        width: .4rem;
        height: .8rem;
    }
    .bs-tooltip-right .arrow::before,
    .bs-tooltip-auto[x-placement^='right'] .arrow::before
    {
        right: 0;

        border-width: .4rem .4rem .4rem 0;
        border-right-color: #000;
    }

    .bs-tooltip-bottom,
    .bs-tooltip-auto[x-placement^='bottom']
    {
        padding: .4rem 0;
    }
    .bs-tooltip-bottom .arrow,
    .bs-tooltip-auto[x-placement^='bottom'] .arrow
    {
        top: 0;
    }
    .bs-tooltip-bottom .arrow::before,
    .bs-tooltip-auto[x-placement^='bottom'] .arrow::before
    {
        bottom: 0;

        border-width: 0 .4rem .4rem;
        border-bottom-color: #000;
    }

    .bs-tooltip-left,
    .bs-tooltip-auto[x-placement^='left']
    {
        padding: 0 .4rem;
    }
    .bs-tooltip-left .arrow,
    .bs-tooltip-auto[x-placement^='left'] .arrow
    {
        right: 0;

        width: .4rem;
        height: .8rem;
    }
    .bs-tooltip-left .arrow::before,
    .bs-tooltip-auto[x-placement^='left'] .arrow::before
    {
        left: 0;

        border-width: .4rem 0 .4rem .4rem;
        border-left-color: #000;
    }

    .tooltip-inner
    {
        max-width: 200px;
        padding: .25rem .5rem;

        text-align: center;

        color: #fff;
        border-radius: .25rem;
        background-color: #000;
    }

    .popover
    {
        font-family: 'motiva-sans', sans-serif;
        font-size: .875rem;
        font-weight: 400;
        font-style: normal;
        line-height: 1.5;

        position: absolute;
        z-index: 1060;
        top: 0;
        left: 0;

        display: block;

        max-width: 276px;

        text-align: left;
        text-align: start;
        white-space: normal;
        text-decoration: none;
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        word-wrap: break-word;
        word-break: normal;

        border: 1px solid rgba(0, 0, 0, .05);
        border-radius: .3rem;
        background-color: #fff;
        background-clip: padding-box;
        box-shadow: 0 .5rem 2rem 0 rgba(0, 0, 0, .2);
        text-shadow: none;

        line-break: auto;
    }
    .popover .arrow
    {
        position: absolute;

        display: block;

        width: 1.5rem;
        height: .75rem;
        margin: 0 .3rem;
    }
    .popover .arrow::before,
    .popover .arrow::after
    {
        position: absolute;

        display: block;

        content: '';

        border-style: solid;
        border-color: transparent;
    }

    .bs-popover-top,
    .bs-popover-auto[x-placement^='top']
    {
        margin-bottom: .75rem;
    }
    .bs-popover-top .arrow,
    .bs-popover-auto[x-placement^='top'] .arrow
    {
        bottom: calc((.75rem + 1px) * -1);
    }
    .bs-popover-top .arrow::before,
    .bs-popover-auto[x-placement^='top'] .arrow::before,
    .bs-popover-top .arrow::after,
    .bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-width: .75rem .75rem 0;
    }
    .bs-popover-top .arrow::before,
    .bs-popover-auto[x-placement^='top'] .arrow::before
    {
        bottom: 0;

        border-top-color: transparent;
    }

    .bs-popover-top .arrow::after,
    .bs-popover-auto[x-placement^='top'] .arrow::after
    {
        bottom: 1px;

        border-top-color: #fff;
    }

    .bs-popover-right,
    .bs-popover-auto[x-placement^='right']
    {
        margin-left: .75rem;
    }
    .bs-popover-right .arrow,
    .bs-popover-auto[x-placement^='right'] .arrow
    {
        left: calc((.75rem + 1px) * -1);

        width: .75rem;
        height: 1.5rem;
        margin: .3rem 0;
    }
    .bs-popover-right .arrow::before,
    .bs-popover-auto[x-placement^='right'] .arrow::before,
    .bs-popover-right .arrow::after,
    .bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-width: .75rem .75rem .75rem 0;
    }
    .bs-popover-right .arrow::before,
    .bs-popover-auto[x-placement^='right'] .arrow::before
    {
        left: 0;

        border-right-color: transparent;
    }

    .bs-popover-right .arrow::after,
    .bs-popover-auto[x-placement^='right'] .arrow::after
    {
        left: 1px;

        border-right-color: #fff;
    }

    .bs-popover-bottom,
    .bs-popover-auto[x-placement^='bottom']
    {
        margin-top: .75rem;
    }
    .bs-popover-bottom .arrow,
    .bs-popover-auto[x-placement^='bottom'] .arrow
    {
        top: calc((.75rem + 1px) * -1);
    }
    .bs-popover-bottom .arrow::before,
    .bs-popover-auto[x-placement^='bottom'] .arrow::before,
    .bs-popover-bottom .arrow::after,
    .bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-width: 0 .75rem .75rem .75rem;
    }
    .bs-popover-bottom .arrow::before,
    .bs-popover-auto[x-placement^='bottom'] .arrow::before
    {
        top: 0;

        border-bottom-color: transparent;
    }

    .bs-popover-bottom .arrow::after,
    .bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        top: 1px;

        border-bottom-color: #fff;
    }
    .bs-popover-bottom .popover-header::before,
    .bs-popover-auto[x-placement^='bottom'] .popover-header::before
    {
        position: absolute;
        top: 0;
        left: 50%;

        display: block;

        width: 1.5rem;
        margin-left: -.75rem;

        content: '';

        border-bottom: 1px solid #fff;
    }

    .bs-popover-left,
    .bs-popover-auto[x-placement^='left']
    {
        margin-right: .75rem;
    }
    .bs-popover-left .arrow,
    .bs-popover-auto[x-placement^='left'] .arrow
    {
        right: calc((.75rem + 1px) * -1);

        width: .75rem;
        height: 1.5rem;
        margin: .3rem 0;
    }
    .bs-popover-left .arrow::before,
    .bs-popover-auto[x-placement^='left'] .arrow::before,
    .bs-popover-left .arrow::after,
    .bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-width: .75rem 0 .75rem .75rem;
    }
    .bs-popover-left .arrow::before,
    .bs-popover-auto[x-placement^='left'] .arrow::before
    {
        right: 0;

        border-left-color: transparent;
    }

    .bs-popover-left .arrow::after,
    .bs-popover-auto[x-placement^='left'] .arrow::after
    {
        right: 1px;

        border-left-color: #fff;
    }

    .popover-header
    {
        font-size: 1rem;

        margin-bottom: 0;
        padding: .75rem .75rem;

        color: #32325d;
        border-bottom: 1px solid #f2f2f2;
        border-top-left-radius: calc(.3rem - 1px);
        border-top-right-radius: calc(.3rem - 1px);
        background-color: #fff;
    }
    .popover-header:empty
    {
        display: none;
    }

    .popover-body
    {
        padding: .75rem .75rem;

        color: #525f7f;
    }

    .carousel
    {
        position: relative;
    }

    .carousel-inner
    {
        position: relative;

        overflow: hidden;

        width: 100%;
    }

    .carousel-item
    {
        position: relative;

        display: none;

        width: 100%;

        align-items: center;
        -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
        perspective: 1000px;
    }

    .carousel-item.active,
    .carousel-item-next,
    .carousel-item-prev
    {
        display: block;

        transition: transform .6s ease;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .carousel-item.active,
        .carousel-item-next,
        .carousel-item-prev
        {
            transition: none;
        }
    }

    .carousel-item-next,
    .carousel-item-prev
    {
        position: absolute;
        top: 0;
    }

    .carousel-item-next.carousel-item-left,
    .carousel-item-prev.carousel-item-right
    {
        transform: translateX(0);
    }
    @supports (transform-style: preserve-3d)
    {
        .carousel-item-next.carousel-item-left,
        .carousel-item-prev.carousel-item-right
        {
            transform: translate3d(0, 0, 0);
        }
    }

    .carousel-item-next,
    .active.carousel-item-right
    {
        transform: translateX(100%);
    }
    @supports (transform-style: preserve-3d)
    {
        .carousel-item-next,
        .active.carousel-item-right
        {
            transform: translate3d(100%, 0, 0);
        }
    }

    .carousel-item-prev,
    .active.carousel-item-left
    {
        transform: translateX(-100%);
    }
    @supports (transform-style: preserve-3d)
    {
        .carousel-item-prev,
        .active.carousel-item-left
        {
            transform: translate3d(-100%, 0, 0);
        }
    }

    .carousel-fade .carousel-item
    {
        transition-duration: .6s;
        transition-property: opacity;

        opacity: 0;
    }

    .carousel-fade .carousel-item.active,
    .carousel-fade .carousel-item-next.carousel-item-left,
    .carousel-fade .carousel-item-prev.carousel-item-right
    {
        opacity: 1;
    }

    .carousel-fade .active.carousel-item-left,
    .carousel-fade .active.carousel-item-right
    {
        opacity: 0;
    }

    .carousel-fade .carousel-item-next,
    .carousel-fade .carousel-item-prev,
    .carousel-fade .carousel-item.active,
    .carousel-fade .active.carousel-item-left,
    .carousel-fade .active.carousel-item-prev
    {
        transform: translateX(0);
    }
    @supports (transform-style: preserve-3d)
    {
        .carousel-fade .carousel-item-next,
        .carousel-fade .carousel-item-prev,
        .carousel-fade .carousel-item.active,
        .carousel-fade .active.carousel-item-left,
        .carousel-fade .active.carousel-item-prev
        {
            transform: translate3d(0, 0, 0);
        }
    }

    .carousel-control-prev,
    .carousel-control-next
    {
        position: absolute;
        top: 0;
        bottom: 0;

        display: flex;

        width: 15%;

        text-align: center;

        opacity: .5;
        color: #fff;

        align-items: center;
        justify-content: center;
    }
    .carousel-control-prev:hover,
    .carousel-control-prev:focus,
    .carousel-control-next:hover,
    .carousel-control-next:focus
    {
        text-decoration: none;

        opacity: .9;
        color: #fff;
        outline: 0;
    }

    .carousel-control-prev
    {
        left: 0;
    }

    .carousel-control-next
    {
        right: 0;
    }

    .carousel-control-prev-icon,
    .carousel-control-next-icon
    {
        display: inline-block;

        width: 20px;
        height: 20px;

        background: transparent no-repeat center center;
        background-size: 100% 100%;
    }

    .carousel-control-prev-icon
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23fff\' viewBox=\'0 0 8 8\'%3E%3Cpath d=\'M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z\'/%3E%3C/svg%3E');
    }

    .carousel-control-next-icon
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23fff\' viewBox=\'0 0 8 8\'%3E%3Cpath d=\'M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z\'/%3E%3C/svg%3E');
    }

    .carousel-indicators
    {
        position: absolute;
        z-index: 15;
        right: 0;
        bottom: 10px;
        left: 0;

        display: flex;

        margin-right: 15%;
        margin-left: 15%;
        padding-left: 0;

        list-style: none;

        justify-content: center;
    }
    .carousel-indicators li
    {
        position: relative;

        width: 30px;
        height: 3px;
        margin-right: 3px;
        margin-left: 3px;

        cursor: pointer;
        text-indent: -999px;

        background-color: rgba(255, 255, 255, .5);

        flex: 0 1 auto;
    }
    .carousel-indicators li::before
    {
        position: absolute;
        top: -10px;
        left: 0;

        display: inline-block;

        width: 100%;
        height: 10px;

        content: '';
    }
    .carousel-indicators li::after
    {
        position: absolute;
        bottom: -10px;
        left: 0;

        display: inline-block;

        width: 100%;
        height: 10px;

        content: '';
    }
    .carousel-indicators .active
    {
        background-color: #fff;
    }

    .carousel-caption
    {
        position: absolute;
        z-index: 10;
        right: 15%;
        bottom: 20px;
        left: 15%;

        padding-top: 20px;
        padding-bottom: 20px;

        text-align: center;

        color: #fff;
    }

    .align-baseline
    {
        vertical-align: baseline !important;
    }

    .align-top
    {
        vertical-align: top !important;
    }

    .align-middle
    {
        vertical-align: middle !important;
    }

    .align-bottom
    {
        vertical-align: bottom !important;
    }

    .align-text-bottom
    {
        vertical-align: text-bottom !important;
    }

    .align-text-top
    {
        vertical-align: text-top !important;
    }

    .bg-primary
    {
        background-color: #546FF7 !important;
    }

    a.bg-primary:hover,
    a.bg-primary:focus,
    button.bg-primary:hover,
    button.bg-primary:focus
    {
        background-color: #324cdd !important;
    }

    .bg-secondary
    {
        background-color: #f4f5f7 !important;
    }

    a.bg-secondary:hover,
    a.bg-secondary:focus,
    button.bg-secondary:hover,
    button.bg-secondary:focus
    {
        background-color: #d6dae2 !important;
    }

    .bg-success
    {
        background-color: #2dce89 !important;
    }

    a.bg-success:hover,
    a.bg-success:focus,
    button.bg-success:hover,
    button.bg-success:focus
    {
        background-color: #24a46d !important;
    }

    .bg-info
    {
        background-color: #11cdef !important;
    }

    a.bg-info:hover,
    a.bg-info:focus,
    button.bg-info:hover,
    button.bg-info:focus
    {
        background-color: #0da5c0 !important;
    }

    .bg-warning
    {
        background-color: #fb6340 !important;
    }

    a.bg-warning:hover,
    a.bg-warning:focus,
    button.bg-warning:hover,
    button.bg-warning:focus
    {
        background-color: #fa3a0e !important;
    }

    .bg-danger
    {
        background-color: #f5365c !important;
    }

    a.bg-danger:hover,
    a.bg-danger:focus,
    button.bg-danger:hover,
    button.bg-danger:focus
    {
        background-color: #ec0c38 !important;
    }

    .bg-light
    {
        background-color: #adb5bd !important;
    }

    a.bg-light:hover,
    a.bg-light:focus,
    button.bg-light:hover,
    button.bg-light:focus
    {
        background-color: #919ca6 !important;
    }

    .bg-dark
    {
        background-color: #212529 !important;
    }

    a.bg-dark:hover,
    a.bg-dark:focus,
    button.bg-dark:hover,
    button.bg-dark:focus
    {
        background-color: #0a0c0d !important;
    }

    .bg-default
    {
        background-color: #172b4d !important;
    }

    a.bg-default:hover,
    a.bg-default:focus,
    button.bg-default:hover,
    button.bg-default:focus
    {
        background-color: #0b1526 !important;
    }

    .bg-white
    {
        background-color: #fff !important;
    }

    a.bg-white:hover,
    a.bg-white:focus,
    button.bg-white:hover,
    button.bg-white:focus
    {
        background-color: #e6e6e6 !important;
    }

    .bg-neutral
    {
        background-color: #fff !important;
    }

    a.bg-neutral:hover,
    a.bg-neutral:focus,
    button.bg-neutral:hover,
    button.bg-neutral:focus
    {
        background-color: #e6e6e6 !important;
    }

    .bg-darker
    {
        background-color: black !important;
    }

    a.bg-darker:hover,
    a.bg-darker:focus,
    button.bg-darker:hover,
    button.bg-darker:focus
    {
        background-color: black !important;
    }

    .bg-white
    {
        background-color: #fff !important;
    }

    .bg-transparent
    {
        background-color: transparent !important;
    }

    .border
    {
        border: .0625rem solid #e9ecef !important;
    }

    .border-top
    {
        border-top: .0625rem solid #e9ecef !important;
    }

    .border-right
    {
        border-right: .0625rem solid #e9ecef !important;
    }

    .border-bottom
    {
        border-bottom: .0625rem solid #e9ecef !important;
    }

    .border-left
    {
        border-left: .0625rem solid #e9ecef !important;
    }

    .border-0
    {
        border: 0 !important;
    }

    .border-top-0
    {
        border-top: 0 !important;
    }

    .border-right-0
    {
        border-right: 0 !important;
    }

    .border-bottom-0
    {
        border-bottom: 0 !important;
    }

    .border-left-0
    {
        border-left: 0 !important;
    }

    .border-primary
    {
        border-color: #546FF7 !important;
    }

    .border-secondary
    {
        border-color: #f4f5f7 !important;
    }

    .border-success
    {
        border-color: #2dce89 !important;
    }

    .border-info
    {
        border-color: #11cdef !important;
    }

    .border-warning
    {
        border-color: #fb6340 !important;
    }

    .border-danger
    {
        border-color: #f5365c !important;
    }

    .border-light
    {
        border-color: #adb5bd !important;
    }

    .border-dark
    {
        border-color: #212529 !important;
    }

    .border-default
    {
        border-color: #172b4d !important;
    }

    .border-white
    {
        border-color: #fff !important;
    }

    .border-neutral
    {
        border-color: #fff !important;
    }

    .border-darker
    {
        border-color: black !important;
    }

    .border-white
    {
        border-color: #fff !important;
    }

    .rounded
    {
        border-radius: .25rem !important;
    }

    .rounded-top
    {
        border-top-left-radius: .25rem !important;
        border-top-right-radius: .25rem !important;
    }

    .rounded-right
    {
        border-top-right-radius: .25rem !important;
        border-bottom-right-radius: .25rem !important;
    }

    .rounded-bottom
    {
        border-bottom-right-radius: .25rem !important;
        border-bottom-left-radius: .25rem !important;
    }

    .rounded-left
    {
        border-top-left-radius: .25rem !important;
        border-bottom-left-radius: .25rem !important;
    }

    .rounded-circle
    {
        border-radius: 50% !important;
    }

    .rounded-0
    {
        border-radius: 0 !important;
    }

    .clearfix::after
    {
        display: block;
        clear: both;

        content: '';
    }

    .d-none
    {
        display: none !important;
    }

    .d-inline
    {
        display: inline !important;
    }

    .d-inline-block
    {
        display: inline-block !important;
    }

    .d-block
    {
        display: block !important;
    }

    .d-table
    {
        display: table !important;
    }

    .d-table-row
    {
        display: table-row !important;
    }

    .d-table-cell
    {
        display: table-cell !important;
    }

    .d-flex
    {
        display: flex !important;
    }

    .d-inline-flex
    {
        display: inline-flex !important;
    }

    @media (min-width: 576px)
    {
        .d-sm-none
        {
            display: none !important;
        }
        .d-sm-inline
        {
            display: inline !important;
        }
        .d-sm-inline-block
        {
            display: inline-block !important;
        }
        .d-sm-block
        {
            display: block !important;
        }
        .d-sm-table
        {
            display: table !important;
        }
        .d-sm-table-row
        {
            display: table-row !important;
        }
        .d-sm-table-cell
        {
            display: table-cell !important;
        }
        .d-sm-flex
        {
            display: flex !important;
        }
        .d-sm-inline-flex
        {
            display: inline-flex !important;
        }
    }

    @media (min-width: 768px)
    {
        .d-md-none
        {
            display: none !important;
        }
        .d-md-inline
        {
            display: inline !important;
        }
        .d-md-inline-block
        {
            display: inline-block !important;
        }
        .d-md-block
        {
            display: block !important;
        }
        .d-md-table
        {
            display: table !important;
        }
        .d-md-table-row
        {
            display: table-row !important;
        }
        .d-md-table-cell
        {
            display: table-cell !important;
        }
        .d-md-flex
        {
            display: flex !important;
        }
        .d-md-inline-flex
        {
            display: inline-flex !important;
        }
    }

    @media (min-width: 992px)
    {
        .d-lg-none
        {
            display: none !important;
        }
        .d-lg-inline
        {
            display: inline !important;
        }
        .d-lg-inline-block
        {
            display: inline-block !important;
        }
        .d-lg-block
        {
            display: block !important;
        }
        .d-lg-table
        {
            display: table !important;
        }
        .d-lg-table-row
        {
            display: table-row !important;
        }
        .d-lg-table-cell
        {
            display: table-cell !important;
        }
        .d-lg-flex
        {
            display: flex !important;
        }
        .d-lg-inline-flex
        {
            display: inline-flex !important;
        }
    }

    @media (min-width: 1200px)
    {
        .d-xl-none
        {
            display: none !important;
        }
        .d-xl-inline
        {
            display: inline !important;
        }
        .d-xl-inline-block
        {
            display: inline-block !important;
        }
        .d-xl-block
        {
            display: block !important;
        }
        .d-xl-table
        {
            display: table !important;
        }
        .d-xl-table-row
        {
            display: table-row !important;
        }
        .d-xl-table-cell
        {
            display: table-cell !important;
        }
        .d-xl-flex
        {
            display: flex !important;
        }
        .d-xl-inline-flex
        {
            display: inline-flex !important;
        }
    }

    @media print
    {
        .d-print-none
        {
            display: none !important;
        }
        .d-print-inline
        {
            display: inline !important;
        }
        .d-print-inline-block
        {
            display: inline-block !important;
        }
        .d-print-block
        {
            display: block !important;
        }
        .d-print-table
        {
            display: table !important;
        }
        .d-print-table-row
        {
            display: table-row !important;
        }
        .d-print-table-cell
        {
            display: table-cell !important;
        }
        .d-print-flex
        {
            display: flex !important;
        }
        .d-print-inline-flex
        {
            display: inline-flex !important;
        }
    }

    .embed-responsive
    {
        position: relative;

        display: block;
        overflow: hidden;

        width: 100%;
        padding: 0;
    }
    .embed-responsive::before
    {
        display: block;

        content: '';
    }
    .embed-responsive .embed-responsive-item,
    .embed-responsive iframe,
    .embed-responsive embed,
    .embed-responsive object,
    .embed-responsive video
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 100%;

        border: 0;
    }

    .embed-responsive-21by9::before
    {
        padding-top: 42.85714%;
    }

    .embed-responsive-16by9::before
    {
        padding-top: 56.25%;
    }

    .embed-responsive-4by3::before
    {
        padding-top: 75%;
    }

    .embed-responsive-1by1::before
    {
        padding-top: 100%;
    }

    .flex-row
    {
        flex-direction: row !important;
    }

    .flex-column
    {
        flex-direction: column !important;
    }

    .flex-row-reverse
    {
        flex-direction: row-reverse !important;
    }

    .flex-column-reverse
    {
        flex-direction: column-reverse !important;
    }

    .flex-wrap
    {
        flex-wrap: wrap !important;
    }

    .flex-nowrap
    {
        flex-wrap: nowrap !important;
    }

    .flex-wrap-reverse
    {
        flex-wrap: wrap-reverse !important;
    }

    .flex-fill
    {
        flex: 1 1 auto !important;
    }

    .flex-grow-0
    {
        flex-grow: 0 !important;
    }

    .flex-grow-1
    {
        flex-grow: 1 !important;
    }

    .flex-shrink-0
    {
        flex-shrink: 0 !important;
    }

    .flex-shrink-1
    {
        flex-shrink: 1 !important;
    }

    .justify-content-start
    {
        justify-content: flex-start !important;
    }

    .justify-content-end
    {
        justify-content: flex-end !important;
    }

    .justify-content-center
    {
        justify-content: center !important;
    }

    .justify-content-between
    {
        justify-content: space-between !important;
    }

    .justify-content-around
    {
        justify-content: space-around !important;
    }

    .align-items-start
    {
        align-items: flex-start !important;
    }

    .align-items-end
    {
        align-items: flex-end !important;
    }

    .align-items-center
    {
        align-items: center !important;
    }

    .align-items-baseline
    {
        align-items: baseline !important;
    }

    .align-items-stretch
    {
        align-items: stretch !important;
    }

    .align-content-start
    {
        align-content: flex-start !important;
    }

    .align-content-end
    {
        align-content: flex-end !important;
    }

    .align-content-center
    {
        align-content: center !important;
    }

    .align-content-between
    {
        align-content: space-between !important;
    }

    .align-content-around
    {
        align-content: space-around !important;
    }

    .align-content-stretch
    {
        align-content: stretch !important;
    }

    .align-self-auto
    {
        align-self: auto !important;
    }

    .align-self-start
    {
        align-self: flex-start !important;
    }

    .align-self-end
    {
        align-self: flex-end !important;
    }

    .align-self-center
    {
        align-self: center !important;
    }

    .align-self-baseline
    {
        align-self: baseline !important;
    }

    .align-self-stretch
    {
        align-self: stretch !important;
    }

    @media (min-width: 576px)
    {
        .flex-sm-row
        {
            flex-direction: row !important;
        }
        .flex-sm-column
        {
            flex-direction: column !important;
        }
        .flex-sm-row-reverse
        {
            flex-direction: row-reverse !important;
        }
        .flex-sm-column-reverse
        {
            flex-direction: column-reverse !important;
        }
        .flex-sm-wrap
        {
            flex-wrap: wrap !important;
        }
        .flex-sm-nowrap
        {
            flex-wrap: nowrap !important;
        }
        .flex-sm-wrap-reverse
        {
            flex-wrap: wrap-reverse !important;
        }
        .flex-sm-fill
        {
            flex: 1 1 auto !important;
        }
        .flex-sm-grow-0
        {
            flex-grow: 0 !important;
        }
        .flex-sm-grow-1
        {
            flex-grow: 1 !important;
        }
        .flex-sm-shrink-0
        {
            flex-shrink: 0 !important;
        }
        .flex-sm-shrink-1
        {
            flex-shrink: 1 !important;
        }
        .justify-content-sm-start
        {
            justify-content: flex-start !important;
        }
        .justify-content-sm-end
        {
            justify-content: flex-end !important;
        }
        .justify-content-sm-center
        {
            justify-content: center !important;
        }
        .justify-content-sm-between
        {
            justify-content: space-between !important;
        }
        .justify-content-sm-around
        {
            justify-content: space-around !important;
        }
        .align-items-sm-start
        {
            align-items: flex-start !important;
        }
        .align-items-sm-end
        {
            align-items: flex-end !important;
        }
        .align-items-sm-center
        {
            align-items: center !important;
        }
        .align-items-sm-baseline
        {
            align-items: baseline !important;
        }
        .align-items-sm-stretch
        {
            align-items: stretch !important;
        }
        .align-content-sm-start
        {
            align-content: flex-start !important;
        }
        .align-content-sm-end
        {
            align-content: flex-end !important;
        }
        .align-content-sm-center
        {
            align-content: center !important;
        }
        .align-content-sm-between
        {
            align-content: space-between !important;
        }
        .align-content-sm-around
        {
            align-content: space-around !important;
        }
        .align-content-sm-stretch
        {
            align-content: stretch !important;
        }
        .align-self-sm-auto
        {
            align-self: auto !important;
        }
        .align-self-sm-start
        {
            align-self: flex-start !important;
        }
        .align-self-sm-end
        {
            align-self: flex-end !important;
        }
        .align-self-sm-center
        {
            align-self: center !important;
        }
        .align-self-sm-baseline
        {
            align-self: baseline !important;
        }
        .align-self-sm-stretch
        {
            align-self: stretch !important;
        }
    }

    @media (min-width: 768px)
    {
        .flex-md-row
        {
            flex-direction: row !important;
        }
        .flex-md-column
        {
            flex-direction: column !important;
        }
        .flex-md-row-reverse
        {
            flex-direction: row-reverse !important;
        }
        .flex-md-column-reverse
        {
            flex-direction: column-reverse !important;
        }
        .flex-md-wrap
        {
            flex-wrap: wrap !important;
        }
        .flex-md-nowrap
        {
            flex-wrap: nowrap !important;
        }
        .flex-md-wrap-reverse
        {
            flex-wrap: wrap-reverse !important;
        }
        .flex-md-fill
        {
            flex: 1 1 auto !important;
        }
        .flex-md-grow-0
        {
            flex-grow: 0 !important;
        }
        .flex-md-grow-1
        {
            flex-grow: 1 !important;
        }
        .flex-md-shrink-0
        {
            flex-shrink: 0 !important;
        }
        .flex-md-shrink-1
        {
            flex-shrink: 1 !important;
        }
        .justify-content-md-start
        {
            justify-content: flex-start !important;
        }
        .justify-content-md-end
        {
            justify-content: flex-end !important;
        }
        .justify-content-md-center
        {
            justify-content: center !important;
        }
        .justify-content-md-between
        {
            justify-content: space-between !important;
        }
        .justify-content-md-around
        {
            justify-content: space-around !important;
        }
        .align-items-md-start
        {
            align-items: flex-start !important;
        }
        .align-items-md-end
        {
            align-items: flex-end !important;
        }
        .align-items-md-center
        {
            align-items: center !important;
        }
        .align-items-md-baseline
        {
            align-items: baseline !important;
        }
        .align-items-md-stretch
        {
            align-items: stretch !important;
        }
        .align-content-md-start
        {
            align-content: flex-start !important;
        }
        .align-content-md-end
        {
            align-content: flex-end !important;
        }
        .align-content-md-center
        {
            align-content: center !important;
        }
        .align-content-md-between
        {
            align-content: space-between !important;
        }
        .align-content-md-around
        {
            align-content: space-around !important;
        }
        .align-content-md-stretch
        {
            align-content: stretch !important;
        }
        .align-self-md-auto
        {
            align-self: auto !important;
        }
        .align-self-md-start
        {
            align-self: flex-start !important;
        }
        .align-self-md-end
        {
            align-self: flex-end !important;
        }
        .align-self-md-center
        {
            align-self: center !important;
        }
        .align-self-md-baseline
        {
            align-self: baseline !important;
        }
        .align-self-md-stretch
        {
            align-self: stretch !important;
        }
    }

    @media (min-width: 992px)
    {
        .flex-lg-row
        {
            flex-direction: row !important;
        }
        .flex-lg-column
        {
            flex-direction: column !important;
        }
        .flex-lg-row-reverse
        {
            flex-direction: row-reverse !important;
        }
        .flex-lg-column-reverse
        {
            flex-direction: column-reverse !important;
        }
        .flex-lg-wrap
        {
            flex-wrap: wrap !important;
        }
        .flex-lg-nowrap
        {
            flex-wrap: nowrap !important;
        }
        .flex-lg-wrap-reverse
        {
            flex-wrap: wrap-reverse !important;
        }
        .flex-lg-fill
        {
            flex: 1 1 auto !important;
        }
        .flex-lg-grow-0
        {
            flex-grow: 0 !important;
        }
        .flex-lg-grow-1
        {
            flex-grow: 1 !important;
        }
        .flex-lg-shrink-0
        {
            flex-shrink: 0 !important;
        }
        .flex-lg-shrink-1
        {
            flex-shrink: 1 !important;
        }
        .justify-content-lg-start
        {
            justify-content: flex-start !important;
        }
        .justify-content-lg-end
        {
            justify-content: flex-end !important;
        }
        .justify-content-lg-center
        {
            justify-content: center !important;
        }
        .justify-content-lg-between
        {
            justify-content: space-between !important;
        }
        .justify-content-lg-around
        {
            justify-content: space-around !important;
        }
        .align-items-lg-start
        {
            align-items: flex-start !important;
        }
        .align-items-lg-end
        {
            align-items: flex-end !important;
        }
        .align-items-lg-center
        {
            align-items: center !important;
        }
        .align-items-lg-baseline
        {
            align-items: baseline !important;
        }
        .align-items-lg-stretch
        {
            align-items: stretch !important;
        }
        .align-content-lg-start
        {
            align-content: flex-start !important;
        }
        .align-content-lg-end
        {
            align-content: flex-end !important;
        }
        .align-content-lg-center
        {
            align-content: center !important;
        }
        .align-content-lg-between
        {
            align-content: space-between !important;
        }
        .align-content-lg-around
        {
            align-content: space-around !important;
        }
        .align-content-lg-stretch
        {
            align-content: stretch !important;
        }
        .align-self-lg-auto
        {
            align-self: auto !important;
        }
        .align-self-lg-start
        {
            align-self: flex-start !important;
        }
        .align-self-lg-end
        {
            align-self: flex-end !important;
        }
        .align-self-lg-center
        {
            align-self: center !important;
        }
        .align-self-lg-baseline
        {
            align-self: baseline !important;
        }
        .align-self-lg-stretch
        {
            align-self: stretch !important;
        }
    }

    @media (min-width: 1200px)
    {
        .flex-xl-row
        {
            flex-direction: row !important;
        }
        .flex-xl-column
        {
            flex-direction: column !important;
        }
        .flex-xl-row-reverse
        {
            flex-direction: row-reverse !important;
        }
        .flex-xl-column-reverse
        {
            flex-direction: column-reverse !important;
        }
        .flex-xl-wrap
        {
            flex-wrap: wrap !important;
        }
        .flex-xl-nowrap
        {
            flex-wrap: nowrap !important;
        }
        .flex-xl-wrap-reverse
        {
            flex-wrap: wrap-reverse !important;
        }
        .flex-xl-fill
        {
            flex: 1 1 auto !important;
        }
        .flex-xl-grow-0
        {
            flex-grow: 0 !important;
        }
        .flex-xl-grow-1
        {
            flex-grow: 1 !important;
        }
        .flex-xl-shrink-0
        {
            flex-shrink: 0 !important;
        }
        .flex-xl-shrink-1
        {
            flex-shrink: 1 !important;
        }
        .justify-content-xl-start
        {
            justify-content: flex-start !important;
        }
        .justify-content-xl-end
        {
            justify-content: flex-end !important;
        }
        .justify-content-xl-center
        {
            justify-content: center !important;
        }
        .justify-content-xl-between
        {
            justify-content: space-between !important;
        }
        .justify-content-xl-around
        {
            justify-content: space-around !important;
        }
        .align-items-xl-start
        {
            align-items: flex-start !important;
        }
        .align-items-xl-end
        {
            align-items: flex-end !important;
        }
        .align-items-xl-center
        {
            align-items: center !important;
        }
        .align-items-xl-baseline
        {
            align-items: baseline !important;
        }
        .align-items-xl-stretch
        {
            align-items: stretch !important;
        }
        .align-content-xl-start
        {
            align-content: flex-start !important;
        }
        .align-content-xl-end
        {
            align-content: flex-end !important;
        }
        .align-content-xl-center
        {
            align-content: center !important;
        }
        .align-content-xl-between
        {
            align-content: space-between !important;
        }
        .align-content-xl-around
        {
            align-content: space-around !important;
        }
        .align-content-xl-stretch
        {
            align-content: stretch !important;
        }
        .align-self-xl-auto
        {
            align-self: auto !important;
        }
        .align-self-xl-start
        {
            align-self: flex-start !important;
        }
        .align-self-xl-end
        {
            align-self: flex-end !important;
        }
        .align-self-xl-center
        {
            align-self: center !important;
        }
        .align-self-xl-baseline
        {
            align-self: baseline !important;
        }
        .align-self-xl-stretch
        {
            align-self: stretch !important;
        }
    }

    .float-left
    {
        float: left !important;
    }

    .float-right
    {
        float: right !important;
    }

    .float-none
    {
        float: none !important;
    }

    @media (min-width: 576px)
    {
        .float-sm-left
        {
            float: left !important;
        }
        .float-sm-right
        {
            float: right !important;
        }
        .float-sm-none
        {
            float: none !important;
        }
    }

    @media (min-width: 768px)
    {
        .float-md-left
        {
            float: left !important;
        }
        .float-md-right
        {
            float: right !important;
        }
        .float-md-none
        {
            float: none !important;
        }
    }

    @media (min-width: 992px)
    {
        .float-lg-left
        {
            float: left !important;
        }
        .float-lg-right
        {
            float: right !important;
        }
        .float-lg-none
        {
            float: none !important;
        }
    }

    @media (min-width: 1200px)
    {
        .float-xl-left
        {
            float: left !important;
        }
        .float-xl-right
        {
            float: right !important;
        }
        .float-xl-none
        {
            float: none !important;
        }
    }

    .position-static
    {
        position: static !important;
    }

    .position-relative
    {
        position: relative !important;
    }

    .position-absolute
    {
        position: absolute !important;
    }

    .position-fixed,
    .headroom--pinned,
    .headroom--unpinned
    {
        position: fixed !important;
    }

    .position-sticky
    {
        position: -webkit-sticky !important;
        position:         sticky !important;
    }

    .fixed-top
    {
        position: fixed;
        z-index: 1030;
        top: 0;
        right: 0;
        left: 0;
    }

    .fixed-bottom
    {
        position: fixed;
        z-index: 1030;
        right: 0;
        bottom: 0;
        left: 0;
    }

    @supports ((position: -webkit-sticky) or (position: sticky))
    {
        .sticky-top
        {
            position: -webkit-sticky;
            position:         sticky;
            z-index: 1020;
            top: 0;
        }
    }

    .sr-only
    {
        position: absolute;

        overflow: hidden;
        clip: rect(0, 0, 0, 0);

        width: 1px;
        height: 1px;
        padding: 0;

        white-space: nowrap;

        border: 0;
    }

    .sr-only-focusable:active,
    .sr-only-focusable:focus
    {
        position: static;

        overflow: visible;
        clip: auto;

        width: auto;
        height: auto;

        white-space: normal;
    }

    .shadow-sm
    {
        box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
    }

    .shadow,
    .profile-page .card-profile .card-profile-image img
    {
        box-shadow: 0 15px 35px rgba(50, 50, 93, .1), 0 5px 15px rgba(0, 0, 0, .07) !important;
    }

    .shadow-lg
    {
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, .175) !important;
    }

    .shadow-none
    {
        box-shadow: none !important;
    }

    .w-25
    {
        width: 25% !important;
    }

    .w-50
    {
        width: 50% !important;
    }

    .w-75
    {
        width: 75% !important;
    }

    .w-100
    {
        width: 100% !important;
    }

    .w-auto
    {
        width: auto !important;
    }

    .h-25
    {
        height: 25% !important;
    }

    .h-50
    {
        height: 50% !important;
    }

    .h-75
    {
        height: 75% !important;
    }

    .h-100
    {
        height: 100% !important;
    }

    .h-auto
    {
        height: auto !important;
    }

    .mw-100
    {
        max-width: 100% !important;
    }

    .mh-100
    {
        max-height: 100% !important;
    }

    .m-0
    {
        margin: 0 !important;
    }

    .mt-0,
    .my-0
    {
        margin-top: 0 !important;
    }

    .mr-0,
    .mx-0
    {
        margin-right: 0 !important;
    }

    .mb-0,
    .my-0
    {
        margin-bottom: 0 !important;
    }

    .ml-0,
    .mx-0
    {
        margin-left: 0 !important;
    }

    .m-1
    {
        margin: .25rem !important;
    }

    .mt-1,
    .my-1
    {
        margin-top: .25rem !important;
    }

    .mr-1,
    .mx-1
    {
        margin-right: .25rem !important;
    }

    .mb-1,
    .my-1
    {
        margin-bottom: .25rem !important;
    }

    .ml-1,
    .mx-1
    {
        margin-left: .25rem !important;
    }

    .m-2
    {
        margin: .5rem !important;
    }

    .mt-2,
    .my-2
    {
        margin-top: .5rem !important;
    }

    .mr-2,
    .mx-2
    {
        margin-right: .5rem !important;
    }

    .mb-2,
    .my-2
    {
        margin-bottom: .5rem !important;
    }

    .ml-2,
    .mx-2
    {
        margin-left: .5rem !important;
    }

    .m-3
    {
        margin: 1rem !important;
    }

    .mt-3,
    .my-3
    {
        margin-top: 1rem !important;
    }

    .mr-3,
    .mx-3
    {
        margin-right: 1rem !important;
    }

    .mb-3,
    .my-3
    {
        margin-bottom: 1rem !important;
    }

    .ml-3,
    .mx-3
    {
        margin-left: 1rem !important;
    }

    .m-4
    {
        margin: 1.5rem !important;
    }

    .mt-4,
    .my-4
    {
        margin-top: 1.5rem !important;
    }

    .mr-4,
    .mx-4
    {
        margin-right: 1.5rem !important;
    }

    .mb-4,
    .my-4
    {
        margin-bottom: 1.5rem !important;
    }

    .ml-4,
    .mx-4
    {
        margin-left: 1.5rem !important;
    }

    .m-5
    {
        margin: 3rem !important;
    }

    .mt-5,
    .my-5
    {
        margin-top: 3rem !important;
    }

    .mr-5,
    .mx-5
    {
        margin-right: 3rem !important;
    }

    .mb-5,
    .my-5
    {
        margin-bottom: 3rem !important;
    }

    .ml-5,
    .mx-5
    {
        margin-left: 3rem !important;
    }

    .m-sm
    {
        margin: 2rem !important;
    }

    .mt-sm,
    .my-sm
    {
        margin-top: 2rem !important;
    }

    .mr-sm,
    .mx-sm
    {
        margin-right: 2rem !important;
    }

    .mb-sm,
    .my-sm
    {
        margin-bottom: 2rem !important;
    }

    .ml-sm,
    .mx-sm
    {
        margin-left: 2rem !important;
    }

    .m-md
    {
        margin: 4rem !important;
    }

    .mt-md,
    .my-md
    {
        margin-top: 4rem !important;
    }

    .mr-md,
    .mx-md
    {
        margin-right: 4rem !important;
    }

    .mb-md,
    .my-md
    {
        margin-bottom: 4rem !important;
    }

    .ml-md,
    .mx-md
    {
        margin-left: 4rem !important;
    }

    .m-lg
    {
        margin: 6rem !important;
    }

    .mt-lg,
    .my-lg
    {
        margin-top: 6rem !important;
    }

    .mr-lg,
    .mx-lg
    {
        margin-right: 6rem !important;
    }

    .mb-lg,
    .my-lg
    {
        margin-bottom: 6rem !important;
    }

    .ml-lg,
    .mx-lg
    {
        margin-left: 6rem !important;
    }

    .m-xl
    {
        margin: 8rem !important;
    }

    .mt-xl,
    .my-xl
    {
        margin-top: 8rem !important;
    }

    .mr-xl,
    .mx-xl
    {
        margin-right: 8rem !important;
    }

    .mb-xl,
    .my-xl
    {
        margin-bottom: 8rem !important;
    }

    .ml-xl,
    .mx-xl
    {
        margin-left: 8rem !important;
    }

    .p-0
    {
        padding: 0 !important;
    }

    .pt-0,
    .py-0
    {
        padding-top: 0 !important;
    }

    .pr-0,
    .px-0
    {
        padding-right: 0 !important;
    }

    .pb-0,
    .py-0
    {
        padding-bottom: 0 !important;
    }

    .pl-0,
    .px-0
    {
        padding-left: 0 !important;
    }

    .p-1
    {
        padding: .25rem !important;
    }

    .pt-1,
    .py-1
    {
        padding-top: .25rem !important;
    }

    .pr-1,
    .px-1
    {
        padding-right: .25rem !important;
    }

    .pb-1,
    .py-1
    {
        padding-bottom: .25rem !important;
    }

    .pl-1,
    .px-1
    {
        padding-left: .25rem !important;
    }

    .p-2
    {
        padding: .5rem !important;
    }

    .pt-2,
    .py-2
    {
        padding-top: .5rem !important;
    }

    .pr-2,
    .px-2
    {
        padding-right: .5rem !important;
    }

    .pb-2,
    .py-2
    {
        padding-bottom: .5rem !important;
    }

    .pl-2,
    .px-2
    {
        padding-left: .5rem !important;
    }

    .p-3
    {
        padding: 1rem !important;
    }

    .pt-3,
    .py-3
    {
        padding-top: 1rem !important;
    }

    .pr-3,
    .px-3
    {
        padding-right: 1rem !important;
    }

    .pb-3,
    .py-3
    {
        padding-bottom: 1rem !important;
    }

    .pl-3,
    .px-3
    {
        padding-left: 1rem !important;
    }

    .p-4
    {
        padding: 1.5rem !important;
    }

    .pt-4,
    .py-4
    {
        padding-top: 1.5rem !important;
    }

    .pr-4,
    .px-4
    {
        padding-right: 1.5rem !important;
    }

    .pb-4,
    .py-4
    {
        padding-bottom: 1.5rem !important;
    }

    .pl-4,
    .px-4
    {
        padding-left: 1.5rem !important;
    }

    .p-5
    {
        padding: 3rem !important;
    }

    .pt-5,
    .py-5
    {
        padding-top: 3rem !important;
    }

    .pr-5,
    .px-5
    {
        padding-right: 3rem !important;
    }

    .pb-5,
    .py-5
    {
        padding-bottom: 3rem !important;
    }

    .pl-5,
    .px-5
    {
        padding-left: 3rem !important;
    }

    .p-sm
    {
        padding: 2rem !important;
    }

    .pt-sm,
    .py-sm
    {
        padding-top: 2rem !important;
    }

    .pr-sm,
    .px-sm
    {
        padding-right: 2rem !important;
    }

    .pb-sm,
    .py-sm
    {
        padding-bottom: 2rem !important;
    }

    .pl-sm,
    .px-sm
    {
        padding-left: 2rem !important;
    }

    .p-md
    {
        padding: 4rem !important;
    }

    .pt-md,
    .py-md
    {
        padding-top: 4rem !important;
    }

    .pr-md,
    .px-md
    {
        padding-right: 4rem !important;
    }

    .pb-md,
    .py-md
    {
        padding-bottom: 4rem !important;
    }

    .pl-md,
    .px-md
    {
        padding-left: 4rem !important;
    }

    .p-lg
    {
        padding: 6rem !important;
    }

    .pt-lg,
    .py-lg
    {
        padding-top: 6rem !important;
    }

    .pr-lg,
    .px-lg
    {
        padding-right: 6rem !important;
    }

    .pb-lg,
    .py-lg
    {
        padding-bottom: 6rem !important;
    }

    .pl-lg,
    .px-lg
    {
        padding-left: 6rem !important;
    }

    .p-xl
    {
        padding: 8rem !important;
    }

    .pt-xl,
    .py-xl
    {
        padding-top: 8rem !important;
    }

    .pr-xl,
    .px-xl
    {
        padding-right: 8rem !important;
    }

    .pb-xl,
    .py-xl
    {
        padding-bottom: 8rem !important;
    }

    .pl-xl,
    .px-xl
    {
        padding-left: 8rem !important;
    }

    .m-auto
    {
        margin: auto !important;
    }

    .mt-auto,
    .my-auto
    {
        margin-top: auto !important;
    }

    .mr-auto,
    .mx-auto
    {
        margin-right: auto !important;
    }

    .mb-auto,
    .my-auto
    {
        margin-bottom: auto !important;
    }

    .ml-auto,
    .mx-auto
    {
        margin-left: auto !important;
    }

    @media (min-width: 576px)
    {
        .m-sm-0
        {
            margin: 0 !important;
        }
        .mt-sm-0,
        .my-sm-0
        {
            margin-top: 0 !important;
        }
        .mr-sm-0,
        .mx-sm-0
        {
            margin-right: 0 !important;
        }
        .mb-sm-0,
        .my-sm-0
        {
            margin-bottom: 0 !important;
        }
        .ml-sm-0,
        .mx-sm-0
        {
            margin-left: 0 !important;
        }
        .m-sm-1
        {
            margin: .25rem !important;
        }
        .mt-sm-1,
        .my-sm-1
        {
            margin-top: .25rem !important;
        }
        .mr-sm-1,
        .mx-sm-1
        {
            margin-right: .25rem !important;
        }
        .mb-sm-1,
        .my-sm-1
        {
            margin-bottom: .25rem !important;
        }
        .ml-sm-1,
        .mx-sm-1
        {
            margin-left: .25rem !important;
        }
        .m-sm-2
        {
            margin: .5rem !important;
        }
        .mt-sm-2,
        .my-sm-2
        {
            margin-top: .5rem !important;
        }
        .mr-sm-2,
        .mx-sm-2
        {
            margin-right: .5rem !important;
        }
        .mb-sm-2,
        .my-sm-2
        {
            margin-bottom: .5rem !important;
        }
        .ml-sm-2,
        .mx-sm-2
        {
            margin-left: .5rem !important;
        }
        .m-sm-3
        {
            margin: 1rem !important;
        }
        .mt-sm-3,
        .my-sm-3
        {
            margin-top: 1rem !important;
        }
        .mr-sm-3,
        .mx-sm-3
        {
            margin-right: 1rem !important;
        }
        .mb-sm-3,
        .my-sm-3
        {
            margin-bottom: 1rem !important;
        }
        .ml-sm-3,
        .mx-sm-3
        {
            margin-left: 1rem !important;
        }
        .m-sm-4
        {
            margin: 1.5rem !important;
        }
        .mt-sm-4,
        .my-sm-4
        {
            margin-top: 1.5rem !important;
        }
        .mr-sm-4,
        .mx-sm-4
        {
            margin-right: 1.5rem !important;
        }
        .mb-sm-4,
        .my-sm-4
        {
            margin-bottom: 1.5rem !important;
        }
        .ml-sm-4,
        .mx-sm-4
        {
            margin-left: 1.5rem !important;
        }
        .m-sm-5
        {
            margin: 3rem !important;
        }
        .mt-sm-5,
        .my-sm-5
        {
            margin-top: 3rem !important;
        }
        .mr-sm-5,
        .mx-sm-5
        {
            margin-right: 3rem !important;
        }
        .mb-sm-5,
        .my-sm-5
        {
            margin-bottom: 3rem !important;
        }
        .ml-sm-5,
        .mx-sm-5
        {
            margin-left: 3rem !important;
        }
        .m-sm-sm
        {
            margin: 2rem !important;
        }
        .mt-sm-sm,
        .my-sm-sm
        {
            margin-top: 2rem !important;
        }
        .mr-sm-sm,
        .mx-sm-sm
        {
            margin-right: 2rem !important;
        }
        .mb-sm-sm,
        .my-sm-sm
        {
            margin-bottom: 2rem !important;
        }
        .ml-sm-sm,
        .mx-sm-sm
        {
            margin-left: 2rem !important;
        }
        .m-sm-md
        {
            margin: 4rem !important;
        }
        .mt-sm-md,
        .my-sm-md
        {
            margin-top: 4rem !important;
        }
        .mr-sm-md,
        .mx-sm-md
        {
            margin-right: 4rem !important;
        }
        .mb-sm-md,
        .my-sm-md
        {
            margin-bottom: 4rem !important;
        }
        .ml-sm-md,
        .mx-sm-md
        {
            margin-left: 4rem !important;
        }
        .m-sm-lg
        {
            margin: 6rem !important;
        }
        .mt-sm-lg,
        .my-sm-lg
        {
            margin-top: 6rem !important;
        }
        .mr-sm-lg,
        .mx-sm-lg
        {
            margin-right: 6rem !important;
        }
        .mb-sm-lg,
        .my-sm-lg
        {
            margin-bottom: 6rem !important;
        }
        .ml-sm-lg,
        .mx-sm-lg
        {
            margin-left: 6rem !important;
        }
        .m-sm-xl
        {
            margin: 8rem !important;
        }
        .mt-sm-xl,
        .my-sm-xl
        {
            margin-top: 8rem !important;
        }
        .mr-sm-xl,
        .mx-sm-xl
        {
            margin-right: 8rem !important;
        }
        .mb-sm-xl,
        .my-sm-xl
        {
            margin-bottom: 8rem !important;
        }
        .ml-sm-xl,
        .mx-sm-xl
        {
            margin-left: 8rem !important;
        }
        .p-sm-0
        {
            padding: 0 !important;
        }
        .pt-sm-0,
        .py-sm-0
        {
            padding-top: 0 !important;
        }
        .pr-sm-0,
        .px-sm-0
        {
            padding-right: 0 !important;
        }
        .pb-sm-0,
        .py-sm-0
        {
            padding-bottom: 0 !important;
        }
        .pl-sm-0,
        .px-sm-0
        {
            padding-left: 0 !important;
        }
        .p-sm-1
        {
            padding: .25rem !important;
        }
        .pt-sm-1,
        .py-sm-1
        {
            padding-top: .25rem !important;
        }
        .pr-sm-1,
        .px-sm-1
        {
            padding-right: .25rem !important;
        }
        .pb-sm-1,
        .py-sm-1
        {
            padding-bottom: .25rem !important;
        }
        .pl-sm-1,
        .px-sm-1
        {
            padding-left: .25rem !important;
        }
        .p-sm-2
        {
            padding: .5rem !important;
        }
        .pt-sm-2,
        .py-sm-2
        {
            padding-top: .5rem !important;
        }
        .pr-sm-2,
        .px-sm-2
        {
            padding-right: .5rem !important;
        }
        .pb-sm-2,
        .py-sm-2
        {
            padding-bottom: .5rem !important;
        }
        .pl-sm-2,
        .px-sm-2
        {
            padding-left: .5rem !important;
        }
        .p-sm-3
        {
            padding: 1rem !important;
        }
        .pt-sm-3,
        .py-sm-3
        {
            padding-top: 1rem !important;
        }
        .pr-sm-3,
        .px-sm-3
        {
            padding-right: 1rem !important;
        }
        .pb-sm-3,
        .py-sm-3
        {
            padding-bottom: 1rem !important;
        }
        .pl-sm-3,
        .px-sm-3
        {
            padding-left: 1rem !important;
        }
        .p-sm-4
        {
            padding: 1.5rem !important;
        }
        .pt-sm-4,
        .py-sm-4
        {
            padding-top: 1.5rem !important;
        }
        .pr-sm-4,
        .px-sm-4
        {
            padding-right: 1.5rem !important;
        }
        .pb-sm-4,
        .py-sm-4
        {
            padding-bottom: 1.5rem !important;
        }
        .pl-sm-4,
        .px-sm-4
        {
            padding-left: 1.5rem !important;
        }
        .p-sm-5
        {
            padding: 3rem !important;
        }
        .pt-sm-5,
        .py-sm-5
        {
            padding-top: 3rem !important;
        }
        .pr-sm-5,
        .px-sm-5
        {
            padding-right: 3rem !important;
        }
        .pb-sm-5,
        .py-sm-5
        {
            padding-bottom: 3rem !important;
        }
        .pl-sm-5,
        .px-sm-5
        {
            padding-left: 3rem !important;
        }
        .p-sm-sm
        {
            padding: 2rem !important;
        }
        .pt-sm-sm,
        .py-sm-sm
        {
            padding-top: 2rem !important;
        }
        .pr-sm-sm,
        .px-sm-sm
        {
            padding-right: 2rem !important;
        }
        .pb-sm-sm,
        .py-sm-sm
        {
            padding-bottom: 2rem !important;
        }
        .pl-sm-sm,
        .px-sm-sm
        {
            padding-left: 2rem !important;
        }
        .p-sm-md
        {
            padding: 4rem !important;
        }
        .pt-sm-md,
        .py-sm-md
        {
            padding-top: 4rem !important;
        }
        .pr-sm-md,
        .px-sm-md
        {
            padding-right: 4rem !important;
        }
        .pb-sm-md,
        .py-sm-md
        {
            padding-bottom: 4rem !important;
        }
        .pl-sm-md,
        .px-sm-md
        {
            padding-left: 4rem !important;
        }
        .p-sm-lg
        {
            padding: 6rem !important;
        }
        .pt-sm-lg,
        .py-sm-lg
        {
            padding-top: 6rem !important;
        }
        .pr-sm-lg,
        .px-sm-lg
        {
            padding-right: 6rem !important;
        }
        .pb-sm-lg,
        .py-sm-lg
        {
            padding-bottom: 6rem !important;
        }
        .pl-sm-lg,
        .px-sm-lg
        {
            padding-left: 6rem !important;
        }
        .p-sm-xl
        {
            padding: 8rem !important;
        }
        .pt-sm-xl,
        .py-sm-xl
        {
            padding-top: 8rem !important;
        }
        .pr-sm-xl,
        .px-sm-xl
        {
            padding-right: 8rem !important;
        }
        .pb-sm-xl,
        .py-sm-xl
        {
            padding-bottom: 8rem !important;
        }
        .pl-sm-xl,
        .px-sm-xl
        {
            padding-left: 8rem !important;
        }
        .m-sm-auto
        {
            margin: auto !important;
        }
        .mt-sm-auto,
        .my-sm-auto
        {
            margin-top: auto !important;
        }
        .mr-sm-auto,
        .mx-sm-auto
        {
            margin-right: auto !important;
        }
        .mb-sm-auto,
        .my-sm-auto
        {
            margin-bottom: auto !important;
        }
        .ml-sm-auto,
        .mx-sm-auto
        {
            margin-left: auto !important;
        }
    }

    @media (min-width: 768px)
    {
        .m-md-0
        {
            margin: 0 !important;
        }
        .mt-md-0,
        .my-md-0
        {
            margin-top: 0 !important;
        }
        .mr-md-0,
        .mx-md-0
        {
            margin-right: 0 !important;
        }
        .mb-md-0,
        .my-md-0
        {
            margin-bottom: 0 !important;
        }
        .ml-md-0,
        .mx-md-0
        {
            margin-left: 0 !important;
        }
        .m-md-1
        {
            margin: .25rem !important;
        }
        .mt-md-1,
        .my-md-1
        {
            margin-top: .25rem !important;
        }
        .mr-md-1,
        .mx-md-1
        {
            margin-right: .25rem !important;
        }
        .mb-md-1,
        .my-md-1
        {
            margin-bottom: .25rem !important;
        }
        .ml-md-1,
        .mx-md-1
        {
            margin-left: .25rem !important;
        }
        .m-md-2
        {
            margin: .5rem !important;
        }
        .mt-md-2,
        .my-md-2
        {
            margin-top: .5rem !important;
        }
        .mr-md-2,
        .mx-md-2
        {
            margin-right: .5rem !important;
        }
        .mb-md-2,
        .my-md-2
        {
            margin-bottom: .5rem !important;
        }
        .ml-md-2,
        .mx-md-2
        {
            margin-left: .5rem !important;
        }
        .m-md-3
        {
            margin: 1rem !important;
        }
        .mt-md-3,
        .my-md-3
        {
            margin-top: 1rem !important;
        }
        .mr-md-3,
        .mx-md-3
        {
            margin-right: 1rem !important;
        }
        .mb-md-3,
        .my-md-3
        {
            margin-bottom: 1rem !important;
        }
        .ml-md-3,
        .mx-md-3
        {
            margin-left: 1rem !important;
        }
        .m-md-4
        {
            margin: 1.5rem !important;
        }
        .mt-md-4,
        .my-md-4
        {
            margin-top: 1.5rem !important;
        }
        .mr-md-4,
        .mx-md-4
        {
            margin-right: 1.5rem !important;
        }
        .mb-md-4,
        .my-md-4
        {
            margin-bottom: 1.5rem !important;
        }
        .ml-md-4,
        .mx-md-4
        {
            margin-left: 1.5rem !important;
        }
        .m-md-5
        {
            margin: 3rem !important;
        }
        .mt-md-5,
        .my-md-5
        {
            margin-top: 3rem !important;
        }
        .mr-md-5,
        .mx-md-5
        {
            margin-right: 3rem !important;
        }
        .mb-md-5,
        .my-md-5
        {
            margin-bottom: 3rem !important;
        }
        .ml-md-5,
        .mx-md-5
        {
            margin-left: 3rem !important;
        }
        .m-md-sm
        {
            margin: 2rem !important;
        }
        .mt-md-sm,
        .my-md-sm
        {
            margin-top: 2rem !important;
        }
        .mr-md-sm,
        .mx-md-sm
        {
            margin-right: 2rem !important;
        }
        .mb-md-sm,
        .my-md-sm
        {
            margin-bottom: 2rem !important;
        }
        .ml-md-sm,
        .mx-md-sm
        {
            margin-left: 2rem !important;
        }
        .m-md-md
        {
            margin: 4rem !important;
        }
        .mt-md-md,
        .my-md-md
        {
            margin-top: 4rem !important;
        }
        .mr-md-md,
        .mx-md-md
        {
            margin-right: 4rem !important;
        }
        .mb-md-md,
        .my-md-md
        {
            margin-bottom: 4rem !important;
        }
        .ml-md-md,
        .mx-md-md
        {
            margin-left: 4rem !important;
        }
        .m-md-lg
        {
            margin: 6rem !important;
        }
        .mt-md-lg,
        .my-md-lg
        {
            margin-top: 6rem !important;
        }
        .mr-md-lg,
        .mx-md-lg
        {
            margin-right: 6rem !important;
        }
        .mb-md-lg,
        .my-md-lg
        {
            margin-bottom: 6rem !important;
        }
        .ml-md-lg,
        .mx-md-lg
        {
            margin-left: 6rem !important;
        }
        .m-md-xl
        {
            margin: 8rem !important;
        }
        .mt-md-xl,
        .my-md-xl
        {
            margin-top: 8rem !important;
        }
        .mr-md-xl,
        .mx-md-xl
        {
            margin-right: 8rem !important;
        }
        .mb-md-xl,
        .my-md-xl
        {
            margin-bottom: 8rem !important;
        }
        .ml-md-xl,
        .mx-md-xl
        {
            margin-left: 8rem !important;
        }
        .p-md-0
        {
            padding: 0 !important;
        }
        .pt-md-0,
        .py-md-0
        {
            padding-top: 0 !important;
        }
        .pr-md-0,
        .px-md-0
        {
            padding-right: 0 !important;
        }
        .pb-md-0,
        .py-md-0
        {
            padding-bottom: 0 !important;
        }
        .pl-md-0,
        .px-md-0
        {
            padding-left: 0 !important;
        }
        .p-md-1
        {
            padding: .25rem !important;
        }
        .pt-md-1,
        .py-md-1
        {
            padding-top: .25rem !important;
        }
        .pr-md-1,
        .px-md-1
        {
            padding-right: .25rem !important;
        }
        .pb-md-1,
        .py-md-1
        {
            padding-bottom: .25rem !important;
        }
        .pl-md-1,
        .px-md-1
        {
            padding-left: .25rem !important;
        }
        .p-md-2
        {
            padding: .5rem !important;
        }
        .pt-md-2,
        .py-md-2
        {
            padding-top: .5rem !important;
        }
        .pr-md-2,
        .px-md-2
        {
            padding-right: .5rem !important;
        }
        .pb-md-2,
        .py-md-2
        {
            padding-bottom: .5rem !important;
        }
        .pl-md-2,
        .px-md-2
        {
            padding-left: .5rem !important;
        }
        .p-md-3
        {
            padding: 1rem !important;
        }
        .pt-md-3,
        .py-md-3
        {
            padding-top: 1rem !important;
        }
        .pr-md-3,
        .px-md-3
        {
            padding-right: 1rem !important;
        }
        .pb-md-3,
        .py-md-3
        {
            padding-bottom: 1rem !important;
        }
        .pl-md-3,
        .px-md-3
        {
            padding-left: 1rem !important;
        }
        .p-md-4
        {
            padding: 1.5rem !important;
        }
        .pt-md-4,
        .py-md-4
        {
            padding-top: 1.5rem !important;
        }
        .pr-md-4,
        .px-md-4
        {
            padding-right: 1.5rem !important;
        }
        .pb-md-4,
        .py-md-4
        {
            padding-bottom: 1.5rem !important;
        }
        .pl-md-4,
        .px-md-4
        {
            padding-left: 1.5rem !important;
        }
        .p-md-5
        {
            padding: 3rem !important;
        }
        .pt-md-5,
        .py-md-5
        {
            padding-top: 3rem !important;
        }
        .pr-md-5,
        .px-md-5
        {
            padding-right: 3rem !important;
        }
        .pb-md-5,
        .py-md-5
        {
            padding-bottom: 3rem !important;
        }
        .pl-md-5,
        .px-md-5
        {
            padding-left: 3rem !important;
        }
        .p-md-sm
        {
            padding: 2rem !important;
        }
        .pt-md-sm,
        .py-md-sm
        {
            padding-top: 2rem !important;
        }
        .pr-md-sm,
        .px-md-sm
        {
            padding-right: 2rem !important;
        }
        .pb-md-sm,
        .py-md-sm
        {
            padding-bottom: 2rem !important;
        }
        .pl-md-sm,
        .px-md-sm
        {
            padding-left: 2rem !important;
        }
        .p-md-md
        {
            padding: 4rem !important;
        }
        .pt-md-md,
        .py-md-md
        {
            padding-top: 4rem !important;
        }
        .pr-md-md,
        .px-md-md
        {
            padding-right: 4rem !important;
        }
        .pb-md-md,
        .py-md-md
        {
            padding-bottom: 4rem !important;
        }
        .pl-md-md,
        .px-md-md
        {
            padding-left: 4rem !important;
        }
        .p-md-lg
        {
            padding: 6rem !important;
        }
        .pt-md-lg,
        .py-md-lg
        {
            padding-top: 6rem !important;
        }
        .pr-md-lg,
        .px-md-lg
        {
            padding-right: 6rem !important;
        }
        .pb-md-lg,
        .py-md-lg
        {
            padding-bottom: 6rem !important;
        }
        .pl-md-lg,
        .px-md-lg
        {
            padding-left: 6rem !important;
        }
        .p-md-xl
        {
            padding: 8rem !important;
        }
        .pt-md-xl,
        .py-md-xl
        {
            padding-top: 8rem !important;
        }
        .pr-md-xl,
        .px-md-xl
        {
            padding-right: 8rem !important;
        }
        .pb-md-xl,
        .py-md-xl
        {
            padding-bottom: 8rem !important;
        }
        .pl-md-xl,
        .px-md-xl
        {
            padding-left: 8rem !important;
        }
        .m-md-auto
        {
            margin: auto !important;
        }
        .mt-md-auto,
        .my-md-auto
        {
            margin-top: auto !important;
        }
        .mr-md-auto,
        .mx-md-auto
        {
            margin-right: auto !important;
        }
        .mb-md-auto,
        .my-md-auto
        {
            margin-bottom: auto !important;
        }
        .ml-md-auto,
        .mx-md-auto
        {
            margin-left: auto !important;
        }
    }

    @media (min-width: 992px)
    {
        .m-lg-0
        {
            margin: 0 !important;
        }
        .mt-lg-0,
        .my-lg-0
        {
            margin-top: 0 !important;
        }
        .mr-lg-0,
        .mx-lg-0
        {
            margin-right: 0 !important;
        }
        .mb-lg-0,
        .my-lg-0
        {
            margin-bottom: 0 !important;
        }
        .ml-lg-0,
        .mx-lg-0
        {
            margin-left: 0 !important;
        }
        .m-lg-1
        {
            margin: .25rem !important;
        }
        .mt-lg-1,
        .my-lg-1
        {
            margin-top: .25rem !important;
        }
        .mr-lg-1,
        .mx-lg-1
        {
            margin-right: .25rem !important;
        }
        .mb-lg-1,
        .my-lg-1
        {
            margin-bottom: .25rem !important;
        }
        .ml-lg-1,
        .mx-lg-1
        {
            margin-left: .25rem !important;
        }
        .m-lg-2
        {
            margin: .5rem !important;
        }
        .mt-lg-2,
        .my-lg-2
        {
            margin-top: .5rem !important;
        }
        .mr-lg-2,
        .mx-lg-2
        {
            margin-right: .5rem !important;
        }
        .mb-lg-2,
        .my-lg-2
        {
            margin-bottom: .5rem !important;
        }
        .ml-lg-2,
        .mx-lg-2
        {
            margin-left: .5rem !important;
        }
        .m-lg-3
        {
            margin: 1rem !important;
        }
        .mt-lg-3,
        .my-lg-3
        {
            margin-top: 1rem !important;
        }
        .mr-lg-3,
        .mx-lg-3
        {
            margin-right: 1rem !important;
        }
        .mb-lg-3,
        .my-lg-3
        {
            margin-bottom: 1rem !important;
        }
        .ml-lg-3,
        .mx-lg-3
        {
            margin-left: 1rem !important;
        }
        .m-lg-4
        {
            margin: 1.5rem !important;
        }
        .mt-lg-4,
        .my-lg-4
        {
            margin-top: 1.5rem !important;
        }
        .mr-lg-4,
        .mx-lg-4
        {
            margin-right: 1.5rem !important;
        }
        .mb-lg-4,
        .my-lg-4
        {
            margin-bottom: 1.5rem !important;
        }
        .ml-lg-4,
        .mx-lg-4
        {
            margin-left: 1.5rem !important;
        }
        .m-lg-5
        {
            margin: 3rem !important;
        }
        .mt-lg-5,
        .my-lg-5
        {
            margin-top: 3rem !important;
        }
        .mr-lg-5,
        .mx-lg-5
        {
            margin-right: 3rem !important;
        }
        .mb-lg-5,
        .my-lg-5
        {
            margin-bottom: 3rem !important;
        }
        .ml-lg-5,
        .mx-lg-5
        {
            margin-left: 3rem !important;
        }
        .m-lg-sm
        {
            margin: 2rem !important;
        }
        .mt-lg-sm,
        .my-lg-sm
        {
            margin-top: 2rem !important;
        }
        .mr-lg-sm,
        .mx-lg-sm
        {
            margin-right: 2rem !important;
        }
        .mb-lg-sm,
        .my-lg-sm
        {
            margin-bottom: 2rem !important;
        }
        .ml-lg-sm,
        .mx-lg-sm
        {
            margin-left: 2rem !important;
        }
        .m-lg-md
        {
            margin: 4rem !important;
        }
        .mt-lg-md,
        .my-lg-md
        {
            margin-top: 4rem !important;
        }
        .mr-lg-md,
        .mx-lg-md
        {
            margin-right: 4rem !important;
        }
        .mb-lg-md,
        .my-lg-md
        {
            margin-bottom: 4rem !important;
        }
        .ml-lg-md,
        .mx-lg-md
        {
            margin-left: 4rem !important;
        }
        .m-lg-lg
        {
            margin: 6rem !important;
        }
        .mt-lg-lg,
        .my-lg-lg
        {
            margin-top: 6rem !important;
        }
        .mr-lg-lg,
        .mx-lg-lg
        {
            margin-right: 6rem !important;
        }
        .mb-lg-lg,
        .my-lg-lg
        {
            margin-bottom: 6rem !important;
        }
        .ml-lg-lg,
        .mx-lg-lg
        {
            margin-left: 6rem !important;
        }
        .m-lg-xl
        {
            margin: 8rem !important;
        }
        .mt-lg-xl,
        .my-lg-xl
        {
            margin-top: 8rem !important;
        }
        .mr-lg-xl,
        .mx-lg-xl
        {
            margin-right: 8rem !important;
        }
        .mb-lg-xl,
        .my-lg-xl
        {
            margin-bottom: 8rem !important;
        }
        .ml-lg-xl,
        .mx-lg-xl
        {
            margin-left: 8rem !important;
        }
        .p-lg-0
        {
            padding: 0 !important;
        }
        .pt-lg-0,
        .py-lg-0
        {
            padding-top: 0 !important;
        }
        .pr-lg-0,
        .px-lg-0
        {
            padding-right: 0 !important;
        }
        .pb-lg-0,
        .py-lg-0
        {
            padding-bottom: 0 !important;
        }
        .pl-lg-0,
        .px-lg-0
        {
            padding-left: 0 !important;
        }
        .p-lg-1
        {
            padding: .25rem !important;
        }
        .pt-lg-1,
        .py-lg-1
        {
            padding-top: .25rem !important;
        }
        .pr-lg-1,
        .px-lg-1
        {
            padding-right: .25rem !important;
        }
        .pb-lg-1,
        .py-lg-1
        {
            padding-bottom: .25rem !important;
        }
        .pl-lg-1,
        .px-lg-1
        {
            padding-left: .25rem !important;
        }
        .p-lg-2
        {
            padding: .5rem !important;
        }
        .pt-lg-2,
        .py-lg-2
        {
            padding-top: .5rem !important;
        }
        .pr-lg-2,
        .px-lg-2
        {
            padding-right: .5rem !important;
        }
        .pb-lg-2,
        .py-lg-2
        {
            padding-bottom: .5rem !important;
        }
        .pl-lg-2,
        .px-lg-2
        {
            padding-left: .5rem !important;
        }
        .p-lg-3
        {
            padding: 1rem !important;
        }
        .pt-lg-3,
        .py-lg-3
        {
            padding-top: 1rem !important;
        }
        .pr-lg-3,
        .px-lg-3
        {
            padding-right: 1rem !important;
        }
        .pb-lg-3,
        .py-lg-3
        {
            padding-bottom: 1rem !important;
        }
        .pl-lg-3,
        .px-lg-3
        {
            padding-left: 1rem !important;
        }
        .p-lg-4
        {
            padding: 1.5rem !important;
        }
        .pt-lg-4,
        .py-lg-4
        {
            padding-top: 1.5rem !important;
        }
        .pr-lg-4,
        .px-lg-4
        {
            padding-right: 1.5rem !important;
        }
        .pb-lg-4,
        .py-lg-4
        {
            padding-bottom: 1.5rem !important;
        }
        .pl-lg-4,
        .px-lg-4
        {
            padding-left: 1.5rem !important;
        }
        .p-lg-5
        {
            padding: 3rem !important;
        }
        .pt-lg-5,
        .py-lg-5
        {
            padding-top: 3rem !important;
        }
        .pr-lg-5,
        .px-lg-5
        {
            padding-right: 3rem !important;
        }
        .pb-lg-5,
        .py-lg-5
        {
            padding-bottom: 3rem !important;
        }
        .pl-lg-5,
        .px-lg-5
        {
            padding-left: 3rem !important;
        }
        .p-lg-sm
        {
            padding: 2rem !important;
        }
        .pt-lg-sm,
        .py-lg-sm
        {
            padding-top: 2rem !important;
        }
        .pr-lg-sm,
        .px-lg-sm
        {
            padding-right: 2rem !important;
        }
        .pb-lg-sm,
        .py-lg-sm
        {
            padding-bottom: 2rem !important;
        }
        .pl-lg-sm,
        .px-lg-sm
        {
            padding-left: 2rem !important;
        }
        .p-lg-md
        {
            padding: 4rem !important;
        }
        .pt-lg-md,
        .py-lg-md
        {
            padding-top: 4rem !important;
        }
        .pr-lg-md,
        .px-lg-md
        {
            padding-right: 4rem !important;
        }
        .pb-lg-md,
        .py-lg-md
        {
            padding-bottom: 4rem !important;
        }
        .pl-lg-md,
        .px-lg-md
        {
            padding-left: 4rem !important;
        }
        .p-lg-lg
        {
            padding: 6rem !important;
        }
        .pt-lg-lg,
        .py-lg-lg
        {
            padding-top: 6rem !important;
        }
        .pr-lg-lg,
        .px-lg-lg
        {
            padding-right: 6rem !important;
        }
        .pb-lg-lg,
        .py-lg-lg
        {
            padding-bottom: 6rem !important;
        }
        .pl-lg-lg,
        .px-lg-lg
        {
            padding-left: 6rem !important;
        }
        .p-lg-xl
        {
            padding: 8rem !important;
        }
        .pt-lg-xl,
        .py-lg-xl
        {
            padding-top: 8rem !important;
        }
        .pr-lg-xl,
        .px-lg-xl
        {
            padding-right: 8rem !important;
        }
        .pb-lg-xl,
        .py-lg-xl
        {
            padding-bottom: 8rem !important;
        }
        .pl-lg-xl,
        .px-lg-xl
        {
            padding-left: 8rem !important;
        }
        .m-lg-auto
        {
            margin: auto !important;
        }
        .mt-lg-auto,
        .my-lg-auto
        {
            margin-top: auto !important;
        }
        .mr-lg-auto,
        .mx-lg-auto
        {
            margin-right: auto !important;
        }
        .mb-lg-auto,
        .my-lg-auto
        {
            margin-bottom: auto !important;
        }
        .ml-lg-auto,
        .mx-lg-auto
        {
            margin-left: auto !important;
        }
    }

    @media (min-width: 1200px)
    {
        .m-xl-0
        {
            margin: 0 !important;
        }
        .mt-xl-0,
        .my-xl-0
        {
            margin-top: 0 !important;
        }
        .mr-xl-0,
        .mx-xl-0
        {
            margin-right: 0 !important;
        }
        .mb-xl-0,
        .my-xl-0
        {
            margin-bottom: 0 !important;
        }
        .ml-xl-0,
        .mx-xl-0
        {
            margin-left: 0 !important;
        }
        .m-xl-1
        {
            margin: .25rem !important;
        }
        .mt-xl-1,
        .my-xl-1
        {
            margin-top: .25rem !important;
        }
        .mr-xl-1,
        .mx-xl-1
        {
            margin-right: .25rem !important;
        }
        .mb-xl-1,
        .my-xl-1
        {
            margin-bottom: .25rem !important;
        }
        .ml-xl-1,
        .mx-xl-1
        {
            margin-left: .25rem !important;
        }
        .m-xl-2
        {
            margin: .5rem !important;
        }
        .mt-xl-2,
        .my-xl-2
        {
            margin-top: .5rem !important;
        }
        .mr-xl-2,
        .mx-xl-2
        {
            margin-right: .5rem !important;
        }
        .mb-xl-2,
        .my-xl-2
        {
            margin-bottom: .5rem !important;
        }
        .ml-xl-2,
        .mx-xl-2
        {
            margin-left: .5rem !important;
        }
        .m-xl-3
        {
            margin: 1rem !important;
        }
        .mt-xl-3,
        .my-xl-3
        {
            margin-top: 1rem !important;
        }
        .mr-xl-3,
        .mx-xl-3
        {
            margin-right: 1rem !important;
        }
        .mb-xl-3,
        .my-xl-3
        {
            margin-bottom: 1rem !important;
        }
        .ml-xl-3,
        .mx-xl-3
        {
            margin-left: 1rem !important;
        }
        .m-xl-4
        {
            margin: 1.5rem !important;
        }
        .mt-xl-4,
        .my-xl-4
        {
            margin-top: 1.5rem !important;
        }
        .mr-xl-4,
        .mx-xl-4
        {
            margin-right: 1.5rem !important;
        }
        .mb-xl-4,
        .my-xl-4
        {
            margin-bottom: 1.5rem !important;
        }
        .ml-xl-4,
        .mx-xl-4
        {
            margin-left: 1.5rem !important;
        }
        .m-xl-5
        {
            margin: 3rem !important;
        }
        .mt-xl-5,
        .my-xl-5
        {
            margin-top: 3rem !important;
        }
        .mr-xl-5,
        .mx-xl-5
        {
            margin-right: 3rem !important;
        }
        .mb-xl-5,
        .my-xl-5
        {
            margin-bottom: 3rem !important;
        }
        .ml-xl-5,
        .mx-xl-5
        {
            margin-left: 3rem !important;
        }
        .m-xl-sm
        {
            margin: 2rem !important;
        }
        .mt-xl-sm,
        .my-xl-sm
        {
            margin-top: 2rem !important;
        }
        .mr-xl-sm,
        .mx-xl-sm
        {
            margin-right: 2rem !important;
        }
        .mb-xl-sm,
        .my-xl-sm
        {
            margin-bottom: 2rem !important;
        }
        .ml-xl-sm,
        .mx-xl-sm
        {
            margin-left: 2rem !important;
        }
        .m-xl-md
        {
            margin: 4rem !important;
        }
        .mt-xl-md,
        .my-xl-md
        {
            margin-top: 4rem !important;
        }
        .mr-xl-md,
        .mx-xl-md
        {
            margin-right: 4rem !important;
        }
        .mb-xl-md,
        .my-xl-md
        {
            margin-bottom: 4rem !important;
        }
        .ml-xl-md,
        .mx-xl-md
        {
            margin-left: 4rem !important;
        }
        .m-xl-lg
        {
            margin: 6rem !important;
        }
        .mt-xl-lg,
        .my-xl-lg
        {
            margin-top: 6rem !important;
        }
        .mr-xl-lg,
        .mx-xl-lg
        {
            margin-right: 6rem !important;
        }
        .mb-xl-lg,
        .my-xl-lg
        {
            margin-bottom: 6rem !important;
        }
        .ml-xl-lg,
        .mx-xl-lg
        {
            margin-left: 6rem !important;
        }
        .m-xl-xl
        {
            margin: 8rem !important;
        }
        .mt-xl-xl,
        .my-xl-xl
        {
            margin-top: 8rem !important;
        }
        .mr-xl-xl,
        .mx-xl-xl
        {
            margin-right: 8rem !important;
        }
        .mb-xl-xl,
        .my-xl-xl
        {
            margin-bottom: 8rem !important;
        }
        .ml-xl-xl,
        .mx-xl-xl
        {
            margin-left: 8rem !important;
        }
        .p-xl-0
        {
            padding: 0 !important;
        }
        .pt-xl-0,
        .py-xl-0
        {
            padding-top: 0 !important;
        }
        .pr-xl-0,
        .px-xl-0
        {
            padding-right: 0 !important;
        }
        .pb-xl-0,
        .py-xl-0
        {
            padding-bottom: 0 !important;
        }
        .pl-xl-0,
        .px-xl-0
        {
            padding-left: 0 !important;
        }
        .p-xl-1
        {
            padding: .25rem !important;
        }
        .pt-xl-1,
        .py-xl-1
        {
            padding-top: .25rem !important;
        }
        .pr-xl-1,
        .px-xl-1
        {
            padding-right: .25rem !important;
        }
        .pb-xl-1,
        .py-xl-1
        {
            padding-bottom: .25rem !important;
        }
        .pl-xl-1,
        .px-xl-1
        {
            padding-left: .25rem !important;
        }
        .p-xl-2
        {
            padding: .5rem !important;
        }
        .pt-xl-2,
        .py-xl-2
        {
            padding-top: .5rem !important;
        }
        .pr-xl-2,
        .px-xl-2
        {
            padding-right: .5rem !important;
        }
        .pb-xl-2,
        .py-xl-2
        {
            padding-bottom: .5rem !important;
        }
        .pl-xl-2,
        .px-xl-2
        {
            padding-left: .5rem !important;
        }
        .p-xl-3
        {
            padding: 1rem !important;
        }
        .pt-xl-3,
        .py-xl-3
        {
            padding-top: 1rem !important;
        }
        .pr-xl-3,
        .px-xl-3
        {
            padding-right: 1rem !important;
        }
        .pb-xl-3,
        .py-xl-3
        {
            padding-bottom: 1rem !important;
        }
        .pl-xl-3,
        .px-xl-3
        {
            padding-left: 1rem !important;
        }
        .p-xl-4
        {
            padding: 1.5rem !important;
        }
        .pt-xl-4,
        .py-xl-4
        {
            padding-top: 1.5rem !important;
        }
        .pr-xl-4,
        .px-xl-4
        {
            padding-right: 1.5rem !important;
        }
        .pb-xl-4,
        .py-xl-4
        {
            padding-bottom: 1.5rem !important;
        }
        .pl-xl-4,
        .px-xl-4
        {
            padding-left: 1.5rem !important;
        }
        .p-xl-5
        {
            padding: 3rem !important;
        }
        .pt-xl-5,
        .py-xl-5
        {
            padding-top: 3rem !important;
        }
        .pr-xl-5,
        .px-xl-5
        {
            padding-right: 3rem !important;
        }
        .pb-xl-5,
        .py-xl-5
        {
            padding-bottom: 3rem !important;
        }
        .pl-xl-5,
        .px-xl-5
        {
            padding-left: 3rem !important;
        }
        .p-xl-sm
        {
            padding: 2rem !important;
        }
        .pt-xl-sm,
        .py-xl-sm
        {
            padding-top: 2rem !important;
        }
        .pr-xl-sm,
        .px-xl-sm
        {
            padding-right: 2rem !important;
        }
        .pb-xl-sm,
        .py-xl-sm
        {
            padding-bottom: 2rem !important;
        }
        .pl-xl-sm,
        .px-xl-sm
        {
            padding-left: 2rem !important;
        }
        .p-xl-md
        {
            padding: 4rem !important;
        }
        .pt-xl-md,
        .py-xl-md
        {
            padding-top: 4rem !important;
        }
        .pr-xl-md,
        .px-xl-md
        {
            padding-right: 4rem !important;
        }
        .pb-xl-md,
        .py-xl-md
        {
            padding-bottom: 4rem !important;
        }
        .pl-xl-md,
        .px-xl-md
        {
            padding-left: 4rem !important;
        }
        .p-xl-lg
        {
            padding: 6rem !important;
        }
        .pt-xl-lg,
        .py-xl-lg
        {
            padding-top: 6rem !important;
        }
        .pr-xl-lg,
        .px-xl-lg
        {
            padding-right: 6rem !important;
        }
        .pb-xl-lg,
        .py-xl-lg
        {
            padding-bottom: 6rem !important;
        }
        .pl-xl-lg,
        .px-xl-lg
        {
            padding-left: 6rem !important;
        }
        .p-xl-xl
        {
            padding: 8rem !important;
        }
        .pt-xl-xl,
        .py-xl-xl
        {
            padding-top: 8rem !important;
        }
        .pr-xl-xl,
        .px-xl-xl
        {
            padding-right: 8rem !important;
        }
        .pb-xl-xl,
        .py-xl-xl
        {
            padding-bottom: 8rem !important;
        }
        .pl-xl-xl,
        .px-xl-xl
        {
            padding-left: 8rem !important;
        }
        .m-xl-auto
        {
            margin: auto !important;
        }
        .mt-xl-auto,
        .my-xl-auto
        {
            margin-top: auto !important;
        }
        .mr-xl-auto,
        .mx-xl-auto
        {
            margin-right: auto !important;
        }
        .mb-xl-auto,
        .my-xl-auto
        {
            margin-bottom: auto !important;
        }
        .ml-xl-auto,
        .mx-xl-auto
        {
            margin-left: auto !important;
        }
    }

    .text-monospace
    {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    }

    .text-justify
    {
        text-align: justify !important;
    }

    .text-nowrap
    {
        white-space: nowrap !important;
    }

    .text-truncate
    {
        overflow: hidden;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .text-left
    {
        text-align: left !important;
    }

    .text-right
    {
        text-align: right !important;
    }

    .text-center
    {
        text-align: center !important;
    }

    @media (min-width: 576px)
    {
        .text-sm-left
        {
            text-align: left !important;
        }
        .text-sm-right
        {
            text-align: right !important;
        }
        .text-sm-center
        {
            text-align: center !important;
        }
    }

    @media (min-width: 768px)
    {
        .text-md-left
        {
            text-align: left !important;
        }
        .text-md-right
        {
            text-align: right !important;
        }
        .text-md-center
        {
            text-align: center !important;
        }
    }

    @media (min-width: 992px)
    {
        .text-lg-left
        {
            text-align: left !important;
        }
        .text-lg-right
        {
            text-align: right !important;
        }
        .text-lg-center
        {
            text-align: center !important;
        }
    }

    @media (min-width: 1200px)
    {
        .text-xl-left
        {
            text-align: left !important;
        }
        .text-xl-right
        {
            text-align: right !important;
        }
        .text-xl-center
        {
            text-align: center !important;
        }
    }

    .text-lowercase
    {
        text-transform: lowercase !important;
    }

    .text-uppercase
    {
        text-transform: uppercase !important;
    }

    .text-capitalize
    {
        text-transform: capitalize !important;
    }

    .font-weight-light
    {
        font-weight: 300 !important;
    }

    .font-weight-normal
    {
        font-weight: 400 !important;
    }

    .font-weight-bold
    {
        font-weight: 600 !important;
    }

    .font-italic
    {
        font-style: italic !important;
    }

    .text-white
    {
        color: #fff !important;
    }

    .text-primary
    {
        color: #546FF7 !important;
    }

    a.text-primary:hover,
    a.text-primary:focus
    {
        color: #324cdd !important;
    }

    .text-secondary
    {
        color: #f4f5f7 !important;
    }

    a.text-secondary:hover,
    a.text-secondary:focus
    {
        color: #d6dae2 !important;
    }

    .text-success
    {
        color: #2dce89 !important;
    }

    a.text-success:hover,
    a.text-success:focus
    {
        color: #24a46d !important;
    }

    .text-info
    {
        color: #11cdef !important;
    }

    a.text-info:hover,
    a.text-info:focus
    {
        color: #0da5c0 !important;
    }

    .text-warning
    {
        color: #fb6340 !important;
    }

    a.text-warning:hover,
    a.text-warning:focus
    {
        color: #fa3a0e !important;
    }

    .text-danger
    {
        color: #f5365c !important;
    }

    a.text-danger:hover,
    a.text-danger:focus
    {
        color: #ec0c38 !important;
    }

    .text-light
    {
        color: #adb5bd !important;
    }

    a.text-light:hover,
    a.text-light:focus
    {
        color: #919ca6 !important;
    }

    .text-dark
    {
        color: #212529 !important;
    }

    a.text-dark:hover,
    a.text-dark:focus
    {
        color: #0a0c0d !important;
    }

    .text-default
    {
        color: #172b4d !important;
    }

    a.text-default:hover,
    a.text-default:focus
    {
        color: #0b1526 !important;
    }

    .text-white
    {
        color: #fff !important;
    }

    a.text-white:hover,
    a.text-white:focus
    {
        color: #e6e6e6 !important;
    }

    .text-neutral
    {
        color: #fff !important;
    }

    a.text-neutral:hover,
    a.text-neutral:focus
    {
        color: #e6e6e6 !important;
    }

    .text-darker
    {
        color: black !important;
    }

    a.text-darker:hover,
    a.text-darker:focus
    {
        color: black !important;
    }

    .text-body
    {
        color: #525f7f !important;
    }

    .text-muted
    {
        color: #8898aa !important;
    }

    .text-black-50
    {
        color: rgba(0, 0, 0, .5) !important;
    }

    .text-white-50
    {
        color: rgba(255, 255, 255, .5) !important;
    }

    .text-hide
    {
        font: 0/0 a;

        color: transparent;
        border: 0;
        background-color: transparent;
        text-shadow: none;
    }

    .visible
    {
        visibility: visible !important;
    }

    .invisible
    {
        visibility: hidden !important;
    }

    @media print
    {
        *,
        *::before,
        *::after
        {
            box-shadow: none !important;
            text-shadow: none !important;
        }
        a:not(.btn)
        {
            text-decoration: underline;
        }
        abbr[title]::after
        {
            content: ' (' attr(title) ')';
        }
        pre
        {
            white-space: pre-wrap !important;
        }
        pre,
        blockquote
        {
            border: .0625rem solid #adb5bd;

            page-break-inside: avoid;
        }
        thead
        {
            display: table-header-group;
        }
        tr,
        img
        {
            page-break-inside: avoid;
        }
        p,
        h2,
        h3
        {
            orphans: 3;
            widows: 3;
        }
        h2,
        h3
        {
            page-break-after: avoid;
        }
        @page
        {
            size: a3;
        }
        body
        {
            min-width: 992px !important;
        }
        .container
        {
            min-width: 992px !important;
        }
        .navbar
        {
            display: none;
        }
        .badge
        {
            border: .0625rem solid #000;
        }
        .table
        {
            border-collapse: collapse !important;
        }
        .table td,
        .table th
        {
            background-color: #fff !important;
        }
        .table-bordered th,
        .table-bordered td
        {
            border: 1px solid #dee2e6 !important;
        }
        .table-dark
        {
            color: inherit;
        }
        .table-dark th,
        .table-dark td,
        .table-dark thead th,
        .table-dark tbody + tbody
        {
            border-color: #dee2e6;
        }
        .table .thead-dark th
        {
            color: inherit;
            border-color: #dee2e6;
        }
    }

    iframe
    {
        border: 0;
    }

    figcaption,
    figure,
    main
    {
        display: block;
    }

    main
    {
        overflow: hidden;
    }

    .section-nucleo-icons .icons-container
    {
        position: relative;
        z-index: 1;

        max-width: 100%;
        height: 360px;
        margin: 0 auto;
    }

    .section-nucleo-icons
    {
        --icon-size: 5rem;
        --icon-sm-size: 3.75rem;
        --gutter: 7rem;
    }
    .section-nucleo-icons .icons-container i
    {
        position: absolute;
        z-index: 1;

        display: inline-flex;

        transition: all .2s cubic-bezier(.25, .65, .9, .75);
        transform: translate(-50%, -50%);

        border-radius: 50%;
        background: #fff;
        box-shadow: 0 15px 35px rgba(50, 50, 93, .1), 0 5px 15px rgba(0, 0, 0, .07);

        align-items: center;
        justify-content: center;
    }
    .section-nucleo-icons .icons-container i.icon
    {
        font-size: 1.7em;

        width: var(--icon-size);
        height: var(--icon-size);
    }
    .section-nucleo-icons .icons-container i.icon-sm
    {
        font-size: 1.5em;

        width: var(--icon-sm-size);
        height: var(--icon-sm-size);
    }
    .section-nucleo-icons .icons-container i:nth-child(1)
    {
        font-size: 42px;

        z-index: 2;

        color: #fb6340;
    }
    .section-nucleo-icons .icons-container:not(.on-screen) i
    {
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
    }
    .section-nucleo-icons .icons-container:not(.on-screen) i:not(:nth-child(1))
    {
        opacity: 0;
    }
    .section-nucleo-icons .icons-container.on-screen i
    {
        opacity: 1;
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(1)
    {
        font-size: 42px;
        width: 100px;
        height: 100px;
        top: 50%;
        left: 50%;

        color: #fb6340;
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(2)
    {
        width: 80px;
        height: 80px;
        top: 50%;
        left: calc(50% + (var(--gutter) * 1.7));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(3)
    {
         width: 80px;
        height: 80px;
        top: calc(50% + var(--gutter));
        left: calc(50% + var(--gutter));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(4)
    {
         width: 70px;
        height: 70px;
        top: calc(50% - var(--gutter));
        left: calc(50% + var(--gutter));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(5)
    {
        top: 50%;
        left: calc(-75% + (var(--gutter) * 4));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(6)
    {
        top: calc(40% + (var(--gutter) * 1.5));
        left: calc(-28% + (var(--gutter) * 2.7));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(7)
    {
        width: 90px;
        height: 90px;
        top: calc(50% - (var(--gutter) * 1.5));
        left: calc(50% + (var(--gutter) * 2.7));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(8)
    {
       width: 70px;
        height: 70px;
        top: 50%;
        left: calc(50% - (var(--gutter) * 1.7));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(9)
    {
        top: calc(50% + var(--gutter));
        left: calc(50% - var(--gutter));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(10)
    {
        width: 50px;
        height: 50px;
        top: calc(50% - var(--gutter));
        left: calc(50% - var(--gutter));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(11)
    {
        top: 50%;
        left: calc(209% - (var(--gutter) * 4));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(12)
    {
        top: calc(50% + (var(--gutter) * 1.5));
        left: calc(50% - (var(--gutter) * 2.7));
    }
    .section-nucleo-icons .icons-container.on-screen i:nth-child(13)
    {
         width: 50px;
        height: 50px;
        top: calc(50% - (var(--gutter) * 1.5));
        left: calc(50% - (var(--gutter) * 2.7));
    }
    .section-nucleo-icons .icons-container.on-screen i{
        overflow: hidden;
    }
    .section-nucleo-icons .icons-container.on-screen i img{
        min-width: 110%;
        min-height: 110%;
    }

    .blur--hover
    {
        position: relative;
    }
    .blur--hover .blur-item
    {
        transition: 1s cubic-bezier(.19, 1, .22, 1);

        opacity: 1;

        will-change: transform;
        -webkit-filter: blur(0);
                filter: blur(0);
    }
    .blur--hover .blur-hidden
    {
        position: absolute;
        z-index: 100;
        top: calc(50% + 7px);
        left: 50%;

        transition: all .15s ease;
        transform: translate(-50%, -50%);

        opacity: 0;
    }
    .blur--hover:hover .blur-item
    {
        z-index: 1;

        transform: scale(.95);

        opacity: .8;

        -webkit-filter: blur(10px);
                filter: blur(10px);
    }
    .blur--hover:hover .blur-hidden
    {
        top: 50%;

        opacity: 1;
    }

    .bg-blue
    {
        background-color: #546FF7 !important;
    }

    a.bg-blue:hover,
    a.bg-blue:focus,
    button.bg-blue:hover,
    button.bg-blue:focus
    {
        background-color: #324cdd !important;
    }

    .bg-indigo
    {
        background-color: #5603ad !important;
    }

    a.bg-indigo:hover,
    a.bg-indigo:focus,
    button.bg-indigo:hover,
    button.bg-indigo:focus
    {
        background-color: #3d027b !important;
    }

    .bg-purple
    {
        background-color: #8965e0 !important;
    }

    a.bg-purple:hover,
    a.bg-purple:focus,
    button.bg-purple:hover,
    button.bg-purple:focus
    {
        background-color: #683bd7 !important;
    }

    .bg-pink
    {
        background-color: #f3a4b5 !important;
    }

    a.bg-pink:hover,
    a.bg-pink:focus,
    button.bg-pink:hover,
    button.bg-pink:focus
    {
        background-color: #ed7790 !important;
    }

    .bg-red
    {
        background-color: #f5365c !important;
    }

    a.bg-red:hover,
    a.bg-red:focus,
    button.bg-red:hover,
    button.bg-red:focus
    {
        background-color: #ec0c38 !important;
    }

    .bg-orange
    {
        background-color: #fb6340 !important;
    }

    a.bg-orange:hover,
    a.bg-orange:focus,
    button.bg-orange:hover,
    button.bg-orange:focus
    {
        background-color: #fa3a0e !important;
    }

    .bg-yellow
    {
        background-color: #ffd600 !important;
    }

    a.bg-yellow:hover,
    a.bg-yellow:focus,
    button.bg-yellow:hover,
    button.bg-yellow:focus
    {
        background-color: #ccab00 !important;
    }

    .bg-green
    {
        background-color: #2dce89 !important;
    }

    a.bg-green:hover,
    a.bg-green:focus,
    button.bg-green:hover,
    button.bg-green:focus
    {
        background-color: #24a46d !important;
    }

    .bg-teal
    {
        background-color: #11cdef !important;
    }

    a.bg-teal:hover,
    a.bg-teal:focus,
    button.bg-teal:hover,
    button.bg-teal:focus
    {
        background-color: #0da5c0 !important;
    }

    .bg-cyan
    {
        background-color: #2bffc6 !important;
    }

    a.bg-cyan:hover,
    a.bg-cyan:focus,
    button.bg-cyan:hover,
    button.bg-cyan:focus
    {
        background-color: #00f7b5 !important;
    }

    .bg-white
    {
        background-color: #fff !important;
    }

    a.bg-white:hover,
    a.bg-white:focus,
    button.bg-white:hover,
    button.bg-white:focus
    {
        background-color: #e6e6e6 !important;
    }

    .bg-gray
    {
        background-color: #8898aa !important;
    }

    a.bg-gray:hover,
    a.bg-gray:focus,
    button.bg-gray:hover,
    button.bg-gray:focus
    {
        background-color: #6a7e95 !important;
    }

    .bg-gray-dark
    {
        background-color: #32325d !important;
    }

    a.bg-gray-dark:hover,
    a.bg-gray-dark:focus,
    button.bg-gray-dark:hover,
    button.bg-gray-dark:focus
    {
        background-color: #20203c !important;
    }

    .bg-light
    {
        background-color: #ced4da !important;
    }

    a.bg-light:hover,
    a.bg-light:focus,
    button.bg-light:hover,
    button.bg-light:focus
    {
        background-color: #b1bbc4 !important;
    }

    .bg-lighter
    {
        background-color: #e9ecef !important;
    }

    a.bg-lighter:hover,
    a.bg-lighter:focus,
    button.bg-lighter:hover,
    button.bg-lighter:focus
    {
        background-color: #cbd3da !important;
    }

    .bg-gradient-primary
    {
        background: linear-gradient(87deg, #546FF7 0, #825ee4 100%) !important;
    }

    .bg-gradient-secondary
    {
        background: linear-gradient(87deg, #f4f5f7 0, #f4f4f7 100%) !important;
    }

    .bg-gradient-success
    {
        background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
    }

    .bg-gradient-info
    {
        background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important;
    }

    .bg-gradient-warning
    {
        background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
    }

    .bg-gradient-danger
    {
        background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important;
    }

    .bg-gradient-light
    {
        background: linear-gradient(87deg, #adb5bd 0, #adaebd 100%) !important;
    }

    .bg-gradient-dark
    {
        background: linear-gradient(87deg, #212529 0, #212229 100%) !important;
    }

    .bg-gradient-default
    {
        background: linear-gradient(87deg, #172b4d 0, #1a174d 100%) !important;
    }

    .bg-gradient-white
    {
        background: linear-gradient(87deg, #fff 0, white 100%) !important;
    }

    .bg-gradient-neutral
    {
        background: linear-gradient(87deg, #fff 0, white 100%) !important;
    }

    .bg-gradient-darker
    {
        background: linear-gradient(87deg, black 0, black 100%) !important;
    }

    .bg-gradient-blue
    {
        background: linear-gradient(87deg, #546FF7 0, #825ee4 100%) !important;
    }

    .bg-gradient-indigo
    {
        background: linear-gradient(87deg, #5603ad 0, #9d03ad 100%) !important;
    }

    .bg-gradient-purple
    {
        background: linear-gradient(87deg, #8965e0 0, #bc65e0 100%) !important;
    }

    .bg-gradient-pink
    {
        background: linear-gradient(87deg, #f3a4b5 0, #f3b4a4 100%) !important;
    }

    .bg-gradient-red
    {
        background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important;
    }

    .bg-gradient-orange
    {
        background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
    }

    .bg-gradient-yellow
    {
        background: linear-gradient(87deg, #ffd600 0, #beff00 100%) !important;
    }

    .bg-gradient-green
    {
        background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
    }

    .bg-gradient-teal
    {
        background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important;
    }

    .bg-gradient-cyan
    {
        background: linear-gradient(87deg, #2bffc6 0, #2be0ff 100%) !important;
    }

    .bg-gradient-white
    {
        background: linear-gradient(87deg, #fff 0, white 100%) !important;
    }

    .bg-gradient-gray
    {
        background: linear-gradient(87deg, #8898aa 0, #888aaa 100%) !important;
    }

    .bg-gradient-gray-dark
    {
        background: linear-gradient(87deg, #32325d 0, #44325d 100%) !important;
    }

    .bg-gradient-light
    {
        background: linear-gradient(87deg, #ced4da 0, #cecfda 100%) !important;
    }

    .bg-gradient-lighter
    {
        background: linear-gradient(87deg, #e9ecef 0, #e9eaef 100%) !important;
    }

    .section-primary
    {
        background-color: #fff !important;
    }

    a.section-primary:hover,
    a.section-primary:focus,
    button.section-primary:hover,
    button.section-primary:focus
    {
        background-color: #e6e6e6 !important;
    }

    .section-secondary
    {
        background-color: #f4f5f7 !important;
    }

    a.section-secondary:hover,
    a.section-secondary:focus,
    button.section-secondary:hover,
    button.section-secondary:focus
    {
        background-color: #d6dae2 !important;
    }

    .section-light
    {
        background-color: #ced4da !important;
    }

    a.section-light:hover,
    a.section-light:focus,
    button.section-light:hover,
    button.section-light:focus
    {
        background-color: #b1bbc4 !important;
    }

    .section-dark
    {
        background-color: #212529 !important;
    }

    a.section-dark:hover,
    a.section-dark:focus,
    button.section-dark:hover,
    button.section-dark:focus
    {
        background-color: #0a0c0d !important;
    }

    .section-darker
    {
        background-color: black !important;
    }

    a.section-darker:hover,
    a.section-darker:focus,
    button.section-darker:hover,
    button.section-darker:focus
    {
        background-color: black !important;
    }

    .bg-gradient-primary
    {
        background: linear-gradient(87deg, #546FF7 0, #825ee4 100%) !important;
    }

    .bg-gradient-secondary
    {
        background: linear-gradient(87deg, #f4f5f7 0, #f4f4f7 100%) !important;
    }

    .bg-gradient-success
    {
        background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
    }

    .bg-gradient-info
    {
        background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important;
    }

    .bg-gradient-warning
    {
        background: linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
    }

    .bg-gradient-danger
    {
        background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important;
    }

    .bg-gradient-light
    {
        background: linear-gradient(87deg, #adb5bd 0, #adaebd 100%) !important;
    }

    .bg-gradient-dark
    {
        background: linear-gradient(87deg, #212529 0, #212229 100%) !important;
    }

    .bg-gradient-default
    {
        background: linear-gradient(87deg, #172b4d 0, #1a174d 100%) !important;
    }

    .bg-gradient-white
    {
        background: linear-gradient(87deg, #fff 0, white 100%) !important;
    }

    .bg-gradient-neutral
    {
        background: linear-gradient(87deg, #fff 0, white 100%) !important;
    }

    .bg-gradient-darker
    {
        background: linear-gradient(87deg, black 0, black 100%) !important;
    }

    .fill-primary
    {
        fill: #546FF7;
    }

    .stroke-primary
    {
        stroke: #546FF7;
    }

    .fill-secondary
    {
        fill: #f4f5f7;
    }

    .stroke-secondary
    {
        stroke: #f4f5f7;
    }

    .fill-success
    {
        fill: #2dce89;
    }

    .stroke-success
    {
        stroke: #2dce89;
    }

    .fill-info
    {
        fill: #11cdef;
    }

    .stroke-info
    {
        stroke: #11cdef;
    }

    .fill-warning
    {
        fill: #fb6340;
    }

    .stroke-warning
    {
        stroke: #fb6340;
    }

    .fill-danger
    {
        fill: #f5365c;
    }

    .stroke-danger
    {
        stroke: #f5365c;
    }

    .fill-light
    {
        fill: #adb5bd;
    }

    .stroke-light
    {
        stroke: #adb5bd;
    }

    .fill-dark
    {
        fill: #212529;
    }

    .stroke-dark
    {
        stroke: #212529;
    }

    .fill-default
    {
        fill: #172b4d;
    }

    .stroke-default
    {
        stroke: #172b4d;
    }

    .fill-white
    {
        fill: #fff;
    }

    .stroke-white
    {
        stroke: #fff;
    }

    .fill-neutral
    {
        fill: #fff;
    }

    .stroke-neutral
    {
        stroke: #fff;
    }

    .fill-darker
    {
        fill: black;
    }

    .stroke-darker
    {
        stroke: black;
    }

    .fill-opacity-8
    {
        fill-opacity: .8;
    }

    .floating
    {
        animation: floating 3s ease infinite;

        will-change: transform;
    }
    .floating:hover
    {
        animation-play-state: paused;
    }

    .floating-lg
    {
        animation: floating-lg 3s ease infinite;
    }

    .floating-sm
    {
        animation: floating-sm 3s ease infinite;
    }

    @keyframes floating-lg
    {
        0%
        {
            transform: translateY(0px);
        }
        50%
        {
            transform: translateY(15px);
        }
        100%
        {
            transform: translateY(0px);
        }
    }

    @keyframes floating
    {
        0%
        {
            transform: translateY(0px);
        }
        50%
        {
            transform: translateY(10px);
        }
        100%
        {
            transform: translateY(0px);
        }
    }

    @keyframes floating-sm
    {
        0%
        {
            transform: translateY(0px);
        }
        50%
        {
            transform: translateY(5px);
        }
        100%
        {
            transform: translateY(0px);
        }
    }

    .img-center
    {
        display: block;

        margin-right: auto;
        margin-left: auto;
    }

    .floatfix:before,
    .floatfix:after
    {
        display: table;

        content: '';
    }

    .floatfix:after
    {
        clear: both;
    }

    .overflow-visible
    {
        overflow: visible !important;
    }

    .overflow-hidden
    {
        overflow: hidden !important;
    }

    .opacity-1
    {
        opacity: .1 !important;
    }

    .opacity-2
    {
        opacity: .2 !important;
    }

    .opacity-3
    {
        opacity: .3 !important;
    }

    .opacity-4
    {
        opacity: .4 !important;
    }

    .opacity-5
    {
        opacity: .5 !important;
    }

    .opacity-6
    {
        opacity: .6 !important;
    }

    .opacity-7
    {
        opacity: .7 !important;
    }

    .opacity-8
    {
        opacity: .8 !important;
    }

    .opacity-8
    {
        opacity: .9 !important;
    }

    .opacity-10
    {
        opacity: 1 !important;
    }

    .top-0
    {
        top: 0;
    }

    .right-0
    {
        right: 0;
    }

    .bottom-0
    {
        bottom: 0;
    }

    .left-0
    {
        left: 0;
    }

    .top-1
    {
        top: .25rem;
    }

    .right-1
    {
        right: .25rem;
    }

    .bottom-1
    {
        bottom: .25rem;
    }

    .left-1
    {
        left: .25rem;
    }

    .top-2
    {
        top: .5rem;
    }

    .right-2
    {
        right: .5rem;
    }

    .bottom-2
    {
        bottom: .5rem;
    }

    .left-2
    {
        left: .5rem;
    }

    .top-3
    {
        top: 1rem;
    }

    .right-3
    {
        right: 1rem;
    }

    .bottom-3
    {
        bottom: 1rem;
    }

    .left-3
    {
        left: 1rem;
    }

    .top-4
    {
        top: 1.5rem;
    }

    .right-4
    {
        right: 1.5rem;
    }

    .bottom-4
    {
        bottom: 1.5rem;
    }

    .left-4
    {
        left: 1.5rem;
    }

    .top-5
    {
        top: 3rem;
    }

    .right-5
    {
        right: 3rem;
    }

    .bottom-5
    {
        bottom: 3rem;
    }

    .left-5
    {
        left: 3rem;
    }

    .top-sm
    {
        top: 2rem;
    }

    .right-sm
    {
        right: 2rem;
    }

    .bottom-sm
    {
        bottom: 2rem;
    }

    .left-sm
    {
        left: 2rem;
    }

    .top-md
    {
        top: 4rem;
    }

    .right-md
    {
        right: 4rem;
    }

    .bottom-md
    {
        bottom: 4rem;
    }

    .left-md
    {
        left: 4rem;
    }

    .top-lg
    {
        top: 6rem;
    }

    .right-lg
    {
        right: 6rem;
    }

    .bottom-lg
    {
        bottom: 6rem;
    }

    .left-lg
    {
        left: 6rem;
    }

    .top-xl
    {
        top: 8rem;
    }

    .right-xl
    {
        right: 8rem;
    }

    .bottom-xl
    {
        bottom: 8rem;
    }

    .left-xl
    {
        left: 8rem;
    }

    .center
    {
        left: 50%;

        transform: translateX(-50%);
    }

    .h-100vh
    {
        height: 100vh !important;
    }

    .row.row-grid > [class*='col-'] + [class*='col-']
    {
        margin-top: 3rem;
    }

    @media (min-width: 992px)
    {
        .row.row-grid > [class*='col-lg-'] + [class*='col-lg-']
        {
            margin-top: 0;
        }
    }

    @media (min-width: 768px)
    {
        .row.row-grid > [class*='col-md-'] + [class*='col-md-']
        {
            margin-top: 0;
        }
    }

    @media (min-width: 576px)
    {
        .row.row-grid > [class*='col-sm-'] + [class*='col-sm-']
        {
            margin-top: 0;
        }
    }

    .row-grid + .row-grid
    {
        margin-top: 3rem;
    }

    @media (min-width: 992px)
    {
        [class*='mt--'],
        [class*='mr--'],
        [class*='mb--'],
        [class*='ml--']
        {
            position: relative;
            z-index: 5;
        }
        .mt--100
        {
            margin-top: -100px !important;
        }
        .mr--100
        {
            margin-right: -100px !important;
        }
        .mb--100
        {
            margin-bottom: -100px !important;
        }
        .ml--100
        {
            margin-left: -100px !important;
        }
        .mt--150
        {
            margin-top: -150px !important;
        }
        .mb--150
        {
            margin-bottom: -150px !important;
        }
        .mt--200
        {
            margin-top: -200px !important;
        }
        .mb--200
        {
            margin-bottom: -200px !important;
        }
        .mt--300
        {
            margin-top: -300px !important;
        }
        .mb--300
        {
            margin-bottom: -300px !important;
        }
        .pt-100
        {
            padding-top: 100px !important;
        }
        .pb-100
        {
            padding-bottom: 100px !important;
        }
        .pt-150
        {
            padding-top: 150px !important;
        }
        .pb-150
        {
            padding-bottom: 150px !important;
        }
        .pt-200
        {
            padding-top: 200px !important;
        }
        .pb-200
        {
            padding-bottom: 200px !important;
        }
        .pt-250
        {
            padding-top: 250px !important;
        }
        .pb-250
        {
            padding-bottom: 250px !important;
        }
        .pt-300
        {
            padding-top: 300px !important;
        }
        .pb-300
        {
            padding-bottom: 300px !important;
        }
    }

    [class*='shadow']
    {
        transition: all .15s ease;
    }

    .shadow-sm--hover:hover
    {
        box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
    }

    .shadow--hover:hover
    {
        box-shadow: 0 15px 35px rgba(50, 50, 93, .1), 0 5px 15px rgba(0, 0, 0, .07) !important;
    }

    .shadow-lg--hover:hover
    {
        box-shadow: 0 1rem 3rem rgba(0, 0, 0, .175) !important;
    }

    .shadow-none--hover:hover
    {
        box-shadow: none !important;
    }

    .font-weight-300
    {
        font-weight: 300 !important;
    }

    .font-weight-400
    {
        font-weight: 400 !important;
    }

    .font-weight-500
    {
        font-weight: 500 !important;
    }

    .font-weight-600
    {
        font-weight: 600 !important;
    }

    .font-weight-700
    {
        font-weight: 700 !important;
    }

    .font-weight-800
    {
        font-weight: 800 !important;
    }

    .font-weight-900
    {
        font-weight: 900 !important;
    }

    .text-underline
    {
        text-decoration: underline;
    }

    .text-through
    {
        text-decoration: line-through;
    }

    .lh-100
    {
        line-height: 1;
    }

    .lh-110
    {
        line-height: 1.1;
    }

    .lh-120
    {
        line-height: 1.2;
    }

    .lh-130
    {
        line-height: 1.3;
    }

    .lh-140
    {
        line-height: 1.4;
    }

    .lh-150
    {
        line-height: 1.5;
    }

    .lh-160
    {
        line-height: 1.6;
    }

    .lh-170
    {
        line-height: 1.7;
    }

    .lh-180
    {
        line-height: 1.8;
    }

    .ls-1
    {
        letter-spacing: .0625rem;
    }

    .ls-15
    {
        letter-spacing: .09375rem;
    }

    .ls-2
    {
        letter-spacing: .125rem;
    }

    @media (min-width: 992px)
    {
        .transform-perspective-right
        {
            transform: scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg);
        }
        .transform-perspective-left
        {
            transform: scale(1) perspective(2000px) rotateY(11deg) rotateX(2deg) rotate(-2deg);
        }
    }

    .alert
    {
        font-size: .875rem;

        padding: 1rem 1.5rem;

        border: 0;
        border-radius: .25rem;
    }
    .alert .alert-inner--icon
    {
        font-size: 1.25rem;

        display: inline-block;

        margin-right: 1.25rem;

        vertical-align: middle;
    }
    .alert .alert-inner--icon i.ni
    {
        position: relative;
        top: 1px;
    }
    .alert .alert-inner--text
    {
        display: inline-block;

        vertical-align: middle;
    }

    .alert:not(.alert-secondary)
    {
        color: #fff;
    }

    [class*='alert-'] .alert-link
    {
        color: #fff;
        border-bottom: 1px dotted rgba(255, 255, 255, .5);
    }

    .alert-heading
    {
        font-size: 1.5rem;
        font-weight: 600;

        margin-top: .15rem;
    }

    .alert-dismissible .close
    {
        top: 50%;
        right: 1.5rem;

        padding: 0;

        transform: translateY(-50%);

        opacity: 1;
        color: rgba(255, 255, 255, .6);
    }
    .alert-dismissible .close:hover,
    .alert-dismissible .close:focus
    {
        opacity: 1 !important;
        color: rgba(255, 255, 255, .9);
    }
    @media (max-width: 575.98px)
    {
        .alert-dismissible .close
        {
            top: 1rem;
            right: .5rem;
        }
    }
    .alert-dismissible .close > span:not(.sr-only)
    {
        font-size: 1.5rem;

        color: rgba(255, 255, 255, .6);
        background-color: transparent;
    }
    .alert-dismissible .close:hover > span:not(.sr-only),
    .alert-dismissible .close:focus > span:not(.sr-only)
    {
        color: rgba(255, 255, 255, .9);
        background-color: transparent;
    }

    .avatar
    {
        font-size: 1rem;

        display: inline-flex;

        width: 48px;
        height: 48px;

        color: #fff;
        border-radius: 50%;
        background-color: #adb5bd;

        align-items: center;
        justify-content: center;
    }

    .avatar img
    {
        width: 100%;

        border-radius: 50%;
    }

    .avatar + .avatar-content
    {
        display: inline-block;

        margin-left: .75rem;
    }

    .avatar-lg
    {
        font-size: .875rem;

        width: 58px;
        height: 58px;
    }

    .avatar-sm
    {
        font-size: .875rem;

        width: 38px;
        height: 38px;
    }

    .avatar-group .avatar
    {
        position: relative;
        z-index: 2;

        border: 2px solid #fff;
    }
    .avatar-group .avatar:hover
    {
        z-index: 3;
    }

    .avatar-group .avatar + .avatar
    {
        margin-left: -1rem;
    }

    .badge
    {
        text-transform: uppercase;
    }
    .badge a
    {
        color: #fff;
    }

    .badge-pill
    {
        padding-right: .875em;
        padding-left: .875em;
    }

    .badge-circle
    {
        font-size: .875rem;

        display: inline-flex;

        width: 2rem;
        height: 2rem;

        text-align: center;

        border-radius: 50%;

        align-items: center;
        justify-content: center;
    }

    .badge-inline
    {
        margin-right: .625rem;
    }

    .badge-inline + span
    {
        position: relative;
        top: 2px;
    }

    .badge-inline + span > a
    {
        text-decoration: underline;
    }

    .badge-md
    {
        padding: .65em 1em;
    }

    .badge-lg
    {
        padding: .85em 1.375em;
    }

    .badge-secondary
    {
        color: #32325d;
    }

    .btn .badge:not(:first-child)
    {
        margin-left: .5rem;
    }

    .btn .badge:not(:last-child)
    {
        margin-right: .5rem;
    }

    .btn
    {
        font-size: .875rem;

        position: relative;

        transition: all .15s ease;
        letter-spacing: .025em;
        text-transform: uppercase;

        will-change: transform;
    }
    .btn:hover
    {
        transform: translateY(-1px);

        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    }
    .btn:not(:last-child)
    {
        margin-right: .5rem;
    }

    .btn-group .btn,
    .input-group .btn
    {
        margin-right: 0;

        transform: translateY(0);
    }

    .btn-sm,
    .btn-group-sm > .btn
    {
        font-size: .75rem;
    }

    .btn-lg,
    .btn-group-lg > .btn
    {
        font-size: .875rem;
    }

    [class*='btn-outline-']
    {
        border-width: 1px;
    }

    .btn-outline-secondary
    {
        color: #637089;
    }

    .btn-inner--icon i:not(.fa)
    {
        position: relative;
        top: 2px;
    }

    .btn-link
    {
        font-weight: 600;

        box-shadow: none;
    }
    .btn-link:hover
    {
        transform: none;

        box-shadow: none;
    }

    .btn-neutral
    {
        color: #546FF7;
    }

    .btn svg:not(:first-child),
    .btn i:not(:first-child)
    {
        margin-left: .5rem;
    }

    .btn svg:not(:last-child),
    .btn i:not(:last-child)
    {
        margin-right: .5rem;
    }

    .btn-icon-label
    {
        position: relative;
    }
    .btn-icon-label .btn-inner--icon
    {
        line-height: 1;

        position: absolute;

        width: 3em;
        height: 100%;
        margin: 0;

        text-align: center;

        border-radius: 0;
        background-color: rgba(0, 0, 0, .1);
    }
    .btn-icon-label .btn-inner--icon:not(:first-child)
    {
        top: 0;
        right: 0;

        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
    }
    .btn-icon-label .btn-inner--icon:not(:last-child)
    {
        top: 0;
        left: 0;

        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
    }
    .btn-icon-label .btn-inner--icon svg
    {
        position: relative;
        top: 50%;

        transform: translateY(-50%);
    }
    .btn-icon-label .btn-inner--text:not(:first-child)
    {
        padding-left: 3em;
    }
    .btn-icon-label .btn-inner--text:not(:last-child)
    {
        padding-right: 3em;
    }

    .btn-icon .btn-inner--icon img
    {
        width: 20px;
    }

    .btn-icon .btn-inner--text:not(:first-child)
    {
        margin-left: .75em;
    }

    .btn-icon .btn-inner--text:not(:last-child)
    {
        margin-right: .75em;
    }

    .btn-icon-only
    {
        width: 2.375rem;
        height: 2.375rem;
        padding: 0;
    }

    a.btn-icon-only
    {
        line-height: 2.5;
    }

    .btn-icon-only.btn-sm,
    .btn-group-sm > .btn-icon-only.btn
    {
        width: 2rem;
        height: 2rem;
    }

    .btn-facebook
    {
        color: #fff;
        border-color: #3b5999;
        background-color: #3b5999;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-facebook:hover
    {
        color: #fff;
        border-color: #3b5999;
        background-color: #3b5999;
    }
    .btn-facebook:focus,
    .btn-facebook.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(59, 89, 153, .5);
    }
    .btn-facebook.disabled,
    .btn-facebook:disabled
    {
        color: #fff;
        border-color: #3b5999;
        background-color: #3b5999;
    }
    .btn-facebook:not(:disabled):not(.disabled):active,
    .btn-facebook:not(:disabled):not(.disabled).active,
    .show > .btn-facebook.dropdown-toggle
    {
        color: #fff;
        border-color: #3b5999;
        background-color: #2d4474;
    }
    .btn-facebook:not(:disabled):not(.disabled):active:focus,
    .btn-facebook:not(:disabled):not(.disabled).active:focus,
    .show > .btn-facebook.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(59, 89, 153, .5);
    }

    .btn-twitter
    {
        color: #fff;
        border-color: #1da1f2;
        background-color: #1da1f2;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-twitter:hover
    {
        color: #fff;
        border-color: #1da1f2;
        background-color: #1da1f2;
    }
    .btn-twitter:focus,
    .btn-twitter.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(29, 161, 242, .5);
    }
    .btn-twitter.disabled,
    .btn-twitter:disabled
    {
        color: #fff;
        border-color: #1da1f2;
        background-color: #1da1f2;
    }
    .btn-twitter:not(:disabled):not(.disabled):active,
    .btn-twitter:not(:disabled):not(.disabled).active,
    .show > .btn-twitter.dropdown-toggle
    {
        color: #fff;
        border-color: #1da1f2;
        background-color: #0c85d0;
    }
    .btn-twitter:not(:disabled):not(.disabled):active:focus,
    .btn-twitter:not(:disabled):not(.disabled).active:focus,
    .show > .btn-twitter.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(29, 161, 242, .5);
    }

    .btn-google-plus
    {
        color: #fff;
        border-color: #dd4b39;
        background-color: #dd4b39;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-google-plus:hover
    {
        color: #fff;
        border-color: #dd4b39;
        background-color: #dd4b39;
    }
    .btn-google-plus:focus,
    .btn-google-plus.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(221, 75, 57, .5);
    }
    .btn-google-plus.disabled,
    .btn-google-plus:disabled
    {
        color: #fff;
        border-color: #dd4b39;
        background-color: #dd4b39;
    }
    .btn-google-plus:not(:disabled):not(.disabled):active,
    .btn-google-plus:not(:disabled):not(.disabled).active,
    .show > .btn-google-plus.dropdown-toggle
    {
        color: #fff;
        border-color: #dd4b39;
        background-color: #c23321;
    }
    .btn-google-plus:not(:disabled):not(.disabled):active:focus,
    .btn-google-plus:not(:disabled):not(.disabled).active:focus,
    .show > .btn-google-plus.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(221, 75, 57, .5);
    }

    .btn-instagram
    {
        color: #fff;
        border-color: #e4405f;
        background-color: #e4405f;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-instagram:hover
    {
        color: #fff;
        border-color: #e4405f;
        background-color: #e4405f;
    }
    .btn-instagram:focus,
    .btn-instagram.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(228, 64, 95, .5);
    }
    .btn-instagram.disabled,
    .btn-instagram:disabled
    {
        color: #fff;
        border-color: #e4405f;
        background-color: #e4405f;
    }
    .btn-instagram:not(:disabled):not(.disabled):active,
    .btn-instagram:not(:disabled):not(.disabled).active,
    .show > .btn-instagram.dropdown-toggle
    {
        color: #fff;
        border-color: #e4405f;
        background-color: #d31e40;
    }
    .btn-instagram:not(:disabled):not(.disabled):active:focus,
    .btn-instagram:not(:disabled):not(.disabled).active:focus,
    .show > .btn-instagram.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(228, 64, 95, .5);
    }

    .btn-pinterest
    {
        color: #fff;
        border-color: #bd081c;
        background-color: #bd081c;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-pinterest:hover
    {
        color: #fff;
        border-color: #bd081c;
        background-color: #bd081c;
    }
    .btn-pinterest:focus,
    .btn-pinterest.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(189, 8, 28, .5);
    }
    .btn-pinterest.disabled,
    .btn-pinterest:disabled
    {
        color: #fff;
        border-color: #bd081c;
        background-color: #bd081c;
    }
    .btn-pinterest:not(:disabled):not(.disabled):active,
    .btn-pinterest:not(:disabled):not(.disabled).active,
    .show > .btn-pinterest.dropdown-toggle
    {
        color: #fff;
        border-color: #bd081c;
        background-color: #8c0615;
    }
    .btn-pinterest:not(:disabled):not(.disabled):active:focus,
    .btn-pinterest:not(:disabled):not(.disabled).active:focus,
    .show > .btn-pinterest.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(189, 8, 28, .5);
    }

    .btn-youtube
    {
        color: #fff;
        border-color: #cd201f;
        background-color: #cd201f;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-youtube:hover
    {
        color: #fff;
        border-color: #cd201f;
        background-color: #cd201f;
    }
    .btn-youtube:focus,
    .btn-youtube.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(205, 32, 31, .5);
    }
    .btn-youtube.disabled,
    .btn-youtube:disabled
    {
        color: #fff;
        border-color: #cd201f;
        background-color: #cd201f;
    }
    .btn-youtube:not(:disabled):not(.disabled):active,
    .btn-youtube:not(:disabled):not(.disabled).active,
    .show > .btn-youtube.dropdown-toggle
    {
        color: #fff;
        border-color: #cd201f;
        background-color: #a11918;
    }
    .btn-youtube:not(:disabled):not(.disabled):active:focus,
    .btn-youtube:not(:disabled):not(.disabled).active:focus,
    .show > .btn-youtube.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(205, 32, 31, .5);
    }

    .btn-slack
    {
        color: #fff;
        border-color: #3aaf85;
        background-color: #3aaf85;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-slack:hover
    {
        color: #fff;
        border-color: #3aaf85;
        background-color: #3aaf85;
    }
    .btn-slack:focus,
    .btn-slack.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(58, 175, 133, .5);
    }
    .btn-slack.disabled,
    .btn-slack:disabled
    {
        color: #fff;
        border-color: #3aaf85;
        background-color: #3aaf85;
    }
    .btn-slack:not(:disabled):not(.disabled):active,
    .btn-slack:not(:disabled):not(.disabled).active,
    .show > .btn-slack.dropdown-toggle
    {
        color: #fff;
        border-color: #3aaf85;
        background-color: #2d8968;
    }
    .btn-slack:not(:disabled):not(.disabled):active:focus,
    .btn-slack:not(:disabled):not(.disabled).active:focus,
    .show > .btn-slack.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(58, 175, 133, .5);
    }

    .btn-dribbble
    {
        color: #fff;
        border-color: #ea4c89;
        background-color: #ea4c89;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-dribbble:hover
    {
        color: #fff;
        border-color: #ea4c89;
        background-color: #ea4c89;
    }
    .btn-dribbble:focus,
    .btn-dribbble.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(234, 76, 137, .5);
    }
    .btn-dribbble.disabled,
    .btn-dribbble:disabled
    {
        color: #fff;
        border-color: #ea4c89;
        background-color: #ea4c89;
    }
    .btn-dribbble:not(:disabled):not(.disabled):active,
    .btn-dribbble:not(:disabled):not(.disabled).active,
    .show > .btn-dribbble.dropdown-toggle
    {
        color: #fff;
        border-color: #ea4c89;
        background-color: #e51e6b;
    }
    .btn-dribbble:not(:disabled):not(.disabled):active:focus,
    .btn-dribbble:not(:disabled):not(.disabled).active:focus,
    .show > .btn-dribbble.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(234, 76, 137, .5);
    }

    .btn-github
    {
        color: #fff;
        border-color: #222;
        background-color: #222;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .btn-github:hover
    {
        color: #fff;
        border-color: #222;
        background-color: #222;
    }
    .btn-github:focus,
    .btn-github.focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(34, 34, 34, .5);
    }
    .btn-github.disabled,
    .btn-github:disabled
    {
        color: #fff;
        border-color: #222;
        background-color: #222;
    }
    .btn-github:not(:disabled):not(.disabled):active,
    .btn-github:not(:disabled):not(.disabled).active,
    .show > .btn-github.dropdown-toggle
    {
        color: #fff;
        border-color: #222;
        background-color: #090909;
    }
    .btn-github:not(:disabled):not(.disabled):active:focus,
    .btn-github:not(:disabled):not(.disabled).active:focus,
    .show > .btn-github.dropdown-toggle:focus
    {
        box-shadow: none, 0 0 0 0 rgba(34, 34, 34, .5);
    }

    .card
    {
        position: relative;
    }

    .profile-page .card-profile
    {
        margin-top: -150px;
    }
    .profile-page .card-profile .card-profile-image
    {
        position: relative;
    }
    .profile-page .card-profile .card-profile-image img
    {
        position: absolute;
        left: 50%;

        max-width: 180px;

        transition: all .15s ease;
        transform: translate(-50%, -30%);

        border-radius: .25rem;
    }
    .profile-page .card-profile .card-profile-image img:hover
    {
        transform: translate(-50%, -33%);
    }
    .profile-page .card-profile .card-profile-stats
    {
        padding: 1rem 0;
    }
    .profile-page .card-profile .card-profile-stats > div
    {
        margin-right: 1rem;
        padding: .875rem;

        text-align: center;
    }
    .profile-page .card-profile .card-profile-stats > div:last-child
    {
        margin-right: 0;
    }
    .profile-page .card-profile .card-profile-stats > div .heading
    {
        font-size: 1.1rem;
        font-weight: bold;

        display: block;
    }
    .profile-page .card-profile .card-profile-stats > div .description
    {
        font-size: .875rem;

        color: #adb5bd;
    }
    .profile-page .card-profile .card-profile-actions
    {
        padding: .875rem;
    }
    @media (max-width: 575.98px)
    {
        .profile-page .card-profile .card-profile-actions
        {
            margin-top: 110px;
        }
    }
    @media (min-width: 576px) and (max-width: 991.98px)
    {
        .profile-page .card-profile .card-profile-stats
        {
            margin-top: 30px;
        }
    }

    .card .card-blockquote
    {
        position: relative;

        padding: 2rem;
    }
    .card .card-blockquote .svg-bg
    {
        position: absolute;
        top: -94px;
        left: 0;

        display: block;

        width: 100%;
        height: 95px;
    }

    .card-lift--hover:hover
    {
        transition: all .15s ease;
        transform: translateY(-20px);
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .card-lift--hover:hover
        {
            transition: none;
        }
    }

    .close
    {
        transition: all .15s ease;
    }
    .close > span:not(.sr-only)
    {
        font-size: 1.25rem;
        line-height: 17px;

        display: block;

        width: 1.25rem;
        height: 1.25rem;

        transition: all .15s ease;

        color: rgba(0, 0, 0, .6);
        border-radius: 50%;
        background-color: transparent;
    }
    .close:hover,
    .close:focus
    {
        color: rgba(0, 0, 0, .9);
        outline: none;
        background-color: transparent;
    }
    .close:hover span:not(.sr-only),
    .close:focus span:not(.sr-only)
    {
        background-color: transparent;
    }

    .custom-control-label::before
    {
        transition: all .2s cubic-bezier(.68, -.55, .265, 1.55);

        border: 1px solid #cad1d7;
    }

    .custom-control-label span
    {
        position: relative;
        top: 2px;
    }

    .custom-control-label
    {
        margin-bottom: 0;
    }

    .custom-control-input:active ~ .custom-control-label::before
    {
        border-color: #546FF7;
    }

    .custom-control-alternative .custom-control-label::before
    {
        border: 0;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15), 0 1px 0 rgba(0, 0, 0, .02);
    }

    .custom-control-alternative .custom-control-input:checked ~ .custom-control-label::before
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }

    .custom-control-alternative .custom-control-input:active ~ .custom-control-label::before,
    .custom-control-alternative .custom-control-input:focus ~ .custom-control-label::before
    {
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15), 0 1px 0 rgba(0, 0, 0, .02);
    }

    .custom-checkbox .custom-control-input ~ .custom-control-label
    {
        font-size: .875rem;

        cursor: pointer;
    }

    .custom-checkbox .custom-control-input:checked ~ .custom-control-label::before
    {
        border-color: #546FF7;
    }

    .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 8 8\'%3E%3Cpath fill=\'%23fff\' d=\'M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z\'/%3E%3C/svg%3E');
    }

    .custom-checkbox .custom-control-input:disabled ~ .custom-control-label::before
    {
        border-color: #e9ecef;
    }

    .custom-checkbox .custom-control-input:disabled:checked::before
    {
        border-color: rgba(94, 114, 228, .5);
    }

    .custom-radio .custom-control-input ~ .custom-control-label
    {
        font-size: .875rem;

        cursor: pointer;
    }

    .custom-radio .custom-control-input:checked ~ .custom-control-label::before
    {
        border-color: #546FF7;
    }

    .custom-radio .custom-control-input:checked ~ .custom-control-label::after
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3E%3Ccircle r=\'3\' fill=\'%23fff\'/%3E%3C/svg%3E');
    }

    .custom-radio .custom-control-input:disabled ~ .custom-control-label::before
    {
        border-color: #e9ecef;
    }

    .custom-radio .custom-control-input:disabled:checked::before
    {
        border-color: rgba(94, 114, 228, .5);
    }

    .custom-toggle
    {
        position: relative;

        display: inline-block;

        width: 50px;
        height: 1.5rem;
    }
    .custom-toggle input
    {
        display: none;
    }
    .custom-toggle input:checked + .custom-toggle-slider
    {
        border: 1px solid #546FF7;
    }
    .custom-toggle input:checked + .custom-toggle-slider:before
    {
        transform: translateX(1.625rem);

        background: #546FF7;
    }
    .custom-toggle input:disabled + .custom-toggle-slider
    {
        border: 1px solid #e9ecef;
    }
    .custom-toggle input:disabled:checked + .custom-toggle-slider
    {
        border: 1px solid #e9ecef;
    }
    .custom-toggle input:disabled:checked + .custom-toggle-slider:before
    {
        background-color: #8a98eb;
    }

    .custom-toggle-slider
    {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        cursor: pointer;

        border: 1px solid #cad1d7;
        border-radius: 34px !important;
        background-color: transparent;
    }
    .custom-toggle-slider:before
    {
        position: absolute;
        bottom: 2px;
        left: 2px;

        width: 18px;
        height: 18px;

        content: '';
        transition: all .2s cubic-bezier(.68, -.55, .265, 1.55);

        border-radius: 50% !important;
        background-color: #ddd;
    }

    .dropdown,
    .dropup,
    .dropright,
    .dropleft
    {
        display: inline-block;
    }

    .dropdown-menu
    {
        min-width: 12rem;
    }
    .dropdown-menu .dropdown-item
    {
        font-size: .875rem;

        padding: .5rem 1rem;
    }
    .dropdown-menu .dropdown-item > i,
    .dropdown-menu .dropdown-item > svg
    {
        font-size: 1rem;

        margin-right: 1rem;

        vertical-align: -17%;
    }

    .dropdown-header
    {
        font-size: .625rem;
        font-weight: 700;

        padding-right: 1rem;
        padding-left: 1rem;

        text-transform: uppercase;

        color: #f6f9fc;
    }

    .dropdown-menu-inverse
    {
        border-color: #242a31;
        background: #282f37;
    }
    .dropdown-menu-inverse .dropdown-item
    {
        color: #dadada;
    }
    .dropdown-menu-inverse .dropdown-item:active,
    .dropdown-menu-inverse .dropdown-item:focus,
    .dropdown-menu-inverse .dropdown-item:hover
    {
        color: #fff;
        background: #31353e;
    }
    .dropdown-menu-inverse .dropdown-divider
    {
        background: #191e23;
    }

    .dropdown-menu a.media > div:first-child
    {
        line-height: 1;
    }

    .dropdown-menu a.media p
    {
        color: #8898aa;
    }

    .dropdown-menu a.media:hover .heading,
    .dropdown-menu a.media:hover p
    {
        color: #172b4d !important;
    }

    .dropdown-menu-sm
    {
        min-width: 100px;

        border: .3rem;
    }

    .dropdown-menu-lg
    {
        min-width: 260px;

        border-radius: .3rem;
    }

    .dropdown-menu-xl
    {
        min-width: 450px;

        border-radius: .3rem;
    }

    .footer
    {
        padding: 3rem 0;

        background: #f4f5f7;
    }
    .footer .col-footer .heading
    {
        font-size: .875rem;
        font-weight: 600;

        margin-bottom: 1rem;

        letter-spacing: 0;
        text-transform: uppercase;

        color: #8898aa;
    }
    .footer .nav .nav-item .nav-link,
    .footer .footer-link
    {
        color: #8898aa !important;
    }
    .footer .nav .nav-item .nav-link:hover,
    .footer .footer-link:hover
    {
        color: #525f7f !important;
    }
    .footer .list-unstyled li a
    {
        font-size: .85rem;

        display: inline-block;

        padding: .125rem 0;

        color: #8898aa;
    }
    .footer .list-unstyled li a:hover
    {
        color: #525f7f;
    }
    .footer .copyright
    {
        font-size: .875rem;
    }

    .footer-dark .col-footer .heading
    {
        color: #fff;
    }

    .footer.has-cards
    {
        position: relative;

        overflow: hidden;

        margin-top: -420px;
        padding-top: 500px;

        pointer-events: none;

        background: transparent;
    }
    .footer.has-cards:before
    {
        position: absolute;
        top: 600px;
        right: 0;
        left: 0;

        height: 2000px;

        content: '';
        transform: skew(0, -8deg);

        background: #f4f5f7;
    }
    .footer.has-cards .container
    {
        position: relative;

        pointer-events: auto;
    }

    .nav-footer .nav-link
    {
        font-size: .875rem;
    }

    .nav-footer .nav-item:last-child .nav-link
    {
        padding-right: 0;
    }

    /* Form controls */
    label
    {
        font-size: .875rem;
    }

    .form-control
    {
        font-size: .875rem;
    }
    .form-control:focus::-webkit-input-placeholder
    {
        color: #adb5bd;
    }
    .form-control:focus:-ms-input-placeholder
    {
        color: #adb5bd;
    }
    .form-control:focus::-ms-input-placeholder
    {
        color: #adb5bd;
    }
    .form-control:focus::placeholder
    {
        color: #adb5bd;
    }

    /* Textareas */
    textarea[resize='none']
    {
        resize: none !important;
    }

    textarea[resize='both']
    {
        resize: both !important;
    }

    textarea[resize='vertical']
    {
        resize: vertical !important;
    }

    textarea[resize='horizontal']
    {
        resize: horizontal !important;
    }

    /* Alternative styles */
    .form-control-muted
    {
        border-color: #edf0f5;
        background-color: #edf0f5;
        box-shadow: none;
    }
    .form-control-muted:focus
    {
        background-color: #edf0f5;
    }

    .form-control-alternative
    {
        transition: box-shadow .15s ease;

        border: 0;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15), 0 1px 0 rgba(0, 0, 0, .02);
    }
    .form-control-alternative:focus
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }

    .form-control-lg
    {
        font-size: 1rem;
    }

    .has-success,
    .has-danger
    {
        position: relative;
    }
    .has-success:after,
    .has-danger:after
    {
        font-family: 'NucleoIcons';
        font-size: 9px;
        line-height: 19px;

        position: absolute;
        top: 2px;
        right: 15px;

        display: inline-block;

        width: 19px;
        height: 19px;

        transform: translateY(50%);
        text-align: center;

        opacity: 1;
        border-radius: 50%;
    }

    .has-success:after
    {
        content: '\ea26';

        color: daken(#2dce89, 18%);
        background-color: #69deac;
    }

    .has-success .form-control
    {
        background-color: #fff;
    }
    .has-success .form-control:focus
    {
        border-color: rgba(50, 151, 211, .25);
    }
    .has-success .form-control::-webkit-input-placeholder
    {
        color: #2dce89;
    }
    .has-success .form-control:-ms-input-placeholder
    {
        color: #2dce89;
    }
    .has-success .form-control::-ms-input-placeholder
    {
        color: #2dce89;
    }
    .has-success .form-control::placeholder
    {
        color: #2dce89;
    }

    .has-danger:after
    {
        content: '\ea53';

        color: daken(#fb6340, 18%);
        background-color: #fda08b;
    }

    .has-danger .form-control
    {
        background-color: #fff;
    }
    .has-danger .form-control:focus
    {
        border-color: rgba(50, 151, 211, .25);
    }
    .has-danger .form-control::-webkit-input-placeholder
    {
        color: #fb6340;
    }
    .has-danger .form-control:-ms-input-placeholder
    {
        color: #fb6340;
    }
    .has-danger .form-control::-ms-input-placeholder
    {
        color: #fb6340;
    }
    .has-danger .form-control::placeholder
    {
        color: #fb6340;
    }

    @media (min-width: 992px)
    {
        .container-lg
        {
            max-width: 1160px;
        }
    }

    .icon
    {
        width: 3rem;
        height: 3rem;
    }
    .icon i,
    .icon svg
    {
        font-size: 2.25rem;
    }

    .icon + .icon-text
    {
        width: calc(100% - 3rem - 1);
        padding-left: 1rem;
    }

    .icon-xl
    {
        width: 5rem;
        height: 5rem;
    }
    .icon-xl i,
    .icon-xl svg
    {
        font-size: 4.25rem;
    }

    .icon-xl + .icon-text
    {
        width: calc(100% - 5rem - 1);
    }

    .icon-lg
    {
        width: 4rem;
        height: 4rem;
    }
    .icon-lg i,
    .icon-lg svg
    {
        font-size: 3.25rem;
    }

    .icon-lg + .icon-text
    {
        width: calc(100% - 4rem - 1);
    }

    .icon-sm
    {
        width: 2rem;
        height: 2rem;
    }
    .icon-sm i,
    .icon-sm svg
    {
        font-size: 1.25rem;
    }

    .icon-sm + .icon-text
    {
        width: calc(100% - 2rem - 1);
    }

    .icon-shape
    {
        display: inline-flex;

        padding: 12px;

        text-align: center;

        border-radius: 50%;

        align-items: center;
        justify-content: center;
    }
    .icon-shape i,
    .icon-shape svg
    {
        font-size: 1.25rem;
    }
    .icon-shape.icon-lg i,
    .icon-shape.icon-lg svg
    {
        font-size: 1.625rem;
    }
    .icon-shape.icon-sm i,
    .icon-shape.icon-sm svg
    {
        font-size: .875rem;
    }
    .icon-shape svg
    {
        width: 30px;
        height: 30px;
    }

    .icon-shape-primary
    {
        color: #2643e9;
        background-color: rgba(138, 152, 235, .5);
    }

    .icon-shape-secondary
    {
        color: #d3d9e5;
        background-color: rgba(255, 255, 255, .5);
    }

    .icon-shape-success
    {
        color: #1aae6f;
        background-color: rgba(84, 218, 161, .5);
    }

    .icon-shape-info
    {
        color: #03acca;
        background-color: rgba(65, 215, 242, .5);
    }

    .icon-shape-warning
    {
        color: #ff3709;
        background-color: rgba(252, 140, 114, .5);
    }

    .icon-shape-danger
    {
        color: #f80031;
        background-color: rgba(247, 103, 131, .5);
    }

    .icon-shape-light
    {
        color: #879cb0;
        background-color: rgba(201, 207, 212, .5);
    }

    .icon-shape-dark
    {
        color: #090c0e;
        background-color: rgba(56, 63, 69, .5);
    }

    .icon-shape-default
    {
        color: #091428;
        background-color: rgba(35, 65, 116, .5);
    }

    .icon-shape-white
    {
        color: #e8e3e3;
        background-color: rgba(255, 255, 255, .5);
    }

    .icon-shape-neutral
    {
        color: #e8e3e3;
        background-color: rgba(255, 255, 255, .5);
    }

    .icon-shape-darker
    {
        color: black;
        background-color: rgba(26, 26, 26, .5);
    }

    .input-group
    {
        transition: all .15s ease;

        border-radius: .25rem;
        box-shadow: none;
    }
    .input-group .form-control
    {
        box-shadow: none;
    }
    .input-group .form-control:not(:first-child)
    {
        padding-left: 0;

        border-left: 0;
    }
    .input-group .form-control:not(:last-child)
    {
        padding-right: 0;

        border-right: 0;
    }
    .input-group .form-control:focus
    {
        box-shadow: none;
    }

    .input-group-text
    {
        transition: all .2s cubic-bezier(.68, -.55, .265, 1.55);
    }

    .input-group-alternative
    {
        transition: box-shadow .15s ease;

        border: 0;
        box-shadow: 0 1px 3px rgba(50, 50, 93, .15), 0 1px 0 rgba(0, 0, 0, .02);
    }
    .input-group-alternative .form-control,
    .input-group-alternative .input-group-text
    {
        border: 0;
        box-shadow: none;
    }

    .focused .input-group-alternative
    {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08) !important;
    }

    .focused .input-group
    {
        box-shadow: none;
    }

    .focused .input-group-text
    {
        color: #8898aa;
        border-color: rgba(50, 151, 211, .25);
        background-color: #fff;
    }

    .focused .form-control
    {
        border-color: rgba(50, 151, 211, .25);
    }

    .list-group-space .list-group-item
    {
        margin-bottom: 1.5rem;

        border-radius: .25rem;
    }

    .list-group-img
    {
        width: 3rem;
        height: 3rem;
        margin: -.1rem 1.2rem 0 -.2rem;

        vertical-align: top;

        border-radius: 50%;
    }

    .list-group-content
    {
        min-width: 0;

        flex: 1 1;
    }

    .list-group-content > p
    {
        line-height: 1.5;

        margin: .2rem 0 0;

        color: #adb5bd;
    }

    .list-group-heading
    {
        font-size: 1rem;

        color: #32325d;
    }

    .list-group-heading > small
    {
        font-weight: 500;

        float: right;

        color: #adb5bd;
    }

    .modal-content
    {
        border: 0;
        border-radius: .3rem;
    }

    .modal-fluid .modal-dialog
    {
        margin-top: 0;
        margin-bottom: 0;
    }

    .modal-fluid .modal-content
    {
        border-radius: 0;
    }

    .modal-primary .modal-title
    {
        color: #fff;
    }

    .modal-primary .modal-header,
    .modal-primary .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-primary .modal-content
    {
        color: #fff;
        background-color: #546FF7;
    }
    .modal-primary .modal-content .heading
    {
        color: #fff;
    }

    .modal-primary .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-secondary .modal-title
    {
        color: #212529;
    }

    .modal-secondary .modal-header,
    .modal-secondary .modal-footer
    {
        border-color: rgba(33, 37, 41, .075);
    }

    .modal-secondary .modal-content
    {
        color: #212529;
        background-color: #f4f5f7;
    }
    .modal-secondary .modal-content .heading
    {
        color: #212529;
    }

    .modal-secondary .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-success .modal-title
    {
        color: #fff;
    }

    .modal-success .modal-header,
    .modal-success .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-success .modal-content
    {
        color: #fff;
        background-color: #2dce89;
    }
    .modal-success .modal-content .heading
    {
        color: #fff;
    }

    .modal-success .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-info .modal-title
    {
        color: #fff;
    }

    .modal-info .modal-header,
    .modal-info .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-info .modal-content
    {
        color: #fff;
        background-color: #11cdef;
    }
    .modal-info .modal-content .heading
    {
        color: #fff;
    }

    .modal-info .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-warning .modal-title
    {
        color: #fff;
    }

    .modal-warning .modal-header,
    .modal-warning .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-warning .modal-content
    {
        color: #fff;
        background-color: #fb6340;
    }
    .modal-warning .modal-content .heading
    {
        color: #fff;
    }

    .modal-warning .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-danger .modal-title
    {
        color: #fff;
    }

    .modal-danger .modal-header,
    .modal-danger .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-danger .modal-content
    {
        color: #fff;
        background-color: #f5365c;
    }
    .modal-danger .modal-content .heading
    {
        color: #fff;
    }

    .modal-danger .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-light .modal-title
    {
        color: #fff;
    }

    .modal-light .modal-header,
    .modal-light .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-light .modal-content
    {
        color: #fff;
        background-color: #adb5bd;
    }
    .modal-light .modal-content .heading
    {
        color: #fff;
    }

    .modal-light .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-dark .modal-title
    {
        color: #fff;
    }

    .modal-dark .modal-header,
    .modal-dark .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-dark .modal-content
    {
        color: #fff;
        background-color: #212529;
    }
    .modal-dark .modal-content .heading
    {
        color: #fff;
    }

    .modal-dark .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-default .modal-title
    {
        color: #fff;
    }

    .modal-default .modal-header,
    .modal-default .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-default .modal-content
    {
        color: #fff;
        background-color: #172b4d;
    }
    .modal-default .modal-content .heading
    {
        color: #fff;
    }

    .modal-default .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-white .modal-title
    {
        color: #212529;
    }

    .modal-white .modal-header,
    .modal-white .modal-footer
    {
        border-color: rgba(33, 37, 41, .075);
    }

    .modal-white .modal-content
    {
        color: #212529;
        background-color: #fff;
    }
    .modal-white .modal-content .heading
    {
        color: #212529;
    }

    .modal-white .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-neutral .modal-title
    {
        color: #212529;
    }

    .modal-neutral .modal-header,
    .modal-neutral .modal-footer
    {
        border-color: rgba(33, 37, 41, .075);
    }

    .modal-neutral .modal-content
    {
        color: #212529;
        background-color: #fff;
    }
    .modal-neutral .modal-content .heading
    {
        color: #212529;
    }

    .modal-neutral .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .modal-darker .modal-title
    {
        color: #fff;
    }

    .modal-darker .modal-header,
    .modal-darker .modal-footer
    {
        border-color: rgba(255, 255, 255, .075);
    }

    .modal-darker .modal-content
    {
        color: #fff;
        background-color: black;
    }
    .modal-darker .modal-content .heading
    {
        color: #fff;
    }

    .modal-darker .close > span:not(.sr-only)
    {
        color: #fff;
    }

    .nav-link
    {
        color: #525f7f;
    }
    .nav-link:hover
    {
        color: #546FF7;
    }
    .nav-link i:not(.fa)
    {
        position: relative;
        top: 2px;
    }

    .nav-pills .nav-item:not(:last-child)
    {
        padding-right: 1rem;
    }

    .nav-pills .nav-link
    {
        font-size: .875rem;
        font-weight: 500;

        padding: .75rem 1rem;

        transition: all .15s ease;

        color: #546FF7;
        background-color: #fff;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }
    .nav-pills .nav-link:hover
    {
        color: #485fe0;
    }

    .nav-pills .nav-link.active,
    .nav-pills .show > .nav-link
    {
        color: #fff;
        background-color: #546FF7;
    }

    @media (max-width: 575.98px)
    {
        .nav-pills .nav-item
        {
            margin-bottom: 1rem;
        }
    }

    @media (max-width: 767.98px)
    {
        .nav-pills:not(.nav-pills-circle) .nav-item
        {
            padding-right: 0;
        }
    }

    .nav-pills-circle .nav-link
    {
        line-height: 60px;

        width: 60px;
        height: 60px;
        padding: 0;

        text-align: center;

        border-radius: 50%;
    }

    .nav-pills-circle .nav-link-icon i,
    .nav-pills-circle .nav-link-icon svg
    {
        font-size: 1rem;
    }

    .nav-wrapper
    {
        padding: 1rem 0;

        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    .nav-wrapper + .card
    {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: .25rem;
        border-bottom-left-radius: .25rem;
    }

    .navbar-nav .nav-link
    {
        font-family: 'motiva-sans', sans-serif;
        font-size: .9rem;
        font-weight: 400;

        transition: all .15s linear;
        letter-spacing: 0;
        text-transform: normal;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .navbar-nav .nav-link
        {
            transition: none;
        }
    }
    .navbar-nav .nav-link .nav-link-inner--text
    {
        margin-left: .25rem;
    }

    .navbar-brand
    {
        font-size: .875rem;
        font-size: .875rem;
        font-weight: 600;

        letter-spacing: .05px;
        text-transform: uppercase;
    }
    .navbar-brand img
    {
        height: 40px;
    }

    .navbar-dark .navbar-brand
    {
        color: #fff;
    }

    .navbar-light .navbar-brand
    {
        color: #32325d;
    }

    .navbar-nav .nav-item .media:not(:last-child)
    {
        margin-bottom: 1.5rem;
    }

    @media (min-width: 992px)
    {
        .navbar-nav .nav-item
        {
            margin-right: .5rem;
        }
        .navbar-nav .nav-item [data-toggle='dropdown']::after
        {
            transition: all .15s ease;
        }
        .navbar-nav .nav-item.show [data-toggle='dropdown']::after
        {
            transform: rotate(180deg);
        }
        .navbar-nav .nav-link
        {
            padding-top: 1rem;
            padding-bottom: 1rem;

            border-radius: .25rem;
        }
        .navbar-nav .nav-link i
        {
            margin-right: .625rem;
        }
        .navbar-nav .nav-link-icon
        {
            font-size: 1rem;

            padding-right: .5rem !important;
            padding-left: .5rem !important;

            border-radius: .25rem;
        }
        .navbar-nav .nav-link-icon i
        {
            margin-right: 0;
        }
        .navbar-nav .dropdown-menu
        {
            margin: 0;

            pointer-events: none;

            opacity: 0;
        }
        .navbar-nav .dropdown-menu:before
        {
            position: absolute;
            z-index: -5;
            bottom: 100%;
            left: 20px;

            display: block;

            width: 16px;
            height: 16px;

            content: '';
            transform: rotate(-45deg) translateY(1rem);

            border-radius: .2rem;
            background: #fff;
            box-shadow: none;
        }
        .navbar-nav .dropdown-menu-right:before
        {
            right: 20px;
            left: auto;
        }
        .navbar-nav:not(.navbar-nav-hover) .dropdown-menu.show
        {
            animation: show-navbar-dropdown .25s ease forwards;
            pointer-events: auto;

            opacity: 1;
        }
        .navbar-nav:not(.navbar-nav-hover) .dropdown-menu.close
        {
            display: block;

            animation: hide-navbar-dropdown .15s ease backwards;
        }
        .navbar-nav.navbar-nav-hover .dropdown-menu
        {
            display: block;

            transition: visibility .25s, opacity .25s, transform .25s;
            transform: translate(0, 10px) perspective(200px) rotateX(-2deg);
            pointer-events: none;

            opacity: 0;
        }
        .navbar-nav.navbar-nav-hover .nav-item.dropdown:hover > .dropdown-menu
        {
            display: block;
            visibility: visible;

            transform: translate(0, 0);
            animation: none;
            pointer-events: auto;

            opacity: 1;
        }
        .navbar-nav .dropdown-menu-inner
        {
            position: relative;

            padding: 1rem;
        }
    }

    .navbar-transparent
    {
        position: absolute;
        z-index: 100;
        top: 0;

        width: 100%;

        border: 0;
        background-color: transparent;
        box-shadow: none;
    }
    .navbar-transparent .navbar-brand
    {
        color: white;
    }
    .navbar-transparent .navbar-toggler
    {
        color: white;
    }
    .navbar-transparent .navbar-toggler-icon
    {
        background-image: url('data:image/svg+xml;charset=utf8,%3Csvg viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath stroke=\'rgba(255, 255, 255, 0.95)\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-miterlimit=\'10\' d=\'M4 7h22M4 15h22M4 23h22\'/%3E%3C/svg%3E');
    }

    @media (min-width: 768px)
    {
        .navbar-transparent .navbar-nav .nav-link
        {
            color: rgba(255, 255, 255, .95);
        }
        .navbar-transparent .navbar-nav .nav-link:hover,
        .navbar-transparent .navbar-nav .nav-link:focus
        {
            color: rgba(255, 255, 255, .65);
        }
        .navbar-transparent .navbar-nav .nav-link.disabled
        {
            color: rgba(255, 255, 255, .25);
        }
        .navbar-transparent .navbar-nav .show > .nav-link,
        .navbar-transparent .navbar-nav .active > .nav-link,
        .navbar-transparent .navbar-nav .nav-link.show,
        .navbar-transparent .navbar-nav .nav-link.active
        {
            color: rgba(255, 255, 255, .65);
        }
        .navbar-transparent .navbar-brand
        {
            color: rgba(255, 255, 255, .95);
        }
        .navbar-transparent .navbar-brand:hover,
        .navbar-transparent .navbar-brand:focus
        {
            color: rgba(255, 255, 255, .95);
        }
    }

    .navbar-collapse-header
    {
        display: none;
    }

    @media (max-width: 991.98px)
    {
        .navbar-nav .nav-link
        {
            padding: .625rem 0;

            color: #172b4d !important;
        }
        .navbar-nav .dropdown-menu
        {
            min-width: auto;

            box-shadow: none;
        }
        .navbar-nav .dropdown-menu .media svg
        {
            width: 30px;
        }
        .navbar-collapse
        {
            position: absolute;
            z-index: 1050;
            top: 0;
            right: 0;
            left: 0;

            overflow-y: auto;

            width: calc(100% - 1.4rem);
            height: auto !important;
            margin: .7rem;

            opacity: 0;
        }
        .navbar-collapse .navbar-toggler
        {
            position: relative;

            display: inline-block;

            width: 20px;
            height: 20px;
            padding: 0;

            cursor: pointer;
        }
        .navbar-collapse .navbar-toggler span
        {
            position: absolute;

            display: block;

            width: 100%;
            height: 2px;

            opacity: 1;
            border-radius: 2px;
            background: #283448;
        }
        .navbar-collapse .navbar-toggler :nth-child(1)
        {
            transform: rotate(135deg);
        }
        .navbar-collapse .navbar-toggler :nth-child(2)
        {
            transform: rotate(-135deg);
        }
        .navbar-collapse .navbar-collapse-header
        {
            display: block;

            margin-bottom: 1rem;
            padding-bottom: 1rem;

            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }
        .navbar-collapse .collapse-brand img
        {
            height: 36px;
        }
        .navbar-collapse .collapse-close
        {
            text-align: right;
        }
        .navbar-collapse.collapsing,
        .navbar-collapse.show
        {
            padding: 1.5rem;

            animation: show-navbar-collapse .2s ease forwards;

            border-radius: .25rem;
            background: #fff;
            box-shadow: 0 50px 100px rgba(50, 50, 93, .1), 0 15px 35px rgba(50, 50, 93, .15), 0 5px 15px rgba(0, 0, 0, .1);
        }
        .navbar-collapse.collapsing-out
        {
            animation: hide-navbar-collapse .2s ease forwards;
        }
    }

    @keyframes show-navbar-collapse
    {
        0%
        {
            transform: scale(.95);
            transform-origin: 100% 0;

            opacity: 0;
        }
        100%
        {
            transform: scale(1);

            opacity: 1;
        }
    }

    @keyframes hide-navbar-collapse
    {
        from
        {
            transform: scale(1);
            transform-origin: 100% 0;

            opacity: 1;
        }
        to
        {
            transform: scale(.95);

            opacity: 0;
        }
    }

    @keyframes show-navbar-dropdown
    {
        0%
        {
            transition: visibility .25s, opacity .25s, transform .25s;
            transform: translate(0, 10px) perspective(200px) rotateX(-2deg);

            opacity: 0;
        }
        100%
        {
            transform: translate(0, 0);

            opacity: 1;
        }
    }

    @keyframes hide-navbar-dropdown
    {
        from
        {
            opacity: 1;
        }
        to
        {
            transform: translate(0, 10px);

            opacity: 0;
        }
    }

.page-item.active .page-link
{
    box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
}

.page-item .page-link,
.page-item span
{
    font-size: .875rem;

    display: flex;

    width: 36px;
    height: 36px;
    margin: 0 3px;
    padding: 0;

    border-radius: 50% !important;

    align-items: center;
    justify-content: center;
}

.pagination-lg .page-item .page-link,
.pagination-lg .page-item span
{
    line-height: 46px;

    width: 46px;
    height: 46px;
}

.pagination-sm .page-item .page-link,
.pagination-sm .page-item span
{
    line-height: 30px;

    width: 30px;
    height: 30px;
}

.popover
{
    border: 0;
}

.popover-header
{
    font-weight: 600;
}

.popover-primary
{
    background-color: #546FF7;
}
.popover-primary .popover-header
{
    color: #fff;
    background-color: #546FF7;
}
.popover-primary .popover-body
{
    color: #fff;
}
.popover-primary .popover-header
{
    border-color: rgba(255, 255, 255, .2);
}
.popover-primary.bs-popover-top .arrow::after,
.popover-primary.bs-popover-auto[x-placement^='top'] .arrow::after
{
    border-top-color: #546FF7;
}
.popover-primary.bs-popover-right .arrow::after,
.popover-primary.bs-popover-auto[x-placement^='right'] .arrow::after
{
    border-right-color: #546FF7;
}
.popover-primary.bs-popover-bottom .arrow::after,
.popover-primary.bs-popover-auto[x-placement^='bottom'] .arrow::after
{
    border-bottom-color: #546FF7;
}
.popover-primary.bs-popover-left .arrow::after,
.popover-primary.bs-popover-auto[x-placement^='left'] .arrow::after
{
    border-left-color: #546FF7;
}

.popover-secondary
{
    background-color: #f4f5f7;
}
.popover-secondary .popover-header
{
    color: #212529;
    background-color: #f4f5f7;
}

    .popover-secondary .popover-body
    {
        color: #212529;
    }
    .popover-secondary .popover-header
    {
        border-color: rgba(33, 37, 41, .2);
    }
    .popover-secondary.bs-popover-top .arrow::after,
    .popover-secondary.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #f4f5f7;
    }
    .popover-secondary.bs-popover-right .arrow::after,
    .popover-secondary.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #f4f5f7;
    }
    .popover-secondary.bs-popover-bottom .arrow::after,
    .popover-secondary.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #f4f5f7;
    }
    .popover-secondary.bs-popover-left .arrow::after,
    .popover-secondary.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #f4f5f7;
    }

    .popover-success
    {
        background-color: #2dce89;
    }
    .popover-success .popover-header
    {
        color: #fff;
        background-color: #2dce89;
    }
    .popover-success .popover-body
    {
        color: #fff;
    }
    .popover-success .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-success.bs-popover-top .arrow::after,
    .popover-success.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #2dce89;
    }
    .popover-success.bs-popover-right .arrow::after,
    .popover-success.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #2dce89;
    }
    .popover-success.bs-popover-bottom .arrow::after,
    .popover-success.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #2dce89;
    }
    .popover-success.bs-popover-left .arrow::after,
    .popover-success.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #2dce89;
    }

    .popover-info
    {
        background-color: #11cdef;
    }
    .popover-info .popover-header
    {
        color: #fff;
        background-color: #11cdef;
    }
    .popover-info .popover-body
    {
        color: #fff;
    }
    .popover-info .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-info.bs-popover-top .arrow::after,
    .popover-info.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #11cdef;
    }
    .popover-info.bs-popover-right .arrow::after,
    .popover-info.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #11cdef;
    }
    .popover-info.bs-popover-bottom .arrow::after,
    .popover-info.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #11cdef;
    }
    .popover-info.bs-popover-left .arrow::after,
    .popover-info.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #11cdef;
    }

    .popover-warning
    {
        background-color: #fb6340;
    }
    .popover-warning .popover-header
    {
        color: #fff;
        background-color: #fb6340;
    }
    .popover-warning .popover-body
    {
        color: #fff;
    }
    .popover-warning .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-warning.bs-popover-top .arrow::after,
    .popover-warning.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #fb6340;
    }
    .popover-warning.bs-popover-right .arrow::after,
    .popover-warning.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #fb6340;
    }
    .popover-warning.bs-popover-bottom .arrow::after,
    .popover-warning.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #fb6340;
    }
    .popover-warning.bs-popover-left .arrow::after,
    .popover-warning.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #fb6340;
    }

    .popover-danger
    {
        background-color: #f5365c;
    }
    .popover-danger .popover-header
    {
        color: #fff;
        background-color: #f5365c;
    }
    .popover-danger .popover-body
    {
        color: #fff;
    }
    .popover-danger .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-danger.bs-popover-top .arrow::after,
    .popover-danger.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #f5365c;
    }
    .popover-danger.bs-popover-right .arrow::after,
    .popover-danger.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #f5365c;
    }
    .popover-danger.bs-popover-bottom .arrow::after,
    .popover-danger.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #f5365c;
    }
    .popover-danger.bs-popover-left .arrow::after,
    .popover-danger.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #f5365c;
    }

    .popover-light
    {
        background-color: #adb5bd;
    }
    .popover-light .popover-header
    {
        color: #fff;
        background-color: #adb5bd;
    }
    .popover-light .popover-body
    {
        color: #fff;
    }
    .popover-light .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-light.bs-popover-top .arrow::after,
    .popover-light.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #adb5bd;
    }
    .popover-light.bs-popover-right .arrow::after,
    .popover-light.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #adb5bd;
    }
    .popover-light.bs-popover-bottom .arrow::after,
    .popover-light.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #adb5bd;
    }
    .popover-light.bs-popover-left .arrow::after,
    .popover-light.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #adb5bd;
    }

    .popover-dark
    {
        background-color: #212529;
    }
    .popover-dark .popover-header
    {
        color: #fff;
        background-color: #212529;
    }
    .popover-dark .popover-body
    {
        color: #fff;
    }
    .popover-dark .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-dark.bs-popover-top .arrow::after,
    .popover-dark.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #212529;
    }
    .popover-dark.bs-popover-right .arrow::after,
    .popover-dark.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #212529;
    }
    .popover-dark.bs-popover-bottom .arrow::after,
    .popover-dark.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #212529;
    }
    .popover-dark.bs-popover-left .arrow::after,
    .popover-dark.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #212529;
    }

    .popover-default
    {
        background-color: #172b4d;
    }
    .popover-default .popover-header
    {
        color: #fff;
        background-color: #172b4d;
    }
    .popover-default .popover-body
    {
        color: #fff;
    }
    .popover-default .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-default.bs-popover-top .arrow::after,
    .popover-default.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #172b4d;
    }
    .popover-default.bs-popover-right .arrow::after,
    .popover-default.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #172b4d;
    }
    .popover-default.bs-popover-bottom .arrow::after,
    .popover-default.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #172b4d;
    }
    .popover-default.bs-popover-left .arrow::after,
    .popover-default.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #172b4d;
    }

    .popover-white
    {
        background-color: #fff;
    }
    .popover-white .popover-header
    {
        color: #212529;
        background-color: #fff;
    }
    .popover-white .popover-body
    {
        color: #212529;
    }
    .popover-white .popover-header
    {
        border-color: rgba(33, 37, 41, .2);
    }
    .popover-white.bs-popover-top .arrow::after,
    .popover-white.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #fff;
    }
    .popover-white.bs-popover-right .arrow::after,
    .popover-white.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #fff;
    }
    .popover-white.bs-popover-bottom .arrow::after,
    .popover-white.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #fff;
    }
    .popover-white.bs-popover-left .arrow::after,
    .popover-white.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #fff;
    }

    .popover-neutral
    {
        background-color: #fff;
    }
    .popover-neutral .popover-header
    {
        color: #212529;
        background-color: #fff;
    }
    .popover-neutral .popover-body
    {
        color: #212529;
    }
    .popover-neutral .popover-header
    {
        border-color: rgba(33, 37, 41, .2);
    }
    .popover-neutral.bs-popover-top .arrow::after,
    .popover-neutral.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: #fff;
    }
    .popover-neutral.bs-popover-right .arrow::after,
    .popover-neutral.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: #fff;
    }
    .popover-neutral.bs-popover-bottom .arrow::after,
    .popover-neutral.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: #fff;
    }
    .popover-neutral.bs-popover-left .arrow::after,
    .popover-neutral.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: #fff;
    }

    .popover-darker
    {
        background-color: black;
    }
    .popover-darker .popover-header
    {
        color: #fff;
        background-color: black;
    }
    .popover-darker .popover-body
    {
        color: #fff;
    }
    .popover-darker .popover-header
    {
        border-color: rgba(255, 255, 255, .2);
    }
    .popover-darker.bs-popover-top .arrow::after,
    .popover-darker.bs-popover-auto[x-placement^='top'] .arrow::after
    {
        border-top-color: black;
    }
    .popover-darker.bs-popover-right .arrow::after,
    .popover-darker.bs-popover-auto[x-placement^='right'] .arrow::after
    {
        border-right-color: black;
    }
    .popover-darker.bs-popover-bottom .arrow::after,
    .popover-darker.bs-popover-auto[x-placement^='bottom'] .arrow::after
    {
        border-bottom-color: black;
    }
    .popover-darker.bs-popover-left .arrow::after,
    .popover-darker.bs-popover-auto[x-placement^='left'] .arrow::after
    {
        border-left-color: black;
    }

    .progress-wrapper
    {
        position: relative;

        padding-top: 1.5rem;
    }

    .progress
    {
        overflow: hidden;

        height: 8px;
        margin-bottom: 1rem;

        border-radius: .2rem;
        background-color: #e9ecef;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
    }

    .progress .sr-only
    {
        font-size: 13px;
        line-height: 20px;

        left: 0;

        clip: auto;

        width: auto;
        height: 20px;
        margin: 0 0 0 30px;
    }

    .progress-heading
    {
        font-size: 14px;
        font-weight: 500;

        margin: 0 0 2px;
        padding: 0;
    }

    .progress-bar
    {
        height: auto;

        border-radius: 0;
        box-shadow: none;
    }

    .progress-info
    {
        display: flex;

        margin-bottom: .5rem;

        align-items: center;
        justify-content: space-between;
    }

    .progress-label span
    {
        font-size: .625rem;
        font-weight: 600;

        display: inline-block;

        padding: .25rem 1rem;

        text-transform: uppercase;

        color: #546FF7;
        border-radius: 30px;
        background: rgba(94, 114, 228, .1);
    }

    .progress-percentage
    {
        text-align: right;
    }
    .progress-percentage span
    {
        font-size: .875rem;
        font-weight: 600;

        display: inline-block;

        color: #8898aa;
    }

    .section
    {
        position: relative;

        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    .section-xl
    {
        padding-top: 8rem;
        padding-bottom: 8rem;
    }

    .section-lg
    {
        padding-top: 6rem;
        padding-bottom: 6rem;
    }

    .section-sm
    {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }

    @media (min-width: 768px)
    {
        .section-hero
        {
            min-height: 500px;
        }
    }

    .section-shaped
    {
        position: relative;
        background: linear-gradient(150deg, #546FF7 15%, #6772e5 70%, #555abf 94%);
    }
    .section-shaped .stars-and-coded
    {
        margin-top: 8rem;
    }
    .section-shaped .shape
    {
        position: absolute;
        z-index: 0;
        top: 0;

        width: 100%;
        height: 100%;
    }
    .section-shaped .shape span
    {
        position: absolute;
    }
    .section-shaped .shape + .container
    {
        position: relative;

        height: 100%;
    }
    .section-shaped .shape.shape-skew + .container
    {
        padding-top: 0;
    }
    .section-shaped .shape.shape-skew + .container .col
    {
        margin-top: -100px;
    }
    .section-shaped .shape.shape-skew + .shape-container
    {
        padding-top: 18rem;
        padding-bottom: 19rem;
    }
    .section-shaped .shape-skew
    {
        transform: skewY(-4deg);
        transform-origin: 0;
    }
    .section-shaped .shape-skew span
    {
        transform: skew(4deg);
    }
    .section-shaped .shape-primary
    {
        background: linear-gradient(150deg, #281483 15%, #8f6ed5 70%, #d782d9 94%);
    }
    .section-shaped .shape-primary :nth-child(1)
    {
        background: #53f;
    }
    .section-shaped .shape-primary :nth-child(2)
    {
        background: #4553ff;
    }
    .section-shaped .shape-primary :nth-child(3)
    {
        background: #4f40ff;
    }
    .section-shaped .shape-primary :nth-child(4)
    {
        background: #25ddf5;
    }
    .section-shaped .shape-primary :nth-child(5)
    {
        background: #1fa2ff;
    }
    .section-shaped .shape-default
    {
        background: linear-gradient(150deg, #546FF7 15%, #6772e5 70%, #555abf 94%);
    }
    .section-shaped .shape-default :nth-child(1)
    {
        background: #7b9aff ;
    }
    .section-shaped .shape-default :nth-child(2)
    {
        background: #7b9aff;
    }

    .section-shaped .shape-light
    {
        background: linear-gradient(150deg, shapes-light-color('step-1-gradient-bg') 15%, shapes-light-color('step-2-gradient-bg') 70%, shapes-light-color('step-3-gradient-bg') 94%);
    }
    .section-shaped .shape-light :nth-child(1)
    {
        background: shapes-light-color('span-1-bg');
    }
    .section-shaped .shape-light :nth-child(2)
    {
        background: shapes-light-color('span-2-bg');
    }
    .section-shaped .shape-light :nth-child(3)
    {
        background: shapes-light-color('span-3-bg');
    }
    .section-shaped .shape-light :nth-child(4)
    {
        background: shapes-light-color('span-4-bg');
    }
    .section-shaped .shape-light :nth-child(5)
    {
        background: shapes-light-color('span-5-bg');
    }
    .section-shaped .shape-dark
    {
        background: linear-gradient(150deg, #32325d 15%, #32325d 70%, #32325d 94%);
    }
    .section-shaped .shape-dark :nth-child(1)
    {
        background: #2e2e57;
    }
    .section-shaped .shape-dark :nth-child(2)
    {
        background: #2b2b58;
    }
    .section-shaped .shape-dark :nth-child(3)
    {
        background: #25254d;
    }
    .section-shaped .shape-dark :nth-child(4)
    {
        background: #d782d9;
    }
    .section-shaped .shape-dark :nth-child(5)
    {
        background: #008169;
    }
    .section-shaped .shape-style-1 span
    {
        width: 400px;
        height: 400px;

        border-radius: 10%;
    }
    .section-shaped .shape-style-1 .span-200
    {
        width: 200px;
        height: 200px;
    }
    .section-shaped .shape-style-1 .span-150
    {
        width: 150px;
        height: 150px;
    }
    .section-shaped .shape-style-1 .span-100
    {
        width: 100px;
        height: 100px;
    }
    .section-shaped .shape-style-1 .span-75
    {
        width: 75px;
        height: 75px;
    }
    .section-shaped .shape-style-1 .span-50
    {
        width: 50px;
        height: 50px;
    }
    .section-shaped .shape-style-1 :nth-child(1)
    {
        bottom: auto;
        left: -5%;
        transform: rotate(20deg);
        background: rgba(255, 255, 255, .05);
    }
    .section-shaped .shape-style-1 :nth-child(2)
    {
        top: 50%;
        left: -5%;
        transform: rotate(20deg);
        background: rgba(255, 255, 255, .05);
    }
    .section-shaped .shape-style-1 :nth-child(3)
    {
        top: 40px;
        right: -5%;
        background: rgba(255, 255, 255, .07);
        transform: rotate(20deg);
    }
    .section-shaped .shape-style-1 :nth-child(4)
    {

        top: 250px;
        right: -4%;
        background: rgba(255, 255, 255, .05);
        transform: rotate(20deg);
    }
    .section-shaped .shape-style-1 :nth-child(5)
    {
        top: 38%;
        right: auto;
        left: 1%;

        background: rgba(255, 255, 255, .05);
    }
    .section-shaped .shape-style-1 :nth-child(6)
    {
        top: 44%;
        right: auto;
        left: 10%;

        width: 200px;
        height: 200px;

        background: rgba(255, 255, 255, .15);
    }
    .section-shaped .shape-style-1 :nth-child(7)
    {
        right: 36%;
        bottom: 50%;

        background: rgba(255, 255, 255, .04);
    }
    .section-shaped .shape-style-1 :nth-child(8)
    {
        right: 2%;
        bottom: 70px;

        background: rgba(255, 255, 255, .2);
    }
    .section-shaped .shape-style-1 :nth-child(9)
    {
        right: 2%;
        bottom: 1%;

        background: rgba(255, 255, 255, .1);
    }
    .section-shaped .shape-style-1 :nth-child(10)
    {
        right: auto;
        bottom: 1%;
        left: 1%;

        background: rgba(255, 255, 255, .05);
    }
    @media (max-width: 991.98px)
    {
        .section-shaped .shape-style-1 span
        {
            height: 120px;
        }
    }
    @media (max-width: 767.98px)
    {
        .section-shaped .shape-style-1 span
        {
            height: 90px;
        }
    }
    .section-shaped .shape-style-1.shape-primary
    {
        background: linear-gradient(150deg, #281483 15%, #8f6ed5 70%, #d782d9 94%);
    }
    .section-shaped .shape-style-1.shape-default
    {
        background: linear-gradient(150deg, #546FF7 15%, #6772e5 70%, #555abf 94%);
    }
    .section-shaped .shape-style-1.shape-light
    {
        background: linear-gradient(150deg, shapes-light-color('step-1-gradient-bg') 15%, shapes-light-color('step-2-gradient-bg') 70%, shapes-light-color('step-3-gradient-bg') 94%);
    }
    .section-shaped .shape-style-1.shape-dark
    {
        background: linear-gradient(150deg, #32325d 15%, #32325d 70%, #32325d 94%);
    }
    .section-shaped .shape-style-2 span
    {
        height: 190px;
    }
    .section-shaped .shape-style-2 .span-sm
    {
        height: 100px;
    }
    .section-shaped .shape-style-2 :nth-child(1)
    {
        top: 0;
        left: -16.66666%;

        width: 33.33333%;
    }
    .section-shaped .shape-style-2 :nth-child(2)
    {
        top: 0;
        right: auto;
        left: 16.66666%;

        width: 33.33333%;
    }
    .section-shaped .shape-style-2 :nth-child(3)
    {
        bottom: auto;
        left: 49.99999%;

        width: 33.33333%;
    }
    .section-shaped .shape-style-2 :nth-child(4)
    {
        top: 55%;
        right: -16.66666%;

        width: 33.33333%;
    }
    .section-shaped .shape-style-2 :nth-child(5)
    {
        bottom: 0;

        width: 33.33333%;
    }
    @media (max-width: 991.98px)
    {
        .section-shaped .shape-style-2 span
        {
            height: 120px;
        }
    }
    @media (max-width: 767.98px)
    {
        .section-shaped .shape-style-2 span
        {
            height: 90px;
        }
    }
    .section-shaped .shape-style-3 span
    {
        height: 140px;
    }
    .section-shaped .shape-style-3 .span-sm
    {
        height: 100px;
    }
    .section-shaped .shape-style-3 :nth-child(1)
    {
        bottom: auto;
        left: -16.66666%;

        width: 66%;
    }
    .section-shaped .shape-style-3 :nth-child(2)
    {
        top: 54%;
        right: -16.66666%;

        width: 40%;
    }
    .section-shaped .shape-style-3 :nth-child(3)
    {
        top: 34%;
        right: auto;
        left: -16.66666%;

        width: 33.33333%;
    }
    .section-shaped .shape-style-3 :nth-child(4)
    {
        right: -16.66666%;
        bottom: 0;

        width: 60%;

        opacity: .6;
    }
    .section-shaped .shape-style-3 :nth-child(5)
    {
        bottom: 0;

        width: 33.33333%;
    }
    @media (max-width: 991.98px)
    {
        .section-shaped .shape-style-3 span
        {
            height: 120px;
        }
    }
    @media (max-width: 767.98px)
    {
        .section-shaped .shape-style-3 span
        {
            height: 90px;
        }
    }

    .device-ill
    {
        position: absolute;
        left: 50%;

        display: flex;

        width: 1287px;
        margin-left: -644px;

        transform: scale(.5) rotate(-12deg) translateX(50px);
        transform-origin: 50% 20%;
        pointer-events: none;

        will-change: transform;
    }
    .device-ill div
    {
        display: flex;

        padding: .875rem;

        border-radius: .25rem;
        background: #fff;
        box-shadow: inset 0 4px 7px 1px #fff, inset 0 -5px 20px rgba(173, 186, 204, .25), 0 2px 6px rgba(0, 21, 64, .14), 0 10px 20px rgba(0, 21, 64, .05);

        justify-content: center;
        align-items: center;
    }
    .device-ill .tablet-landscape
    {
        width: 512px;
        height: 352px;
        margin: 115px 50px 0;
    }

    @media (min-width: 670px)
    {
        .device-ill
        {
            top: 215px;

            width: 512px;
            margin-left: -50px;

            transform: rotate(-12deg);
            transform-origin: 100% 0;

            flex-wrap: wrap;
        }
        .device-ill [class^=tablet]
        {
            margin: 0;
        }
        .device-ill .tablet-landscape
        {
            width: 512px;
            height: 352px;
        }
    }

    @media (min-width: 880px)
    {
        .device-ill
        {
            top: 20px;

            width: 829px;
            margin-left: -10px;
        }
        .device-ill .tablet-landscape
        {
            margin-right: 50px;

            align-self: flex-end;
        }
        .device-ill .phone-big
        {
            display: flex;

            width: 267px;
            height: 553px;
        }
    }

    .section-profile-cover
    {
        height: 580px;

        background-position: center center;
        background-size: cover;
    }

    @media (max-width: 991.98px)
    {
        .section-profile-cover
        {
            height: 400px;
        }
    }

    .section-components > .form-control + .form-control
    {
        margin-top: .5rem;
    }

    .section-components > .nav + .nav,
    .section-components > .alert + .alert,
    .section-components > .navbar + .navbar,
    .section-components > .progress + .progress,
    .section-components > .progress + .btn,
    .section-components .badge,
    .section-components .btn
    {
        margin-top: .5rem;
        margin-bottom: .5rem;
    }

    .section-components .btn-group
    {
        margin-top: .5rem;
        margin-bottom: .5rem;
    }
    .section-components .btn-group .btn
    {
        margin: 0;
    }

    .section-components .alert
    {
        margin: 0;
    }
    .section-components .alert + .alert
    {
        margin-top: 1.25rem;
    }

    .section-components .badge
    {
        margin-right: .5rem;
    }

    .section-components .modal-footer .btn
    {
        margin: 0;
    }

    .floating-cards
    {
        position: relative;

        perspective: 1500px;
        align-items: center;
    }

    .floating-cards > div
    {
        position: absolute;

        overflow: hidden;

        border-radius: 8px;

        flex-shrink: 0;
    }

    .floating-cards .shine
    {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        pointer-events: none;
    }

    .separator
    {
        position: absolute;
        z-index: 1;
        top: auto;
        right: 0;
        left: 0;

        overflow: hidden;

        width: 100%;
        height: 150px;

        transform: translateZ(0);
        pointer-events: none;
    }
    .separator svg
    {
        position: absolute;

        pointer-events: none;
    }

    .separator-top
    {
        top: 0;
        bottom: auto;
    }
    .separator-top svg
    {
        top: 0;
    }

    .separator-bottom
    {
        top: auto;
        bottom: 0;
    }
    .separator-bottom svg
    {
        bottom: 0;
    }

    .separator-inverse
    {
        transform: rotate(180deg);
    }

    .separator-skew
    {
        height: 60px;
    }

    p
    {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.7;
    }

    .lead
    {
        font-size: 1.25rem;
        font-weight: 300;
        line-height: 1.7;

        margin-top: 1.5rem;
    }
    .lead + .btn-wrapper
    {
        margin-top: 3rem;
    }

    .description
    {
        font-size: .875rem;
    }

    .heading
    {
        font-size: .95rem;
        font-weight: 400;

        letter-spacing: .025em;
        text-transform: uppercase;
    }

    .heading-title
    {
        font-size: 1.375rem;
        font-weight: 600;

        letter-spacing: .025em;
        text-transform: uppercase;
    }

    .heading-section
    {
        font-size: 1.375rem;
        font-weight: 600;

        letter-spacing: .025em;
        text-transform: uppercase;
    }
    .heading-section img
    {
        display: block;

        width: 72px;
        height: 72px;
        margin-bottom: 1.5rem;
    }
    .heading-section.text-center img
    {
        margin-right: auto;
        margin-left: auto;
    }

    .display-1 span,
    .display-2 span,
    .display-3 span,
    .display-4 span
    {
        font-weight: 300;

        display: block;
    }

    article h4:not(:first-child),
    article h5:not(:first-child)
    {
        margin-top: 3rem;
    }

    article h4,
    article h5
    {
        margin-bottom: 1.5rem;
    }

    article figure
    {
        margin: 3rem 0;
    }

    article h5 + figure
    {
        margin-top: 0;
    }

    .datepicker
    {
        border-radius: .25rem;

        direction: ltr;
    }
    .datepicker-inline
    {
        width: 220px;
    }
    .datepicker-rtl
    {
        direction: rtl;
    }
    .datepicker-rtl.dropdown-menu
    {
        left: auto;
    }
    .datepicker-rtl table tr td span
    {
        float: right;
    }
    .datepicker-dropdown
    {
        top: 0;
        left: 0;

        padding: 20px 22px;

        box-shadow: 0 50px 100px rgba(50, 50, 93, .1), 0 15px 35px rgba(50, 50, 93, .15), 0 5px 15px rgba(0, 0, 0, .1);
    }
    .datepicker-dropdown.datepicker-orient-left:before
    {
        left: 6px;
    }
    .datepicker-dropdown.datepicker-orient-left:after
    {
        left: 7px;
    }
    .datepicker-dropdown.datepicker-orient-right:before
    {
        right: 6px;
    }
    .datepicker-dropdown.datepicker-orient-right:after
    {
        right: 7px;
    }
    .datepicker-dropdown.datepicker-orient-bottom:before
    {
        top: -7px;
    }
    .datepicker-dropdown.datepicker-orient-bottom:after
    {
        top: -6px;
    }
    .datepicker-dropdown.datepicker-orient-top:before
    {
        bottom: -7px;

        border-top: 7px solid white;
        border-bottom: 0;
    }
    .datepicker-dropdown.datepicker-orient-top:after
    {
        bottom: -6px;

        border-top: 6px solid #fff;
        border-bottom: 0;
    }
    .datepicker table
    {
        margin: 0;

        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;

        -webkit-touch-callout: none;
    }
    .datepicker table tr td
    {
        border-radius: 50%;
    }
    .datepicker table tr th
    {
        font-weight: 500;

        border-radius: .25rem;
    }
    .datepicker table tr td,
    .datepicker table tr th
    {
        font-size: .875rem;

        width: 36px;
        height: 36px;

        transition: all .15s ease;
        text-align: center;

        border: none;
    }
    .table-striped .datepicker table tr td,
    .table-striped .datepicker table tr th
    {
        background-color: transparent;
    }
    .datepicker table tr td.old,
    .datepicker table tr td.new
    {
        color: #adb5bd;
    }
    .datepicker table tr td.day:hover,
    .datepicker table tr td.focused
    {
        cursor: pointer;

        background: white;
    }
    .datepicker table tr td.disabled,
    .datepicker table tr td.disabled:hover
    {
        cursor: default;

        color: #dee2e6;
        background: none;
    }
    .datepicker table tr td.highlighted
    {
        border-radius: 0;
    }
    .datepicker table tr td.highlighted.focused
    {
        background: #546FF7;
    }
    .datepicker table tr td.highlighted.disabled,
    .datepicker table tr td.highlighted.disabled:active
    {
        color: #ced4da;
        background: #546FF7;
    }
    .datepicker table tr td.today
    {
        background: white;
    }
    .datepicker table tr td.today.focused
    {
        background: white;
    }
    .datepicker table tr td.today.disabled,
    .datepicker table tr td.today.disabled:active
    {
        color: #8898aa;
        background: white;
    }
    .datepicker table tr td.range
    {
        color: #fff;
        border-radius: 0;
        background: #546FF7;
    }
    .datepicker table tr td.range.focused
    {
        background: #3b53de;
    }
    .datepicker table tr td.range.disabled,
    .datepicker table tr td.range.disabled:active,
    .datepicker table tr td.range.day.disabled:hover
    {
        color: #8a98eb;
        background: #324cdd;
    }
    .datepicker table tr td.range.highlighted.focused
    {
        background: #cbd3da;
    }
    .datepicker table tr td.range.highlighted.disabled,
    .datepicker table tr td.range.highlighted.disabled:active
    {
        color: #dee2e6;
        background: #e9ecef;
    }
    .datepicker table tr td.range.today.disabled,
    .datepicker table tr td.range.today.disabled:active
    {
        color: #fff;
        background: #546FF7;
    }
    .datepicker table tr td.day.range-start
    {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .datepicker table tr td.day.range-end
    {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .datepicker table tr td.day.range-start.range-end
    {
        border-radius: 50%;
    }
    .datepicker table tr td.selected,
    .datepicker table tr td.selected.highlighted,
    .datepicker table tr td.selected:hover,
    .datepicker table tr td.selected.highlighted:hover,
    .datepicker table tr td.day.range:hover
    {
        color: #fff;
        background: #546FF7;
    }
    .datepicker table tr td.active,
    .datepicker table tr td.active.highlighted,
    .datepicker table tr td.active:hover,
    .datepicker table tr td.active.highlighted:hover
    {
        color: #fff;
        background: #546FF7;
        box-shadow: none;
    }
    .datepicker table tr td span
    {
        line-height: 54px;

        display: block;
        float: left;

        width: 23%;
        height: 54px;
        margin: 1%;

        cursor: pointer;

        border-radius: 4px;
    }
    .datepicker table tr td span:hover,
    .datepicker table tr td span.focused
    {
        background: #e9ecef;
    }
    .datepicker table tr td span.disabled,
    .datepicker table tr td span.disabled:hover
    {
        cursor: default;

        color: #dee2e6;
        background: none;
    }
    .datepicker table tr td span.active,
    .datepicker table tr td span.active:hover,
    .datepicker table tr td span.active.disabled,
    .datepicker table tr td span.active.disabled:hover
    {
        text-shadow: 0 -1px 0 rgba(0, 0, 0, .25);
    }
    .datepicker table tr td span.old,
    .datepicker table tr td span.new
    {
        color: #8898aa;
    }
    .datepicker .datepicker-switch
    {
        width: 145px;
    }
    .datepicker .datepicker-switch,
    .datepicker .prev,
    .datepicker .next,
    .datepicker tfoot tr th
    {
        cursor: pointer;
    }
    .datepicker .datepicker-switch:hover,
    .datepicker .prev:hover,
    .datepicker .next:hover,
    .datepicker tfoot tr th:hover
    {
        background: #e9ecef;
    }
    .datepicker .prev.disabled,
    .datepicker .next.disabled
    {
        visibility: hidden;
    }
    .datepicker .cw
    {
        font-size: 10px;

        width: 12px;
        padding: 0 2px 0 5px;

        vertical-align: middle;
    }

    .headroom
    {
        transition: all .15s ease;

        background-color: inherit;

        will-change: transform;
    }
    @media screen and (prefers-reduced-motion: reduce)
    {
        .headroom
        {
            transition: none;
        }
    }

    .headroom--pinned
    {
        transform: translateY(0%);
    }

    .headroom--unpinned
    {
        transform: translateY(-100%);
    }

    .headroom--not-top
    {
        padding-top: .5rem;
        padding-bottom: .5rem;

        background-color: #172b4d !important;
        box-shadow: 0 1px 10px rgba(130, 130, 134, .1);
    }

    .noUi-target,
    .noUi-target *
    {
        box-sizing: border-box;

        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;

        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        touch-action: none;
    }

    .noUi-target
    {
        position: relative;

        direction: ltr;
    }

    .noUi-base,
    .noUi-connects
    {
        position: relative;
        z-index: 1;

        width: 100%;
        height: 100%;
    }

    /* Wrapper for all connect elements.
     */
    .noUi-connects
    {
        z-index: 0;

        overflow: hidden;
    }

    .noUi-connect,
    .noUi-origin
    {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        transform-origin: 0 0;

        will-change: transform;
    }

    html:not([dir='rtl']) .noUi-horizontal .noUi-origin
    {
        right: 0;
        left: auto;
    }

    .noUi-vertical .noUi-origin
    {
        width: 0;
    }

    .noUi-horizontal .noUi-origin
    {
        height: 0;
    }

    .noUi-handle
    {
        position: absolute;
    }

    .noUi-state-tap .noUi-connect,
    .noUi-state-tap .noUi-origin
    {
        transition: transform .3s;
    }

    .noUi-state-drag *
    {
        cursor: inherit !important;
    }

    .noUi-horizontal
    {
        height: 5px;
    }

    .noUi-horizontal .noUi-handle
    {
        top: -6px;
        left: -17px;

        width: 34px;
        height: 28px;
    }

    .noUi-vertical
    {
        width: 5px;
    }

    .noUi-vertical .noUi-handle
    {
        top: -17px;
        left: -6px;

        width: 28px;
        height: 34px;
    }

    html:not([dir='rtl']) .noUi-horizontal .noUi-handle
    {
        right: -17px;
        left: auto;
    }

    .noUi-connects
    {
        border-radius: 3px;
    }

    .noUi-connect
    {
        background: #546FF7;
    }

    .noUi-draggable
    {
        cursor: ew-resize;
    }

    .noUi-vertical .noUi-draggable
    {
        cursor: ns-resize;
    }

    .noUi-handle
    {
        cursor: default;

        border: 1px solid #d9d9d9;
        border-radius: 3px;
        outline: none;
        background: #fff;
        box-shadow: inset 0 0 1px #fff, inset 0 1px 7px #ebebeb, 0 3px 6px -3px #bbb;
    }

    .noUi-active
    {
        outline: none;
    }

    /* Disabled state;
     */
    [disabled] .noUi-connect
    {
        background: #b8b8b8;
    }

    [disabled].noUi-target,
    [disabled].noUi-handle,
    [disabled] .noUi-handle
    {
        cursor: not-allowed;
    }

    /* Base;
     *
     */
    .noUi-pips,
    .noUi-pips *
    {
        box-sizing: border-box;
    }

    .noUi-pips
    {
        position: absolute;

        color: #999;
    }

    /* Values;
     *
     */
    .noUi-value
    {
        position: absolute;

        text-align: center;
        white-space: nowrap;
    }

    .noUi-value-sub
    {
        font-size: 10px;

        color: #ccc;
    }

    /* Markings;
     *
     */
    .noUi-marker
    {
        position: absolute;

        background: #ccc;
    }

    .noUi-marker-sub
    {
        background: #aaa;
    }

    .noUi-marker-large
    {
        background: #aaa;
    }

    /* Horizontal layout;
     *
     */
    .noUi-pips-horizontal
    {
        top: 100%;
        left: 0;

        width: 100%;
        height: 80px;
        padding: 10px 0;
    }

    .noUi-value-horizontal
    {
        transform: translate(-50%, 50%);
    }

    .noUi-rtl .noUi-value-horizontal
    {
        transform: translate(50%, 50%);
    }

    .noUi-marker-horizontal.noUi-marker
    {
        width: 2px;
        height: 5px;
        margin-left: -1px;
    }

    .noUi-marker-horizontal.noUi-marker-sub
    {
        height: 10px;
    }

    .noUi-marker-horizontal.noUi-marker-large
    {
        height: 15px;
    }

    /* Vertical layout;
     *
     */
    .noUi-pips-vertical
    {
        top: 0;
        left: 100%;

        height: 100%;
        padding: 0 10px;
    }

    .noUi-value-vertical
    {
        padding-left: 25px;

        transform: translate(0, -50%, 0);
    }

    .noUi-rtl .noUi-value-vertical
    {
        transform: translate(0, 50%);
    }

    .noUi-marker-vertical.noUi-marker
    {
        width: 5px;
        height: 2px;
        margin-top: -1px;
    }

    .noUi-marker-vertical.noUi-marker-sub
    {
        width: 10px;
    }

    .noUi-marker-vertical.noUi-marker-large
    {
        width: 15px;
    }

    .noUi-tooltip
    {
        position: absolute;

        display: block;

        padding: 5px;

        text-align: center;
        white-space: nowrap;

        color: #000;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        background: #fff;
    }

    .noUi-horizontal .noUi-tooltip
    {
        bottom: 120%;
        left: 50%;

        transform: translate(-50%, 0);
    }

    .noUi-vertical .noUi-tooltip
    {
        top: 50%;
        right: 120%;

        transform: translate(0, -50%);
    }

    .noUi-target
    {
        margin: 15px 0;

        cursor: pointer;

        border: 0;
        border-radius: 5px;
        background: #eceeef;
        box-shadow: inset 0 1px 2px rgba(90, 97, 105, .1);
    }

    .noUi-horizontal
    {
        height: 5px;
    }

html:not([dir='rtl']) .noUi-horizontal .noUi-handle
{
    right: -10px;
}

.noUi-vertical
{
    width: 5px;
}

.noUi-connect
{
    background: #546FF7;
    box-shadow: none;
}

.noUi-horizontal .noUi-handle,
.noUi-vertical .noUi-handle
{
    top: -5px;

    width: 15px;
    height: 15px;

    cursor: pointer;
    transition: box-shadow .15s, transform .15s;

    border: 0;
    border-radius: 100%;
    background-color: #546FF7;
    box-shadow: none;
}

.noUi-horizontal .noUi-handle.noUi-active,
.noUi-vertical .noUi-handle.noUi-active
{
    transform: scale(1.2);
}

.input-slider--cyan .noUi-connect
{
    background: #2bffc6;
}

.input-slider--cyan.noUi-horizontal .noUi-handle,
.input-slider--cyan.noUi-vertical .noUi-handle
{
    background-color: #2bffc6;
}

.input-slider--red .noUi-connect
{
    background: #f5365c;
}

.input-slider--red.noUi-horizontal .noUi-handle,
.input-slider--red.noUi-vertical .noUi-handle
{
    background-color: #f5365c;
}

.input-slider--green .noUi-connect
{
    background: #2dce89;
}

.input-slider--green.noUi-horizontal .noUi-handle,
.input-slider--green.noUi-vertical .noUi-handle
{
    background-color: #2dce89;
}

.input-slider--yellow .noUi-connect
{
    background: #ffd600;
}

.input-slider--yellow.noUi-horizontal .noUi-handle,
.input-slider--yellow.noUi-vertical .noUi-handle
{
    background-color: #ffd600;
}

.input-slider--pink .noUi-connect
{
    background: #f3a4b5;
}

.input-slider--pink.noUi-horizontal .noUi-handle,
.input-slider--pink.noUi-vertical .noUi-handle
{
    background-color: #f3a4b5;
}

/* Disabled state */
[disabled] .noUi-connect,
[disabled].noUi-connect
{
    background: #b2b2b2;
}

[disabled] .noUi-handle,
[disabled].noUi-origin
{
    cursor: not-allowed;
}

.range-slider-value
{
    font-size: .75rem;
    font-weight: 500;

    padding: .4em .8em .3em .85em;

    color: #fff;
    border-radius: 10px;
    background-color: rgba(33, 37, 41, .7);
}

.range-slider-wrapper .upper-info
{
    font-weight: 400;

    margin-bottom: 5px;
}

.input-slider-value-output
{
    font-size: 11px;

    position: relative;
    top: 12px;

    padding: 4px 8px;

    color: #fff;
    border-radius: 2px;
    background: #333;
}

.input-slider-value-output:after
{
    position: absolute;
    bottom: 100%;
    left: 10px;

    width: 0;
    height: 0;
    margin-left: -4px;

    content: ' ';
    pointer-events: none;

    border: solid transparent;
    border-width: 4px;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #333;
}

.input-slider-value-output.left:after
{
    right: auto;
    left: 10px;
}

.input-slider-value-output.right:after
{
    right: 10px;
    left: auto;
}


.main-screen{
    position: absolute;
    right: 0;
    z-index: 2;
    top: -30px;
}

    `}} />;
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (

      <div className="content-for-wallet position-relative">
        { this.showCSS }
        <div className="position-relative">
          <section className="section section-mg section-shaped">
            <div className="shape shape-style-1 shape-default">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="container py-lg-md d-flex">
              <div className="col px-0">
                <div className="row">
                  <div className="col-lg-6">
                  <Fade left>
                    <h1 className="display-3 text-white">Ninja Wallet</h1>
                    <p className="text-white">No downloads. No signups. No fees.<br/>A decentralized cryptocurrency wallet that lets you stay 100% anonymous.</p>
                    <p className="text-white">Open <a className="text-info" href="https://ninja.org/wallet">ninja.org/wallet</a> on your mobile browser <br />to access Ninja Wallet</p>
                    <div className="btn-wrapper">
                      { this.state.isSubscribed ? <div className="bg card bg-success p-4 text-center">Thank you for subscribing!</div> : this.renderEmailForm() }
                    </div>
                  </Fade>
                  </div>
                  <div className="col-lg-6 main-screen text-center">
                    <Flip right><img width="300" src={imgIPHONE} /></Flip>
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
              </svg>
            </div>
          </section>
        </div>

        <section className="section section-lg   section-nucleo-icons pb-50">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-6 order-md-2">
              <Zoom right>
                <div className="icons-container mt-5 on-screen" data-toggle="on-screen">
                  <i className="icon floating"><img src={imgBTC} /></i>
                  <i className="icon floating"><img src={imgXRP} /></i>
                  <i className="icon floating"><img src={imgETH} /></i>
                  <i className="icon floating"><img src={imgZEC} /></i>
                  <i className="icon floating"><img src={imgLTC} /></i>
                </div>
              </Zoom>
              </div>
              <div className="col-md-6 order-md-1">
                <Slide bottom>
                <div className="pr-md-5">
                  <h3>Hold multiple cryptocurrencies with a decentralized wallet </h3>
                  <p>Ninja Wallet - free, no downloads, no sign ups, and no KYC. Allowing users to remain 100% anonymous, with all transactions secured on the blockchain.</p>
                  <p>It currently supports BTC, ETH, BCH, ERC20 tokens, and ERC721 collectibles such as CryptoKitties, CryptoStrikers, CryptoPunks. The currencies XRP, ZEC, LTC… and more will be added soon.</p>
                </div>
                </Slide>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-secondary pt-lg pb-lg">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-7 transform-perspective-left">
              < Flip left><img src={imgPromo1} className="img-fluid" /></ Flip>
              </div>
              <div className="col-md-5">
              <Slide bottom>
                <div className="pl-md-5">
                  <h3>Multiple wallets </h3>
                  <p>Quickly create, import and manage personal, business and testnet wallets in one secure location.</p>
                  <p>We use hierarchical deterministic (HD) address generation for secure in-app wallet generation and back up.</p>
                </div>
                </Slide>
              </div>
            </div>
          </div>
        </section>
        <section className="section pb-lg bg-gradient-default">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-6 order-lg-2 ml-lg-auto">
                <div className="position-relative pl-md-5">
                  <Zoom bottom><img src={img1} className="img-fluid" /></Zoom>
                </div>
              </div>
              <div className="col-lg-6 order-lg-1  pb-100">
                <div className="d-flex">
                <Slide top>
                  <div className="">
                    <h4 className="display-3 text-white">All storage is on your device</h4>
                    <p className="text-white">We want to ensure that our customers have a secure and private experience when using our wallet. That is why we don’t store any of your personal information, private keys, or data on our servers.</p>
                  </div>
                  </Slide>
                </div>

                <Slide top>
                <div className="card shadow shadow-lg--hover mt-5">
                  <div className="card-body">
                    <div className="d-flex px-3">
                      <div>
                        <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                          <img src={imgLock} width="16px" />
                        </div>
                      </div>
                      <div className="pl-4">
                        <p>Ninja Wallet uses device-based security. All private keys are stored locally on your device.</p>
                      </div>
                    </div>
                  </div>
                </div>
                </Slide>
              </div>
            </div>
          </div>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-150 pb-150">
          <div className="container">
          <LightSpeed bottom cascade>
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="display-3">Don’t forget to backup your wallet</h2>
                <p className="lead text-muted">Keep your cryptocurrencies and crypto assets safe and make sure you backup your Ninja Wallet as soon as you create one.</p>
                <div className="btn-wrapper">
                  <a target="_blank" href="https://medium.com/@ninja_org/ninja-wallet-101-d7e3c27c52e6" className="btn btn-primary mb-3 mb-sm-0">Learn how to backup your wallet</a>
                </div>
              </div>
            </div>
            </LightSpeed>
          </div>
        </section>
        <section className="section section-lg bg-gradient-warning pt-150 pb-150">
          <div className="container pb-50">
            <div className="row text-center justify-content-center">
              <Slide bottom cascade>
              <div className="col-lg-10">
                <h2 className="display-3 text-white">More features of Ninja Wallet</h2>


                <ul className="list-unstyled offset-md-2">
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Backup and restore wallet using standard BIP39 recovery phrases</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Payment gateway by Cryptocurrency </h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle ">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Configure gas price, gas</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle ">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Push notifications</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">20+ currency conversion rates</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Paper wallet sweep import</h6>
                        </div>
                      </div>
                    </li>
                  </ul>
              </div>
              </Slide>
            </div>
          </div>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>
      </div>
    )
  }
}

ContentForWallet.propTypes = {};

export default injectIntl(ContentForWallet);
