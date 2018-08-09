import React from 'react';
import className from 'classnames';
import PropTypes from "prop-types";
import EventItem from "../../pages/Prediction/EventItem";


const renderField = ({ input, label, type, placeholder, className, meta: { touched, error } }) => (
  <div className={className}>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={placeholder} />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

function CustomField(props) {
    return (
      <div className={className}>

      </div>
    );
}


CustomField.propTypes = {
  className: PropTypes.string,
};

CustomField.defaultProps = {
  className: '',
};

export default CustomField;
