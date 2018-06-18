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
      categories: this.props.categories,
    };
    // bind
    this.categoryClick.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.idActive !== prevState.idActive) {
      return { idActive: nextProps.idActive };
    }
    return null;
  }

  componentDidMount() {
    if (Object.prototype.hasOwnProperty.call(this.props, 'onRef')) this.props.onRef(this);
  }

  componentWillUnmount() {
    if (Object.prototype.hasOwnProperty.call(this.props, 'onRef')) this.props.onRef(undefined);
  }

  get categoriesHtml() {
    const { idActive, categories } = this.state;
    const categoriesList = (categories && categories.length > 0) ? categories : CATEGORIES;
    return categoriesList.map((category, index) => (
      <div
        key={index + 1}
        className={`category-item ${category.id === idActive ? 'active' : ''}`}
        onClick={() => this.categoryClick(category)}
      >
        <Image src={category.image} alt={category.name} />
        <span>{category.name}</span>
      </div>
    ));
  }

  set idActive(id) {
    this.setState({
      idActive: id,
    });
  }

  categoryClick(category) {
    this.setState({
      idActive: category.id,
    });
    if (Object.prototype.hasOwnProperty.call(this.props, 'onItemClick')) this.props.onItemClick(category);
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
