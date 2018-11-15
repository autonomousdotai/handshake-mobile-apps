import React from 'react';
import PropTypes from 'prop-types';

export default class Thumbnail extends React.Component {
  static propTypes = {
    file: PropTypes.any,
    defaultImage: PropTypes.string,
    onLoaded: PropTypes.func,
  };

  static defaultProps = {
    file: undefined,
    defaultImage: undefined,
    onLoaded: undefined,
  };

  state = {
    thumb: undefined
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) { return; }

    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({ thumb: reader.result });
      nextProps.onLoaded && nextProps.onLoaded();
    };

    reader.readAsDataURL(nextProps.file);
  }

  render() {
    const { file, defaultImage } = this.props;
    const { thumb } = this.state;

    return (<img
      src={thumb || defaultImage}
      alt={(file || {}).name}
      className="Thumbnail"
      height={200}
      width={200}
    />);
  }
}
