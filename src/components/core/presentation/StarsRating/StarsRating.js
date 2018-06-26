/**
 * StarsRating Component.
*/
import React from 'react';
import PropTypes from 'prop-types';
import Helper from '@/services/helper';
// style
import './StarsRating.scss';

class StarsRating extends React.PureComponent {
  constructor(props) {
    super(props);
    this.startNum = props.startNum || 5;
  }

  get htmlStar() {
    const { starPoint } = this.props;
    // round rating point: (0 --> 0.49) round to 0.5; (0.5 --> 1) round to 1
    const roundStarPoint = Math.ceil(starPoint * 2) / 2;
    const starts = [];
    let hasHalfStart = false;
    for (let i = 1; i <= this.startNum; i++) {
      let classStart = '';
      if (i <= roundStarPoint) {
        classStart = 'full';
      } else if (i > roundStarPoint) {
        if (Helper.isFloat(roundStarPoint) && !hasHalfStart) {
          hasHalfStart = true;
          classStart = 'half';
        } else {
          classStart = 'empty';
        }
      }
      starts.push(<span key={i + 1} className={classStart}>☆</span>);
    }
    return starts;
  }

  render() {
    const {
      className, starPoint, startNum, ...newProps
    } = this.props;
    return (
      <div className={`stars-rating ${className || ''}`} {...newProps}>
        {this.htmlStar}
      </div>
    );
  }
}

StarsRating.propTypes = {
  starPoint: PropTypes.number.isRequired,
  startNum: PropTypes.number,
  className: PropTypes.string,
};

export default StarsRating;
