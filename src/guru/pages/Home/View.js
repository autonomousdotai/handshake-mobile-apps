import React from 'react';
import CardList from './CardList';
import Disclaimer from './Disclaimer';
import EmailSubscribe from './EmailSubscribe';
import ReportNotice from './ReportNotice';

const View = (props) => {
  const htmlClassName = 'HomeGuruContainer';
  return (
    <div className={htmlClassName}>
      <CardList {...props} />
      <Disclaimer />
      <EmailSubscribe {...props} />
      <ReportNotice {...props} />
    </div>
  );
};

export default View;
