import React from 'react';
import { PropTypes } from 'prop-types';

class Card extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    className: 'CardGuru',
    imageUrl: null,
    children: null
  }

  renderTitle = (title) => {
    if (!title || title === '') return null;
    return (<div className="CardTitle">{title}</div>);
  }

  renderImage = (imageUrl) => {
    if (!imageUrl) return null;
    return (
      <div className="CardImage">
        { imageUrl && (<img src={imageUrl} alt="" />) }
      </div>
    );
  }

  renderCard = (props) => {
    const { className, title, imageUrl, children } = props;
    return (
      <div className={className}>
        <div className="CardHeading">
          { this.renderTitle(title) }
          { this.renderImage(imageUrl) }
        </div>
        { children }
      </div>
    );
  }

  render() {
    return this.renderCard(this.props);
  }
}

export default Card;
