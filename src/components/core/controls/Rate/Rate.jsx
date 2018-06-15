import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// component

// style
import './Rate.scss';
const LENGTH = 5;

class Rate extends React.PureComponent {

  constructor(props) {
    super(props);
    this.starNum = props.startNum || LENGTH;
    // bind
    this.ratingClick = ::this.ratingClick;
    this.open = ::this.open;
    this.close = ::this.close;
  }

  open() {
    this.ratingRef.style.display = 'flex';
  }

  close() {
    this.ratingRef.style.display = 'none';
  }

  ratingClick(num) {
    this.props.hasOwnProperty('ratingOnClick') && this.props.ratingOnClick(this.starNum - num);
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`modal rate ${className || ''}`} ref={rating => this.ratingRef = rating}>
        {
          Array.apply(null, { length: this.starNum }).map((star, index) => (
            <span key={index} onClick={() => this.ratingClick(index)}>☆</span>
          ))
        }
      </div>
    );
  }
}

Rate.propTypes = {
  className: PropTypes.string,
  ratingOnClick: PropTypes.func,
  startNum: PropTypes.number,
  onRef: PropTypes.func,
};

export default Rate;
