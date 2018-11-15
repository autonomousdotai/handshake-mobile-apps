import React from 'react';
import PropTypes from 'prop-types';
import BetAppBar from './BetAppBar';
import BetForm from './BetForm';
import BetParams from './BetParams';

const View = ({ history, betFormProps, betParamsProps }) => {
  return (
    <React.Fragment>
      <BetAppBar history={history} />
      <div className="PlaceBetComponent">
        <BetForm {...betFormProps} />
        <BetParams {...betParamsProps} />
      </div>
    </React.Fragment>
  );
};

View.propTypes = {
  history: PropTypes.object.isRequired,
  betFormProps: PropTypes.object,
  betParamsProps: PropTypes.object
};

View.defaultProps = {
  betFormProps: {},
  betParamsProps: {}
};

export default View;
