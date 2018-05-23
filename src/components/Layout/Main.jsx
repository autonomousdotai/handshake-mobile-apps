import React from 'react';
import PropTypes from 'prop-types';
import MainHeader from '@/components/Header/MainHeader';
import Navigation from '@/components/core/controls/Navigation/Navigation';

class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  }

  render() {
    return (
      <div className="app">
        <MainHeader />
        <div className="content">
          {this.props.children}
        </div>
        <Navigation />
      </div>
    );
  }
}

export default MainLayout;
