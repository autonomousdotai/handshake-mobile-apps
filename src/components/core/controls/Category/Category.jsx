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

  get categoriesHtml() {
    const { categories } = this.props;
    const categoriesList = (categories && categories.length > 0) ? categories : CATEGORIES;
    return categoriesList.map((category, index) => (
      <div className="category-item" key={index + 1} onClick={() => this.categoryClick(category)}>
        <Image src={category.image} alt={category.name} />
        <span>{category.name}</span>
      </div>
    ))
  }

  categoryClick(category) {
    this.props.hasOwnProperty('onItemClick') && this.props.onItemClick(category);
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`category ${className || ''}`}>
        <Slider settings={this.settings}>
          {this.categoriesHtml}
        </Slider>
      </div>
    );
  }
}

Category.propType = {
  className: PropTypes.string,
  categories: PropTypes.array,
  onItemClick: PropTypes.func
};

export default Category;
