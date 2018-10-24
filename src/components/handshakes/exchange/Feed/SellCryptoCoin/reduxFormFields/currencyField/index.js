import React from 'react';

const renderFields = (fields) => (
  <div>
    <div className="input-row">
      <input {...fields.bankOwner.input} type="text" />
      {fields.bankOwner.meta.touched && fields.bankOwner.meta.error &&
        <span className="error">{fields.bankOwner.meta.error}</span>}
    </div>
    <div className="input-row">
      <input {...fields.bankName.input} type="text" />
      {fields.bankName.meta.touched && fields.bankName.meta.error &&
        <span className="error">{fields.bankName.meta.error}</span>}
    </div>
    <div className="input-row">
      <input {...fields.bankNumber.input} type="text" />
      {fields.bankNumber.meta.touched && fields.bankNumber.meta.error &&
        <span className="error">{fields.bankNumber.meta.error}</span>}
    </div>
    <div className="input-row">
      <input {...fields.phoneNumber.input} type="text" />
      {fields.phoneNumber.meta.touched && fields.phoneNumber.meta.error &&
        <span className="error">{fields.phoneNumber.meta.error}</span>}
    </div>
  </div>
);

export default renderFields;
