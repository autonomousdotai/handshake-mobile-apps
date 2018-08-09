/* eslint react/prop-types: 0 */
/* eslint import/prefer-default-export: 0 */

import React from 'react';
import classNames from 'classnames';

export const renderField = (props) => {
  const {
    input,
    label,
    type,
    placeholder,
    className,
    fieldClass,
    disabled,
    meta: { touched, error, warning },
  } = props;

  const cls = classNames(className, {
    'form-error': touched && error,
    'form-warning': touched && warning,
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      <input
        {...input}
        className={fieldClass}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
      />
      {touched && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
    </div>
  );
};
