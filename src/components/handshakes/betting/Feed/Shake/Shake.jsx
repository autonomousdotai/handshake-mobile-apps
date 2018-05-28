import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";

// components
import { InputField } from '@/components/handshakes/betting/form/customField';
import Button from '@/components/core/controls/Button';

import './Shake.scss';

const nameFormBettingShake = 'bettingShakeForm';
const BettingShakeForm = createForm({
  propsReduxForm: {
    form: nameFormBettingShake,
  },
});

const defaultAmount = 1;

class BetingShake extends React.Component {
  static propTypes = {
    remaining: PropTypes.number.isRequired,
    odd: PropTypes.number.isRequired,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
  }

  static defaultProps = {
    remaining: 10
  }

  constructor(props) {
    super(props);
    const {odd} = props;
    this.state = {
      amount: defaultAmount,
      total: defaultAmount * odd,
    };

    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
  }

  onSubmit(values) {
    console.log("Submit");
    const {amount} = this.state;
    this.props.onSubmitClick(amount);
  }

  onCancel() {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  updateTotal(value) {
    console.log('value:', value);
    if (!!value) {
      const { odd } = this.props;
      const amount = value * odd;
      this.setState({
        amount: value,
        total: amount.toFixed(4),
      })
    }
  }

  renderInputField(props) {
    const {
      label,
      className,
      id,
      cryptoCurrency = 'ETH',
      isShowCurrency = true,
      type = 'text',
      value,
      isInput = true,
      ...newProps
    } = props;

    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <Field
              component={InputField}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              {...newProps}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowCurrency && <div className="cryptoCurrency">{cryptoCurrency}</div>
        }
      </div>
    )
  }

  renderForm() {
    const { total } = this.state;
    const { remaining, odd } = this.props;
    const odds = `1 : ${odd}`;

    const formFieldData = [
      {
        id: 'you_bet',
        name: 'you_bet',
        label: 'You bet',
        key: 1,
        defaultValue: '1',
        onChange: (evt) => this.updateTotal(parseFloat(evt.target.value)),
      },
      {
        id: 'at_odds',
        name: 'at_odds',
        label: 'At odds',
        isInput: false,
        value: odds,
        className: 'atOdds',
        isShowCurrency: false,
        key: 2,
      },
      {
        id: 'remaining',
        name: 'remaining',
        label: 'Remaining',
        isInput: false,
        value: remaining,
        key: 3,
      },
    ];

    const youCouldWinField = {
      id: 'you_could_win',
      name: 'you_could_win',
      label: 'You could win',
      className: 'total',
      isInput: false,
      value: total || 0,
      readOnly: true,
    };

    return (
      <BettingShakeForm className="wrapperBettingShake" onSubmit={this.onSubmit}>
        {formFieldData.map(item => this.renderInputField(item))}
        <hr className="line" />
        {this.renderInputField(youCouldWinField)}

        <Button type="submit" block className="btnOK">
          OK
        </Button>
      </BettingShakeForm>
    );
  }

  render() {
    return this.renderForm();
  }
}

export default BetingShake;
