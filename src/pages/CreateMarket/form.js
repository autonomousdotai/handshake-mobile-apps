/* eslint react/prop-types: 0 */
/* eslint import/prefer-default-export: 0 */

import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import RangeSlider from '@/components/RangeSlider/RangeSlider';
import CreatableSelect from 'react-select/lib/Creatable';

function selectControl(props) {
  const { name, value, onChange } = props.input;
  const finalValue = (typeof value === 'string' || typeof value === 'number')
    ? props.options.find(o => o.value === value) : value;
  return (
    <Select
      classNamePrefix="react-select"
      name={name}
      value={finalValue}
      onChange={onChange}
      placeholder={props.placeholder}
      isDisabled={props.disabled}
      options={props.options}
    />
  );
}

function creatableSelect(props) {
  const { name, value, onChange } = props.input;
  return (
    <CreatableSelect
      // className={props.className}
      classNamePrefix="react-select"
      name={name}
      value={value}
      onChange={onChange}
      isClearable
      placeholder={props.placeholder}
      options={props.dataSource}
      isDisabled={props.disabled}
      getOptionLabel={props.getOptionLabel}
      getOptionValue={props.getOptionValue}
    />
  );
}

function inputControl(props) {
  return (
    <input
      {...props.input}
      className={props.fieldClass}
      placeholder={props.placeholder}
      type={props.type}
      disabled={props.disabled}
    />
  );
}

function rangeSlider(props) {
  return (
    <RangeSlider
      {...props}
      value={props.input.value}
      onChange={props.input.onChange}
    />
  );
}

function renderByType(props) {
  switch (props.type) {
    case 'select':
      return selectControl(props);
    case 'creatableSelect':
      return creatableSelect(props);
    case 'rangeSlider':
      return rangeSlider(props);
    default:
      return inputControl(props);
  }
}

export const renderField = (props) => {
  const {
    label, className,
    meta: { touched, error, warning, asyncValidating },
  } = props;

  const cls = classNames(className, {
    'form-error': touched && error,
    'form-warning': touched && warning,
    'async-validating': asyncValidating,
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      {renderByType(props)}
      {touched && ((error && <span className="ErrorMsg">{error}</span>) || (warning && <span className="WarningMsg">{warning}</span>))}
    </div>
  );
};
