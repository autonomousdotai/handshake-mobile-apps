import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';

class Card extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    className: 'CardGuru',
    imageUrl: null,
    children: null,
  }

  renderTitle = (title) => {
    if (!title || title === '') return null;
    return (<div className="CardTitle">{title}</div>);
  }

  renderImage = (imageUrl) => {
    return (
      <div className="CardImage">
        { imageUrl && (<image src={imageUrl} alt="" />) }
      </div>
    );
  }

  renderCard = (props) => {
    const { className, title, imageUrl, children } = props;
    return (
      <div className={className}>
        { this.renderTitle(title) }
        { this.renderImage(imageUrl) }
        { children }
      </div>
    );
  }

  render() {
    return this.renderCard(this.props);
  }
}

export default Card;
