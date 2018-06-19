import React from 'react';
import PropTypes from 'prop-types';
// component
import Button from '@/components/core/controls/Button/Button';
// style
import './Rate.scss';
const LENGTH = 5;

class Rate extends React.PureComponent {

  constructor(props) {
    super(props);
    this.starNum = props.starNum || LENGTH;
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
    const { className, onSubmit, title, description } = this.props;
    return (
      <div className={`modal rate ${className || ''}`} ref={rating => this.ratingRef = rating}>
        <p className="title">{title}</p>
        <p className="description">{description}</p>
        <div className="star-block">
          {
            Array.apply(null, { length: this.starNum }).map((star, index) => (
              <span key={index} onClick={() => this.ratingClick(index)}>☆</span>
            ))
          }
        </div>
        <Button block onClick={onSubmit}>Submit</Button>
      </div>
    );
  }
}

Rate.propTypes = {
  className: PropTypes.string,
  ratingOnClick: PropTypes.func,
  onSubmit: PropTypes.func,
  starNum: PropTypes.number,
  onRef: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
};

Rate.defaultProps = {
  title: 'Thank you!',
  description: 'Rate your trade with ICO shop',
};

export default Rate;
