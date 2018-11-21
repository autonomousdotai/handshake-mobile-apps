import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@/guru/components/AppBar/AppBar';

const backAction = (history) => (history.go(-1));

const BetAppBar = ({ history }) => {
  return (
    <AppBar>
      <span className="IconLeft BackAction" onClick={() => backAction(history)} >
        <i className="far fa-angle-left" />
      </span>
      <span className="Title">Place a bet</span>
    </AppBar>
  );
};

BetAppBar.propTypes = {
  history: PropTypes.object.isRequired
};

export default BetAppBar;
