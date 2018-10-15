/* eslint react/prop-types: 0 */
/* eslint react/no-unused-prop-types:0 */

import React from 'react';
import PropTypes from 'prop-types';

function buildTitle(props) {
  const { title } = props;
  return (
    <div className="Title">{title}</div>
  );
}

function buildItem(itemProps) {
  const { name, percent } = itemProps;
  return (
    <div key={name} className="Item">
      <span className={`Percent ${name}`}>{percent}</span>
      <span className="Name">{name}</span>
    </div>
  );
}

function buildList(props) {
  const { listItems } = props;
  return (
    <div className="Statistics">
      { listItems.map(item => buildItem(item)) }
    </div>
  );
}

function percentStyle(percent) {
  return {
    flexBasis: percent,
    textIndent: '-9999px',
  };
}

function buildPercent(itemProps) {
  const { name, percent } = itemProps;
  return (
    <span
      key={name}
      style={percentStyle(percent)}
      className={name}
    >
      {percent}
    </span>
  );
}

function buildPercentages(props) {
  const { listItems } = props;
  return (
    <div className="Percentages">
      { listItems.map(item => buildPercent(item))}
    </div>
  );
}

function Statistics(props) {
  return (
    <div className="ComponentStatistics">
      {buildTitle(props)}
      {buildList(props)}
      {props.percentBar && buildPercentages(props)}
    </div>
  );
}

Statistics.propTypes = {
  title: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(Object).isRequired,
  percentBar: PropTypes.bool,
};

Statistics.defaultProps = {
  title: 'Ninja predicts:',
  listItems: [],
  percentBar: false,
};

export default Statistics;
