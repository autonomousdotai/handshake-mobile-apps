import React, { Component } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import createForm from '@/components/core/form/createForm';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fieldInput, fieldTextArea } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import './styles.scss';

const COMPONENT_NAME = 'codForm';
const scopedCss = (className) => `${COMPONENT_NAME}-${className}`;

const FormCod = createForm({
  propsReduxForm: {
    form: COMPONENT_NAME,
  },
});

class CodForm extends Component {
  constructor() {
    super();
    this.onSubmit = :: this.onSubmit;
  }

  onSubmit() {
    console.log('Submited!');
  }

  render() {
    const { intl: { messages } } = this.props;
    return (
      <div className={scopedCss('container')}>
        <div className={scopedCss('title')}>
          <span>{messages.create.cod_form.cod}</span>
        </div>
        <FormCod onSubmit={this.onSubmit} className={scopedCss('form')}>
          <Field
            type="text"
            className="form-control input-field"
            name="address"
            placeholder={messages.create.cod_form.your_address}
            component={fieldInput}
            validate={[required]}
          />
          <Field
            type="text"
            className="form-control input-field"
            placeholder={messages.create.cod_form.time_note}
            name="noteAndTime"
            component={fieldTextArea}
            validate={[required]}
          />
          <ConfirmButton
            label={messages.create.cod_form.buy_btn}
            buttonClassName={scopedCss('buy-btn')}
            containerClassName={scopedCss('buy-btn-container')}
          />
        </FormCod>
      </div>
    );
  }
}

CodForm.propTypes = {
  intl: PropTypes.object.isRequired,
};
export default injectIntl(connect(null, null)(CodForm));
