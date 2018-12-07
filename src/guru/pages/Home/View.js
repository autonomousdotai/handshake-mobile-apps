import React from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
import CardList from './CardList';
import Disclaimer from './Disclaimer';
import EmailSubscribe from './EmailSubscribe';
import ReportNotice from './ReportNotice';

const relatedMatches = (props) => {
  if (!props.relatedMatches) return null;
  return (
    <React.Fragment>
      <div className="RelatedMatches">
        Events related to this event:
      </div>
      <CardList {...props} eventList={props.relatedMatches} />
    </React.Fragment>
  );
};

const viewAllMatches = ({ matchParam }) => {
  if (!matchParam) return null;
  return (
    <Link to={URL.HANDSHAKE_PREDICTION} className="ViewAllMatches">
      View All Events
    </Link>
  );
};

const View = (props) => {
  const htmlClassName = 'HomeGuruContainer';
  return (
    <div className={htmlClassName}>
      <CardList {...props} />
      {relatedMatches(props)}
      {viewAllMatches(props)}
      <Disclaimer />
      <EmailSubscribe {...props} />
      <ReportNotice {...props} />
    </div>
  );
};

export default View;
