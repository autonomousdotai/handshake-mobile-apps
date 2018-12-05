/* eslint react/prop-types: 0 */
/* eslint react/no-unused-prop-types:0 */

import React from 'react';
import PropTypes from 'prop-types';

import './Statistics.scss';

function buildItem(itemProps) {
  const { name, percent } = itemProps;
  return (
    <div key={name} className={`Item ${name}`}>
      <span className="Percent">{`${percent}%`}</span>
      <span className="Name">{name}</span>
    </div>
  );
}

function buildList(props) {
  const { listItems } = props;
  const itemY = listItems.filter(item => (item.name === 'Yes'));
  return (
    <div className="Statistics">
      <div className={`c100 p${itemY[0].percent}`}>
        <div className="Percents">{ listItems.map(item => buildItem(item)) }</div>
        <div className="slice">
          <div className="bar">&nbsp;</div>
          <div className="fill">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

function Statistics(props) {
  return buildList(props);
}

Statistics.propTypes = {
  listItems: PropTypes.arrayOf(Object).isRequired
};

Statistics.defaultProps = {
  listItems: []
};

export default Statistics;
