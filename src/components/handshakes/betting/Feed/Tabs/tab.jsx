import React from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

class Tab extends React.Component {
  static propTypes = {
    activeTab: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  handleTabClick = () => {
    const { label, onClick } = this.props;
    onClick(label);
  }

  render() {
    const { activeTab, label } = this.props;
    const classNames = className({
      TabItem: true,
      Active: (activeTab === label),
    }, this.props.className || '');

    return (
      <div className={classNames} onClick={this.handleTabClick}>
        {label}
      </div>
    );
  }
}

export default Tab;
