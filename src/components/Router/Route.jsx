import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';
import Loading from './Loading';

class AppRoute extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { Component: Loading };
  }

  componentDidMount() {
    this.fetch(this.props.component);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path !== this.props.path) {
      this.fetch(nextProps.component);
    }
  }

  fetch(component) {
    component().then((Component) => {
      this.setState({ Component: Component.default });
    });
  }

  render() {
    return <Route component={this.state.Component} />;
  }
}

export default AppRoute;
