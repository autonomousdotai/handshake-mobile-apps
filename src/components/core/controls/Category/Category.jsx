import React from 'react';
import PropTypes from 'prop-types';
// component
import Slider from '@/components/core/controls/Slider';
import Image from '@/components/core/presentation/Image';
// style
import './Category.scss';

import CATEGORIES from './categories.js';

class Category extends React.PureComponent {
  constructor(props) {
    super(props);
    // bind
    this.categoryClick.bind(this);
  }
  settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: false
  };

  categoryClick(category) {
    this.props.hasOwnProperty('onItemClick') && this.props.onItemClick(category);
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`category ${className || ''}`}>
        <Slider settings={this.settings}>
          {
            CATEGORIES.map((category, index) => (
              <div className="category-item" key={index + 1} onClick={()=> this.categoryClick(category)}>
                <Image src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </div>
            ))
          }
        </Slider>
      </div>
    );
  }
}

Category.propType = {
  className: PropTypes.string,
  onItemClick: PropTypes.func
};

export default Category;
