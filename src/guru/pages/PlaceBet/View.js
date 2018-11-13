import React from 'react';
import PropTypes from 'prop-types';
import BetInput from './BetInput';
import BetParams from './BetParams';

const View = ({ BetInputProps, BetParamsProps }) => {
  return (
    <div className="PlaceBetComponent">
      <BetInput {...BetInputProps} />
      <BetParams {...BetParamsProps} />
    </div>
  );
};

View.propTypes = {
  BetInputProps: PropTypes.object,
  BetParamsProps: PropTypes.object
};

View.defaultProps = {
  BetInputProps: {},
  BetParamsProps: {}
};

export default View;
