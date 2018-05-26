import React from 'react';
import PropTypes from 'prop-types';
// style
import './ListGroup.scss';

class ListGroup extends React.PureComponent {
  render() {
    const { className, onSelecting, source, ...props } = this.props;
    if (!source || source.length < 1) {
      return null;
    }
    console.log(11111, source);
    return (
      <ul className={`list-group-cp ${className || ''}`} {...props}>
        {
          source.map(item => (
            <li
              key={item.id}
              onClick={item => onSelecting ? onSelecting(item) : null}
              className="list-group-item-cp"
              style={item.style || {}}>
              {item.value}
            </li>
          ))
        }
        
      </ul>
    );
  }
}

ListGroup.propTypes = {
  className: PropTypes.string,
  source: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    value: PropTypes.string,
    style: PropTypes.object,
  })).isRequired,
  onSelecting: PropTypes.func
};

export default ListGroup;
