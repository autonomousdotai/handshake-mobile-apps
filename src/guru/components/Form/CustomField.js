/* eslint-disable react/prop-types */
import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { RangeSlider } from '@/guru/components/Form';

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

export default function CustomField(props) {
  switch (props.type) {
    case 'reselect':
      return renderReselect(props);
    case 'rangeSlider':
      return rangeSlider(props);
    default:
      throw Error('type is required');
  }
}
