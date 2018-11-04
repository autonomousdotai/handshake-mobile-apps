import React from 'react';
import cx from 'classnames';
import connect from 'react-redux';
import PropTypes from 'prop-types';

class ReportSource extends React.Component {
  static displayName = 'ReportSource';
  static propTypes = {
    classNames: PropTypes.string,
  };

  static defaultProps = {
    classNames: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    const cls = cx(ReportSource.displayName, {
      [this.props.classNames]: this.props.classNames,
    });
    return (
      <div className={cls}>
        {this.props.classNames}
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  null
)(ReportSource);
