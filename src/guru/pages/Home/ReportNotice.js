import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

const ReportNotice = ({ countReport }) => {
  if (!countReport) return null;
  return (
    <div className="ReportNotice">
      <span>You had a private event.</span>
      <Link
        to={{ pathname: URL.REPORT }}
        className="btn btn-report"
      >
        Fill us in
      </Link>
    </div>
  );
};

ReportNotice.propTypes = {
  countReport: PropTypes.number
};

ReportNotice.defaultProps = {
  countReport: 0
};

export default ReportNotice;
