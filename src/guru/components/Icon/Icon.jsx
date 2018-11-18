import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SVGInjector from 'svg-injector';

export default class Icon extends PureComponent {
  static propTypes = {
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    onInjected: PropTypes.func,
    completedInjected: PropTypes.func,
  };

  static defaultProps = {
    className: null,
    style: {},
    evalScripts: 'never',
    onInjected: () => undefined,
    completedInjected: () => undefined,
  };

  constructor(props) {
    super(props);
    this.refElement = React.createRef();
  }

  componentDidMount() {
    if (this.props.path) {
      this.svg(this.props);
    }
  }

  svg = (props) => {
    const element = this.refElement.current;
    const options = {
      evalScripts: props.evalScripts,
      each: props.onInjected,
    };
    const callback = props.completedInjected;
    SVGInjector(element, options, callback);
  }

  render() {
    const { props } = this;
    const svgProps = {
      src: props.path,
      className: props.className,
      style: props.style,
    };
    return (<svg {...svgProps} ref={this.refElement} />);
  }
}
