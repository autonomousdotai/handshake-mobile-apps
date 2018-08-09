import React, { Component } from 'react';
import classNames from 'classnames';
import ReactList from 'react-list';
import PropTypes from 'prop-types';

import './ScrollableList.scss';

class ScrollableList extends Component {
  static displayName = 'ScrollableList';
  static propTypes = {
    className: PropTypes.string,
    axis: PropTypes.string,
    data: PropTypes.array.isRequired,
    onClickItem: PropTypes.func,
    itemRenderer: PropTypes.func,
    selectedID: PropTypes.number,
    event: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    axis: 'x',
    itemRenderer: (i) => i,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedID: props.selectedID,
    };
  }

  onClickItem = (itemData, e, props) => {
    this.setState({
      selectedID: itemData.id,
    });
    if (props.onClickItem) {
      props.onClickItem(props, itemData);
    }
  }

  buildItem = (index, key, props, state) => {
    const itemData = props.data[index];
    const cls = classNames('ScrollableItem', {
      Selected: state.selectedID === itemData.id,
    });
    if (!itemData.id && itemData.id !== 0) {
      console.error('Item need to have an id');
    }

    return (
      <div
        className={cls}
        key={itemData.id}
        onClick={(e) => this.onClickItem(itemData, e, props)}
      >
        {props.itemRenderer(itemData)}
      </div>
    );
  }

  renderComponent = (props, state) => {
    const cls = classNames(ScrollableList.displayName, {
      [props.className]: !!props.className,
      [`axis-${props.axis}`]: props.axis,
    });

    return (
      <div className={cls}>
        <ReactList
          axis={props.axis}
          length={props.data.length}
          itemRenderer={(item, key) => this.buildItem(item, key, props, state)}
        />
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props, this.state);
  }
}

export default ScrollableList;

