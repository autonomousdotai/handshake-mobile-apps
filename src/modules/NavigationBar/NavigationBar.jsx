import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import MultiLanguage from '@/components/core/controls/MultiLanguage';
import Image from '@/components/core/presentation/Image';
import { URL } from '@/constants';

import predictionIcon from '@/assets/images/categories/chip.svg';
import cashIcon from '@/assets/images/categories/exchange.svg';
import ScrollableList from '@/components/ScrollableList/ScrollableList';

import './NavigationBar.scss';

export default class NavigationBar extends Component {
  static displayName = 'NavigationBar';
  static propTypes = {
    classNames: PropTypes.string,
  };
  static defaultProps = {
    classNames: '',
  }

  buildMenuData = () => {
    return [
      {
        id: 'prediction',
        name: 'prediction',
        icon: predictionIcon,
        url: URL.HANDSHAKE_PREDICTION,
        position: 1,
      },
      {
        id: 'cash',
        name: 'cash',
        icon: cashIcon,
        url: URL.HANDSHAKE_ATM,
        position: 2,
      },
      // {
      //   id: 'swap',
      //   name: 'swap',
      //   icon: null,
      //   url: 'swap',
      //   position: 3,
      // },
    ].sort((a, b) => a.position - b.position);
  }

  renderLanguageDropDown = () => {
    return (
      <div className="LanguageSelector">
        <MultiLanguage />
      </div>
    );
  }

  renderMenuItem = (item) => {
    const { selectedMenuId, onClickMenuItem } = this.props;
    return (
      <div className="NavigationBarItem" key={item.id}>
        <div
          // to={item.url}
          // activeClassName="Active"
          onClick={() => onClickMenuItem(item.url)}
          className={item.url === selectedMenuId ? 'Active' : ''}
        >
          {item.icon && <Image src={item.icon} alt={item.name} />}
          <span>{item.name}</span>
        </div>
      </div>
    );
  }

  renderMenuList = () => {
    return (
      <ScrollableList
        className="NavigationBarList"
        data={this.buildMenuData()}
        itemRenderer={this.renderMenuItem}
      />
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(NavigationBar.displayName, {
      [props.classNames]: !!props.classNames,
    });

    return (
      <div className={cls}>
        {this.renderMenuList(props, state)}
        {this.renderLanguageDropDown(props, state)}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}
