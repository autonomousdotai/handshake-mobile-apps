import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

const scopeCss = (className) => `internal-admin-sidebar-${className}`;

export default class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      selectedId: null,
      show: false,
    };
  }

  componentWillMount() {
    this.props.selectedMenuId && this.setState({ selectedId: this.props.selectedMenuId });
  }
  onMenuSelect = (idMenu) => {
    this.setState({ selectedId: idMenu });
    const { onMenuSelect } = this.props;
    if (typeof onMenuSelect === 'function') {
      onMenuSelect(idMenu);
    }
  }

  toggle = (forceShow = !this.state.show) => {
    this.setState({ show: forceShow });
  }

  renderMenu = () => {
    const { menus } = this.props;
    const { selectedId } = this.state;
    return Object.entries(menus || {}).map(([id, menu]) => (
      <div key={id} onClick={() => this.onMenuSelect(id)} className={`${scopeCss('item')} ${selectedId === id ? 'selected' : ''}`}>
        <span>{menu?.name}</span>
      </div>
    ));
  }

  renderExpanded = () => {
    const { show } = this.state;
    return (
      <React.Fragment>
        <div className={`${scopeCss('sidebar')} ${show ? 'expanded' : ''}`}>
          <div className={scopeCss('header')}>Admin Dashboard</div>
          <div className={scopeCss('body')}>{this.renderMenu()}</div>
        </div>
        <div className={show ? scopeCss('overlay') : ''} onClick={() => this.toggle(false)} />
      </React.Fragment>
    );
  }

  renderCollapse = () => {
    return (
      <div className={scopeCss('collapse-icon')} onClick={() => this.toggle(true)}>{`Open Menu >`}</div>
    );
  }

  render() {
    const { show } = this.state;
    return (
      <div className={scopeCss('container')}>
        {!show && this.renderCollapse()}
        {this.renderExpanded()}
      </div>
    );
  }
}

Sidebar.defaultProps = {
  onMenuSelect: null,
  selectedMenuId: null,
};

Sidebar.propTypes = {
  menus: PropTypes.object.isRequired,
  onMenuSelect: PropTypes.func,
  selectedMenuId: PropTypes.string,
};
