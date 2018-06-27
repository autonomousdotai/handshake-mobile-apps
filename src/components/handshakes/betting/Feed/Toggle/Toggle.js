import React from 'react';
import PropTypes from 'prop-types';

import './Toggle.scss';

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
    };
    this.active = 1;
    this.activeItem = {};
    this.onActive = ::this.onActive;
  }

  get value() {
    return this.active;
  }

  get sideName() {
    return this.activeItem.name || '';
  }

  onActive(item) {
    this.setState({ active: item.id });
    this.active = item.id;
    this.activeItem = item;
    const { onChange } = this.props;
    onChange && onChange(item.id);
  }

  render() {
    const { data } = this.props;
    const { active } = this.state;
    const renderToggle = data.map(item => (
      <div
        // className={`itemToggle ${(active === item.id && item.id === 2) ? 'btnBlue' : (active === item.id && item.id === 1) ? 'btnRed' : ''}`}
        className={`itemToggle ${(active === item.id && item.id === 1) ? 'btnBlue' : (active === item.id && item.id === 2) ? 'btnRed' : ''}`}

        key={item.id}
        onClick={(e) => { e && e.preventDefault(); this.onActive(item); }}
      >
        {item.name}
      </div>
    ));
    return (
      <div className="toggleShakeBetting">
        {renderToggle}
      </div>
    );
  }
}

Toggle.propTypes = {
  data: PropTypes.array,
};

Toggle.defaultProps = {
  data: [
    {
      id: 1,
      name: 'SUPPORT',
    },
    {
      id: 2,
      name: 'OPPOSE',
    },
  ],
};

export default Toggle;
