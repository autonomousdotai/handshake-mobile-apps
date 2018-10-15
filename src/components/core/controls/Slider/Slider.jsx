import React from 'react';
import PropTypes from 'prop-types';
// component
import Slider from 'react-slick';
import './Slider.scss';

class SimpleSlider extends React.PureComponent {

  componentDidMount() {
    if (this.props.hasOwnProperty('onRef')) {
      this.props.onRef(this);
    }
  }

  render() {
    const { settings, children } = this.props;
    return (
      <Slider ref={slider => this.slider = slider} {...settings}>
        {children}
      </Slider>
    );
  }
}

SimpleSlider.propType = {
  settings: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func,
}

export default SimpleSlider;
