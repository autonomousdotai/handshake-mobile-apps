import React from 'react';
import CardList from './CardList';
import Disclaimer from './Disclaimer';

const View = (props) => {
  const htmlClassName = 'HomeGuruContainer';
  return (
    <div className={htmlClassName}>
      <CardList {...props} />
      <Disclaimer />
    </div>
  );
};

export default View;
