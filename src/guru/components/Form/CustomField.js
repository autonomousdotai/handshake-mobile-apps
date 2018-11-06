/* eslint-disable react/prop-types */
import React from 'react';
import cx from 'classnames';
import CreatableSelect from 'react-select/lib/Creatable';
import RangeSlider from '@/guru/components/Form/RangeSlider';

function renderReselect(props) {
  return (
    <CreatableSelect
      classNamePrefix="react-select"
      {...props.field}
      onChange={option => props.form.setFieldValue(props.field.name, option)}
      isClearable
      placeholder={props.placeholder}
      options={props.options}
      isDisabled={props.disabled}
    />
  );
}

function rangeSlider(props) {
  return (
    <RangeSlider
      options={props.options}
      {...props.field}
      form={props.form}
    />
  );
}

function fieldByType(props) {
  switch (props.type) {
    case 'reselect':
      return renderReselect(props);
    case 'rangeSlider':
      return rangeSlider(props);
    default:
      throw Error('type is required');
  }
}

export default function CustomField(props) {
  const {
    className,
    field, // { name, value, onChange, onBlur }
    form: { touched, errors } // values, setXX, handleXX, dirty, isValid, status, etc.
  } = props;

  const cls = cx(className, {
    'form-error': touched && errors
  });

  return (
    <div className={cls}>
      {fieldByType(props)}
      {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </div>
  );
}
