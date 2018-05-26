import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setNotFound, clearNotFound } from '@/reducers/app/action';

class DynamicImport extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    loading: PropTypes.func.isRequired,
    isNotFound: PropTypes.bool,
    setNotFound: PropTypes.func.isRequired,
    clearNotFound: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isNotFound: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      component: this.props.loading,
    };

    if (this.props.isNotFound) {
      this.props.setNotFound();
    } else {
      this.props.clearNotFound();
    }
  }

  componentDidMount() {
    this.props.load()
      .then((component) => {
        this.setState(() => ({
          component: component.default ? component.default : component,
        }));
      });
  }
  render() {
    return this.props.children(this.state.component);
  }
}

export default connect(null, ({ setNotFound, clearNotFound }))(DynamicImport);
