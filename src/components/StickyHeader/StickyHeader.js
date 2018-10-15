import React from 'react';
import PropTypes from 'prop-types';

class StickyHeader extends React.PureComponent {
  static displayName = 'StickyHeader';
  static propTypes = {
    elementId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const createBtn = document.getElementById(this.props.elementId);
    if (window.pageYOffset > createBtn.offsetTop) {
      createBtn.classList.add('Sticky');
    } else {
      createBtn.classList.remove('Sticky');
    }
  };

  renderComponent = (props) => {
    return (
      <div id={props.elementId}>
        {props.children}
      </div>
    );
  };

  render() {
    return this.renderComponent(this.props, this.state);
  }
}


export default StickyHeader;
