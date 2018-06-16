import React from 'react';
import PropTypes from 'prop-types';
// component
import Image from '@/components/core/presentation/Image';
// style
import './Category.scss';

import CATEGORIES from './categories.js';

class Category extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idActive: this.props.idActive || -1,
    };
    // bind
    this.categoryClick.bind(this);
  }

  get categoriesHtml() {
    const { categories } = this.props;
    const { idActive } = this.state;
    const categoriesList = (categories && categories.length > 0) ? categories : CATEGORIES;
    return categoriesList.map((category, index) => (
      <div
        key={index + 1}
        className={`category-item ${category.id === idActive ? 'active': ''}`}
        onClick={() => this.categoryClick(category)}>
        <Image src={category.image} alt={category.name} />
        <span>{category.name}</span>
      </div>
    ))
  }

  set idActive(id) {
    this.setState({
      idActive: id
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.idActive !== prevState.idActive) {
      return { idActive: nextProps.idActive };
    }
  }

  categoryClick(category) {
    this.setState({
      idActive: category.id
    });
    this.props.hasOwnProperty('onItemClick') && this.props.onItemClick(category);
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
      <div className={`category ${className || ''}`}>
        {this.categoriesHtml}
      </div>
    );
  }
}

Category.propType = {
  className: PropTypes.string,
  idActive: PropTypes.any,
  categories: PropTypes.array,
  onItemClick: PropTypes.func,
  onRef: PropTypes.func,
};

export default Category;
