import React from 'react';
import PropTypes from 'prop-types';
// component
import Slider from 'react-slick';
import './Slider.scss';

class SimpleSlider extends React.PureComponent {
  render() {
    const { settings, children } = this.props;
    return (
      <Slider {...settings}>
        {children}
      </Slider>
    );
  }
}

SimpleSlider.propType = {
  settings: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}

export default SimpleSlider;
