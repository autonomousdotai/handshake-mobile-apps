/* eslint react/prop-types:0 */
import React from 'react';
import ExtraInfo from '@/components/handshakes/exchange/components/ExtraInfo';
import { PAYMENT_METHODS } from '../../BuyCryptoCoin';
import './styles.scss';

const paymentMethodCheckbox = ({ input, name, titles, items, extraInfo, disabled = false }) => {
  const { onChange, value } = input;
  return (
    <div className="payment-method-field-container" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(items).map(([key, itemValue]) => {
        const label = titles[itemValue];
        return (
          <div key={key} className="payment-method-item">
            <label className="radio-inline payment-method-field-radio-container">
              <input
                value={itemValue}
                type="radio"
                name={name}
                checked={value === itemValue}
                onChange={() => null}
                disabled={disabled}
              />
              <span className={`checkmark ${disabled && value !== itemValue && 'disabled'}`} />
              <span className={`${disabled && value !== itemValue && 'disabled'}`}>{label}</span>
            </label>
            { extraInfo && itemValue === PAYMENT_METHODS.COD && <ExtraInfo info={extraInfo[itemValue]} className="payment-method-extra-info-cod" /> }
          </div>
        );
      })}
    </div>
  );
};

export default paymentMethodCheckbox;
