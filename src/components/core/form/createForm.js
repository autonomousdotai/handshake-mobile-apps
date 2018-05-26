import React from 'react';
import { reduxForm } from 'redux-form';

const Form = (props) => {
  const { handleSubmit, children, className = '' } = props;
  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
};

export default ({ propsReduxForm }) => reduxForm(propsReduxForm)(Form);
