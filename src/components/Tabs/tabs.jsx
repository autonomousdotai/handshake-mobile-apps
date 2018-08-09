import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import Tab from './tab';

import './tabs.scss';

class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    htmlClassName: PropTypes.string,
    afterClick: PropTypes.func,
  }

  static defaultProps = {
    htmlClassName: '',
    afterClick: null,
  }

  state = {
    activeTab: this.props.children[0].props.label,
  };

  handleTabClick = (tab) => {
    const { afterClick } = this.props;
    this.setState({
      activeTab: tab,
    }, afterClick && this.props.afterClick(tab));
  }

  buildTabList = (props, state) => {
    const { children } = props;
    const { activeTab } = state;
    const tabList = children.map((child) => {
      const { label } = child.props;
      return (
        <Tab
          activeTab={activeTab}
          key={label}
          {...child.props}
          onClick={this.handleTabClick}
        />
      );
    });

    return (
      <div className="TabList">
        {tabList}
      </div>
    );
  }

  buildTabPanel = (props, state) => {
    const { children } = props;
    const { activeTab } = state;
    const tabPanel = children.map((child) => {
      if (child.props.label !== activeTab) return null;
      return child.props.children;
    });

    return (
      <div className="TabPanel">
        {tabPanel}
      </div>
    );
  }

  render() {
    const classNames = className({
      Tabs: true,
    }, this.props.htmlClassName);

    return (
      <div className={classNames}>
        {this.buildTabList(this.props, this.state)}
        {this.buildTabPanel(this.props, this.state)}
      </div>
    );
  }
}

export default Tabs;
