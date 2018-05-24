import React from 'react';
import PropTypes from 'prop-types';
import CreatePromise from './Promise';
import CreateContract from './Contract';
import CreateBetting from './Betting';

export const maps = [
  { name: 'Promise', component: CreatePromise },
  { name: 'Betting', component: CreateBetting },
  { name: 'Contract', component: CreateContract },
];

class CreateItems extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    const seleted = maps[this.props.id];
    this.state = { Component: seleted.component };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.id !== prevState.id) {
      return { Component: maps[nextProps.id].component };
    }
  }

  render() {
    const { Component } = this.state;
    return <Component />;
  }
}

export default CreateItems;
