import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage } from 'formik';

export default function ErrMsg(props) {
  return (
    <ErrorMessage name={props.name}>
      {msg => <div className={ErrMsg.displayName}>{msg}</div>}
    </ErrorMessage>
  );
}
ErrMsg.displayName = 'ErrMsg';
ErrMsg.propTypes = {
  name: PropTypes.string.isRequired
};
