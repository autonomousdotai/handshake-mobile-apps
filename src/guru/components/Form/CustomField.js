/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';
import CreatableSelect from 'react-select/lib/Creatable';

function renderReselect(props) {
  const { name, value, onChange } = props.field;
  return (
    <CreatableSelect
      classNamePrefix="react-select"
      name={name}
      value={value}
      onChange={onChange}
      isClearable
      placeholder={props.placeholder}
      options={props.data}
      isDisabled={props.disabled}
      getOptionLabel={props.getOptionLabel}
      getOptionValue={props.getOptionValue}
    />
  );
}

function fieldByType(props) {
  switch (props.type) {
    case 'reselect':
      return renderReselect(props);
    default:
      throw Error('type is required');
  }
}

export default function CustomField(props) {
  const {
    label,
    className,
    field, // { name, value, onChange, onBlur }
    form: { touched, errors } // values, setXX, handleXX, dirty, isValid, status, etc.
  } = props;

  const cls = cx(className, {
    'form-error': touched && errors,
    // 'form-warning': touched && warning,
    // 'async-validating': asyncValidating
  });

  return (
    <div className={cls}>
      {label && <label>{label}</label>}
      {fieldByType(props)}
      {touched[field.name] &&
        errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </div>
  );
}
